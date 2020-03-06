window.onload = () => _startSession();

//#region testing
function runTest(){
	console.log('ah');
	
}


//#region control flow
async function _startSession(resetLocalStorage = false) {

	timit = new TimeIt('*timer', TIMIT_SHOW); // [true] | false (false fuer tacit)

	//resetLocalStorage = true; //********** true for LOCALSTORAGE CLEAR!!!!! */
	await loadAssets(resetLocalStorage);
	timit.showTime('*load asset and server done!');

	addEventListener('keyup', keyUpHandler);
	addEventListener('keydown', keyDownHandler);

	await _startNewGame();

	openTab(mById('bPlayers'));

	//	makeCard52_test(1, null, { key: 'green2', area: 'decks' });
}
async function _startNewGame(game) {
	//need to reload spec & code!
	if (isdef(game)) GAME = game;
	USERNAME = USERNAME_ORIG;
	mappingsClear();
	mById('actions').style.setProperty('min-width', null);

	await loadSpecAndCode();

	updatePlayerConfig(); //sets colors for current players from initial serverData

	_startGame();
}
function _startGame() {

	stopBlinking('status');
	// hide('passToNextPlayerUI');
	// hide('freezer');

	logClearAll();
	scenarioQ = [];

	_startStep();

}
function _startStep() {

	//addCardsToPlayers();

	//reset_zoom_on_resize();
	clearStep();

	pageHeaderInit();

	checkPlayerChange();

	rMergeSpec();

	rAreas();
	rPlayerStatsAreas();

	//preProcess
	rPreProcessPlayers(); //adds obj_type='opponent' to all players that do not have an obj_type
	rPreProcessActions();

	//runTest();


	timit.showTime('*mappings')
	rMappings();

	//present
	mkMan.presentationStart();
	rPresentMappings();
	//return;
	timit.showTime('mappings done...')
	rPresentBehaviors(); //should enter completed oids in DONE dict

	rPresentDefault();//???
	//return;

	rPresentStatus();
	rPresentLog();

	timit.showTime('*presentation done!');

	if (serverData.options) { presentActions(); getReadyForInteraction(); }
	else if (serverData.waiting_for) { presentWaitingFor(); }
	else if (serverData.end) { rPresentEnd(); }

	//zoom_on_resize('actions', 'table', 'logDiv', 30);

}

//#region helpers
function checkPlayerChange() {
	if (!serverData.players) { return; } //alert('no players in serverData!!!'); }
	let plid = firstCondDict(serverData.players, x => x.obj_type == 'GamePlayer');
	if (plid != gamePlayerId) {
		//player changed!!!
		//console.log('player changing to:', plid)
		prevPlayerId = gamePlayerId;
		gamePlayerId = plid;
		//console.log(playerConfig[GAME].players)
		pageHeaderUpdatePlayer(plid);
		//hide logs of other players!
		logUpdateVisibility(plid, serverData.players);
	}

}
function fillActions(areaName, boats, availHeight) {
	let nActions = boats.length;
	//console.log(areaName, nActions, availHeight)
	//let html='hallo133'; `<a>hallo</a>`
	let html = boats[0].elem.innerHTML;
	//console.log('html for measuring',html)
	let nRowsFit = calcNumRowsFitting(areaName, availHeight, html);//b.height);
	nRowsFit = Math.floor(nRowsFit);
	let colsNeeded = Math.ceil(nActions / nRowsFit);
	//console.log('need', colsNeeded, 'to fit all actions')

	let d = document.getElementById(areaName);
	d.style.gridTemplateColumns = 'auto '.repeat(colsNeeded);

	d.innerHTML = '';
	d.style.width = 'auto';
	for (let i = 0; i < nActions; i++) {
		boats[i].attach();
		// let d1 = document.createElement('div');
		// // d1.innerHTML = 'hallo' + i;
		// d1.innerHTML =html+i; //`<a>hallo ${i}</a>`;
		// d.appendChild(d1);
	}
	//check if width of 200px erreicht ist
	// wenn ja, immediately set min-width
	//nein: set minWidth as long as it is <=200px
	let bds = getBounds('actions');
	//console.log('action bounds',bds);
	if (bds.width < 200) mById('actions').style.setProperty('min-width', Math.ceil(bds.width) + 'px');
}
function getReadyForInteraction() { startInteraction(); }

async function interaction(action, data) {
	if (action == INTERACTION.selected) {
		timit.init('*send action');
		if (TESTING) {
			let pl = serverData.players[gamePlayerId];
			let o = GAME == 'catan' ? pl.devcards : pl.hand;
			if (!o){
				for(const plid in serverData.players){
					serverData.players[plid].hand = {_set:[]};
				}
				o=pl.hand;
			}
			let cards = getElements(o);
			if (cards.length > 5) resetPlayerCards(); else addCardsToPlayers();
		} else {
			let boat = data;
			let route = '/action/' + USERNAME + '/' + serverData.key + '/' + boat.desc + '/';
			let t = boat.tuple;
			//console.log('tuple is:', t);
			route += t.map(x => _pickStringForAction(x)).join('+');// /action/felix/91b7584a2265b1f5/loc-settlement/96
			//console.log('sending action...', route);
			let result = await route_server_js(route);
			//console.log('server returned', result);
			serverData = result;
		}
		_startStep();

	} else if (action == INTERACTION.stop) {
		// stop game etc.... send restart or whatever and come out at _start
		console.log('interrupt!')
	} else {
		console.log('other action')
	}
}
function _pickStringForAction(x) {
	//x is a tuple element, eg., {type:'fixed', val:'pass'} or {ID: "0", val: "hex[0]", type: "obj"}
	//console.log('pickStringForAction',x)
	if (x.type == 'fixed') return x.val;
	if (x.type == 'obj') return x.ID;
	if (x.type == 'player') return x.val;
}
function presentActions() {
	deleteActions(); //clear rest of action data from last round
	if (!tupleGroups) return;
	let areaName = 'a_d_divSelect';
	let div = mById(areaName);
	div.scrollTop = 0;
	let iGroup = 0;
	let iTuple = 0;

	//new code

	//end of new code
	let boats = [];
	for (const tg of tupleGroups) {
		for (const t of tg.tuples) {
			let boatInfo = { obj_type: 'boat', oids: [], desc: tg.desc, tuple: t, iGroup: iGroup, iTuple: iTuple, text: t.map(x => x.val), weg: false };
			let mk = makeDefaultAction(boatInfo, areaName, `<a>${boatInfo.text}</a>`);
			boats[iTuple] = mk;
			iTuple += 1;
		}
		iGroup += 1;
	}

	//console.log('number of boats',iTuple,IdOwner['a'].length,areaName,SPEC.tableSize);
	fillActions(areaName, boats, SPEC.tableSize[1]);

}
async function presentWaitingFor() {
	//console.log('changing player!')
	//hier komm ich nur her wenn es mein turn war
	//also kann switchen wenn entweder der pl me ist oder eine FrontAI
	//console.log(G.serverData)
	let pl = serverData.waiting_for[0];
	if (nundef(prevWaitingFor) || prevWaitingFor != pl) {
		//now waiting for a new player!!!
		//update page header with that player and set G.previousWaitingFor
		prevWaitingFor = pl;
		//console.log('presenting waiting for', pl)
		pageHeaderUpdatePlayer(pl);
	}
	if (PLAYMODE != 'passplay' && (isMyPlayer(pl) || isFrontAIPlayer(pl) && isMyPlayer(gamePlayerId))) {
		USERNAME = playerConfig[GAME].players[pl].username;
		//console.log('just switching username to', user)
		let data = await route_status(USERNAME);
		serverData = data;
		_startStep();
	} else if (PLAYMODE == 'passplay') {
		//this is where I have to output message: NOT YOU TURN ANYMORE!!!!! please click pass!!!
		_showPassToNextPlayer(pl);
	} else {
		//console.log('presentWaitingFor:',G.playersAugmented[G.player].username,'emits poll',pl);
		socketEmitMessage({ type: 'poll', data: pl });
	}

}
function rPreProcessPlayers() {
	for (const plid in serverData.players) {
		let pl = serverData.players[plid];
		if (nundef(pl.obj_type)) {
			//console.log('.......CORRECTING!!!!',plid)
			pl.obj_type = 'opponent';
		}
		//console.log(serverData.players[plid].obj_type)
	}
	//console.log(serverData.players)
}

function rPreProcessActions() { if (!serverData.options) tupleGroups = null; tupleGroups = getTupleGroups(); }

function rPresentEnd() {
	let winner = serverData.end.winner;
	//console.log('game over! winner', winner)

	let plWinner = playerConfig[GAME].players[winner];
	let msg = winner == null ? 'Both players win!' : 'Winner is ' + plWinner.username;
	setStatus('GAME OVER! ' + msg);
	if (winner) { setCSSVariable('--bgWinner', plWinner.color); areaBlink('status'); }

	//UI update
	setAutoplayFunctionForMode();
	unfreezeUI();

	//clear action div
	let d = mById('a_d_divSelect'); clearElement(d); d.scrollTop = 0;
	return true;
}
function rPresentLog() {
	if (nundef(serverData.log)) return;
	let pl = gamePlayerId;

	let dLog = logGetDiv(pl);
	let logId = dLog.id;

	logRenew();
	let BASEMARGIN = 16;
	for (const logEntry of serverData.log) {
		let lineArr = logEntry.line;
		let lineDiv = document.createElement('div');
		logAddLine(lineDiv);
		lineDiv.style.marginLeft = '' + (BASEMARGIN * (logEntry.level)) + 'px';
		for (const item of lineArr) {
			if (isSimple(item)) {
				let s = trim(item.toString());
				if (!isEmpty(s)) { lineDiv.appendChild(document.createTextNode(item)); }
			} else if (isDict(item)) {
				if (item.type == 'obj') {
					let oid = item.ID;
					let mobj = makeAux(item.val, oid, logId, lineDiv);
				} else if (item.type == 'player') {
					let oid = item.val;
					let mobj = makeAux(item.val, oid, logId, lineDiv);
				} else {
					error('unknown item in log:', item)
				}
			}
		}
		dLog.appendChild(lineDiv);
	}
	dLog.scrollTop = dLog.scrollHeight;

}
function rPresentStatus() {
	if (nundef(serverData.status)) { return; }

	let lineArr = serverData.status.line;

	let areaName = isPlain() ? 'statusInHeaderText' : 'status';
	let d = mById(areaName);
	//TODO delete refs in status line! only have to do that if not clear everything anyway!

	clearElement(d);

	//make aux for current player (TODO: could reuse these but maybe not necessary)
	let pl = gamePlayerId;
	let msStatus = makeAux(getUsername(pl) + ' (' + pl + ')', pl, areaName);
	let color = getPlayerColor(pl);
	msStatus.setBg(color);
	msStatus.setFg(colorIdealText(color));

	d.appendChild(document.createTextNode(': '));

	for (const item of lineArr) {
		if (isSimple(item)) {
			let s = trim(item.toString());
			if (!isEmpty(s)) {
				//console.log('adding item:', s, 'to log');
				d.appendChild(document.createTextNode(item)); //ausgabe+=item+' ';
			}
		} else if (isDict(item)) {
			//console.log(item);
			if (item.type == 'obj') {
				let oid = item.ID;
				let mobj = makeAux(item.val, oid, areaName);
			} else if (item.type == 'player') {
				let oid = item.val;
				let mobj = makeAux(item.val, oid, areaName);
			}
		}
	}
}
function setStatus(s) {
	let areaName = isPlain() ? 'statusInHeaderText' : 'status';
	let d = document.getElementById(areaName);
	//clearElement(d);
	d.innerHTML = s;
}

//#region tupleGroups
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
		//console.log('*** ', desc, '........tuples:', tuples);

		if (tuples.length == 1 && !isList(tuples[0])) tuples = [tuples];
		//console.log(tuples)
		tg.tuples = tuples;
		tupleGroups.push({ desc: desc, tuples: tuples });
	}
	//console.log('tupleGroups', tupleGroups);
	return tupleGroups;
}
function expand1_99(x) {
	//console.log('expand1_99 input', tsRec(x))
	//console.log('expand1_99');
	if (isList(x)) {
		console.log('expand1_99: x should be dict BUT is a list', x);
	}
	if (isDict(x)) { // TODO:  || isList(x)) {
		// if (isList(x)) {
		// 	console.log('process: list',x)
		// }
		if ('_set' in x) {
			//console.log('handleSet wird aufgerufen')
			return handleSet(x._set);
		} else if ('_tuple' in x) {
			//console.log('handleTuple wird aufgerufen')
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
//#endregion tupleGroups

