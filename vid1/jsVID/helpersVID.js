//#region routes
async function loadGameInfo(){
	if (allGames) return;
	let gameNames = await routeJS('/game/available');

	allGames = {};
	for(const name of gameNames){
		allGames[name] = await routeJS('/game/info/' + name);
	}
	console.log('game names',gameNames)
	console.log('allGames',allGames)
}

//#region server (low level)
async function routeJS(url){
	let data = await fetch(SERVER+url);
	return await data.json();
}
