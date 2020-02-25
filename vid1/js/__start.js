//#region vars
var timit = null;
var vidCache = null;
var allGames = null;
var playerConfig = null;
var iconChars = null;
var c52 = null;
var userSpec = null;
var userCode = null;
var initialData = {};
var serverDataCache = null;
var serverData = null;
var testCards = null

window.onload = () => _start();
//#endregion

function clear() {
	clearElement('t1');
}
async function _start(resetLocalStorage = false) {

	clear();

	//#region loading
	timit = new TimeIt('*');
	timit.tacit();
	timit.showTime('*timer');

	//loading assets
	//resetLocalStorage = true; //********** true for LOCALSTORAGE CLEAR!!!!! */
	vidCache = new LazyCache(resetLocalStorage);

	testCards = await vidCache.load('testCards', async () => await route_rsg_asset('testCards', 'yaml'));
	iconChars = await vidCache.load('iconChars', route_iconChars);
	c52 = await vidCache.load('c52', route_c52);
	allGames = await vidCache.load('allGames', route_allGames);

	playerConfig = stubPlayerConfig(allGames.live); //stub to get player info

	// console.log('testCards', testCards['green2']);
	// console.log('c52', c52['card_2C']);
	// console.log('icons', iconChars.crow);
	// console.log('allGames', allGames.catan);
	// console.log(vidCache);

	if (TESTING) {

		let url = TEST_PATH + 'uspec' + SPEC_VERSION + '.yaml';
		userSpec = await vidCache.load('userSpec', async () => await route_test_userSpec(url));

		url = TEST_PATH + 'code' + CODE_VERSION + '.js';
		userCode = await vidCache.load('userCode', async () => await route_path_asText_dict(url));//
		loadCode(GAME, userCode.asText);

		url = TEST_PATH + 'data' + DATA_VERSION + '.yaml';
		initialData[GAME] = await vidCache.load('_initial_' + GAME, async () => await route_path_yaml_dict(url)); //, true); //set true to reload from server
		serverData = vidCache.asDict('_initial_' + GAME);

	} else {

		userSpec = await vidCache.load('userSpec', async () => await route_userSpec(GAME, USERSPEC_FNAME));//, true); //set true to reload from server!
		let fname = userSpec['CODE']; 

		userCode = await vidCache.load('userCode', async () => await route_userCode(GAME, fname), true, false); //set true to reload from server!
		loadCode(GAME, userCode.asText);

		initialData[GAME] = await vidCache.load('_initial_' + GAME, async () => await route_initGame(GAME, playerConfig[GAME],USERNAME)); //, true); //set true to reload from server
		serverData = vidCache.asDict('_initial_' + GAME);
	}

	//timit.showTime('*** DONE ***');
	document.getElementById('userSpec').innerHTML = '<pre>' + userSpec.asText + '</pre>'; //PERFECT!!!!!!!!!!
	document.getElementById('code').innerHTML = '<pre>"' + userCode.asText + '"</pre>'; //PERFECT!!!!!!!!!!

	document.getElementById('serverData').innerHTML = '<pre id="json-result"></pre>';
	document.getElementById("json-result").innerHTML = JSON.stringify(serverData.table, undefined, 2);
	//#endregion

	rStart();

//	makeCard52_test(1, null, { key: 'green2', area: 'decks' });
}
