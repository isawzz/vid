window.onload = () => _start();
var divMain, divPlayer, divOpps, colors, iColor, timit;
const SPEC_PATH = '/work2/static2.yaml';
const SERVERDATA_PATH = '/work2/serverData.yaml';
//#region control flow
async function _start() {
	timit = new TimeIt('*timer', TIMIT_SHOW);
	await loadAssets();
	await loadSpecfe();
	await loadCode();
	await loadInitialServerDatafe();
	//consExpand(serverData,['players','Player1','table']);
	initUI();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
	//interaction(); //to test 2nd step
}
async function gameStep() {

	//#region prelims
	if (serverData.waiting_for) { await sendStatus(getUsernameForPlid(serverData.waiting_for[0])); }
	if (serverData.end) { d3.select('button').text('RESTART').on('click', restartGame); }
	timit.showTime('* vor package: *')

	//worldMap('OPPS'); 

	preProcessData();
	//have d14, u14 ==> serverData (processed), tupleGroups, boats, SPEC, CODE

	// TODO: here I could insert computing diffed serverData

	sData = serverData; //these are the data that I actually want to present!

	//#endregion

	//console.log(sData);
	root('ROOT');
	parseStaticSpec();
	parseDynamicSpec();
}




//#region rest
async function restartGame() {
	await sendRestart();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
}
async function interaction() {
	await sendAction();
	gameStep();
}
function initUI() {
	document.title = 'HA!';
	divMain = d3.select('#MAIN');
	divPlayer = d3.select('#PLAYER');
	divOpps = {};
	let dOpps = d3.select('#OPPS');
	for (const plid in playerConfig[GAME].players) {
		let dPlid = dOpps.append('div').attr('id', plid);
		divOpps[plid] = dPlid;
	}

	colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
	iColor = 0;
}
async function loadSpecfe() {

	let url = DSPEC_PATH + DSPEC_VERSION + '.yaml';
	defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), true, false);// last 2 params: reload, useLocal

	url = SPEC_PATH;
	let staticSpecC = await vidCache.load('staticSpec', async () => await route_test_userSpec(url), true, false);// last 2 params: reload, useLocal

	// url = '/work2/dynamic.yaml';
	// dynSpecC = await vidCache.load('dynSpec', async () => await route_test_userSpec(url), true, false);// last 2 params: reload, useLocal

	defaultSpec = vidCache.asDict('defaultSpec');
	staticSpec = vidCache.asDict('staticSpec');
	// dynSpec = vidCache.asDict('dynSpec');

	//merge default and userSpec
	SPEC = deepmerge(defaultSpec, staticSpec, { arrayMerge: overwriteMerge });
	// SPEC = deepmerge(SPEC, dynSpec, { arrayMerge: overwriteMerge });

	//need to correct areas because it should NOT be merged!!!
	delete SPEC.asText;

	let d = mBy('SPEC');
	if (d && SHOW_SPEC) { d.innerHTML = '<pre>' + jsonToYaml(SPEC) + '</pre>'; }
	//else consOutput('SPEC',SPEC);

}
async function loadInitialServerDatafe(unameStarts) {
	_syncUsernameOfSender(unameStarts);

	let url = SERVERDATA_PATH;
	serverDataC = initialDataC[GAME] = await vidCache.load('serverData', async () => await route_path_yaml_dict(url), true, false); // last 2 params: reload, useLocal

	serverData = vidCache.asDict('serverData');
	return serverData;
}

//#region FUNCTIONS
var FUNCTIONS={
	instanceof: 'instanceOf',

}
function evalCond(o,node){
	let qualifies=true;
	for(const fCond in node.cond){
		console.log(fCond)
		let func=FUNCTIONS[fCond];
		func=window[func];
		if (!func) {qualifies=false;break;}
		let val = func(o,node.cond[fCond]);
		if (!val) {qualifies=false;break;}
	}
	return qualifies;

}

function instanceOf(o,className){
	let otype = o.obj_type;
	switch(className){
		case '_player': return otype=='GamePlayer'||otype =='opponent';break;
		case 'building': return otype == 'farm'||otype=='estate'||otype=='chateau'||otype=='settlement'||otype=='city'||otype =='road';break;
	}
}




