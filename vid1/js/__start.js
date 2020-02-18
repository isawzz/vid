//#region vars
var timit = null;
var vidCache = null;
var allGames = null;
var playerConfig = null;
var iconChars = null;
var userSpec = null;
var userCode = null;
var initialData = {};
var serverData = null;


window.onload = () => _start();
//#endregion

async function _start() {

	//#region testing
	// userSpec = await route_userSpec('catan');
	// console.log(userSpec)
	// return;
	//#endregion testing

	//#region loading
	timit = new TimeIt('*');
	// zoom_on_wheel_alt(); //TODO!
	// zoom_on_resize();
	// initZoom();
	timit.showTime('*timer');

	vidCache = new LazyCache();//********** true for LOCALSTORAGE CLEAR!!!!! */
	iconChars = await vidCache.load('iconChars', route_iconChars);
	allGames = await vidCache.load('allGames', route_allGames);
	playerConfig = stubPlayerConfig(allGames.live); //stub to get player info
	userSpec = await vidCache.load('userSpec', () => route_userSpec(GAME, USERSPEC_FNAME));//, false); //set false to reload from server!
	let fname = userSpec.get('CODE');

	userCode = await vidCache.load('userCode', () => route_userCode(GAME, fname));//, false); //set false to reload from server!
	loadCode(GAME,userCode.live.asText);
	initialData[GAME] = await vidCache.load('_initial_' + GAME, () => route_initGame(GAME, playerConfig[GAME]));
	serverData = initialData[GAME].live;
	//serverData = await route_initGame(GAME,playerConfig[GAME]); // if not caching init data

	//timit.showTime('*** DONE ***');
	// document.getElementById('table').innerHTML = '<pre>' + userSpec.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	document.getElementById('objects').innerHTML = '<pre>' + userCode.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	// document.getElementById('actions').innerHTML = '<pre id="json-result"></pre>';
	// document.getElementById("json-result").innerHTML = JSON.stringify(serverData, undefined, 2);
	//#endregion

	//this is where RSG takes over!
	//console.log(userSpec.live)
	//console.log(userCode.live)
	rStart();


}
