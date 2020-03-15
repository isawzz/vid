//mapping keys are of the form: obj_type.prop1...propn
//mappings is a list of mappings.
// a mapping in this list has id=obj_type of structure in serverData
//there is a setting ignoreStructureTypesInPresentation = [true] that refers to these obj_types
function mappingsClear() {
	mappingTypes = {};
	mappingsInitialized = {};
}
function rMappings() {
	//using initial serverData, setup structures to establish mappings
	//mappingTypes = {};
	mappings = SPEC.mappings;
	if (nundef(mappings)) return false;
	mappings = dict2list(mappings, 'id').map(x => { let k = stringBefore(x.id, '.'); mappingTypes[k] = x[k] = true; return x; });
	//mappingsInitialized = {};
	console.log('mappings', mappings, mappingTypes);
}
function rPresentMappings() {
	// let bds=getBounds('opps');
	// console.log('---------------------------',bds.height);
	
	if (isdef(serverData.players)) {
		//console.log('------------------presentMappings',GAMEPLID);
		presentMappings(GAMEPLID, serverData.players[GAMEPLID]);
		//console.log('presentMappings',GAMEPLID,' DONE!!!!!!!!!!!!!');
	}

	//bds=getBounds('others');
	//console.log('---------------------------',bds.height);

	for (const plid in serverData.players) { 
		//console.log(plid)
		if (plid != GAMEPLID) presentMappings(plid, serverData.players[plid]); 
	}
	for (const oid in serverData.table) { presentMappings(oid, serverData.table[oid]); }
}
function presentMappings(oid, o) {
	let otype = o.obj_type;

	//console.log('presentMappings',oid,o,otype);

	if (mappingTypes[otype]) {
		//there have been found mappings on this object type
		//check all these mappings

		if (mappingsInitialized[otype + '.' + oid]) return;

		let mm = mappings.filter(x => x[otype]);
		//console.log('matching mappings for object', oid, mm);
		let onlyOnce = false; //immutable need to implement other structure uis!!!
		for (const mapping of mm) {
			// if (!mapping.immutable) onlyOnce = false;
			//console.log('___mapping:',mapping)

			executeMapping(mapping, otype, oid, o);
			//console.log('___mapping done:',mapping)
		}
		if (onlyOnce) mappingsInitialized[otype + '.' + oid] = true;
	}
}
function executeMapping(mapping, otype, oid, o) {
	//find object to map (this can be o itself or some [nested] property)
	let mKey = mapping.id;
	let path = stringAfter(mKey, '.');
	let omap = parsePropertyPath(o, stringAfter(mKey, '.'));
	//console.log('object to be mapped is',omap);
	if (nundef(omap)) return;
	let func = mapping.type;
	let loc = mapping.loc;
	if (stringBefore(loc, '.') == 'this') {
		loc = parsePropertyPath(o, stringAfter(loc, '.'));
		//console.log('------------------',loc)
	}

	//dynamic max-height settings for loc!
	let mkLoc = UIS[loc];
	if (mkLoc && mkLoc.maxHeightFunc) {
		let hMax = mkLoc.maxHeightFunc();
		mkLoc.elem.style.setProperty('height',hMax+'px');
		//console.log(loc,'max-height set to',hMax);
		//console.log('call',func)
		//return;
	}
	// //console.log('mapping:',mapping);
	//console.log('type',mapping.type,'func',window[func].name,'\nloc',loc,'\no',o,'\noid',oid,'\npath',path,'\nomap',omap);

	let structObject = window[func](serverData.table, loc, o, oid, path, omap);
}



