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
async function _start(resetLocalStorage=false) {

	clear();

	//#region loading
	timit = new TimeIt('*');
	timit.tacit();
	timit.showTime('*timer');

	//loading assets
	vidCache = new LazyCache2();//resetLocalStorage);//********** true for LOCALSTORAGE CLEAR!!!!! */
	testCards = await vidCache.load('testCards',async()=>await route_rsg_asset('cards','yaml')); 
	//return;

	iconChars = await vidCache.load('iconChars', route_iconChars);
	c52 = await vidCache.load('c52',route_c52);
	allGames = await vidCache.load('allGames', route_allGames);
	playerConfig = stubPlayerConfig(allGames.live); //stub to get player info

	console.log('testCards',testCards['green2']);
	console.log('c52',c52['card_2C']);
	console.log('icons',iconChars.crow);
	console.log('allGames',allGames.catan);
	console.log(vidCache);
	return;

	if (TESTING) {
		await loadTest(1, 1, 1);
	} else {
		userSpec = await vidCache.load('userSpec', async () => await route_userSpec(GAME, USERSPEC_FNAME));//, true); //set true to reload from server!
		let fname = userSpec.get('CODE');

		userCode = await vidCache.load('userCode', async () => await route_userCode(GAME, fname), true, false); //set true to reload from server!
		loadCode(GAME, userCode.live.asText);

		//serverdata are cached now for testing,later will just:
		//serverData = await route_initGame(GAME,playerConfig[GAME]);
		serverDataCache = initialData[GAME] = await vidCache.load('_initial_' + GAME, async () => await route_initGame(GAME, playerConfig[GAME])); //, true); //set true to reload from server
		serverData = initialData[GAME].live;
	}

	//timit.showTime('*** DONE ***');
	document.getElementById('userSpec').innerHTML = '<pre>' + userSpec.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	document.getElementById('code').innerHTML = '<pre>' + userCode.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!

	document.getElementById('serverData').innerHTML = '<pre id="json-result"></pre>';
	document.getElementById("json-result").innerHTML = JSON.stringify(serverData.table, undefined, 2);
	//#endregion

	rStart();

	makeCard52_test(1,null,{key:'green2',area:'decks'});
}
