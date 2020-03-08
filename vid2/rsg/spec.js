var mappings;
var mappingsInitialized;
var mappingTypes;

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
	//console.log('mappings', mappings, mappingTypes);
}
function rPresentMappings() {
	//let bds=getBounds('others');
	//console.log('---------------------------',bds.height);
	
	if (isdef(serverData.players)) presentMappings(GAMEPLID, serverData.players[GAMEPLID]);

	//bds=getBounds('others');
	//console.log('---------------------------',bds.height);

	for (const plid in serverData.players) { if (plid != GAMEPLID) presentMappings(plid, serverData.players[plid]); }
	for (const oid in serverData.table) { presentMappings(oid, serverData.table[oid]); }
}
function presentMappings(oid, o) {
	let otype = o.obj_type;

	if (mappingTypes[otype]) {
		//there have been found mappings on this object type
		//check all these mappings

		if (mappingsInitialized[otype + '.' + oid]) return;

		let mm = mappings.filter(x => x[otype]);
		//console.log('matching mappings for object', oid, mm);
		let onlyOnce = false; //immutable need to implement other structure uis!!!
		for (const mapping of mm) {
			// if (!mapping.immutable) onlyOnce = false;

			executeMapping(mapping, otype, oid, o);
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
	// console.log('mapping:',mapping);
	//console.log('func',window[func].name,'\nloc',loc,'\no',o,'\noid',oid,'\npath',path,'\nomap',omap);

	let structObject = window[func](serverData.table, loc, o, oid, path, omap);
}

function rMergeSpec() {
	SPEC = deepmerge(defaultSpec, userSpec, { arrayMerge: overwriteMerge });

	//need to correct areas because it should NOT be merged!!!
	if (userSpec.layout_alias) { SPEC.layout_alias = userSpec.layout_alias; }
	if (userSpec.areas) { SPEC.areas = userSpec.areas; }

	//SPEC is merged userSpec!
	//console.log(SPEC);
	delete SPEC.asText;
	// document.getElementById('SPEC').innerHTML = '<pre id="spec-result"></pre>';
	// document.getElementById("spec-result").innerHTML = JSON.stringify(SPEC, undefined, 2);

	mById('SPEC').innerHTML = '<pre>"' + jsonToYaml(SPEC) + '"</pre>';


	//console.log(defaultSpec.color,userSpec.color,SPEC.color)


	_initAutoplayToActionButtons();
	_initCheatButtons();
	_initScenarioButtons();


}






//#region helpers
function _initAutoplayToActionButtons() {
	let d = document.getElementById('a_d_autoplay_buttons');
	let buttons = [...d.children];
	let defaultIds = ['c_b_NextPlayer', 'c_b_NextTurn', 'c_b_NextPhase'];

	let kws = lookup(SPEC, ['dev', 'run_to_buttons']);
	let requiredButtonIds;
	if (!kws) {
		kws = {};
		requiredButtonIds = defaultIds;
	} else {
		let kwKeys = getKeys(kws);
		requiredButtonIds = kwKeys.map(x => 'c_b_RTA_' + x).concat(defaultIds);
	}
	let actualButtonIds = buttons.filter(x => x.id).map(x => x.id);

	//console.log(actualButtonIds,requiredButtonIds)

	for (const id of arrMinus(actualButtonIds, requiredButtonIds)) mRemove(id);
	for (const id of arrMinus(requiredButtonIds, actualButtonIds)) {
		let b = document.createElement('button');
		let key = id.substring(8);
		b.innerHTML = kws[key];
		b.id = id;
		b.onclick = () => onClickRunToAction(key);
		d.appendChild(b);
	}
}
function _initCheatButtons() {
	let areaName = 'a_d_cheat_buttons';
	let kws = lookup(SPEC, ['dev', 'cheat_buttons']);
	if (!kws) { hide(areaName); return; }

	show(areaName);
	let d = document.getElementById(areaName);
	let buttons = [...d.children];
	let kwKeys = getKeys(kws);
	let requiredButtonIds = kwKeys.map(x => 'c_b_CHT_' + x);
	let actualButtons = buttons.filter(x => x.id).map(x => x.id);
	for (const id of arrMinus(actualButtons, requiredButtonIds)) $('#' + id).remove();
	for (const id of arrMinus(requiredButtonIds, actualButtons)) {
		let b = document.createElement('button');
		let key = id.substring(8);
		b.innerHTML = kws[key];
		b.id = id;
		b.onclick = () => onClickCheat(key);
		d.appendChild(b);
	}
}
function _initScenarioButtons() {
	let areaName = 'a_d_scenario_buttons';
	let kws = lookup(SPEC, ['dev', 'scenario_buttons']);
	if (!kws) { hide(areaName); return; }

	show(areaName);
	let d = document.getElementById(areaName);
	let buttons = [...d.children];
	let kwKeys = getKeys(kws);
	let requiredButtonIds = kwKeys.map(x => 'c_b_SCE_' + x);
	let actualButtons = buttons.filter(x => x.id).map(x => x.id);
	for (const id of arrMinus(actualButtons, requiredButtonIds)) $('#' + id).remove();
	for (const id of arrMinus(requiredButtonIds, actualButtons)) {
		let b = document.createElement('button');
		let key = id.substring(8);
		let caption = kws[key];
		b.innerHTML = caption;
		b.id = id;
		b.onclick = () => onClickPushScenario(stringBefore(caption, ' '), stringAfter(caption, ' '));
		d.appendChild(b);
	}
}

//#endregion