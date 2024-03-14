import { OpenAIChatCompletion } from '@edisonai/openai-standard-chat-completion';
import icon from './openai.svg';

const { Node } = await modular.require('@edisonai/nodemap/node');
const { ChatMessage } = await modular.require('@edisonai/datatypes');

const models = [
	'gpt-3.5-turbo-0125',
	'gpt-3.5-turbo',
	'gpt-3.5-turbo-1106',
	'gpt-3.5-turbo-instruct',
	'gpt-3.5-turbo-16k',
	'gpt-3.5-turbo-0613',
	'gpt-3.5-turbo-16k-0613'
]

export default class Gpt3p5 extends Node {

	// Initialization
	//--------------------------------------------------

	static _version = 'gpt3p5node';
	static _hotupdate = true;

	static buttonStyles = {
		background: 'rgba(128, 255, 128, 0.5)',
		fontWeight: '800'
	}

	static template = {

		name: 'Gpt 3.5 Turbo',
		icon: icon,
		color: 'rgba(128, 255, 128, 0.85)',
		category: 'OpenAI',

		settings: {

			showLogs: true,

			// Settings applied to all inputs
			inputs: {
				canAdd: true,
				canRemove: true,
				canEditName: true,
				canEditAccept: true,
				canAcceptStream: false,
				placeholder: 'name?',
				nameOptions: ['user', 'assistant', 'system']
			},

			// Settings applied to all outputs
			outputs: {
				canAdd: true,
				canRemove: true,
				canEditName: true,
				placeholder: 'tool?'
			},

			// OpenAI settings
			authorization: '',
			model: 'gpt-3.5-turbo',
			n: 1,
			temperature: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			stop: null,
			stream: true,
			target_wpm: 600,
		},

		gui: [

			// Model, n
			{
				type: 'group', direction: 'horizontal', elements: [
					{ type: 'dropdown', name: 'Model', setting: 'model', values: models },
					{ type: 'number', name: 'Max Tokens', setting: 'max_tokens', minValue: 0, maxValue: 100000, step: 1 }
				]
			},

			// Temperature, frequency_penalty, presence_penalty
			{
				type: 'group', direction: 'vertical', elements: [
					{ type: 'range', name: 'Temperature', setting: 'temperature', minValue: 0, maxValue: 2, step: 0.01 },
					{ type: 'range', name: 'Frequency Penalty', setting: 'frequency_penalty', minValue: -2, maxValue: 2, step: 0.01 },
					{ type: 'range', name: 'Presence Penalty', setting: 'presence_penalty', minValue: -2, maxValue: 2, step: 0.01 },
				]
			},

			// Stop sequences
			{
				type: 'text', name: 'Stop Sequences', setting: 'stop', placeholder: `['phrase 1', 'word 2', etc...]`, events: { change: 'stopSequencesChange' }, style: { width: '100%' }
			},

			// Advanced
			{
				type: 'group', direction: 'vertical', name: 'advanced settings', expanded: false, elements: [

					{ type: 'text', name: 'Api Key', setting: 'authorization', secret: true, style: { minWidth: '100%', maxWidth: '32ch' } },
					{
						type: 'group', direction: 'horizontal', elements: [
							{ type: 'checkbox', name: 'Stream?', setting: 'stream' },
							{ type: 'number', name: 'Target WPM', setting: 'target_wpm', minValue: 1, maxValue: 9001, step: 1 },
							{ type: 'number', name: 'Completions', setting: 'n', minValue: 1, maxValue: 16, step: 1 }
						]
					}
				]
			}
		],

		// Node inputs
		inputs: [
			{ name: 'user', accept: 'complete' }
		],

		// Node outputs
		outputs: [
			{ id: 'main', name: 'msg', canRemove: false, canEditName: false }
		]
	}

	constructor(json, options) {
		super(json, options);
	}

	// Events
	//--------------------------------------------------

	stopSequencesChange() {

		const element = this.gui.getElementWithName('Stop Sequences');
		element.clearError();

		if (this.stopSequencesChange.timeout) { clearTimeout(this.stopSequencesChange.timeout); }
		this.stopSequencesChange.timeout = setTimeout(validate.bind(this), 750);

		// Check if exists, attempt to parse into array, throw error if not
		function validate() {
			if (!this.settings.stop) { return; }
			try { if (!Array.isArray(JSON.parse(this.settings.stop))) { throw new Error(); } }
			catch (e) { element.error(new Error('Stop sequences must be valid json')); }
		}
	}

	// Methods
	//--------------------------------------------------

	halt() {
		this.emit('abort');
	}

	// Called automatically by all inputs
	main() {
		if (!this.inputsReady()) { this.log('Reaching back...'); this.reachBack(); return; }
		this.executeOnce(this.doChatCompletion);
	}

	// Actually do the chat completion
	async doChatCompletion() {

		// Clear logs, set state as processing
		this.clearLogs();
		this.log('Creating chat completion...');
		this.setState('processing');
		this.inputs.close();

		const tools = this.getTools();
		this.log('Tools:', tools);

		// Process inputs into an array of chat messages
		//--------------------------------------------------

		const messages = [];
		this.inputs.forEach(processInput);
		function processInput(input) {

			// Check if input contains special values
			if (input.name === 'tools') { throw new Error('Tools are coming soon but are not allowed just yet!'); }

			// Convert single value into array
			let { value, name } = input;
			if (!Array.isArray(value)) { value = [value]; }

			// Each item is converted to a chat message and pushed
			value.forEach((item) => {
				if (!item) { return; }
				const nameIsRole = ['user', 'assistant', 'system'].includes(name);
				messages.push(ChatMessage(item, {
					role: nameIsRole ? name : 'user',
					name: nameIsRole ? undefined : name
				}));
			});
		}

		this.log('Messages:', messages);

		// Do chat completion
		//--------------------------------------------------

		const completion = new OpenAIChatCompletion({
			url: 'https://api.openai.com/v1/chat/completions',
			auth: 'Bearer ' + String(this.settings.authorization),
			body: {
				messages,
				tools,
				target_wpm: Number(this.settings.target_wpm),

				model: String(this.settings.model),
				max_tokens: Math.round(Number(this.settings.max_tokens)),
				stop: JSON.parse(String(this.settings.stop || '[]')),

				temperature: Number(this.settings.temperature),
				frequency_penalty: Number(this.settings.frequency_penalty),
				presence_penalty: Number(this.settings.presence_penalty),
				top_p: Number(this.settings.top_p),
				//top_k: Math.round(Number(this.settings.top_k)),

				stream: Boolean(this.settings.stream),
				n: Math.round(Number(this.settings.n)),
			}
		});

		// Log message, process tool calls, 
		completion.onMessage((message) => {
			//if (message.tool_calls) { this.processToolCalls(message.tool_calls); }
			///this.log(message);
			this.outputs.get('msg').send(message);
		});

		// When everything is done
		completion.onFinish((messages) => {

			this.log('Completed:', messages);

			// Look for tool calls
			messages.forEach((message) => {
				if (message.tool_calls) {
					message.tool_calls.forEach((call) => {
						this.sendToolCall(call);
					});
				}
			});

			this.setState('done');
			this.inputs.open();
		});

		// When there is an error
		completion.onError((e) => {
			completion.abort();
			throw e;
		});

		const releaseListener = this.listen('abort', () => { completion?.abort?.() });
		completion.onAbort(() => { releaseListener(); this.error(new Error('Completion aborted')); });

		await completion.start();
		this.inputs.clear();
	}

	// Send a tool call
	sendToolCall(call) {

		try {

			const name = call.function.name;
			const params = JSON.parse(call.function.arguments);

			this.log('Using tool:', { name, params });

			this.outputs.forEach((output) => {
				if (output.name === name) {
					output.connections?.forEach((connection) => {
						const { name } = connection.input?.options?.node?.settings || {};
						if (name in params) { connection.send(params[name]); }
					});
				}
			});
		}

		catch (e) {
			this.error(e);
		}
	}


	// Go through each output and collect all the tools at out disposal
	getTools() {
		//this.log(this.outputs.getParams());

		this.log('Getting tools...');

		const tools = [];

		this.outputs.forEach((output) => {

			const name = output.name;
			if (name === 'msg') { return; }

			const tool = {
				type: 'function',
				function: {
					name: output.name,
					description: '',
					parameters: {
						type: 'object',
						properties: {},
						required: [],
					},
				}
			}

			// Go through each connected output
			output.connections.forEach((connection) => {

				// Get paremeter settings from node
				const node = connection.input.options.node;
				const { type, name, description, required } = node.settings;

				// Add to properties and push to required if required
				tool.function.parameters.properties[name] = { type, description };
				if (node.settings.Required) { tool.function.parameters.required.push(name); }
			});

			tools.push(tool);
		});

		if (!tools.length) { return undefined; }
		return tools;
	}
}
