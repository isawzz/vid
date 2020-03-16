//#region API
var plidSendStatus=null;
function stubSendInitNewGame(isStarter){
	let unameStarts = S.gameConfig.players[0].username;
	plidSendStatus = getPlidForUsername(unameStarts);
	let data = serverData;
	preProcessData(data);
	if (isStarter && isReallyMultiplayer) socketEmitMessage({ type: 'started', data: USERNAME + ' has started the game!' });
	gameStep(data);

}
function sendAction(boat, callbacks) {
	//timit.timeStamp('send');
	plidSendStatus = G.player;
	let pl = G.playersAugmented[G.player];
	let route = '/action/' + pl.username + '/' + G.serverData.key + '/' + boat.desc + '/';
	let t = boat.tuple;
	//console.log('tuple is:',t);

	_sendRouteJS(route + t.map(x => _pickStringForAction(x)).join('+'), data => {
		preProcessData(data);
		if (!isEmpty(callbacks)) callbacks[0](data, arrFromIndex(callbacks, 1));
	});
}
function sendGetAllGames(callback) {
	//console.log('halloooooooo')
	if (USE_ALL_GAMES_ROUTE) { sendGetAllGamesFromServer(callback); }
	else { sendGetAllGamesFromYaml(callback); }
}
function sendGetAllGamesFromYaml(callback) {
	_sendRouteJS('/game/available', glist => {
		let chain = [];
		//console.log(glist);//glist is a list!!!
		for (const g of glist) chain.push({ cmd: '/games/' + g + '/info.yaml', f: loadYML, data: null });
		_cmdChainSend(chain, res => {
			//console.log(res);//res is a list of JSON objects 
			let info = {};
			res.map(x => info[x.short_name] = x);
			if (callback) callback(info); // (!isEmpty(callbacks)) callbacks[0](arrFromIndex(callbacks, 1));
		});
	});
}
function sendGetAllGamesFromServer(callback) {
	console.log('halloooooooo')
	_sendRouteJS('/game/available', glist => {
		let chain = [];
		//console.log(glist);//glist is a list!!!
		for (const g of glist) chain.push({ cmd: '/game/info/' + g, f: _sendRouteJS, data: null });
		_cmdChainSend(chain, res => {
			//console.log(res);//res is a list of JSON objects 
			let info = {};
			res.map(x => info[x.short_name] = x);
			if (callback) callback(info); // (!isEmpty(callbacks)) callbacks[0](arrFromIndex(callbacks, 1));
		});
	});
}
function sendInitNewGame() {
	let cmdChain = _prepCommandChain(S.gameConfig);

	//timit.showTime('sending init new game (as starter!)');
	_sendRoute('/restart', _ => {
		//timit.showTime('sending select game');
		_sendRoute('/game/select/' + S.settings.game, _ => {
			_cmdChainSend(cmdChain, _ => {
				_sendRoute('/begin/' + SEED, _ => {
					let unameStarts = S.gameConfig.players[0].username;

					//make sure this is the correct username!!!
					if (unameStarts != USERNAME) {
						alert('username wrong!!!!', unameStarts, USERNAME);
					}
					//timit.showTime('sending status');
					sendStatus(unameStarts, [
						data => {
							if (isReallyMultiplayer) socketEmitMessage({ type: 'started', data: USERNAME + ' has started the game!' });
							gameStep(data);
						}]);
				});
			});
		})
	});
}
function sendRestartGame(username, seed, callbacks) {
	// timit.showTime('sending restart game');
	_sendRoute('/begin/' + seed, d6 => {
		sendStatus(username, callbacks);
	});
}
function sendRoute(cmd, callback) { _sendRoute(cmd, callback); }
function sendStatus(username, callbacks) {
	plidSendStatus = getPlidForUsername(username);
	_sendRouteJS('/status/' + username, data => {
		// console.log('back from _sendStatusJS in sendStatus, data:',data)
		preProcessData(data);
		if (!isEmpty(callbacks)) callbacks[0](data, arrFromIndex(callbacks, 1));
	});
}
function sendStatusNewGame() { sendStatus(USERNAME, [gameStep]); }

function preProcessData(data){
	//console.log('preprocess:',data.players);
	for (const plid in data.players) {
		let pl = data.players[plid];
		pl.obj_type = plid == plidSendStatus ? 'GamePlayer' : 'opponent';
		// if (nundef(pl.obj_type)) {
		// 	//console.log('.......CORRECTING!!!!',plid)
		// 	pl.obj_type = 'opponent';
		// }
		//console.log(serverData.players[plid].obj_type)
	}
	//console.log(serverData.players)

}


//#region helpers
function _cmdChainSend(msgChain, callback) {
	let akku = [];
	_cmdChainSendRec(akku, msgChain, callback);
}
function _cmdChainSendRec(akku, msgChain, callback) {
	if (msgChain.length > 0) {
		msgChain[0].f(msgChain[0].cmd, d => {
			akku.push(d);
			_cmdChainSendRec(akku, msgChain.slice(1), callback)
		}, msgChain[0].data);
	} else {
		callback(akku);
	}
}
function _pickStringForAction(x) {
	//x is a tuple element, eg., {type:'fixed', val:'pass'} or {ID: "0", val: "hex[0]", type: "obj"}
	//console.log('pickStringForAction',x)
	if (x.type == 'fixed') return x.val;
	if (x.type == 'obj') return x.ID;
	if (x.type == 'player') return x.val;
}
function _prepCommandChain(gc) {
	let nPlayers = gc.numPlayers;
	let cmdChain = [];
	for (let i = 0; i < nPlayers; i++) {
		let plInfo = gc.players[i];
		let isAI = plInfo.agentType !== null;
		let isBackendAI = USE_BACKEND_AI && isAI;
		if (isBackendAI) {
			let cmd = 'add/client/agent/' + plInfo.username;
			cmdChain.push({ cmd: cmd, f: _postRoute, data: { agent_type: plInfo.agentType, timeout: null } });
			cmd = '/add/player/' + plInfo.username + '/' + plInfo.id;
			cmdChain.push({ cmd: cmd, f: _sendRoute, data: null });
		} else {
			let cmd = '/add/player/' + plInfo.username + '/' + plInfo.id;
			cmdChain.push({ cmd: cmd, f: _sendRoute });
		}
	}
	return cmdChain;
}
function _postRoute(route, callback, data) {
	if (nundef(counters)) counters = { msg: 0 };
	counters.msg += 1;
	let prefix = last(SERVER_URL) == '/' ? dropLast(SERVER_URL) : SERVER_URL;
	if (route[0] != '/') route = '/' + route;
	let url = prefix + route;
	console.log(counters.msg + ': request sent: ' + url + '\nPOST data:', data);
	$.ajax({
		type: 'POST',
		url: url,
		data: JSON.stringify(data),
		success: response => callback(response),
		error: function (e) {
			callback(e.responseText)
		},
		dataType: "json",
		contentType: "application/json"
	});
}
function _sendRoute(route, callback) { _sendRouteBase(false, route, callback); }
function _sendRouteJS(route, callback) { _sendRouteBase(true, route, callback); }
function _sendRouteBase(returnJS, route, callback) {
	//console.log('*** _sendRouteBase *** ', returnJS, route)
	if (nundef(counters)) counters = { msg: 0 };
	counters.msg += 1;
	let prefix = last(SERVER_URL) == '/' ? dropLast(SERVER_URL) : SERVER_URL;
	if (route[0] != '/') route = '/' + route;
	let url = prefix + route;
	//console.log(counters.msg + ': request sent: ' + url);

	let js = { NODATA: 'NODATA' };
	$.ajax({
		url: url,
		type: 'GET',
		success: response => {
			try {
				js = JSON.parse(response);
				//console.log('raw',response);
				//console.log('json',js)
				if (js.error) { console.log(js.error.msg); }
				//if (callback) callback(returnJS ? js : response);
			} catch{
				//alert('NOT JSON: '+response);
				js = { response: response };
				//if (callback) callback(returnJS ? { response: response } : response);
			}
			if (callback) callback(returnJS ? js : response);

		},
		error: err => { error(err); alert(err); },
	});
}
//#endregion

//#region route_ API new!
//#region routes
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
			console.log('game info',name,res[name]);
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

var route_counter=0;
async function fetch_wrapper(url){
	route_counter+=1;
	if (SHOW_SERVER_ROUTE) console.log(route_counter+': route:'+url);
	let res = await fetch(url);
	if (SHOW_SERVER_RETURN) console.log(route_counter+': return:',res);
	return res;
}

