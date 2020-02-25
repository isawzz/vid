var mappings;
var mappingsInitialized;
var mappingTypes;

function rMappings() {
	//using initial serverData, setup structures to establish mappings
	mappingTypes = {};
	mappings = SPEC.mappings; if (nundef(mappings)) return false;
	mappings = dict2list(mappings, 'id').map(x => { let k = stringBefore(x.id, '.'); mappingTypes[k] = x[k] = true; return x; });
	mappingsInitialized = {};
	//console.log('mappings',mappings);
}
function rPresentSpec() {
	// 	//look in table or in players for objects that map any of the mappings!
	for (const kPool of ['table', 'players']) {
		let pool = serverData[kPool];
		for (const oid in pool) {

			let o = pool[oid];
			let otype = o.obj_type;
			if (mappingTypes[otype]) {
				if (mappingsInitialized[otype + '.' + oid]) continue;

				executeMappings(otype, oid, o, pool);

			}
		}
	}
}
function executeMappings(otype, oid, o, pool) {
	//there have been found mappings on this object type
	//check all these mappings
	let mm = mappings.filter(x => x[otype]);
	console.log('matching mappings for object', oid, mm);

	for (const mapping of mm) {
		//find object to map (this can be o itself or some [nested] property)
		let mKey = mapping.id;
		let omap = parsePropertyPath(o,stringAfter(mKey,'.'));
		//console.log('object to be mapped is',omap);
		let func = mapping.type; 
		let loc = mapping.loc;
		//console.log(func,loc,window[func]);
		let structObject = window[func](serverData.table, loc, o, oid);
	}
}

function rMergeSpec() {
	SPEC = deepmerge(defaultSpec, userSpec, { arrayMerge: overwriteMerge });

	//need to correct areas because it should NOT be merged!!!
	if (userSpec.areas) { SPEC.areas = userSpec.areas; }

	//SPEC is merged userSpec!
	//console.log(SPEC);
	document.getElementById('mergedSpec').innerHTML = '<pre id="spec-result"></pre>';
	document.getElementById("spec-result").innerHTML = JSON.stringify(SPEC, undefined, 2);


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
	if (!kws) kws = {};
	let kwKeys = getKeys(kws);
	let requiredButtonIds = kwKeys.map(x => 'c_b_RTA_' + x).concat(defaultIds);
	let actualButtons = buttons.filter(x => x.id).map(x => x.id);

	for (const id of arrMinus(actualButtons, requiredButtonIds)) $('#' + id).remove();
	for (const id of arrMinus(requiredButtonIds, actualButtons)) {
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