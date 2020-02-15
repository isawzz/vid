//#region routes
async function route_allGames() {
	let gameNames = await route_server_js('/game/available');
	let res = {};
	for (const name of gameNames) {
		res[name] = await route_server_js('/game/info/' + name);
	}
	return res;
}
async function route_iconChars() {
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
async function route_userSpec(game, fname) {
	try {
		let url = '/spec/' + game + (isdef(fname) ? '/' + fname : '');
		//let url = '/spec/' + GAME + (isdef(fname) ? '/' + fname : '');
		let text = await route_server_text(url);
		let spec = jsyaml.load(text);
		spec.asText = text;
		return spec;
	} catch{
		return { asText: '' }; //empty spec!
	}
}
async function route_userCode(game, fname) {
	try {
		//let codePath = '/games/' + game + '/_rsg/' + fname + '.js';
		let url = '/code/' + game + (isdef(fname) ? '/' + fname : '');
		let text = await route_server_text(url);

		var scriptTag = document.createElement("script");
		scriptTag.onload = () => console.log('code for', game, 'loaded');
		scriptTag.setAttribute("type", "text/javascript");
		scriptTag.innerHTML = text; // "console.log('HALLOOOOOOOOOO DU!!!!!!!');";
		document.getElementsByTagName("body")[0].appendChild(scriptTag);
		return { asText: text };
	} catch{ return {}; }

}
async function route_initGame(game, gc) {
	await fetch(SERVER + '/restart');
	await fetch(SERVER + '/game/select/' + game);
	let nPlayers = gc.numPlayers;
	console.log(gc)
	for (let i = 0; i < nPlayers; i++) {
		let plInfo = gc.players[i];
		let isAI = plInfo.agentType !== null;
		if (isAI) {
			await postData(SERVER + '/add/client/agent/' + plInfo.username, { agent_type: plInfo.agentType, timeout: null });
		}
		await fetch(SERVER + '/add/player/' + plInfo.username + '/' + plInfo.id);
	}
	await fetch(SERVER + '/begin/' + SEED);
	let data = await route_server_js('/status/' + gc.players[0].username);
	return data;
}

//#region server routes (low level)
async function route_rsg_asset(filename, ext = 'yml') {
	let url = '/vid0/static/rsg/assets/' + filename + '.' + ext;
	let response = await route_path_yaml_dict(url); //TODO: depending on ext, treat other assets as well!
	return response;
}
async function route_server_js(url) {
	let data = await fetch(SERVER + url);
	return await data.json();
}
async function route_server_text(url) {
	console.log(url, SERVER + url)
	let data = await fetch(SERVER + url);
	let text = await data.text();
	return text;
}
async function route_path_yaml_dict(url) {
	let data = await fetch(url);
	let text = await data.text();
	let dict = jsyaml.load(text);
	return dict;
}
// Example POST method implementation:
async function postData(url = '', data = {}) {
	//usage:
	// postData('https://example.com/answer', { answer: 42 })
	// .then((data) => {
	//   console.log(data); // JSON data parsed by `response.json()` call
	// });

	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *client
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return await response.json(); // parses JSON response into native JavaScript objects
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


