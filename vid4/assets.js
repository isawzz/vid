var vidCache, allGames, playerConfig, iconChars, c52, testCards; //session data
var defaultSpec, userSpec, userCode, serverData; //new game data

//#region API: loadAssets, loadSpec (also merges), loadCode (also activates), loadInitialServerData
async function loadAssets() {
	vidCache = new LazyCache(!USE_LOCAL_STORAGE);

	testCardsC = await vidCache.load('testCards', async () => await route_rsg_asset('testCards', 'yaml'));
	testCards = vidCache.asDict('testCards');
	iconCharsC = await vidCache.load('iconChars', route_iconChars);
	iconChars = vidCache.asDict('iconChars');
	c52C = await vidCache.load('c52', route_c52);
	c52 = vidCache.asDict('c52');

	allGamesC = await vidCache.load('allGames', route_allGames);
	allGames = vidCache.asDict('allGames');
	//console.log('allGames', GAME, allGames[GAME]);
	playerConfig = stubPlayerConfig(allGames); //stub to get player info
	// console.log('playerConfig', playerConfig[GAME]);
	// console.log('testCards', testCards['green2']);
	// console.log('c52', c52['card_2C']);
	// console.log('icons', iconChars.crow);
	// console.log('allGames', allGames.catan);
	// console.log(vidCache);
}
async function loadSpec() {
	if (TESTING) {

		let url = TEST_PATH + 'defaultSpec' + DSPEC_VERSION + '.yaml';
		defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), true, false);// last 2 params: reload, useLocal

		url = TEST_PATH + GAME + '/uspec' + USPEC_VERSION + '.yaml';
		if (USE_NON_TESTING_DATA) url = '/games/' + GAME + '/_rsg/' + GAME + VERSION + '.yaml';
		userSpecC = await vidCache.load('userSpec', async () => await route_test_userSpec(url), true, false);// last 2 params: reload, useLocal

	} else {

		url = TEST_PATH + 'defaultSpec' + DSPEC_VERSION + '.yaml'; //always the same default spec!
		defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), !CACHE_DEFAULTSPEC, CACHE_DEFAULTSPEC);// last 2 params: reload, useLocal

		userSpecC = await vidCache.load('userSpec', async () => await route_userSpec(GAME, GAME + VERSION), !CACHE_USERSPEC, CACHE_USERSPEC);// last 2 params: reload, useLocal

	}

	defaultSpec = vidCache.asDict('defaultSpec');
	userSpec = vidCache.asDict('userSpec');

	//merge default and userSpec
	SPEC = deepmerge(defaultSpec, userSpec, { arrayMerge: overwriteMerge });

	//need to correct areas because it should NOT be merged!!!
	if (userSpec.layout_alias) { SPEC.areas = userSpec.layout_alias; }
	if (userSpec.areas) { SPEC.areas = userSpec.areas; }
	delete SPEC.layout_alias;
	delete SPEC.asText;

	let d = mBy('SPEC');
	if (d && SHOW_SPEC) { d.innerHTML = '<pre>' + jsonToYaml(SPEC) + '</pre>'; }
	else console.log('SPEC',SPEC);

}
async function loadCode() {
	// let url = TEST_PATH + GAME + '/code' + CODE_VERSION + '.js';
	let url = TESTING && !USE_NON_TESTING_DATA ? TEST_PATH + GAME + '/code' + CODE_VERSION + '.js'
		: url = '/games/' + GAME + '/_rsg/' + GAME + VERSION + '.js';

	let loader = new ScriptLoader();
	await loader.load(SERVER + url);

	if (TESTING) userCodeC = await vidCache.load('userCode', async () => await route_path_asText_dict(url), true, false);// last 2 params: reload, useLocal
	else userCodeC = await vidCache.load('userCode', async () => await route_userCode(GAME, GAME + VERSION), !CACHE_CODE, CACHE_CODE); // last 2 params: reload, useLocal

	userCode = vidCache.asDict('userCode');

	// document.getElementById('code').innerHTML = '<pre>"' + userCode.asText + '"</pre>'; //PERFECT!!!!!!!!!!
	let d = mBy('CODE');
	if (d && SHOW_CODE) { d.innerHTML = '<pre>' + userCode.asText + '</pre>'; }
	else console.log('CODE',userCode.asText);

	testingHallo('hallo das geht wirklich!!!!!');
}
async function loadInitialServerData() {
	let initialPath = GAME + (USE_MAX_PLAYER_NUM ? '_max' : '');
	if (TESTING) {
		url = TEST_PATH + GAME + '/data' + SERVERDATA_VERSION + '_' + initialPath + '.yaml';
		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + initialPath, async () => await route_path_yaml_dict(url), true, false); // last 2 params: reload, useLocal
	} else {
		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + initialPath, async () => await route_initGame(GAME, playerConfig[GAME], USERNAME), !CACHE_INITDATA, CACHE_INITDATA); // last 2 params: reload, useLocal 
	}

	serverData = vidCache.asDict('_initial_' + initialPath);

	let d = mBy('SERVERDATA');
	if (d && SHOW_SERVERDATA) { d.innerHTML = '<pre>' + jsonToYaml(serverData.table) + '</pre>'; }
	else console.log('serverData',serverData);

	return serverData;
}
//preProcessServerData
//sendAction
//sendStatus
//oder koennte auch in preProcessServerData bereits das weitingFor handeln?!?
//>>muss ich mir ueberlegen wo das hingehoert?


//#region API: serverData+SPEC ==> object tree


//#region _internal
// serverData modification (stub)


// playerConfig (stub)
function setGamePlayer(username) {
	USERNAME = username;
	GAMEPLID = firstCondDict(playerConfig[GAME].players, p => p.username == username);

}
function stubPlayerConfig(gameInfo) {
	//automatically set a player configuration when starting in game view
	gcs = {};
	for (const gName in gameInfo) {
		let info = gameInfo[gName]
		//console.log(gName, info);
		let nPlayers = info.num_players[0]; // min player number, info.num_players.length - 1]; // max player number
		if (USE_MAX_PLAYER_NUM) nPlayers = info.num_players[info.num_players.length - 1]; // max player number
		let pls = {};
		for (let i = 0; i < nPlayers; i++) {
			let id = info.player_names[i];
			pls[id] = { id: id, playerType: 'me', agentType: null, username: USERNAME + (i > 0 ? i : ''), index: i };
			//console.log('player:', pl)
			// pls.push(pl);
		}
		gcs[gName] = { numPlayers: nPlayers, players: pls };

	}
	return gcs;
	//console.log('-------------------',gcs);
}
function updatePlayerConfig() {
	let keysPlayerColors = Object.keys(playerColors);
	//let players = playerConfig[GAME].players;

	//match colors to better colors!
	let iColor = 0;
	for (const id in serverData.players) {
		let pl = serverData.players[id];
		let colorName = isdef(pl.color) ? pl.color : keysPlayerColors[iColor];
		colorName = colorName.toLowerCase();
		let altName = capitalize(colorName);
		let color = isdef(playerColors[colorName]) ? playerColors[colorName] : colorName;


		playerConfig[GAME].players[id].color = color;
		//playerConfig[id].color = color;
		// playerConfig[id].altName = altName;
		// playerConfig[id].index = i;
		iColor += 1;
	}
}

// routes
async function route_allGames() {
	let gameNames = await route_server_js('/game/available');
	console.log('gamenames returned:', gameNames)
	let res = {};
	for (const name of gameNames) {
		console.log(name);
		if (USE_ALL_GAMES_ROUTE) {
			res[name] = await route_server_js('/game/info/' + name);
		} else {
			let url = '/games/' + name + '/info.yaml';
			res[name] = await route_path_yaml_dict(url);// last 2 params: reload, useLocal
			console.log('game info', name, res[name]);
		}
	}
	return res;
}
async function route_c52() {
	return await route_rsg_asset('c52', 'yaml');
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
async function route_test_userSpec(url) {
	try {
		let text = await route_path_text(url);
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

		return { asText: text };
	} catch{ return {}; }

}
async function route_initGame(game, gc, username, seed = SEED) {
	await fetch_wrapper(SERVER + '/restart');
	await fetch_wrapper(SERVER + '/game/select/' + game);
	let nPlayers = gc.numPlayers;
	//console.log(gc)
	// for (let i = 0; i < nPlayers; i++) {
	for (plid in gc.players) {
		let plInfo = gc.players[plid];
		let isAI = plInfo.agentType !== null;
		if (isAI) {
			await postData(SERVER + '/add/client/agent/' + plInfo.username, { agent_type: plInfo.agentType, timeout: null });
		}
		await fetch_wrapper(SERVER + '/add/player/' + plInfo.username + '/' + plInfo.id);
	}
	return await route_restart(username, seed);
}
async function route_restart(username, seed = SEED) {
	await fetch_wrapper(SERVER + '/begin/' + seed);
	let data = await route_status(username);
	//console.log(data)
	return data;
}
async function route_status(username) { return await route_server_js('/status/' + username); }
async function route_rsg_asset(filename, ext = 'yml') {
	let url = '/assets/' + filename + '.' + ext;
	let response = await route_path_yaml_dict(url); //TODO: depending on ext, treat other assts as well!
	return response;
}
async function route_server_js(url) {
	let data = await fetch_wrapper(SERVER + url);
	return await data.json();
}
async function route_server_text(url) {
	//console.log(url, SERVER + url)
	let data = await fetch_wrapper(SERVER + url);
	let text = await data.text();
	return text;
}
async function route_path_yaml_dict(url) {
	let data = await fetch_wrapper(url);
	let text = await data.text();
	let dict = jsyaml.load(text);
	return dict;
}
async function route_path_text(url) {
	let data = await fetch_wrapper(url);
	return await data.text();
}
async function route_path_asText_dict(url) {
	let data = await fetch_wrapper(url);
	let res = {};
	res.asText = await data.text();
	//console.log(res.asText)
	//res.asDict = JSON.parse(res.asText);//
	return res; // await data.text();
}
async function postData(url = '', data = {}) {
	//usage: postData('https://example.com/answer', { answer: 42 })

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
async function route_server(url) { await fetch_wrapper(SERVER + url); }

var route_counter = 0;
async function fetch_wrapper(url) {
	route_counter += 1;
	if (SHOW_SERVER_ROUTE) console.log(route_counter + ': route:' + url);
	let res = await fetch(url);
	if (SHOW_SERVER_RETURN) console.log(route_counter + ': return:', res);
	return res;
}

// caches & consts: playerColors, THEMES, iTHEME
var allGamesC = null;
var playerConfigC = null;
var iconCharsC = null;
var c52C = null;
var testCardsC = null
var defaultSpecC = null;
var userSpecC = null;
var userCodeC = null;
var initialDataC = {}; //mostly for testing
var serverDataC = null;

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

// helpers
function _getTestPathForPlayerNum() { return GAME + (USE_MAX_PLAYER_NUM ? '_max' : ''); }


//#endregion








