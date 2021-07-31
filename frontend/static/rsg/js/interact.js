var choiceCompleted = false;
var frozen = false;
var boatFilters = [];
var boatHighlighted = null;

function startInteraction() {
	//window.scrollTo(0,0); //better: remove scrollIntoView bei log window
	boatFilters = [];
	if (isdef(IdOwner.a)) IdOwner.a.map(x => _addStandardInteraction(x));
	if (isdef(IdOwner.l)) IdOwner.l.map(x => _addStandardInteraction(x)); //da muss click handler removen!!!!
	if (isdef(IdOwner.p)) IdOwner.p.map(x => _addStandardInteraction(x));
	if (isdef(IdOwner.r)) IdOwner.r.map(x => _addStandardInteraction(x));
	//if (isdef(IdOwner.s)) IdOwner.s.map(x => addStandardInteraction(x)); //anderen clickHandler
	if (isdef(IdOwner.t)) IdOwner.t.map(x => _addStandardInteraction(x)); //anderen clickHandler
	_preselectFirstVisualsForBoats();
	choiceCompleted = false;
	let nBoats = getBoatIds().length;
	let autoplay = S_autoplayFunction(G) || nBoats < 2 || robbedDescInBoats();
	if (autoplay) {
		//console.log(nBoats<2?'autoplay:...only 1 option!!!':'different function....');
		setTimeout(onClickStep, S_AIThinkingTime);
		return;
	} else if (!isEmpty(scenarioQ)){
		let func = scenarioQ.shift();
		//console.log(func.name,'wird aufgerufen!!!')
		func();
	} else {
		scenarioRunning = false;
		//console.log('resettint autoplay function to mode!!!')
		setAutoplayFunctionForMode(); //unless have more goals in waitinglist
		unfreezeUI();
	}
}
function stopAllHighlighting() {
	//only unhighlight all, leave handlers on
	if (isdef(IdOwner.a)) IdOwner.a.map(x => _removeAllHighlighting(x));
	if (isdef(IdOwner.l)) IdOwner.l.map(x => _removeAllHighlighting(x)); //da muss click handler removen!!!!
	if (isdef(IdOwner.p)) IdOwner.p.map(x => _removeAllHighlighting(x));
	if (isdef(IdOwner.r)) IdOwner.r.map(x => _removeAllHighlighting(x));
	if (isdef(IdOwner.s)) IdOwner.s.map(x => _removeAllHighlighting(x)); //anderen clickHandler
	if (isdef(IdOwner.t)) IdOwner.t.map(x => _removeAllHighlighting(x)); //anderen clickHandler
	setTimeout(hideTooltip, 500);
}
function stopInteraction() {
	//remove all handlers
	if (isdef(IdOwner.a)) IdOwner.a.map(x => _removeInteraction(x));
	if (isdef(IdOwner.l)) IdOwner.l.map(x => _removeInteraction(x)); //da muss click handler removen!!!!
	if (isdef(IdOwner.p)) IdOwner.p.map(x => _removeInteraction(x));
	if (isdef(IdOwner.r)) IdOwner.r.map(x => _removeInteraction(x));
	if (isdef(IdOwner.s)) IdOwner.s.map(x => _removeInteraction(x)); //anderen clickHandler
	if (isdef(IdOwner.t)) IdOwner.t.map(x => _removeInteraction(x)); //anderen clickHandler
	setTimeout(hideTooltip, 500);
}

function keyUpHandler(ev) {
	checkControlKey(ev); //infobox.js

}
function keyDownHandler(ev) {
	checkArrowKeys(ev);
}
function checkArrowKeys(ev) {
	if (!ev.ctrlKey) return;
	//if (!isControlKeyDown && boatHighlighted) unhighlightBoat();

	//isControlKeyDown = true;

	if (ev.keyCode == '13' && boatHighlighted) onClickSelectTuple(null, boatHighlighted);
	else if (ev.keyCode == '38') _highlightPrevBoat();
	else if (ev.keyCode == '40') _highlightNextBoat();
	else if (ev.keyCode == '37') { }	// left arrow
	else if (ev.keyCode == '39') { }	// right arrow
}

//#region onClick...
function onClickCatan() {
	GAME = S.settings.game = 'catan';
	PLAYMODE = S.settings.playmode = 'hotseat'; // das wird in specAndDom gemacht! setPlaymode(currentPlaymode);
	S.gameConfig = gcs[GAME];
	_startNewGame('starter');

}
function onClickCheat(code) { sendRoute('/cheat/' + code, null); }

function onClickFilterTuples(ev, mobj, part) {
	//hat auf irgendein object or player geclickt
	let id = mobj.id;
	if (boatFilters.includes(id)) {
		_removeFilterHighlight(mobj);
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
			_addFilterHighlight(mobj);
			for (const bid of IdOwner.a) { if (!boats.includes(bid)) { _hideBoat(bid) } } //soll von tuple list nur die tuples anzeigen, wo diese id vorkommt
			//TODO!!! soll von objects nur die anzeigen, die in einem der visible tuples vorkommen
		}
	}
}
function onClickFilterOrInfobox(ev, mobj, part) { if (!ev.ctrlKey) onClickFilterTuples(ev, mobj, part); else openInfobox(ev, mobj, part); }

function onClickFilterAndInfobox(ev, mobj, part) { onClickFilterTuples(ev, mobj, part); onClickPlusControlInfobox(ev, mobj, part); }

function onClickPlusControlInfobox(ev, mobj, part) { if (ev.ctrlKey) { openInfobox(ev, mobj, part); } }
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
		for (const mobj of getBoats()) {
			for (const ti of mobj.o.tuple) {
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

function onClickSelectTuple(ev, mobj, part) {
	//console.log(ev,mobj,part)
	if (choiceCompleted) return;
	choiceCompleted = true;
	//let id = mobj.id;
	iTuple = mobj.o.iTuple;
	//console.log(counters.msg + ': ' + G.player + ' :', iTuple, mobj.o.desc, mobj.o.text, mobj.id);
	freezeUI();
	stopAllHighlighting();
	sendAction(mobj.o, [gameStep]);
}
var startBoats = ['93', '99', '109', '121', '124', '116', '106', '111', '116', '129'];
function getNextStartBoat() {
	//console.log('phase', G.phase)
	let mobj = null;
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
						mobj = b;
						removeInPlace(startBoats, sb);
						return mobj;
					}
				}
			}
		}
	}
	//console.log(startBoats)
	return mobj;
}
function onClickStep() {
	if (!this.choiceCompleted) {
		//let mobj = getRandomBoat();
		//let mobj = getBoatWith(['demand', 'offer'], false);
		let mobj = getNextStartBoat();
		if (nundef(mobj)) mobj = getBoatWith(['demand', 'offer'], false);
		if (nundef(mobj)) mobj = getBoatWith(['buy'], true);
		if (nundef(mobj)) mobj = getBoatWith(['pass'], true);
		if (nundef(mobj)) mobj = getBoatWith(['demand', 'offer'], false);
		if (nundef(mobj)) mobj = getRandomBoat();
		onClickSelectTuple(null, mobj);
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

//#region utilities
function highlightMsAndRelatives(ev, mobj, partName) {
	//console.log(mobj.id,partName)
	let id = mobj.id;
	//console.log('------------>id',id)
	mobj.high(partName);
	if (mobj.isa.infobox) bringInfoboxToFront(mobj);
	let relativeIds = id2uids[id];
	if (nundef(relativeIds)) return;
	for (const idRel of relativeIds) {
		let msRel = UIS[idRel];
		msRel.high('title');
	}

}
function unhighlightMsAndRelatives(ev, mobj, partName) {
	let id = mobj.id;
	mobj.unhigh(partName);
	let relativeIds = id2uids[id];
	if (nundef(relativeIds)) return;
	for (const idRel of relativeIds) {
		let msRel = UIS[idRel];
		msRel.unhigh('title');
	}

}
function fullViewObjects() { let ids = getDefaultObjectIds(); ids.map(x => UIS[x].maximize()); }
function minimizeObjects() { let ids = getDefaultObjectIds(); ids.map(x => UIS[x].minimize()); }
function freezeUI() {
	if (frozen) return;
	frozen = true;
	show('tempFreezer');
}
function unfreezeUI() {
	if (!frozen) return;
	frozen = false;
	hide('tempFreezer');
}
function hideTooltip() { $('div#tooltip').css({ display: 'none' }); }

//#region local helpers
function _addFilterHighlight(mobj) { mobj.highC('green'); }
function _addStandardInteraction(id) {
	//console.log(id)
	let mobj = UIS[id];
	switch (id[2]) {

		case 'a':
			mobj.addClickHandler('elem', onClickSelectTuple);
			mobj.addMouseEnterHandler('title', highlightMsAndRelatives);
			mobj.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
			break;

		case 'l':
		case 'r':
			mobj.addMouseEnterHandler('title', highlightMsAndRelatives);
			mobj.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
			break;

		case 't':
			if (id[0] == 'm') { //main table objects!!!!!
				mobj.addClickHandler('elem', onClickFilterOrInfobox);

				// if (mobj.isa.deck) {
				// 	//card should also be magnified or minified!
				// 	//console.log('adding mouse handler to deck!!!')
				// 	mobj.addMouseEnterHandler('topmost', highlightMsAndRelatives);
				// 	mobj.addMouseLeaveHandler('topmost', unhighlightMsAndRelatives);
				// } else 
				if (mobj.isa.card) {
					//card should also be magnified or minified!
					mobj.addMouseEnterHandler('title', _highlightAndMagnify);
					mobj.addMouseLeaveHandler('title', _unhighlightAndMinify);
				} else {
					mobj.addMouseEnterHandler('title', highlightMsAndRelatives);
					mobj.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
				}


			} else {
				mobj.addClickHandler('elem', onClickFilterTuples);
				mobj.addMouseEnterHandler('title', highlightMsAndRelatives);
				mobj.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
			}
			break;

		default:
			mobj.addClickHandler('elem', onClickFilterTuples);
			mobj.addMouseEnterHandler('title', highlightMsAndRelatives);
			mobj.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
			break;
	}
}
function _preselectFirstVisualsForBoats() {
	let oidlist = [];
	for (const id of getBoatIds()) {
		//select firstVisual for each oid in boat
		let oids = id2oids[id];
		//console.log(oids);
		if (isdef(oids)) oids.map(x => addIf(oidlist, x))
	}
	//console.log('oids to select:',oidlist);

	//console.log(oidlist);
	let vislist = oidlist.map(x => getMainId(x)).filter(x => x !== null);
	vislist = vislist.concat(oidlist.map(x => getDefId(x)));
	//console.log('vislist',vislist);
	vislist.map(id => UIS[id].highFrame());
}
function _removeFilterHighlight(mobj) { mobj.unhighC(); }
function _removeAllHighlighting(id) { let mobj = UIS[id]; mobj.unhighAll(); }
function _removeClickHandler(id) { let mobj = UIS[id]; mobj.removeClickHandler(); }
function _removeHoverHandlers(id) { let mobj = UIS[id]; mobj.removeHoverHandlers(); }
function _removeInteraction(id) { let mobj = UIS[id]; mobj.removeHandlers(); mobj.unhighAll(); }

function _hideBoat(id) { let mobj = UIS[id]; mobj.hide(); mobj.o.weg = true; }
function _showBoat(id) { let mobj = UIS[id]; mobj.show(); mobj.o.weg = false; }
function _highlightNextBoat() {
	if (!boatHighlighted) _highlightBoat(getFirstBoatId());
	else {
		//console.log('boatHighlighted',boatHighlighted);
		let idx = boatHighlighted.o.iTuple + 1;
		//console.log('idx',idx);
		//console.log(getBoatIdByIdx(idx));
		_highlightBoat(getBoatIdByIdx(boatHighlighted.o.iTuple + 1));
	}
}
function _highlightPrevBoat() {
	if (!boatHighlighted) _highlightBoat(getLastBoatId()); else _highlightBoat(getBoatIdByIdx(boatHighlighted.o.iTuple - 1));
}
function _highlightBoat(id) {
	//console.log('...highlighBoat',id)
	if (id === null) return;
	if (boatHighlighted) {
		if (boatHighlighted.id == id) return;
		else _unhighlightBoat();
	}
	boatHighlighted = UIS[id];
	boatHighlighted.elem.scrollIntoView(false);
	highlightMsAndRelatives(null, boatHighlighted);
	_openInfoboxesForBoatOids(boatHighlighted);

}
function _openInfoboxesForBoatOids(boat) {
	let oids = boat.o.oids;
	let mainIds = oids.map(x => getMainId(x));
	for (const id of mainIds) {
		let mobj = UIS[id];
		openInfobox(null, mobj);
	}
}
function _closeInfoboxesForBoatOids(boat) {
	let oids = boat.o.oids;
	for (const oid of oids) hideInfobox(oid);
}
function _unhighlightBoat() {
	if (boatHighlighted) {
		unhighlightMsAndRelatives(null, boatHighlighted);
		_closeInfoboxesForBoatOids(boatHighlighted);
		boatHighlighted = null;
	}
}
function _highlightAndMagnify(ev, mobj, partName) {
	//this is typical behavior for cards in a hand
	magnifyFront(mobj.id);
	highlightMsAndRelatives(ev, mobj, partName);
}
function _unhighlightAndMinify(ev, mobj, partName) {
	minifyBack(mobj.id);
	unhighlightMsAndRelatives(ev, mobj, partName);
}

function robbedDescInBoats() {
	for (const id of IdOwner.a) {
		let boat = UIS[id];
		let desc = boat.desc;
		if (desc == 'robbed') {
			console.log('skip robbed!');
			return true;
		}
	}
	return false;
}
















//#region testing
function addTestInteraction(id) {
	let mobj = UIS[id];
	mobj.addClickHandler('title', onClickGetUIS);
	mobj.addMouseEnterHandler('title', (x, pName) => x.high(pName));
	mobj.addMouseLeaveHandler('title', (x, pName) => x.unhigh(pName));
}
function addBoatInteraction(id) {
	//console.log(id)
	let mobj = UIS[id];
	mobj.addClickHandler('elem', onClickSelectTuple);
	mobj.addMouseEnterHandler('title', (x, pName) => x.high(pName));
	mobj.addMouseLeaveHandler('title', (x, pName) => x.unhigh(pName));
}
function activateActions() { IdOwner.a.map(x => addBoatInteraction(x)) }
