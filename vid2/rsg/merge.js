//#region merge spec
function rMergeSpec() {
	SPEC = deepmerge(defaultSpec, userSpec, { arrayMerge: overwriteMerge });

	//need to correct areas because it should NOT be merged!!!
	if (userSpec.layout_alias) { SPEC.areas = userSpec.layout_alias; }
	if (userSpec.areas) { SPEC.areas = userSpec.areas; }
	delete SPEC.layout_alias;

	//SPEC is merged userSpec!
	//console.log(SPEC);
	delete SPEC.asText;
	// document.getElementById('SPEC').innerHTML = '<pre id="spec-result"></pre>';
	// document.getElementById("spec-result").innerHTML = JSON.stringify(SPEC, undefined, 2);

	if (SHOW_SPEC_CODE_DATA) mById('SPEC').innerHTML = '<pre>"' + jsonToYaml(SPEC) + '"</pre>';


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





