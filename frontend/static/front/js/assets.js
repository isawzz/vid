//#region vars
//#region caches 
var allGamesC = null;
var playerConfigC = null;
var iconCharsC = null;
//var c52C = null;
var testCardsC = null

//#endregion
//dictionaries:
var allGames = null;
var playerConfig = null;
var iconChars = null;
//var c52 = null;
var testCards = null


//new game data
//#region caches
var defaultSpecC = null;
var userSpecC = null;
var userCodeC = null;
var initialDataC = {}; //mostly for testing
var serverDataC = null;
//#endregion
var defaultSpec = null
var userSpec = null;
var userCode = null;
var serverData = null;

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
//#endregion
async function loadAssets() {
	//loading assets
	vidCache = new LazyCache(!USE_LOCAL_STORAGE);

	testCardsC = await vidCache.load('testCards', async () => await route_rsg_asset('testCards', 'yaml'));
	testCards = vidCache.asDict('testCards');
	iconCharsC = await vidCache.load('iconChars', route_iconChars);
	iconChars = vidCache.asDict('iconChars');
	// c52C = await vidCache.load('c52', route_c52);
	// c52 = vidCache.asDict('c52');

	allGamesC = await vidCache.load('allGames', route_allGames);
	allGames = vidCache.asDict('allGames');
	//console.log('allGames', GAME, allGames[GAME]);
	playerConfig = stubPlayerConfig(allGames); //stub to get player info
}
function setUserSpecAndCode() {
	//console.log('SETTING USER SPEC AND CODE!!!!!!!!!!!!!!!!!!!!!')
	S.user.spec = userSpec;
	S.user.specText = userSpec.asText;
	S.user.script = userCode.asText;
}

async function loadSpecAndCode() {
	let initialPath = GAME + (USE_MAX_PLAYER_NUM ? '_max' : '');
	if (TESTING) {

		let url = TEST_PATH + 'defaultSpec' + DSPEC_VERSION + '.yaml';
		defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), true, false);// last 2 params: reload, useLocal

		url = TEST_PATH + GAME + '/uspec' + USPEC_VERSION + '.yaml';
		if (USE_NON_TESTING_DATA) url = '/games/' + GAME + '/_rsg/' + GAME + VERSION + '.yaml';
		userSpecC = await vidCache.load('userSpec', async () => await route_test_userSpec(url), true, false);// last 2 params: reload, useLocal

		url = TEST_PATH + GAME + '/code' + CODE_VERSION + '.js';
		if (USE_NON_TESTING_DATA) url = '/games/' + GAME + '/_rsg/' + GAME + VERSION + '.js';
		userCodeC = await vidCache.load('userCode', async () => await route_path_asText_dict(url), true, false);// last 2 params: reload, useLocal

		url = TEST_PATH + GAME + '/data' + SERVERDATA_VERSION + '_' + initialPath + '.yaml';
		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + initialPath, async () => await route_path_yaml_dict(url), true, false); // last 2 params: reload, useLocal
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
	// console.log('onCodeLoaded',onCodeLoaded)
	loadCode0(userCode.asText, 'setUserSpecAndCode();', () => {
		//console.log('setting code now!')
		setUserSpecAndCode();
		// console.log(onCodeLoaded)
		// if (onCodeLoaded) onCodeLoaded();
	});
	//console.log('userCode', userCode);

	//console.log('userSpec', userSpec);

	serverData = vidCache.asDict('_initial_' + initialPath);
	//console.log(serverData)

	// return;
	// if (!SHOW_CODE_DATA) return;

	// //timit.showTime('*** DONE ***');
	// // document.getElementById('userSpec').innerHTML = '<pre>' + userSpec.asText + '</pre>'; //PERFECT!!!!!!!!!!
	// document.getElementById('code').innerHTML = '<pre>"' + userCode.asText + '"</pre>'; //PERFECT!!!!!!!!!!

	// //delete serverData.table.asText;
	// // document.getElementById('serverData').innerHTML = '<pre id="json-result"></pre>';
	// // document.getElementById("json-result").innerHTML = JSON.stringify(serverData, undefined, 2);

	// mById('serverData').innerHTML = '<pre>"' + jsonToYaml(serverData.table) + '"</pre>';

}
function stubPlayerConfig(gameInfo) {
	//automatically set a player configuration when starting in game view
	gcs = {};
	for (const gName in gameInfo) {
		let info = gameInfo[gName]
		//console.log(gName, info);
		let nPlayers = info.num_players[0]; // min player number, info.num_players.length - 1]; // max player number
		let pls = [];
		for (let i = 0; i < nPlayers; i++) {
			let pl = { id: info.player_names[i], playerType: 'me', agentType: null, username: USERNAME + (i > 0 ? i : '') };
			//console.log('player:', pl)
			pls.push(pl);
		}
		gcs[gName] = { numPlayers: nPlayers, players: pls };

	}
	return gcs;
	//console.log('-------------------',gcs);
}

















