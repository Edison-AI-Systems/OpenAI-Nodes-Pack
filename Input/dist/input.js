const { Node } = await modular.require('@edisonai/nodemap/node');
const { ChatMessage, List, Image, MpegAudio } = await modular.require('@edisonai/datatypes');
const icon = `data:image/svg+xml,%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3C!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo MixTools --%3E%3Csvg width='800px' height='800px' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='white'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'/%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Ctitle%3Eoutput%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='invisible_box' data-name='invisible box'%3E%3Crect width='48' height='48' fill='none'/%3E%3C/g%3E%3Cg id='Layer_6' data-name='Layer 6'%3E%3Cg%3E%3Cpath d='M45.4,22.6l-7.9-8a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3L39.2,22H16a2,2,0,0,0,0,4H39.2l-4.6,4.6a1.9e,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l7.9-8A1.9,1.9,0,0,0,45.4,22.6Z'/%3E%3Cpath d='M28,42H24A18,18,0,0,1,24,6h4a2,2,0,0,0,1.4-.6A2,2,0,0,0,30,4a2.4,2.4,0,0,0-.2-.9A2,2,0,0,0,28,2H23.8a22,22,0,0,0,.1,44H28a2,2,0,0,0,1.4-.6l.4-.5A2.4,2.4,0,0,0,30,44,2,2,0,0,0,28,42Z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

// JSON template
//----------------------------------------------------------------------------------------------------

const messageSettings = {

    type: 'group', direction: 'vertical',

    elements: [
        {
            type: 'dropdown', name: 'Message Type', setting: 'type', id: 'Message Type', placeholder: 'Any', events: { change: 'messageTypeChange' },
            values: [
                { name: '(Any)', value: '' },
                { name: 'String', value: 'string' },
                { name: 'Number', value: 'number' },
                { name: 'Chat Message', value: 'chatMessage' },
                { name: 'Chat History', value: 'chatHistory' },
                { name: 'Array', value: 'array' },
                { name: 'Image', value: 'image' },
                { name: 'Audio', value: 'audio' },
            ]
        },
    ]
}

const stringSettings = {

    type: 'group', direction: 'horizontal', id: 'stringSettings', expanded: false,

    elements: [
        { type: 'number', name: 'Min Length', setting: 'minLength', placeholder: '(none)', minValue: 0, step: 1 },
        { type: 'number', name: 'Max Length', setting: 'maxLength', placeholder: '(none)', minValue: 0, step: 1 },
        {
            type: 'dropdown', name: 'Count', setting: 'count', value: 'characters', values: [
                { name: 'Characters', value: 'characters' },
                { name: 'Words', value: 'words' },
            ]
        },
        {
            type: 'group', direction: 'horizontal',
            elements: [
                { type: 'checkbox', name: 'Stream?', setting: 'allowStreaming' },
            ]
        },
    ]
}

const numberSettings = {
    type: 'group', direction: 'horizontal', id: 'numberSettings', expanded: false,
    elements: [
        { type: 'number', name: 'Min Value', setting: 'minValue' },
        { type: 'number', name: 'Max Value', setting: 'maxValue' },
        { type: 'number', name: 'Round to', setting: 'roundTo' },
    ]
}

const chatHistorySettings = {
    type: 'group', direction: 'horizontal', id: 'chatHistorySettings', expanded: false,
    elements: [
        { type: 'number', name: 'Max Num Messages', setting: 'maxMessages', },
    ]
}

const chatMessageSettings = {

    type: 'group', direction: 'horizontal', id: 'chatMessageSettings', expanded: false,

    elements: [
        {
            type: 'dropdown', name: 'Role', placeholder: '(default)', value: 'user', width: '100%', setting: 'chatMessageRole', values: [
                { name: 'User', value: 'user' },
                { name: 'System', value: 'system' },
                { name: 'Assistant', value: 'assistant' },
            ]
        },
        {
            type: 'text', name: 'Name', placeholder: '(none)', width: '100%', setting: 'chatMessageName'
        },
    ]
}

const imageSettings = {

    type: 'group', direciton: 'vertical', id: 'imageSettings', expanded: false,

    elements: [
        {
            type: 'group', direction: 'horizontal',
            elements: [
                { type: 'number', name: 'Min Width', placeholder: '(none)', setting: 'minWidth' },
                { type: 'number', name: 'Max Width', placeholder: '(none)', setting: 'maxWidth' },
            ]
        },
        {
            type: 'group', direction: 'horizontal',
            elements: [
                { type: 'number', name: 'Min Height', placeholder: '(none)', setting: 'minHeight' },
                { type: 'number', name: 'Max Height', placeholder: '(none)', setting: 'maxHeight' },
            ]
        },
    ]
}

const audioSettings = {

    type: 'group', direction: 'horizontal', id: 'audioSettings', expanded: false,

    elements: [
        { type: 'number', name: 'Min Duration', placeholder: '(none)', setting: 'minDuration' },
        { type: 'number', name: 'Max Duration', placeholder: '(none)', setting: 'maxDuration' },
        {
            type: 'group', direction: 'horizontal',
            elements: [
                { type: 'checkbox', name: 'Stream? ', setting: 'allowStreaming' },
            ]
        },
    ]
}

// Node JSON template
const template = {

    name: 'Input',
    type: 'InputNode',
    source: '@edisonai/nodes/basic/input',
    icon: icon,
    category: 'Basic Nodes',
    color: 'rgb(128, 128, 255)', //Old: "rgb(66, 165, 245)"

    flags: {
        entryPoint: true,
    },

    settings: {},

    gui: [
        {
            type: 'group', direction: 'vertical',
            elements: [
                { id: 'sourceName', type: 'text', placeholder: 'Name / Source', setting: 'inputName', events: { focus: 'setSourceOptions', change: 'inputNameChange' } }
            ]
        },

        // Advanced settings
        {
            type: 'group', name: 'advanced settings', direction: 'vertical', expanded: false,
            elements: [
                messageSettings,
                stringSettings,
                numberSettings,
                chatMessageSettings,
                chatHistorySettings,
                imageSettings,
                audioSettings,
            ],
        }
    ],

    contents: null,

    outputs: [{ id: 'main' }]
}

// Processing function
//----------------------------------------------------------------------------------------------------

export default class InputNode extends Node {

	static template = template;

    constructor(node, options) {
        super(node, options);
    }

    onInitialize() {

        console.log('Input Node | Initializing...');

        // Get nodemap, output name, ensure exists
        const { nodemap } = this.options;
        const { inputName } = this.settings;
        if (!nodemap || !inputName) { return; }

        // Create / add self to set containing output nodes
        if (!nodemap.nodes.byInput) { nodemap.nodes.byInput = {}; }
        if (!nodemap.nodes.byInput[inputName]) { nodemap.nodes.byInput[inputName] = new Set(); }
        nodemap.nodes.byInput[inputName].add(this);
    }

    // Updating input name map
    //--------------------------------------------------

    // Set options for input name field
    setSourceOptions() {
        this.gui.getElementWithId('sourceName').values = this.options.nodemap.gui?.getElementNames?.();
        this.gui.getElementWithId('sourceName').emit('update');
    }

    // When the the inputName field changes
    inputNameChange() {

        // Ensure input name actually changed
        const { inputName, lastInputName } = this.settings;
        if (inputName === lastInputName) { return; }

        // Ensure we belong to a nodemap
        const { nodemap } = this.options;
        if (!nodemap) { return; }

        // Init entry for name
        if (!nodemap.nodes.byInput) { nodemap.nodes.byInput = {}; }
        if (!nodemap.nodes.byInput[inputName]) { nodemap.nodes.byInput[inputName] = new Set(); }

        // Set entry for node
        nodemap.nodes.byInput[inputName].add(this);
        nodemap.nodes.byInput[lastInputName]?.delete(this);
        if (nodemap.nodes.byInput[lastInputName]?.size < 1) { delete nodemap.nodes.byInput[lastInputName]; }

        // Set last input name for next time
        this.settings.lastInputName = this.settings.inputName;
    }

    // Updating visibility of settings
    //--------------------------------------------------

    messageTypeChange() {

        // Collapse all elements
        const elementsToCollapse = this.gui.getElements('chatMessageSettings', 'stringSettings', 'numberSettings', 'imageSettings', 'audioSettings', 'chatHistorySettings');
        elementsToCollapse.forEach((element) => { element.collapse(); });

        switch (this.settings.type) {

            case ('string'): { this.gui.element('stringSettings').expand(); break; }
            case ('number'): { this.gui.element('numberSettings').expand(); break; }
            case ('chatMessage'): { this.gui.getElements('chatMessageSettings', 'stringSettings').forEach(e => { e.expand() }); break; }
            case ('chatHistory'): { this.gui.element('chatHistorySettings').expand(); break; }
            case ('array'): { this.gui.element('chatHistorySettings').expand(); break; }
            case ('image'): { this.gui.element('imageSettings').expand(); break; }
            case ('audio'): { this.gui.element('audioSettings').expand(); break; }
        }
    }

    // Node functions
    //--------------------------------------------------

    async send(caller, value) {

        // Pre-flight
        //--------------------------------------------------

        // Check if message exists
        if (!value) { throw new Error('Input was triggered but message is null. This is likely not your fault.'); }

        // Clear logs on first chunk or complete value
        if (value.isChunk) { if (value.isFirst()) { this.clearLogs(); } }
        else { this.clearLogs(); }

        // Convert message to correct type
        //--------------------------------------------------

        // Attempt to convert message to selected type
        switch (this.settings.type) {
            case ('string'): { value = String(value); break; }
            case ('number'): { value = Number(value); break; }
            case ('chatMessage'): { value = ChatMessage(value, { role: this.settings.role, name: this.settings.name }); break; }
            case ('chatHistory'): { value = List.from(value); }
            case ('array'): { value = List.from(value); }
            case ('image'): { value = Image(value); break; }
            case ('audio'): { value = MpegAudio(value); break; }
            default: { /* It's okay if nothing is selected */ }
        }

        /* Call the 'check' function for each message,
        passing in the settings as the params */
        if (!(value.isChunk)) {
            await value.check?.({ ...this.settings });
        }

        // Send the value
        //--------------------------------------------------

        this.log(value);

        this.outputs.get('main').send(value);
    }
}
