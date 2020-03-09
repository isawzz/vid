//#region pageHeader
function pageHeaderInit() { pageHeaderSetGame(); pageHeaderSetPlayers(); }
function pageHeaderUpdatePlayer(plid) {
	let mk;
	for (const pl in playerConfig[GAME].players) {
		mk = getPageHeaderDivForPlayer(pl);
		mk.classList.remove('gamePlayer');
	}
	mk = getPageHeaderDivForPlayer(plid);
	mk.classList.add('gamePlayer');
}
function pageHeaderClearAll() { pageHeaderClearPlayers(); pageHeaderClearGame(); }

function getPageHeaderDivForPlayer(oid) { return document.getElementById('c_c_' + playerConfig[GAME].players[oid].username); }
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

//#region playerConfig (stub)
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

//#endregion

//#region tabs
function openTab(button) {
	//console.log('opening',cityName)
	var i, tabcontent, tablinks;
	let selected = button.textContent;
	//console.log(button, button.textContent);
	tabcontent = document.getElementsByClassName('tabcontent');
	for (i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = 'none'; }
	tablinks = document.getElementsByClassName('tablinks');
	for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(' active', ''); }
	document.getElementById(selected).style.display = 'block';
	button.className += ' active';
	//evt.currentTarget.className += ' active';
}

//#endregion

//#region blinking
function areaBlink(id) { mById(id).classList.add('blink'); }
function stopBlinking(id) { mById(id).classList.remove('blink'); }
//#endregion

//#region modify serverData (stubs)

function restoreServerData(){
	resetPlayerCards();
	let opt = serverData.options;
	if (opt) {
		let keys = Object.keys(opt);
		let firstKey = keys[0];
		let actions = opt[firstKey].actions._set[0]._tuple[0]._set;
		removedActions.map(x => actions.push(x));
		removedActions=[];
	}

}
function modifyServerData() {
	let pl = serverData.players[GAMEPLID];
	let o = GAME == 'catan' ? pl.devcards : pl.hand;
	if (!o) {
		for (const plid in serverData.players) {
			serverData.players[plid].hand = { _set: [] };
		}
		o = pl.hand;
	}
	let cards = getElements(o);
	if (cards.length > 5) resetPlayerCards(); else addCardsToPlayers();

	let opt = serverData.options;
	if (opt) {
		let keys = Object.keys(opt);
		let firstKey = keys[0];
		let actions = opt[firstKey].actions._set[0]._tuple[0]._set;
		if (actions.length > 50) removedActions = actions.splice(0, 8);
		else if (actions.length > 33) removedActions = removedActions.concat(actions.splice(0, 30));
		else removedActions.map(x => actions.push(x));
		//console.log(actions);

	}


}
function addCardsToPlayers(n = 1) {
	// if (GAME != 'catan') return;
	for (const plid in serverData.players) {
		let res = [];
		for (let i = 0; i < n; i++) {
			let card = {
				id: getUID(),
				short_name: 'K',
				obj_type: 'card',
				// visible: { _set: [{ _player: Player1 }] },
				// name: 'King',
				generic_type: 'card'
			};
			res.push({ _obj: card.id });
			serverData.table[card.id] = card;
		}
		let pl = serverData.players[plid];
		res = GAME == 'catan' ? pl.devcards._set.concat(res) : pl.hand._set.concat(res);

		if (GAME == 'catan') pl.devcards = { _set: res }; else pl.hand = { _set: res };
	}


}

function resetPlayerCards() {
	for (const plid in serverData.players) {
		let pl = serverData.players[plid];
		if (GAME == 'catan') pl.devcards = { _set: [] }; else pl.hand = { _set: [] };
	}
}


