const playerColors = {
	red: '#D01013',
	blue: '#003399',
	green: '#58A813',
	orange: '#FF6600',
	yellow: '#FAD302',
	violet: '#55038C',
	pink: '#ED527A',
	beige: '#D99559',
	sky: '#049DD9',
	brown: '#A65F46',
	white: '#FFFFFF',
};
const THEMES = ['#c9af98', '#2F4F4F', '#6B7A8F', '#00303F', 'rgb(3, 74, 166)', '#458766', '#7A9D96'];
var iTHEME = 0;

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
	//console.log(allGames)
	playerConfig = stubPlayerConfig(allGames); //stub to get player info

	// console.log('testCards', testCards['green2']);
	// console.log('c52', c52['card_2C']);
	// console.log('icons', iconChars.crow);
	// console.log('allGames', allGames.catan);
	// console.log(vidCache);
}
async function loadSpecAndCode() {
	let initialPath = GAME + (USE_MAX_PLAYER_NUM ? '_max' : '');
	if (TESTING) {

		let url = TEST_PATH + 'defaultSpec' + DSPEC_VERSION + '.yaml';
		defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), true, false);// last 2 params: reload, useLocal

		url = TEST_PATH + GAME + '/uspec' + USPEC_VERSION + '.yaml';
		userSpecC = await vidCache.load('userSpec', async () => await route_test_userSpec(url), true, false);// last 2 params: reload, useLocal

		url = TEST_PATH + GAME + '/code' + CODE_VERSION + '.js';
		userCodeC = await vidCache.load('userCode', async () => await route_path_asText_dict(url), true, false);// last 2 params: reload, useLocal

		url = TEST_PATH + GAME + '/data' + DATA_VERSION + '_' + initialPath + '.yaml';
		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + initialPath, async () => await route_path_yaml_dict(url)); // last 2 params: reload, useLocal
		serverData = vidCache.asDict('_initial_' + initialPath);

	} else {
		url = TEST_PATH + 'defaultSpec' + DSPEC_VERSION + '.yaml'; //always the same default spec!
		defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), !CACHE_DEFAULTSPEC, CACHE_DEFAULTSPEC);// last 2 params: reload, useLocal

		userSpecC = await vidCache.load('userSpec', async () => await route_userSpec(GAME, GAME + VERSION), !CACHE_USERSPEC, CACHE_USERSPEC);// last 2 params: reload, useLocal
		let fname = userSpecC['CODE'];

		userCodeC = await vidCache.load('userCode', async () => await route_userCode(GAME, GAME + VERSION), !CACHE_CODE, CACHE_CODE); // last 2 params: reload, useLocal

		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + initialPath, async () => await route_initGame(GAME, playerConfig[GAME], USERNAME), !CACHE_INITDATA, CACHE_INITDATA); // last 2 params: reload, useLocal 
	}
	defaultSpec = vidCache.asDict('defaultSpec');
	userSpec = vidCache.asDict('userSpec');
	userCode = vidCache.asDict('userCode');
	loadCode(userCode.asText);
	serverData = vidCache.asDict('_initial_' + initialPath);

	if (!SHOW_SPEC_CODE_DATA) return;

	//timit.showTime('*** DONE ***');
	// document.getElementById('userSpec').innerHTML = '<pre>' + userSpec.asText + '</pre>'; //PERFECT!!!!!!!!!!
	document.getElementById('code').innerHTML = '<pre>"' + userCode.asText + '"</pre>'; //PERFECT!!!!!!!!!!

	//delete serverData.table.asText;
	// document.getElementById('serverData').innerHTML = '<pre id="json-result"></pre>';
	// document.getElementById("json-result").innerHTML = JSON.stringify(serverData, undefined, 2);

	mById('serverData').innerHTML = '<pre>"' + jsonToYaml(serverData.table) + '"</pre>';

}

















