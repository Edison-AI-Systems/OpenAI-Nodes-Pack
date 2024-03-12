// Icon
const icon = `data:image/svg+xml,%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3C!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo MixTools --%3E%3Csvg width='800px' height='800px' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='white'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'/%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Ctitle%3Etext-left%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='invisible_box' data-name='invisible box'%3E%3Crect width='48' height='48' fill='none'/%3E%3Crect width='48' height='48' fill='none'/%3E%3Crect width='48' height='48' fill='none'/%3E%3C/g%3E%3Cg id='Q3_icons' data-name='Q3 icons'%3E%3Cpath d='M44,16a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2H4a2,2,0,0,1,2-2H42a2,2,0,0,1,2,2Z'/%3E%3Cpath d='M32,8a2,2,0,0,1-2,2H6A2,2,0,0,1,4,8H4A2,2,0,0,1,6,6H30a2,2,0,0,1,2,2Z'/%3E%3Cpath d='M44,32a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2H4a2,2,0,0,1,2-2H42a2,2,0,0,1,2,2Z'/%3E%3Cpath d='M32,24a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2H4a2,2,0,0,1,2-2H30a2,2,0,0,1,2,2Z'/%3E%3Cpath d='M32,40a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2H4a2,2,0,0,1,2-2H30a2,2,0,0,1,2,2Z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;
const { Node } = await modular.require('@edisonai/nodemap/node');

// Node JSON template
const template = {

    name: "Text",
    category: "Basic Nodes",
    color: "rgb(128, 128, 255)",
    icon: icon,

    flags: {
        entryPoint: true,
        reachback: true,
    },

    inputs: [
    ],


    outputs: [
        {}
    ],

    settings: {
        textContent: "This is a text node - edit the prompt at your leisure.",
        inputs: {
            canAdd: true,
            canRemove: true,
            canAcceptStream: false,
            canEditAccept: true,
        },
    },

    gui: [
        {
            type: 'group', direction: 'horizontal',
            elements: [
                { type: 'textarea', setting: 'textContent', style: { width: 250, height: 150 } }
            ]
        }
    ],
}

// Processing function
//----------------------------------------------------------------------------------------------------

export default class TextNode extends Node {

    static template = template;

    constructor(node, options) {
        super(node, options);
    }

    // Triggered by any input
    main(caller, value) {

        // Send value to output
        this.inputs.clear();
        this.outputs[0].send(this.settings.textContent);
        this.setState('done');
    }

    // Called when 'start' is activated
    start() {

        // Do nothing if connected to any inputs
        for (const input of this.inputs) {
            if (input.connections?.size) {
                return;
            }
        }

        // Send value to output
        this.inputs.clear();
        this.outputs[0].send(this.settings.textContent);
        this.setState('done');
    }

    supply() {
        this.start();
    }
}
