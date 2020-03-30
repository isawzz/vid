//var panels=null; //tree structure for static panels
var UIROOT; //augmented SPEC.root
var AREAS; //areas by name, pointing into UIROOT nodes!
var PROTO;

function root(areaName) {
	//console.log('___ root');
	setTableSize(areaName, 400, 300);
	//panels={};
	// panels.data=areaName;
	// panels.children=[];
	UIROOT = jsCopy(SPEC.staticSpec.root);
	AREAS = {};
	PROTO = {};
	staticArea(areaName, UIROOT);
	//UIROOT=SPEC.staticSpec.root;
}
function parseStaticSpec() {
	for (const k in SPEC.staticSpec) {
		if (k == 'root') continue;
		let thing = jsCopy(SPEC.staticSpec[k]);

		if (thing.loc) {
			staticArea(thing.loc, thing);
			let oEinhaengen = AREAS[thing.loc];
			if (nundef(oEinhaengen.elm)) oEinhaengen.elm = [];
			oEinhaengen.elm.push(thing);
		} else {
			PROTO[k] = jsCopy(SPEC.staticSpec[k]);
		}

	}
	// console.log('UIROOT:');
	// consExpand(UIROOT, ['panels', 'elm'])

	// console.log('PROTO:');
	// console.log(PROTO);
}
function parseDynamicSpec() {
	let sp = jsCopy(SPEC.dynamicSpec);

	//let defaultSource={}
	let augData = jsCopy(serverData);
	for (const k in sp) {
		console.log(sp[k]);

		let node=sp[k];

		//determine source here!


		for (const kPool of ['players', 'table']) {
			let pool = augData[kPool];
			let isTable = kPool == 'table';
			for (const oid in pool) {

				let o = pool[oid];

				if (!evalCond(o,node)) continue;

				console.log('passed',oid);

			}
		}
		break;
	}



}
//function