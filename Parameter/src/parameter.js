import icon from './parameter.svg';
const { Node } = await modular.require('@edisonai/nodemap/node');

export default class ParameterNode extends Node {

    static _version = 'parameternode';
    static _hotupdate = true;

    static template = {

        name: "Parameter",
        category: "OpenAI",
        color: "rgba(255, 248, 128, 0.8)",
        icon: icon,
        type: 'parameter',

        inputs: [{}],
        outputs: [{}],

        settings: {
            type: 'string',
        },

        gui: {
            type: 'group', name: 'details', showLine: true, expanded: false, elements: [
                { type: 'dropdown', setting: 'type', values: ['string', 'number'] },
                { type: 'text', setting: 'name', placeholder: 'Name' },
                { type: 'textarea', setting: 'description', autoResize: true, placeholder: 'description', style: { resize: 'none' } },
                { type: 'checkbox', name: 'required?', setting: 'required' },
            ]
        },
    }

    constructor(node, options) {
        super(node, options);
    }

    // Called automatically
    main(caller, value) {
        this.inputs[0].clear();
        this.outputs[0].send(value);
    }
}