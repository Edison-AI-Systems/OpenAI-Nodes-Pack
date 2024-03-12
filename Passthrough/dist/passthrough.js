const { Node } = await modular.require('@edisonai/nodemap/node');
const icon = `data:image/svg+xml,%3Csvg viewBox='0 -6.5 38 38' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg transform='translate(-1511.000000, -158.000000)' fill='white'%3E%3Cg id='1' transform='translate(1350.000000, 120.000000)'%3E%3Cpath d='M187.812138,38.5802109 L198.325224,49.0042713 L198.41312,49.0858421 C198.764883,49.4346574 198.96954,49.8946897 199,50.4382227 L198.998248,50.6209428 C198.97273,51.0514917 198.80819,51.4628128 198.48394,51.8313977 L198.36126,51.9580208 L187.812138,62.4197891 C187.031988,63.1934036 185.770571,63.1934036 184.990421,62.4197891 C184.205605,61.6415481 184.205605,60.3762573 184.990358,59.5980789 L192.274264,52.3739093 L162.99947,52.3746291 C161.897068,52.3746291 161,51.4850764 161,50.3835318 C161,49.2819872 161.897068,48.3924345 162.999445,48.3924345 L192.039203,48.3917152 L184.990421,41.4019837 C184.205605,40.6237427 184.205605,39.3584519 184.990421,38.5802109 C185.770571,37.8065964 187.031988,37.8065964 187.812138,38.5802109 Z' id='right-arrow'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

// Template
//----------------------------------------------------------------------------------------------------

const template = {

	icon,
	name: "Passthrough",
	category: "Basic Nodes",
	color: "rgb(128, 128, 255)",

	settings: {
		showName: false,

		inputs: {
			canEditAccept: true,
			canAcceptStream: true,
		}
	},

	inputs: [
		{ accept: 'stream' }
	],

	outputs: [
		{}
	],
}

// Processing function
//----------------------------------------------------------------------------------------------------

export default class PassThroughNode extends Node {

	static template = template;

	constructor(node, options) {
		super(node, options);
	}

	// Simply send value to next node
	main(caller, value) {
		this.inputs[0].clear();
		this.outputs[0].send(value);
	}

	// Allow reachback to pass through as well
	supply() {
		this.reachBack();
	}
}
