async function onClickReloadAll() {
	vidCache.invalidate('testCards','allGames','userSpec','serverData','userCode');
	_start();
}
async function onClickResetLocal() {
	_start(true);
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
function onClickRestart() {
	unfreezeUI();
	_startRestartSame();
}
function onClickRunToNextPlayer() {
	let pl = G.player;
	S_autoplayFunction = (_G) => _G.player == pl;

	onClickStep(G);
}
function onClickRunToNextTurn() {
	let pl = G.player;
	S_autoplayFunction = (_G) => {
		if (_G.player != pl) {
			S_autoplayFunction = (_G1, _) => _G1.player != pl;
		};
		return true;
	};
	onClickStep(G);
}
function onClickRunToNextPhase() {
	let phase = G.phase;
	S_autoplayFunction = (_G) => _G.phase == phase;
	onClickStep(G); //kick off
}
function onClickRunToEnd() {
	S_autoplayFunction = () => true;
	onClickStep(G);
}
function onClickRunToAction(keyword) {
	//let b = document.getElementById(bId);
	//console.log(getFunctionCallerName(), bId, keyword)
	S_autoplayFunction = (_G) => {
		//run to action available that contains keyword
		//should return true unless one of the boats.tuple has an element with val.includes(keyword)
		//console.log(getBoats());
		for (const mk of getBoats()) {
			for (const ti of mk.o.tuple) {
				if (ti.val.toString().includes(keyword)) {
					//console.log('STOP!!!!!!!!!!!!!!!!!!!!!!!!!!!')
					setAutoplayFunctionForMode();
					return false;
				}
			}
		}
		return true;
	}
	onClickStep(G);
}
function onClickStop() {
	//console.log('*** clicked STOP!!! ***');
	setAutoplayFunctionForMode(PLAYMODE);
	unfreezeUI();
	//startInteraction();
	// setTimeout(()=>setAutoplayFunctionForMode(S_playMode),1000);
	//STOP = true;
	//setTimeout(showStep,100);
}

function onClickSelectTuple(ev, mk, part) {
	//console.log(ev,mk,part)
	if (choiceCompleted) return;
	choiceCompleted = true;
	//let id = mk.id;
	iTuple = mk.o.iTuple;
	//console.log(counters.msg + ': ' + G.player + ' :', iTuple, mk.o.desc, mk.o.text, mk.id);
	freezeUI();
	stopAllHighlighting();
	sendAction(mk.o, [gameStep]);
}
var startBoats = ['93', '99', '109', '121', '124', '116', '106', '111', '116', '129'];
function getNextStartBoat() {
	//console.log('phase', G.phase)
	let mk = null;
	let sb = startBoats[0];
	if (G.phase == 'setup') {
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




