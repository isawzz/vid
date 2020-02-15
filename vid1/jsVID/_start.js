window.onload = ()=>_start();

async function _start(){

	//#region testing
	// userSpec = await route_userSpec('catan');
	// console.log(userSpec)
	// return;
	//#endregion testing

	timit = new TimeIt('*');
	timit.showTime('*timer');
	vidCache = new LazyCache();//********** true for LOCALSTORAGE CLEAR!!!!! */
	iconChars = await vidCache.load('iconChars', route_iconChars);
	allGames = await vidCache.load('allGames',route_allGames);
	playerConfig = stubPlayerConfig(allGames.live); //stub to get player info
	userSpec = await vidCache.load('userSpec',()=>route_userSpec(GAME));
	let fname = userSpec.get('CODE');
	// console.log('code filename =',fname);
	userCode = await vidCache.load('userCode',()=>route_userCode(GAME,fname));
	initialData[GAME] = await vidCache.load('initial'+GAME,()=>route_initGame(GAME,playerConfig[GAME]));
	//serverData = await route_initGame(GAME,playerConfig[GAME]);

	timit.showTime('*** DONE ***');
	// console.log(userSpec);
	// console.log(userCode);
	document.getElementById('table').innerHTML = '<pre>' + userSpec.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	document.getElementById('log').innerHTML = '<pre>' + userCode.get('asText') + '</pre>'; //PERFECT!!!!!!!!!!
	// console.log(iconChars, typeof iconChars);
	// console.log('allGames',allGames,playerConfig);
	// console.log(allGames.get('catan'));

	//send start sequence to start game!!!!!!!!!


}
