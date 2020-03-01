async function onClickReloadAll() {
	vidCache.invalidate('testCards','allGames','userSpec','serverData','userCode');
	_startSession();
}
async function onClickResetLocal() {
	_startSession(true);
}


//#region onClick vid0...
function onClickCatan() {
	GAME = S.settings.game = 'catan';
	PLAYMODE = S.settings.playmode = 'hotseat'; // das wird in specAndDom gemacht! setPlaymode(currentPlaymode);
	S.gameConfig = gcs[GAME];
	_startNewGame('starter');

}
function onClickCheat(code) { sendRoute('/cheat/' + code, null); }

function onClickFilterTuples(ev, mk, part) {
	//hat auf irgendein object or player geclickt
	let id = mk.id;
	if (boatFilters.includes(id)) {
		_removeFilterHighlight(mk);
		removeInPlace(boatFilters, id);
		let relids = getList(id2uids[id]);
		let boats = relids.filter(x => x[2] == 'a');
		if (isEmpty(boats)) { return; } // no effect!
		for (const bid of boats) { if (!fi.includes(bid)) { _showBoat(bid); } }//show boats that have been filtered out but do not contain any of the other filters
	} else {
		let relids = getList(id2uids[id]);
		//console.log(relids)
		let boats = relids.filter(x => x[2] == 'a');
		//console.log(boats)
		if (isEmpty(boats)) { return }//console.log('no boat!'); return; } // no effect!

		if (boats.length == 1) {
			//console.log(boats[0])
			onClickSelectTuple(null, UIS[boats[0]]);
		} else {
			boatFilters.push(id);
			_addFilterHighlight(mk);
			for (const bid of IdOwner.a) { if (!boats.includes(bid)) { _hideBoat(bid) } } //soll von tuple liste nur die tuples anzeigen, wo diese id vorkommt
			//TODO!!! soll von objects nur die anzeigen, die in einem der visible tuples vorkommen
		}
	}
}
function onClickFilterOrInfobox(ev, mk, part) { if (!ev.ctrlKey) onClickFilterTuples(ev, mk, part); else openInfobox(ev, mk, part); }

function onClickFilterAndInfobox(ev, mk, part) { onClickFilterTuples(ev, mk, part); onClickPlusControlInfobox(ev, mk, part); }

function onClickPlusControlInfobox(ev, mk, part) { if (ev.ctrlKey) { openInfobox(ev, mk, part); } }
function onClickPollStatus() {
	//poll status for USERNAME, and if does not work, poll for waiting for if it belongs to me!

	//pollStatusAs(USERNAME);
	sendStatus(USERNAME,[gameStep]);

}
function onClickLobby() {
	lobbyView();
	if (!isReallyMultiplayer) openGameConfig();
}
//#region game control flow: Restart, RunTo..., STOP, Step
async function onClickRestart() {
	unfreezeUI();
	USERNAME = USERNAME_ORIG;
	serverData = await route_restart(USERNAME);
	_startStep();
}
function onClickRunToNextPlayer() {
	let pl = gamePlayerId;
	autoplayFunction = (win) => win.gamePlayerId == pl;

	onClickStep();
}
function onClickRunToNextTurn() {
	let pl = gamePlayerId;
	autoplayFunction = (win) => {
		if (win.gamePlayerId != pl) {
			autoplayFunction = (win1) => win1.gamePlayerId != pl;
		};
		return true;
	};
	onClickStep();
}
function onClickRunToNextPhase() {
	let phase = serverData.phase;
	autoplayFunction = (win) => win.serverData.phase == phase;
	onClickStep();
}
function onClickRunToEnd() {
	autoplayFunction = () => true;
	onClickStep();
}
function onClickRunToAction(keyword) {
	autoplayFunction = (_) => {
		for (const mk of getBoats()) {
			for (const ti of mk.o.tuple) {
				if (ti.val.toString().includes(keyword)) {
					setAutoplayFunctionForMode();
					return false;
				}
			}
		}
		return true;
	}
	onClickStep();
}
function onClickStop() {
	setAutoplayFunctionForMode(PLAYMODE);
	unfreezeUI();
}
function onClickStep() {
	if (!this.choiceCompleted) {
		//let mk = getRandomBoat();
		//let mk = getBoatWith(['demand', 'offer'], false);
		let mk = getNextStartBoat();
		if (nundef(mk)) mk = getBoatWith(['demand', 'offer'], false);
		if (nundef(mk)) mk = getBoatWith(['buy'], true);
		if (nundef(mk)) mk = getBoatWith(['pass'], true);
		if (nundef(mk)) mk = getBoatWith(['demand', 'offer'], false);
		if (nundef(mk)) mk = getRandomBoat();
		onClickSelectTuple(null, mk);
	}
}
//#endregion game control flow: Restart, RunTo..., STOP, Step


const INTERACTION={none:0,selected:1,stop:2,saveLoad:3,route:4};
function onClickSelectTuple(ev, mk, part) {
	//console.log(ev,mk,part)
	if (choiceCompleted) return;
	choiceCompleted = true;
	//let id = mk.id;
	iTuple = mk.o.iTuple;
	//console.log(counters.msg + ': ' + G.player + ' :', iTuple, mk.o.desc, mk.o.text, mk.id);
	freezeUI();
	stopAllHighlighting();
	interaction(INTERACTION.selected,mk.o);//, [gameStep]);
}
var startBoats = ['93', '99', '109', '121', '124', '116', '106', '111', '116', '129'];
function getNextStartBoat() {
	//console.log('phase', G.phase)
	let mk = null;
	let sb = startBoats[0];
	if (serverData.phase == 'setup') {
		let boats = getBoats();
		for (const b of boats) {
			//console.log(b, b.o, b.o.text);
			for (const id of startBoats) {
				//console.log(b.o.text);
				for (const t of b.o.text) {
					if (t.includes(id)) {
						//console.log('choosing', id)
						sb = id;
						mk = b;
						removeInPlace(startBoats, sb);
						return mk;
					}
				}
			}
		}
	}
	//console.log(startBoats)
	return mk;
}
function onClickToggleButton(button, handlerList) {
	let current = button.textContent;
	let idx = -1;
	let i = 0;
	for (const item of handlerList) {
		if (item[0] == current) {
			idx = i; break;
		}
		i += 1;
	}
	if (idx >= 0) {
		let idxNew = (idx + 1) % handlerList.length;
		button.textContent = handlerList[idxNew][0];
		handlerList[idxNew][1]();
	}
}
function onClickTTT() {
	GAME = S.settings.game = 'ttt';
	PLAYMODE = S.settings.playmode = 'hotseat'; // das wird in specAndDom gemacht! setPlaymode(currentPlaymode);
	S.gameConfig = gcs[GAME];
	_startNewGame('starter');

}




