//#region loading caching saving data
class VidCache {
	constructor(resetStorage = false) {
		this.live = {};
		if (resetStorage) this.resetAll();
	}
	load(key) {
		//console.log(key);
		let keys = null; let sKey = key;
		if (isList(key)) { skey = key.shift(); keys = key; }
		let res = this.live[sKey];
		if (res && keys) res = lookup(res, keys);
		if (res) return res;

		// console.log(sKey)
		let sData = localStorage.getItem(sKey);
		// console.log(sData);
		if (sData) {
			//console.log('found',sKey,'in local storage:',sData)
			let data = sData[0] == '{' || sData[0] == '[' ? JSON.parse(sData) : isNumber(sData) ? Number(sData) : sData;
			if (keys) { this.live[sKey] = data; return lookup(data, keys); }
			return data;
		} else {
			return null;
		}
	}
	reset() { this.live = {}; }
	resetAll() { localStorage.clear(); this.reset(); }
	saveComplexObject(keys,o){
		//for this to work, have to retrieve dict(keys[0]) from localstorage,transform to json,setKeys to o,then store again
	}
	save(key, data) {
		//key MUST be string!
		console.log('saving',key, data)
		this.live[key] = data;
		localStorage.setItem(key, JSON.stringify(data));
	}
}
async function loadAllGames() {
	if (allGames) return;
	allGames = vidCache.load('allGames');
	if (!allGames) { 
		allGames = await loadGameInfo(); 
		console.log(allGames)
		vidCache.save('allGames',allGames); 
	}
}

//#region routes
async function loadGameInfo() {

	let gameNames = await routeJS('/game/available');
	let res = {};
	for (const name of gameNames) {
		res[name] = await routeJS('/game/info/' + name);
	}
	// console.log('game names',gameNames);
	// console.log('allGames',allGames);
	return res;
}

//#region server (low level)
async function routeJS(url) {
	let data = await fetch(SERVER + url);
	return await data.json();
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

