var vidCache = null;
//#region caches 
// var vidSettingsC = null;
// var rsgSettingsC = null;
var allGamesC = null;
var playerConfigC = null;
var iconCharsC = null;
var c52C = null;
var testCardsC = null

var defaultSpecC = null;
var userSpecC = null;
var userCodeC = null;
var initialDataC = {};
var serverDataC = null;
//#endregion
//dictionaries:
// var vidSettings = null;
// var rsgSettings = null;
var allGames = null;
var playerConfig = null;
var iconChars = null;
var c52 = null;
var testCards = null

var defaultSpec = null
var userSpec = null;
var userCode = null;
var serverData = null;

async function loadAssets(resetLocalStorage) {
	//loading assets
	vidCache = new LazyCache(resetLocalStorage);

	testCardsC = await vidCache.load('testCards', async () => await route_rsg_asset('testCards', 'yaml'));
	testCards = vidCache.asDict('testCards');
	iconCharsC = await vidCache.load('iconChars', route_iconChars);
	iconChars = vidCache.asDict('iconChars');
	c52C = await vidCache.load('c52', route_c52);
	c52 = vidCache.asDict('c52');
	allGamesC = await vidCache.load('allGames', route_allGames);
	allGames = vidCache.asDict('allGames');

	playerConfig = stubPlayerConfig(allGames); //stub to get player info

	// console.log('testCards', testCards['green2']);
	// console.log('c52', c52['card_2C']);
	// console.log('icons', iconChars.crow);
	// console.log('allGames', allGames.catan);
	// console.log(vidCache);

	if (TESTING) {

		let url = TEST_PATH + 'defaultSpec' + SPEC_VERSION + '.yaml';
		defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), true, false);

		url = TEST_PATH + 'uspec' + SPEC_VERSION + '.yaml';
		userSpecC = await vidCache.load('userSpec', async () => await route_test_userSpec(url), true, false);

		url = TEST_PATH + 'code' + CODE_VERSION + '.js';
		userCodeC = await vidCache.load('userCode', async () => await route_path_asText_dict(url), true, false);

		url = TEST_PATH + 'data' + DATA_VERSION + '.yaml';
		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + GAME, async () => await route_path_yaml_dict(url)); //, true); //set true to reload from server
		serverData = vidCache.asDict('_initial_' + GAME);

	} else {
		url = TEST_PATH + 'defaultSpec' + SPEC_VERSION + '.yaml';
		defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), true, false);

		userSpecC = await vidCache.load('userSpec', async () => await route_userSpec(GAME, USERSPEC_FNAME));//, true); //set true to reload from server!
		let fname = userSpecC['CODE'];

		userCodeC = await vidCache.load('userCode', async () => await route_userCode(GAME, fname), true, false); //set true to reload from server!

		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + GAME, async () => await route_initGame(GAME, playerConfig[GAME])); //, true); //set true to reload from server
	}
	defaultSpec = vidCache.asDict('defaultSpec');
	userSpec = vidCache.asDict('userSpec');
	userCode = vidCache.asDict('userCode');
	loadCode(GAME, userCode.asText);
	serverData = vidCache.asDict('_initial_' + GAME);

	//timit.showTime('*** DONE ***');
	document.getElementById('userSpec').innerHTML = '<pre>' + userSpec.asText + '</pre>'; //PERFECT!!!!!!!!!!
	document.getElementById('code').innerHTML = '<pre>"' + userCode.asText + '"</pre>'; //PERFECT!!!!!!!!!!

	document.getElementById('serverData').innerHTML = '<pre id="json-result"></pre>';
	document.getElementById("json-result").innerHTML = JSON.stringify(serverData.table, undefined, 2);
	//#endregion


}

















