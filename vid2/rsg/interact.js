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
	if (isdef(IdOwner.m)) IdOwner.m.map(x => _addStandardInteraction(x)); //anderen clickHandler
	_preselectFirstVisualsForBoats();
	choiceCompleted = false;
	let nBoats = getBoatIds().length;
	let autoplay = autoplayFunction(this) || nBoats < 2 || robbedDescInBoats();
	if (autoplay) {
		//console.log(nBoats<2?'autoplay:...only 1 option!!!':'different function....');
		setTimeout(onClickStep, AIThinkingTime);
		return;
	} else if (!isEmpty(scenarioQ)) {
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
}
function stopInteraction() {
	//remove all handlers
	if (isdef(IdOwner.a)) IdOwner.a.map(x => _removeInteraction(x));
	if (isdef(IdOwner.l)) IdOwner.l.map(x => _removeInteraction(x)); //da muss click handler removen!!!!
	if (isdef(IdOwner.p)) IdOwner.p.map(x => _removeInteraction(x));
	if (isdef(IdOwner.r)) IdOwner.r.map(x => _removeInteraction(x));
	if (isdef(IdOwner.s)) IdOwner.s.map(x => _removeInteraction(x)); //anderen clickHandler
	if (isdef(IdOwner.t)) IdOwner.t.map(x => _removeInteraction(x)); //anderen clickHandler
}

function keyUpHandler(ev) {
	//console.log('key up!')
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


//#region utilities
function highlightMsAndRelatives(ev, mk, partName) {
	//console.log(mk.id,partName)
	if (nundef(mk)) return;
	let id = mk.id;
	//console.log('------------>id',id)
	mk.high(partName);
	if (mk.isa.infobox) bringInfoboxToFront(mk);
	let relativeIds = id2uids[id];
	if (nundef(relativeIds)) return;
	for (const idRel of relativeIds) {
		let msRel = UIS[idRel];
		msRel.high('title');
	}

}
function unhighlightMsAndRelatives(ev, mk, partName) {
	if (nundef(mk)) return;
	//console.log('mk',mk)
	let id = mk.id;
	mk.unhigh(partName);
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

//#region local helpers
function _addFilterHighlight(mk) { mk.highC('green'); }
function _addStandardInteraction(id) {
	//console.log(id)
	let mk = UIS[id];
	if (id[0] == '_') {
		//console.log(id,mk);
		mk.addClickHandler('elem', onClickFilterOrInfobox);
		if (mk.isa.card) {
			//card should also be magnified or minified!
			mk.addMouseEnterHandler('elem', _highlightAndMagnify);
			mk.addMouseLeaveHandler('elem', _unhighlightAndMinify);
		} else {
			mk.addMouseEnterHandler('elem', highlightMsAndRelatives);
			mk.addMouseLeaveHandler('elem', unhighlightMsAndRelatives);
		}

	} else {
		switch (id[2]) {

			case 'a':
				mk.addClickHandler('elem', onClickSelectTuple);
				mk.addMouseEnterHandler('title', highlightMsAndRelatives);
				mk.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
				break;

			case 'l':
			case 'r':
				mk.addMouseEnterHandler('title', highlightMsAndRelatives);
				mk.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
				break;

			case 't':
				if (id[0] == 'm') { //main table objects!!!!!

					mk.addClickHandler('elem', onClickFilterOrInfobox);
					if (mk.isa.card) {
						//card should also be magnified or minified!
						mk.addMouseEnterHandler('title', _highlightAndMagnify);
						mk.addMouseLeaveHandler('title', _unhighlightAndMinify);
					} else {
						mk.addMouseEnterHandler('title', highlightMsAndRelatives);
						mk.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
					}


				} else {
					mk.addClickHandler('elem', onClickFilterTuples);
					mk.addMouseEnterHandler('title', highlightMsAndRelatives);
					mk.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
				}
				break;

			default:
				mk.addClickHandler('elem', onClickFilterTuples);
				mk.addMouseEnterHandler('title', highlightMsAndRelatives);
				mk.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
				break;
		}
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
function _removeFilterHighlight(mk) { mk.unhighC(); }
function _removeAllHighlighting(id) { let mk = UIS[id]; mk.unhighAll(); }
function _removeClickHandler(id) { let mk = UIS[id]; mk.removeClickHandler(); }
function _removeHoverHandlers(id) { let mk = UIS[id]; mk.removeHoverHandlers(); }
function _removeInteraction(id) { let mk = UIS[id]; mk.removeHandlers(); mk.unhighAll(); }

function _hideBoat(id) { let mk = UIS[id]; mk.hide(); mk.o.weg = true; }
function _showBoat(id) { let mk = UIS[id]; mk.show(); mk.o.weg = false; }
function _highlightNextBoat() {
	console.log('..._highlightNextBoat')
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
	console.log('..._highlighBoat',id)
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
	console.log('halooooooooooooo')
	let oids = boat.o.oids;
	//koennte mehrere mainIds geben! fuer 1 oid
	//in dem fall only take first one
	//besser ist aber: ueberlass das den infoboxes selbst!
	oids.map(x=>openInfobox(oid));

	// let mainIds = oids.map(x => getMainId(x));
	// for (const id of mainIds) {
	// 	let mk = UIS[id];
	// 	openInfobox(null, mk);
	// }
}

// ^^^ soll ich da nicht gleich clearInfoboxes machen?????
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
function _highlightAndMagnify(ev, mk, partName) {
	//this is typical behavior for cards in a hand
	magnifyFront(mk.id);
	highlightMsAndRelatives(ev, mk, partName);
}
function _unhighlightAndMinify(ev, mk, partName) {
	minifyBack(mk.id);
	unhighlightMsAndRelatives(ev, mk, partName);
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


function setAutoplayFunctionForMode(mode, isStartup = false) {
	// in solo playmode, solo player is always index 0 player
	if (nundef(mode)) mode = SPEC.playmode;
	// if (!isStartup) S_autoplayFunction = mode == 'solo' ? (_g, _) => _g.playerIndex != 0 : () => false;
	if (!isStartup) autoplayFunction = (_g, _) => false; //isFrontAIPlayer(_g.player);
}














//#region testing
function addTestInteraction(id) {
	let mk = UIS[id];
	mk.addClickHandler('title', onClickGetUIS);
	mk.addMouseEnterHandler('title', (x, pName) => x.high(pName));
	mk.addMouseLeaveHandler('title', (x, pName) => x.unhigh(pName));
}
function addBoatInteraction(id) {
	//console.log(id)
	let mk = UIS[id];
	mk.addClickHandler('elem', onClickSelectTuple);
	mk.addMouseEnterHandler('title', (x, pName) => x.high(pName));
	mk.addMouseLeaveHandler('title', (x, pName) => x.unhigh(pName));
}
function activateActions() { IdOwner.a.map(x => addBoatInteraction(x)) }
