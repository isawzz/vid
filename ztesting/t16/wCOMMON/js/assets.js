var vidCache, allGames, playerConfig, iconChars, c52, testCards; //session data
var defaultSpec, userSpec, userCode, serverData, prevServerData, tupleGroups, boats; //new game data

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
	////console.log('allGames', GAME, allGames[GAME]);
	playerConfig = stubPlayerConfig(allGames); //stub to get player info
	// //console.log('playerConfig', playerConfig[GAME]);
	// //console.log('testCards', testCards['green2']);
	// //console.log('c52', c52['card_2C']);
	// //console.log('icons', iconChars.crow);
	// //console.log('allGames', allGames.catan);
	// //console.log(vidCache);
}
async function loadSpec() {
	if (TESTING) {

		let url = DSPEC_PATH + DSPEC_VERSION + '.yaml'; //TEST_PATH + 'defaultSpec' + DSPEC_VERSION + '.yaml';
		defaultSpecC = await vidCache.load('defaultSpec', async () => await route_path_yaml_dict(url), true, false);// last 2 params: reload, useLocal

		url = TEST_VERSION ? TEST_PATH + 'u' + TEST_VERSION + '.yaml'
			: TEST_PATH + GAME + '/uspec' + USPEC_VERSION + '.yaml';

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
	//else consOutput('SPEC',SPEC);

}
async function loadCode() {
	// let url = TEST_PATH + GAME + '/code' + CODE_VERSION + '.js';
	if (TESTING && !CODE_VERSION) return;

	let url = TESTING && !USE_NON_TESTING_DATA ? TEST_PATH + GAME + '/code' + CODE_VERSION + '.js'
		: '/games/' + GAME + '/_rsg/' + GAME + VERSION + '.js';

	let loader = new ScriptLoader();
	await loader.load(SERVER + url);

	if (TESTING) userCodeC = await vidCache.load('userCode', async () => await route_path_asText_dict(url), true, false);// last 2 params: reload, useLocal
	else userCodeC = await vidCache.load('userCode', async () => await route_userCode(GAME, GAME + VERSION), !CACHE_CODE, CACHE_CODE); // last 2 params: reload, useLocal

	userCode = vidCache.asDict('userCode');

	// document.getElementById('code').innerHTML = '<pre>"' + userCode.asText + '"</pre>'; //PERFECT!!!!!!!!!!
	let d = mBy('CODE');
	if (d && SHOW_CODE) { d.innerHTML = '<pre>' + userCode.asText + '</pre>'; }
	//else //console.log('CODE',userCode.asText);

	//testingHallo('hallo das geht wirklich!!!!!');
}
async function loadInitialServerData(unameStarts) {
	let initialPath = GAME + (USE_MAX_PLAYER_NUM ? '_max' : '');

	_syncUsernameOfSender(unameStarts);

	if (TESTING) {
		let url = TEST_VERSION ? TEST_PATH + 'd' + TEST_VERSION + '.yaml'
			: TEST_PATH + GAME + '/data' + SERVERDATA_VERSION + '_' + initialPath + '.yaml';
		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + initialPath, async () => await route_path_yaml_dict(url), true, false); // last 2 params: reload, useLocal
	} else {
		serverDataC = initialDataC[GAME] = await vidCache.load('_initial_' + initialPath, async () => await route_initGame(GAME, playerConfig[GAME], USERNAME), !CACHE_INITDATA, CACHE_INITDATA); // last 2 params: reload, useLocal 
	}

	serverData = vidCache.asDict('_initial_' + initialPath);
	return serverData;
}
async function sendStatus(username) {
	_syncUsernameOfSender(username);
	if (!TESTING) serverData = await route_status(USERNAME);
}
async function sendRestart(username) {
	_syncUsernameOfSender(username);
	if (TESTING) serverData = await loadInitialServerData(USERNAME);
	else serverData = await route_begin_status(USERNAME);
}
async function sendAction(boat, username) {
	if (TESTING) {
		modifyServerDataRandom(username);
	} else {
		_syncUsernameOfSender(username);
		if (nundef(boat)) boat = chooseRandom(boats);
		let route = '/action/' + USERNAME + '/' + serverData.key + '/' + boat.desc + '/';
		let t = boat.tuple;
		//console.log('tuple is:', t);
		route += t.map(x => _pickStringForAction(x)).join('+');// /action/felix/91b7584a2265b1f5/loc-settlement/96
		//console.log('sending action...', route);
		let result = await route_server_js(route);
		//console.log('server returned', result);
		prevServerData = serverData;
		serverData = result;
	}
}

// serverData helpers
function preProcessData(data) {
	//console.log('preprocess:',data.players, 'plidSentStatus',plidSentStatus);
	if (nundef(data)) data = serverData;
	for (const plid in data.players) {
		let pl = data.players[plid];
		pl.obj_type = plid == plidSentStatus ? 'GamePlayer' : 'opponent';
	}
	if (data.options) {
		tupleGroups = getTupleGroups();
		let iGroup = 0;
		let iTuple = 0;
		boats = [];
		for (const tg of tupleGroups) {
			for (const t of tg.tuples) {
				let boatInfo = { obj_type: 'boat', oids: [], desc: tg.desc, tuple: t, iGroup: iGroup, iTuple: iTuple, text: t.map(x => x.val), weg: false };
				boats[iTuple] = boatInfo;
				iTuple += 1;
			}
			iGroup += 1;
		}
	} else {
		tupleGroups = null;
		boats = [];
	}
}
function modifyServerDataRandom(username) {
	//this should ONLY modify serverData
	_syncUsernameOfSender(username);
	prevServerData = jsCopy(serverData);

	let ranks = ['2', '3', '4', 'Q', 'J', 'T', 'A', '9'];

	let dModify = serverData.table ? serverData.table : serverData;
	//console.log('dModify', dModify)
	let keys = Object.keys(dModify);
	//console.log('keys', keys);
	let nChange = randomNumber(1, keys.length);
	shuffle(keys);
	console.log('>>>change', nChange, 'items!')

	for (let i = 0; i < nChange; i++) {
		let id = keys[i];
		let val = dModify[id];
		if (isLiteral(val)) dModify[id] = { id: id, value: val };
		// console.log('change rank of id', id);
		dModify[id].rank = chooseRandom(ranks);
		// console.log(dModify[id])
	}

}
function showServerData(data, domid = 'SERVERDATA') {
	let d = mBy(domid);
	if (d && SHOW_SERVERDATA) { d.innerHTML = '<pre>' + jsonToYaml(data) + '</pre>'; }
	//else consOutput('serverData',data);
}
function showPackages(data, domid = 'CODE') {
	let d = mBy(domid);
	if (d) { d.innerHTML = '<pre>' + jsonToYaml(data) + '</pre>'; }
	//else consOutput('serverData',data);
}

//#region _internal
// serverData / server helpers
function _syncUsernameOfSender(username) {
	if (nundef(username)) username = USERNAME; else USERNAME = username;
	plidSentStatus = getPlidForUsername(username);
	//console.log('------------------', username, USERNAME, plidSentStatus);

}


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
		////console.log(gName, info);
		let nPlayers = info.num_players[0]; // min player number, info.num_players.length - 1]; // max player number
		if (USE_MAX_PLAYER_NUM) nPlayers = info.num_players[info.num_players.length - 1]; // max player number
		let pls = {};
		for (let i = 0; i < nPlayers; i++) {
			let id = info.player_names[i];
			pls[id] = { id: id, playerType: 'me', agentType: null, username: USERNAME + (i > 0 ? i : ''), index: i };
			////console.log('player:', pl)
			// pls.push(pl);
		}
		gcs[gName] = { numPlayers: nPlayers, players: pls };

	}
	return gcs;
	////console.log('-------------------',gcs);
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
	//console.log('gamenames returned:', gameNames)
	let res = {};
	for (const name of gameNames) {
		//console.log(name);
		if (USE_ALL_GAMES_ROUTE) {
			res[name] = await route_server_js('/game/info/' + name);
		} else {
			let url = '/games/' + name + '/info.yaml';
			res[name] = await route_path_yaml_dict(url);// last 2 params: reload, useLocal
			//console.log('game info', name, res[name]);
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
	////console.log(gc)
	// for (let i = 0; i < nPlayers; i++) {
	for (plid in gc.players) {
		let plInfo = gc.players[plid];
		let isAI = plInfo.agentType !== null;
		if (isAI) {
			await postData(SERVER + '/add/client/agent/' + plInfo.username, { agent_type: plInfo.agentType, timeout: null });
		}
		await fetch_wrapper(SERVER + '/add/player/' + plInfo.username + '/' + plInfo.id);
	}
	return await route_begin_status(username, seed);
}
async function route_begin_status(username, seed = SEED) {
	await fetch_wrapper(SERVER + '/begin/' + seed);
	let data = await route_status(username);
	////console.log(data)
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
	////console.log(url, SERVER + url)
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
	////console.log(res.asText)
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
	if (SHOW_SERVER_ROUTE) consOutput(route_counter + ': route:' + url);
	let res = await fetch(url);
	if (SHOW_SERVER_RETURN) consOutput(route_counter + ': return:', res);
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

// tupleGroups
function getTupleGroups() {
	let act = serverData.options;

	//console.log('options', act)
	// json_str = JSON.stringify(act);
	// saveFile("yourfilename.json", "data:application/json", new Blob([json_str], { type: "" }));

	let tupleGroups = [];
	for (const desc in act) {
		let tg = { desc: desc, tuples: [] };
		//let tuples = expand99(act[desc].actions);
		let tuples = expand1_99(act[desc].actions);
		////console.log('*** ', desc, '........tuples:', tuples);

		if (tuples.length == 1 && !isList(tuples[0])) tuples = [tuples];
		////console.log(tuples)
		tg.tuples = tuples;
		tupleGroups.push({ desc: desc, tuples: tuples });
	}
	////console.log('tupleGroups', tupleGroups);
	return tupleGroups;
}
function expand1_99(x) {
	////console.log('expand1_99 input', tsRec(x))
	////console.log('expand1_99');
	if (isList(x)) {
		//console.log('expand1_99: x should be dict BUT is a list', x);
	}
	if (isDict(x)) { // TODO:  || isList(x)) {
		// if (isList(x)) {
		// 	//console.log('process: list',x)
		// }
		if ('_set' in x) {
			////console.log('handleSet wird aufgerufen')
			return handleSet(x._set);
		} else if ('_tuple' in x) {
			////console.log('handleTuple wird aufgerufen')
			return handleTuple(x._tuple);
		} else if ('type' in x) {
			return handleAction(x);
		} else { error('IMPOSSIBLE OBJECT', x); return null; }
	} else { error('IMPOSSIBLE TYPE', x); return null; }
}
function handleSet(x) {
	let irgend = x.map(expand1_99);
	let res = stripSet(irgend);
	return res;
}
function handleTuple(x) {
	let irgend = x.map(expand1_99);
	return multiCartesi(...irgend);
}
function handleAction(x) {
	return [[x]];
}
function isActionElement(x) {
	return typeof x == 'object' && 'type' in x;
}
function isListOfListOfActions(x) {
	return isList(x) && x.length > 0 && isList(x[0]) && x[0].length > 0 && isActionElement(x[0][0]);
}
function cartesi(l1, l2) {
	//l1,l2 are lists of list
	let res = [];
	for (var el1 of l1) {
		for (var el2 of l2) {
			res.push(el1.concat(el2));
		}
	}
	return res;
}
function multiCartesi() {
	//each arg is a list of list
	let arr = Array.from(arguments);
	if (arr.length > 2) {
		return cartesi(arr[0], stripSet(multiCartesi(...arr.slice(1))));
	} else if (arr.length == 2) return cartesi(arr[0], arr[1]);
	else if (arr.length == 1) return arr[0];
	else return [];
}
function stripSet(x) {
	if (isListOfListOfActions(x)) return x;
	else if (isActionElement(x)) return [[x]];
	else if (isList(x) && isActionElement(x[0])) return [x];
	else return [].concat(...x.map(stripSet));
	//return isList(x)&&x.length>0?stripSet(x[0]):x;
}

//preProcessServerData


// helpers
function getUsernameForPlid(id) { return playerConfig[GAME].players[id].username; }
function getPlidForUsername(username) {
	let pl = firstCondDict(playerConfig[GAME].players, x => x.username == username);
	// //console.log(getFunctionCallerName(),pl)
	return pl;
}
function _getTestPathForPlayerNum() { return GAME + (USE_MAX_PLAYER_NUM ? '_max' : ''); }
function _pickStringForAction(x) {
	//x is a tuple element, eg., {type:'fixed', val:'pass'} or {ID: "0", val: "hex[0]", type: "obj"}
	//console.log('pickStringForAction',x)
	if (x.type == 'fixed') return x.val;
	if (x.type == 'obj') return x.ID;
	if (x.type == 'player') return x.val;
}


//#endregion








