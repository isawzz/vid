var allGames = null; //allGames1;
var iconChars=null;


async function loadAllGames_dep() {
	if (allGames) return;
	allGames = vidCache_dep.load('allGames');
	if (!allGames) { 
		allGames = await loadGameInfo(); 
		console.log(allGames)
		vidCache.save('allGames',allGames); 
	}
}
async function loadIcon_dep(key){
	if (!iconChars) iconChars=await route_icons();
	return iconChars[key];
}

//#region routes
async function route_icons(){
	let gaIcons = await route_rsg_asset('gameIconCodes');
	let faIcons = await route_rsg_asset('faIconCodes');
	let dIcons = {};
	for (const k in faIcons) {
		dIcons[k] = faIcons[k];
	}
	for (const k in gaIcons) {
		dIcons[k] = gaIcons[k];
	}
	return dIcons;

}
async function route_rsg_asset(filename,ext='yml'){
	let url = '/vid0/static/rsg/assets/'+filename+'.'+ext;
	//timit.showTime('*** vor ***')
	let response = await route_path_yaml_dict(url); //TODO: depending on ext, treat other assets as well!
	//timit.showTime('*** loaded from server ***');
	return response;
}
async function loadGameInfo() {
	let gameNames = await route_server_js('/game/available');
	let res = {};
	for (const name of gameNames) {
		res[name] = await route_server_js('/game/info/' + name);
	}
	return res;
}

//#region server routes (low level)
async function route_server_js(url) {
	let data = await fetch(SERVER + url);
	return await data.json();
}
async function route_path_yaml_dict(url) {
	let data = await fetch(url);
	let text = await data.text();
	let dict = jsyaml.load(text);
	return dict;
}

//#region stubs
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


