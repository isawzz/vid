//#region vars
var timit = null;
var vidCache = null;
var allGames = null;
var playerConfig = null;
var iconChars = null;
var userSpec = null;
var userCode = null;
var initialData = {};
var serverDataCache = null;
var serverData = null;

window.onload = () => _start();
//#endregion

function clear() {
	clearElement('t1');
}
async function _start(resetLocalStorage=false) {

	clear();

	//#region loading
	timit = new TimeIt('*');
	timit.showTime('*timer');

	vidCache = new LazyCache(resetLocalStorage);//********** true for LOCALSTORAGE CLEAR!!!!! */
	iconChars = await vidCache.load('iconChars', route_iconChars);
	allGames = await vidCache.load('allGames', route_allGames);
	playerConfig = stubPlayerConfig(allGames.live); //stub to get player info

	if (TESTING) {
		await loadTest(1, 1, 1);
	} else {
		userSpec = await vidCache.load('userSpec', async () => await route_userSpec(GAME, USERSPEC_FNAME));//, true); //set true to reload from server!
		let fname = userSpec.get('CODE');

		userCode = await vidCache.load('userCode', async () => await route_userCode(GAME, fname));//, true); //set true to reload from server!
		loadCode(GAME, userCode.live.asText);

		serverDataCache = initialData[GAME] = await vidCache.load('_initial_' + GAME, async () => await route_initGame(GAME, playerConfig[GAME])); //, true); //set true to reload from server
		serverData = initialData[GAME].live;
	}

	//timit.showTime('*** DONE ***');
	// document.getElementById('table').innerHTML = '<pre>' + userSpec.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	document.getElementById('objects').innerHTML = '<pre>' + userCode.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	// document.getElementById('actions').innerHTML = '<pre id="json-result"></pre>';
	// document.getElementById("json-result").innerHTML = JSON.stringify(serverData, undefined, 2);
	//#endregion

	rStart();
}
