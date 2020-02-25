const DOMCATS = { rect: 'g', g: 'g', circle: 'g', text: 'g', polygon: 'g', line: 'g', body: 'd', svg: 'h', div: 'd', p: 'd', table: 'd', button: 'd', a: 'd', span: 'd', image: 'd', paragraph: 'd', anchor: 'd' };
//#region one liners / getters
function getPlayer(id) { return serverData.players[id]; }
function getUser(idPlayer) { return playerConfig[GAME].players[idPlayer].username; }
function getPlid(username) { 
	console.log(playerConfig[GAME].players,username);
	let res = firstCondDict(playerConfig[GAME].players,x=>x.username == username);
	console.log(res)
	return  res;
}
function getPlayerColor(id) { return playerConfig[GAME][id].color; }
function getPlayerColorString(id) { return playerConfig[GAME][id].altName; }
function getColorHint(o) {
	for (const k in o) {
		if (k.toLowerCase() == 'color') return o[k];
		if (isDict(o[k]) && isdef(o[k]._player)) return getPlayerColor(o[k]._player);
	}
	return null;
}
function getIdsInfobox() { return IdOwner.i ? IdOwner.i : []; }
function getSimpleSetElements(o) { return getValueArray(o); }
function getMainArea(areaName) { return UIS[getIdArea(areaName)]; }
function getStandardAreaNameForPlayerProp(pid, propName) { return 'area_' + pid + '_' + propName; }
function getStandardAreaNameForKey(key) { return 'm_A_' + key; }
function getOidForMainId(id) { return id[0] == 'm' ? id.substring(4) : null; }
function getAreaName(id) { return startsWith(id, 'm_A') ? id.substring(4) : id; }
function getIdArea(areaName) { if (startsWith(areaName, 'a_d_')) { return areaName; } else if (startsWith(areaName, 'm_A_')) { return areaName; } else { return 'm_A_' + areaName; } }
function getMainId(oid) { return firstCond(oid2ids[oid], x => x[0] == 'm'); }
function getVisual(oid) { return UIS[getMainId(oid)]; }
function getDefId(oid) { return firstCond(oid2ids[oid], x => x[0] == 'd'); }
function getDefVisual(oid) { return UIS[getDefId(oid)]; }
function getDefaultVisual(oid) { return UIS[getDefId(oid)]; }
function getPageHeaderDivForPlayer(oid) { return document.getElementById('c_c_' + playerConfig[GAME].players[oid].username); }
function getFirstVisual(oid) { let res = getVisual(oid); return res ? res : getDefVisual(oid); }
function _getChildrenOf(id) { let ui = UIS[id]; return ui.children; }
function getList(lst) { return isdef(lst) ? lst : []; }
function getDefaultObjectIds() { return _getChildrenOf(SPEC.table.defaultArea); }
function getDefaultObjects() { return getDefaultObjectIds(x => UIS[x]); }
function getDefaultPlayerIds() { return _getChildrenOf(SPEC.player.defaultArea); }
function getDefaultPlayers() { return getDefaultPlayerIds(x => UIS[x]); }
function getAuxIds() { return getList(IdOwner.l); }
function getAux() { return getAuxIds.map(x => UIS[x]); }
function getBoatIdByIdx(idx) {
	if (!IdOwner.a || isEmpty(IdOwner.a)) return null;
	if (idx < 0) idx += IdOwner.a.length;
	idx = idx % IdOwner.a.length;
	return IdOwner.a[idx];
}
function getFirstBoatId() { if (!IdOwner.a || isEmpty(IdOwner.a)) return null; return IdOwner.a[0]; }
function getLastBoatId() { if (!IdOwner.a || isEmpty(IdOwner.a)) return null; return IdOwner.a[IdOwner.a.length - 1]; }
function getFirstBoat() { if (!IdOwner.a || isEmpty(IdOwner.a)) return null; return UIS[getFirstBoatId()]; }
function getBoatIds() { return getList(IdOwner.a); }
function getBoats() { return getBoatIds().map(x => UIS[x]); }
function getRandomBoat() { return UIS[chooseRandom(getBoatIds())]; }
function getBoatWith(lst, isGood = true) {
	let boats = getBoats();
	if (!isGood) {
		let goodBoats = [];
		for (const b of boats) { if (isEmpty(lst.filter(x => b.o.text.includes(x)))) goodBoats.push(b); }
		return goodBoats.length > 0 ? chooseRandom(goodBoats) : null;
	} else {
		for (const b of boats) { if (!isEmpty(lst.filter(x => b.o.text.includes(x)))) return b; }
	}
	return null;
}
function makeIdInfobox(oid) { return 'i_i_' + oid; }
function makeIdDefaultObject(oid) { return 'd_t_' + oid; }
function makeIdDefaultPlayer(oid) { return 'd_p_' + oid; }
function strategicBoat(goodlist, badlist) {
	let boats = getBoats();
	let goodBoats = boats;
	if (isdef(badlist)) {
		goodBoats = [];
		for (const b of boats) {
			//console.log(b.o.text)
			if (isEmpty(badlist.filter(x => b.o.text.join(',').includes(x)))) goodBoats.push(b);
		}
	}
	if (isdef(goodlist)) { //take it by priority! first one is highest priority!
		for (const kw of goodlist) {
			for (const b of boats) {
				if (b.o.text.join(',').includes(kw) || b.o.desc.includes(kw)) return b;
			}
		}
	}
	//if still here didnt find goodlist match!
	return chooseRandom(goodBoats);
}
//checkers
function isStructuralElement(oid) { if (nundef(G.table) || !(oid in G.table)) return false; return 'map' in G.table[oid]; }
function defaultVisualExists(oid) { return firstCond(oid2ids[oid], x => x[0] == 'd'); }
function someVisualExists(oid) { return firstCond(oid2ids[oid], x => x[0] == 'd' || x[0] == 'm'); }
function mainVisualExists(oid) { return firstCond(oid2ids[oid], x => x[0] == 'm'); }
function isBoardElementObject(o) { return o.edges || o.corners; }
function isBoardElement(oid) { let mk = getVisual(oid); return mk && mk.idParent[2] == 's'; }
function isBoardObject(o) { return o.map && o.fields; }
function isDeckObject(o) { return isdef(o.deck_count); }
function isField(o) { return o.neighbors; }
function isPlain() { return !SPEC.boardDetection && !SPEC.deckDetection && !SPEC.userStructures }
function isDetection() { return (SPEC.boardDetection || SPEC.deckDetection) && !SPEC.userStructures }
//#endregion

//#region pageHeader
function pageHeaderInit() { pageHeaderSetGame(); pageHeaderSetPlayers(); }

function pageHeaderClearAll() { pageHeaderClearPlayers(); pageHeaderClearGame(); }
function pageHeaderClearGame() { clearElement(mById('divGameName')); }
function pageHeaderClearPlayers() { mById('divPlayerNames').innerHTML = '<div style="float:left">Players:&nbsp;</div>'; }
function pageHeaderSetGame() { mById('divGameName').innerHTML = `<div style='float:right;margin:14px'><b>${allGames[GAME].name}</b><br>(${PLAYMODE})</div>`; }
function pageHeaderSetPlayers() {
	let divPlayerNames = mById('divPlayerNames');

	let s = '<div style="float:left">Players:&nbsp;</div>';//&nbsp;';
	let pc = playerConfig[GAME].players;
	for (const pid in pc) {
		let pl = pc[pid];
		spl = pageHeaderGetPlayerHtml(pl.username, pid, pl.color);
		s += spl;
	}
	divPlayerNames.innerHTML = s;
}
function pageHeaderAddPlayer(username, playerId, color, asMe = false) {
	mById('divPlayerNames').insertAdjacentHTML('beforeend', pageHeaderGetPlayerHtml(username, playerId, color, asMe));

}
function pageHeaderGetPlayerHtml(username, playerId, color) {
	let spl = `<div id='c_c_${username}' class='playerHeader'><div>${username}</div><div style='color:${color}'>${playerId}</div></div>`
	return spl;
}

//#endregion

//#region playerConfig
function stubPlayerConfig(gameInfo) {
	//automatically set a player configuration when starting in game view
	gcs = {};
	for (const gName in gameInfo) {
		let info = gameInfo[gName]
		//console.log(gName, info);
		let nPlayers = info.num_players[0]; // min player number, info.num_players.length - 1]; // max player number
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
	G.players = playerConfig[GAME].players;

	//match colors to better colors!
	let iColor = 0;
	for (const id in serverData.players) {
		let pl = serverData.players[id];
		let colorName = isdef(pl.color) ? pl.color : keysPlayerColors[iColor];
		colorName = colorName.toLowerCase();
		let altName = capitalize(colorName);
		let color = isdef(playerColors[colorName]) ? playerColors[colorName] : colorName;


		G.players[id].color = color;
		//playerConfig[id].color = color;
		// playerConfig[id].altName = altName;
		// playerConfig[id].index = i;
		iColor += 1;
	}
}

//#endregion

//#region routes
async function route_allGames() {
	let gameNames = await route_server_js('/game/available');
	let res = {};
	for (const name of gameNames) {
		res[name] = await route_server_js('/game/info/' + name);
	}
	return res;
}
async function route_c52() {
	return await route_rsg_asset('c52', 'yaml'); //'/vid0/static/rsg/assets/c52.yaml');
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
function loadCode(game, text) {
	//console.log('text',text)
	var scriptTag = document.createElement("script");
	scriptTag.onload = () => //console.log('code for', game, 'loaded');
		scriptTag.setAttribute("type", "text/javascript");
	scriptTag.innerHTML = text; // "//console.log('HALLOOOOOOOOOO DU!!!!!!!');";
	document.getElementsByTagName("body")[0].appendChild(scriptTag);
}
async function route_userCode(game, fname) {
	try {
		//let codePath = '/games/' + game + '/_rsg/' + fname + '.js';
		let url = '/code/' + game + (isdef(fname) ? '/' + fname : '');
		let text = await route_server_text(url);

		return { asText: text };
	} catch{ return {}; }

}
async function route_initGame(game, gc, username) {
	await fetch(SERVER + '/restart');
	await fetch(SERVER + '/game/select/' + game);
	let nPlayers = gc.numPlayers;
	//console.log(gc)
	// for (let i = 0; i < nPlayers; i++) {
	for (plid in gc.players) {
		let plInfo = gc.players[plid];
		let isAI = plInfo.agentType !== null;
		if (isAI) {
			await postData(SERVER + '/add/client/agent/' + plInfo.username, { agent_type: plInfo.agentType, timeout: null });
		}
		await fetch(SERVER + '/add/player/' + plInfo.username + '/' + plInfo.id);
	}
	await fetch(SERVER + '/begin/' + SEED);
	let data = await route_server_js('/status/' + username); //getPlid(username));
	return data;
}
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
	//console.log(url, SERVER + url)
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
async function route_path_text(url) {
	let data = await fetch(url);
	return await data.text();
}
async function route_path_asText_dict(url) {
	let data = await fetch(url);
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
//#endregion

//#region tabs
function openTab(button) {
	//console.log('opening',cityName)
	var i, tabcontent, tablinks;
	let selected = button.textContent;
	console.log(button, button.textContent);
	tabcontent = document.getElementsByClassName('tabcontent');
	for (i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = 'none'; }
	tablinks = document.getElementsByClassName('tablinks');
	for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(' active', ''); }
	document.getElementById(selected).style.display = 'block';
	button.className += ' active';
	//evt.currentTarget.className += ' active';
}

//#endregion




