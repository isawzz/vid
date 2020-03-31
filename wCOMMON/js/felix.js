//var panels=null; //tree structure for static panels
var UIROOT; //augmented SPEC.root
var AREAS; //areas by name, pointing into UIROOT nodes!
var PROTO;
var POOLS = {};

function addAREA(id, o) {
	if (AREAS[id]) {
		//console.log('!!!!!!! AREAS', id, 'exists already!!!');
	}
	AREAS[id] = o;
}

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
	// //console.log('UIROOT:');
	// consExpand(UIROOT, ['panels', 'elm'])

	// //console.log('PROTO:');
	// //console.log(PROTO);
}
var dynSpec;
function parseDynamicSpec() {
	let sp = jsCopy(SPEC.dynamicSpec);

	POOLS.augData = makeDefaultPool(sData);// jsCopy(serverData);

	//annotate does NOT create anything!
	annotate(sp); //connects nodes to spec and dyn spec nodes to each object

	//instantiate sp nodes
	dynSpec = sp;
	let pool = POOLS.augData;

	//erst brauch ich einen pass der ueberall die number info setzt
	//und fuer jedes object das in node.pool ist ein eigenes base panel macht
	//fuer diese loc!
	for (const k in sp) {
		let node = sp[k];
		if (node.loc) {
			let group = node.pool;
			if (isEmpty(group)) continue;
			//console.log('group', group);
			let loc = node.loc;
			let uiNode = AREAS[loc];
			//console.log('loc', loc, 'uiNode', uiNode);
			prepParentForChildren(loc,group.length);
			for (const oid of group) {
				//TODO!!! simplification: mach einfach panels!
				//TODO!!! simpl: keine params... werden verwendet!
				addPanel(loc, oid);

			}
		}
	}

	//return;
	// 2. pass: add dynamic areas
	for (const oid in pool) {

		let o = pool[oid];

		if (nundef(o.RSG)) continue;

		let merged = mergeSpecNodes(o);

		if (oid == 'Player2') {
			//console.log('merged', merged);
		}
		// according to merge muss ich in parent loc ein p_elm
		//machen und mit info von o fuellen! das wird 1 panel von parent AREA

		//wie macht man ein panel in einer loc?
		if (!merged.type || !PROTO[merged.type]) continue;
		let info = jsCopy(PROTO[merged.type]);
		if (oid == 'Player2') {
			//console.log('info',merged.type,info);
		}

		let areaName=getDynId(merged.loc,oid)
		dynamicArea(areaName, info, oid, o);
		console.log('>>>>>>>',info.type);
		let propName=info.type == 'panel'?'panels':'elm';
		let oEinhaengen = AREAS[areaName];
		if (nundef(oEinhaengen[propName])) oEinhaengen[propName] = [];
		oEinhaengen[propName].push(info);

		//node ids werden irgendwie NICHT oder falsch gesetzt!
		//div ids werden richtig gesetzt!
		//

		//fill in data how to?!?!?!?!?!?!?!?!?
		console.log('merged', oid, merged);
		console.log('info',info)

		//info ist das ergebnis von merged
		//info soll doch jetzt irgendwo in UIROOT sein???

	}

	return;
	//fuer die wo ich loc hab, haeng ich schon in UIROOT ein
	//default panel
	for (const k in sp) {
		let node = sp[k];
		let loc = node.loc;
		if (loc && AREAS[loc]) {
			if (k == 'all_opps') {
				console.log('habe area fuer', k);
			}
			//merge nodes

			let nParent = AREAS[loc];
			let nChild = node;

			if (nChild.panels) {
				//construct hybrid thing params
				let hybrid = {};
				let num = nChild.pool.length;
				let params = nParent.params;
				params.num = num;
				nParent.panels = nChild.panels;
				hybrid.params = params;
				let panels = nChild.panels;
				if (k == 'opp_info') {
					//console.log(hybrid);
					//console.log(nParent)
				}
				for (const oid of nChild.pool) {
					//let p=
					let o = pool[oid];
					let otherKeys = o.RSG;
					if (k == 'opp_info') {
						//console.log('o', o);
						//console.log('otherKeys', otherKeys);

					}
					for (const k2 of otherKeys) {
						panel
					}

				}
				// let type = nParent.panel_type;
				// hybrid.type = type;


				//split parent into 
			}
		}
	}

}
function annotate(sp) {
	//test	let x=makePool(sp.all_viz_cards);	return;

	for (const k in sp) {
		//console.log(k, sp[k]);

		let node = sp[k];
		node.pool = [];

		//determine source here!
		let pool = makePool(node);

		for (const oid in pool) {

			let o = pool[oid];

			if (!evalCond(o, node)) continue;

			//console.log('passed', oid);
			//mach ein p_elm
			if (nundef(o.RSG)) o.RSG = {};
			let rsg = o.RSG;
			rsg[k] = true;
			node.pool.push(oid);
			//let rsg = o.RSG;
			//let newRSG = deepmerge(rsg, node);
			//o.RSG = newRSG;
			//if (startsWith(oid,'P')) //console.log('???',o.RSG);


		}
	}



}








