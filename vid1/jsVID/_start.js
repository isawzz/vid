window.onload = () => _start();

async function _start() {

	//#region testing
	// userSpec = await route_userSpec('catan');
	// console.log(userSpec)
	// return;
	//#endregion testing

	timit = new TimeIt('*');
	timit.showTime('*timer');

	vidCache = new LazyCache();//********** true for LOCALSTORAGE CLEAR!!!!! */
	iconChars = await vidCache.load('iconChars', route_iconChars);
	allGames = await vidCache.load('allGames', route_allGames);
	playerConfig = stubPlayerConfig(allGames.live); //stub to get player info
	userSpec = await vidCache.load('userSpec', () => route_userSpec(GAME));
	let fname = userSpec.get('CODE');
	userCode = await vidCache.load('userCode', () => route_userCode(GAME, fname));
	initialData[GAME] = await vidCache.load('_initial_' + GAME, () => route_initGame(GAME, playerConfig[GAME]));
	serverData = initialData[GAME].live;
	//serverData = await route_initGame(GAME,playerConfig[GAME]); // if not caching init data

	timit.showTime('*** DONE ***');
	// document.getElementById('table').innerHTML = '<pre>' + userSpec.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	// document.getElementById('log').innerHTML = '<pre>' + userCode.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	// document.getElementById('actions').innerHTML = '<pre id="json-result"></pre>';
	// document.getElementById("json-result").innerHTML = JSON.stringify(serverData, undefined, 2);

}
