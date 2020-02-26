//#region create MK 
//#region board
function makeBoard(idBoard, o, areaName) {
	let id = 'm_s_' + idBoard;
	if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }
	let mk = new MK();
	mk.id = id;
	let domel = addSvgg(UIS[areaName].elem, id, { originInCenter: true });
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let idParent = areaName;
	mk.idParent = areaName;
	let parent = UIS[idParent];
	parent.children.push(id);

	mk.o = o;
	mk.isa.board = true;

	linkObjects(id, idBoard);
	listKey(IdOwner, id[2], id);
	UIS[id] = mk;
	mk.isAttached = true;
	return mk;

}
//makes fields,corners,edges structural info (pos,shape,...)
function makeBoardElement(oid, o, idBoard, elType) {
	let id = 'm_t_' + oid;
	if (isdef(UIS[id])) {
		error('CANNOT create ' + id + ' TWICE!!!!!!!!!');
		return;
	}
	let mk = new MK();
	mk.id = id;
	let domel = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	mk.elem = domel;
	mk.elem.id = id;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let idParent = idBoard;
	mk.idParent = idParent;
	let parent = UIS[idParent];
	parent.children.push(id);

	mk.o = o;
	mk.isa[elType] = true;

	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	UIS[id] = mk;
	//mk.attach();
	return mk;

}
//makes visual aspect (=domel) of fields,corners,edges according to desired dimensions
function makeVisual(mk, x, y, w, h, color, shape, { x1, y1, x2, y2 } = {}) {
	//console.log('makeVisual', x, y, w, h, color, shape, x1, y1, x2, y2);
	if (shape == 'circle') {
		mk.ellipse({ w: w, h: h }).ellipse({ className: 'overlay', w: w, h: h });
		mk.setPos(x, y);
	} else if (shape == 'hex') {
		mk.hex({ w: w, h: h }).hex({ className: 'overlay', w: w, h: h });
		mk.setPos(x, y);
	} else if (shape == 'quad' || shape == 'rect') {
		mk.rect({ w: w, h: h }).rect({ className: 'overlay', w: w, h: h });
		mk.setPos(x, y);
	} else if (shape == 'triangle') {
		//TODO!!!!
		mk.triangle({ w: w, h: h }).triangle({ className: 'overlay', w: w, h: h });
		mk.setPos(x, y);
	} else if (shape == 'line') {
		let thickness = w;
		let fill = color;
		mk.line({ className: 'ground', x1: x1, y1: y1, x2: x2, y2: y2, fill: fill, thickness: thickness })
			.line({ className: 'overlay', x1: x1, y1: y1, x2: x2, y2: y2, thickness: thickness, });
	} else {
		mk[shape]({ className:'ground',w: w, h: h});//,fill:color });
		mk[shape]({ className: 'overlay', w: w, h: h });
		mk.setPos(x, y);
	}
	mk.setBg(color, shape != 'line');
	mk.orig.bg = color;
	mk.originalBg = color;
	mk.orig.shape = shape;
	mk.originalSize = {w:w,h:h};
	mk.orig.w=w;
	mk.orig.h=h;
	return mk;
}

//#region deck
function makeDeckMS(oid, o, deck1, areaName, x, y) {
	//oid = getUID();
	let id = 'm_t_' + oid; //oid;
	//console.log(id)
	if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }

	//let ms1 = new DeckMS(getUID(),deck1);
	//replace by code:
	let mk = new MK();
	mk.id = id;
	mk.o = o;
	//console.log('o', o);
	mk.deck = deck1;
	//mk.deck.elem.id=getUID();
	mk.oid = oid;
	mk.elem = document.createElement('div');
	mk.elem.id = id;// getUID(); // id+'hallo';
	//console.log('elem', mk.elem);

	//ms1.attachTo(UIS[areaName].elem); //div1);
	//replace by code:
	// let div = UIS[areaName].elem;
	// mk.parent = UIS[areaName];
	// //console.log(mk.parent)
	// mk.parentDiv = div;
	// mk.idParent = areaName;

	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(mk.elem);
	mk.cat = DOMCATS[mk.domType];
	mk.idParent = areaName;
	UIS[areaName].children.push(id);
	mk.isa.deck = true;
	//console.log('******** vor link', id, oid)
	listKey(IdOwner, id[2], id);
	linkObjects(id, oid);
	UIS[id] = mk;

	return mk;
}
function makeInfobox(uid, oid, o) {
	let id = makeIdInfobox(oid);
	if (isdef(UIS[id])) {
		//console.log('CANNOT create ' + id + ' TWICE!!!!!!!!!'); 
		return;
	}
	let mk = new MK();
	mk.id = id;
	let domel = document.createElement('div');
	domel.style.cursor = 'default';
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let idParent = 'a_d_game'; //wer soll parent von infobox sein? brauch div!
	mk.idParent = idParent;
	let parent = UIS[idParent];
	parent.children.push(id);

	let sTitle = oid + ': ' + o.obj_type;
	mk.title(sTitle);

	//let pos = staticPos(mk);
	//mk.setPos(pos.x, pos.y);
	mk.setBg('sienna')
	mk.elem.style.border = '2px solid dimgray';

	mk.o = o;
	mk.isa['infobox'] = true;

	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	UIS[id] = mk;
	mk.attach();

	let x = mk.tableX(o);
	//console.log(mk.id,mk.refs,mk.refs['table'])
	mk.addMouseEnterHandler('title', highlightMsAndRelatives);
	mk.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
	mk.addMouseEnterHandler('', () => bringInfoboxToFront(mk));
	mk.addClickHandler('', () => mk.hide())
	mk.refs['table'].map(x => {
		UIS[x].addMouseEnterHandler('title', highlightMsAndRelatives);
		UIS[x].addMouseLeaveHandler('title', unhighlightMsAndRelatives);
	});
	bringInfoboxToFront(mk);
	return mk;
}
function makeRoot() {
	let mk = new MK();
	let id = 'R_d_root';
	mk.id = id;
	mk.elem = document.getElementById(id);
	mk.domType = getTypeOf(mk.elem);
	mk.IdParent = null;
	mk.isAttached = true;
	UIS[id] = mk;
	return mk;
}
function makeDomArea(domel) {
	if (nundef(domel.id)) return;
	let mk = new MK();
	let id = domel.id;
	mk.id = id;
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let idParent = domel.parentNode.id;
	mk.idParent = idParent;
	let parent = UIS[idParent];
	parent.children.push(id);
	mk.isAttached = true;
	UIS[id] = mk;
	listKey(IdOwner, id[2], id);
	return mk;
}
function makeArea(areaName, idParent) {
	let mk = new MK();
	let id = 'm_A_' + areaName;
	mk.id = id;
	let domel = document.createElement('div');
	//el.innerHTML='hallo!';
	// el.style.backgroundColor = randomColor();
	domel.style.position = 'absolute';
	// el.style.left='0px';
	// el.style.top=''+testPosY+'px'; testPosY+=100;
	// el.style.width='100%';
	// el.style.height='50%';
	mk.elem = domel;
	mk.elem.id = id;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(mk.elem);
	mk.cat = DOMCATS[mk.domType];
	mk.idParent = idParent;
	let parent = UIS[idParent];
	parent.children.push(id);
	mk.attach();
	UIS[id] = mk;
	linkObjects(id, areaName);
	//console.log(oid2ids[areaName]);
	listKey(IdOwner, id[2], id);
	return mk;
}
function makeLogArea(plid) {
	let mk = new MK();
	let idParent = 'a_d_log';
	let id = idParent + '_' + plid;
	mk.id = id;
	let el = document.createElement('div');
	el.style.position = 'absolute';
	el.style.left = '0px';
	el.style.top = '0px';
	el.style.width = '100%';
	el.style.height = '100%';
	el.style.overflowY = 'auto';
	mk.elem = el;
	mk.elem.id = id;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(mk.elem);
	mk.cat = DOMCATS[mk.domType];
	mk.idParent = idParent;
	let parent = UIS[idParent];
	parent.children.push(id);
	mk.attach();
	UIS[id] = mk;
	listKey(IdOwner, id[2], id);
	return mk;
}
function makeDrawingArea(id, idArea, addToUIS = false) {

	if (addToUIS && isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }
	let mk = new MK();
	mk.id = id;

	let idParent = idArea;
	mk.idParent = idArea;
	let parent = UIS[idParent];
	if (parent) parent.children.push(id);
	let parentElem = parent ? parent.elem : document.getElementById(idArea);

	let domel = addSvgg(parentElem, id, { originInCenter: true }); //attaches drawing area!
	mk.w = parent.w;
	mk.h = parent.h;
	//console.log(domel.offsetWidth,domel.offsetHeight,parent.w,parent.h)
	mk.isAttached = true;

	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];

	mk.isa.drawingArea = true;

	if (addToUIS) {
		listKey(IdOwner, id[2], id);
		UIS[id] = mk;
	}
	return mk;


}
function makeDrawingElement(id, idDrawingArea, addToUIS = false) {

	if (isdef(UIS[id])) {
		error('CANNOT create ' + id + ' TWICE!!!!!!!!!');
		return;
	}
	let mk = new MK();
	mk.id = id;
	let domel = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];

	let idParent = idDrawingArea;
	mk.idParent = idParent;
	let parent = UIS[idParent];
	if (parent) parent.children.push(id);

	if (addToUIS) {
		listKey(IdOwner, id[2], id);
		UIS[id] = mk;
	}
	return mk;
}
function makeCard(oid, o, areaName) {
	let idArea = getIdArea(areaName);
	//console.log('***makeCard', oid, areaName);
	let id = 'm_t_' + oid;
	if (isdef(UIS[id])) { 
		error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); 
		return; 
	}
	let mk = new MK();
	mk.id = id;
	
	let cardName = isdef(o.name)?o.name:'King';
	//console.log('makeCard', oid, cardName);//, areaName);

	//TODO: move to behaviors!!!!
	let domel;
	if (GAME == 'catan') domel = _makeCardDivCatan(oid, o);
	else if (GAME == 'aristocracy') domel = _makeCardDivAristocracy(oid,o);
	else domel = _makeCardDivDefault(oid,o);
	domel.id = id;
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let parent = UIS[idArea]; //hand area
	let idParent = parent.id;
	mk.idParent = idParent;
	parent.children.push(id);

	mk.o = o;
	mk.isa.card = true; //pieces have location! if location changes a piece must change its parent!!! 

	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	UIS[id] = mk;

	return mk;

}
function makeRefs(idParent, refs) {
	for (const ref of refs) {
		let id = ref.id;
		let oids = ref.oids;
		if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }
		let mk = new MK();
		mk.id = id;
		let domel = document.getElementById(id);
		//console.log('ref elem:',domel)
		mk.elem = domel;
		mk.parts.elem = mk.elem;
		mk.domType = getTypeOf(domel);
		mk.cat = DOMCATS[mk.domType];
		mk.idParent = idParent;
		let parent = UIS[idParent];
		parent.children.push(id);
		mk.isAttached = true;

		mk.isa.ref = true;
		mk.o = ref.oids;

		for (const oid of ref.oids) linkObjects(id, oid);
		listKey(IdOwner, id[2], id);
		UIS[id] = mk;
	}
}
function makeAux(s, oid, areaName, directParent) {
	let id = 'x_l_' + getUID() + '@' + oid;
	if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }
	let mk = new MK();
	mk.id = id;
	let domel = document.createElement('div');
	domel.classList.add('hallo');
	domel.innerHTML = s;
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let idParent = areaName;
	mk.idParent = idParent;
	let parent = UIS[idParent];
	parent.children.push(id);

	mk.isa.aux = true;

	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	UIS[id] = mk;
	//mk.attach();
	if (isdef(directParent)) { mk.isAttached = true; directParent.appendChild(mk.elem) } else mk.attach();
	return mk;

}
function makeDefaultObject(oid, o, areaName) { return _makeDefault(makeIdDefaultObject(oid), oid, o, areaName, oid + ': ' + o.obj_type); }
function makeDefaultPlayer(oid, o, areaName) { return _makeDefault(makeIdDefaultPlayer(oid), oid, o, areaName, 'player: ' + oid + '(' + getPlayerColorString(oid) + ', ' + getUser(oid) + ')'); }
function _makeDefault(id, oid, o, areaName, title) {
	//ACHTUNG!!! default area is NOT part of UIS!!!!!!!!! it is chrome
	//if (oid == '0') //console.log(id, oid, o, areaName, title)
	if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }
	let mk = new MK();
	mk.id = id;
	let domel = document.createElement('div');
	domel.style.cursor = 'default';
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let idParent = areaName;
	mk.idParent = idParent;

	//ACHTUNG!!! default area is NOT part of UIS!!!!!!!!! it is chrome
	let parent = mById(idParent);
	//parent.children.push(id);

	let sTitle = title;
	mk.title(sTitle);

	mk.o = o;
	mk.isa[o.obj_type] = true;

	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	UIS[id] = mk;
	mk.attach();
	return mk;

}
function makeDefaultAction(boat, areaName) {
	let mk = new MK();
	let id = 'd_a_' + boat.iTuple;
	if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return null; }
	mk.id = id;
	let domel = document.createElement('div');
	domel.textContent = boat.text;
	domel.style.cursor = 'pointer';
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let idParent = areaName;
	mk.idParent = idParent;
	let parent = mById(idParent);//UIS[idParent];
	
	//parent.children.push(id);

	mk.o = boat;
	mk.isa.boat = true;

	for (const tupleEl of boat.tuple) {
		if (tupleEl.type == 'obj' && isdef(tupleEl.ID)) {
			let oid = tupleEl.ID;
			boat.oids.push(oid);
			linkObjects(id, oid);
		}
	}

	listKey(IdOwner, id[2], id);
	UIS[id] = mk;
	mk.attach();

	let b=getBounds(mk.elem);
	let bParent=getBounds(parent);
	console.log(b.x,b.width);
	let wNeeded = b.x+b.width-8;
	if  (bParent.width < wNeeded) parent.style.setProperty('width',wNeeded+28+'px');

	return mk;

}

function getBoardElementStandardType(mk) {
	return mk.isa.corner ? 'corner' : mk.isa.field ? 'field' : 'edge';
}
function makeMainBoardElementVisual(oid, o) {
	//examples are: building(road,settlement), robber
	//main objects are only made if loc on board element!
	//console.log(oid, o);
	//depending on size, will be labeled w/ any simple field val, or oid if none

	//TODO: das muss geaendert werden!!!
	//this function only makes visuals located on a board!

	let id = 'm_t_' + oid;
	if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }
	let mk = new MK();
	mk.id = id;
	let domel = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let locElem = getVisual(o.loc._obj);
	let parent = UIS[locElem.idParent]; //board should be parent, not board element!!!
	//console.log('parent', parent);
	//console.log('locElem', locElem);

	let idParent = parent.id;
	mk.idParent = idParent;
	parent.children.push(id);

	mk.o = o;
	mk.isa.movable = 'loc'; //pieces have location! if location changes a piece must change its parent!!! 

	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	UIS[id] = mk;

	let color = SPEC.useColorHintForObjects ? getColorHint(o) : randomColor();
	if (nundef(color)) color = 'black';// randomColor();
	//console.log('isEdge',locElem.isa.edge)
	//if (locElem.isa.edge) //console.log(locElem.w,locElem.h,locElem)
	//console.log('........locElem.isa',locElem.isa);
	let boardElemType = getBoardElementStandardType(locElem);
	let sizeInfo = SPEC.pieceSizeRelativeToLoc[boardElemType];

	let baseValue = locElem[sizeInfo[0]];
	let percent = Number(sizeInfo[1]);
	let sz = (baseValue * percent) / 100;

	//default piece for field,node is circle of size sz w/ symbol in middle
	if (boardElemType != 'edge') {
		makePictoPiece(mk, o, sz, color)
		mk.setPos(locElem.x, locElem.y);
	} else {
		//default piece for edge is lineSegment along edge of length sz (w/ symbol only if addSymbolToEdges==true)

		makeLineSegment(mk, o, locElem, sz, color);
		console.log('........STREET',mk)
	}
	mk.attach();

	return mk;
}
function makeLineSegment(mk, o, msLoc, sz, color) {
	//TODO: S.settings.addSymbolsToEdges
	let [x1, y1, x2, y2] = msLoc.getEndPointsOfLineSegmentOfLength(sz);
	//let ms2=makeDrawingElement('el2', 'board');
	mk.line({ cap: 'round', thickness: msLoc.thickness, x1: x1, y1: y1, x2: x2, y2: y2 }).setBg(color).attach();
	mk.line({ className: 'overlay', cap: 'round', thickness: msLoc.thickness, x1: x1, y1: y1, x2: x2, y2: y2 });

}
function makePictoPiece(mk, o, sz, color) {

	//console.log('unit',unit,'percent',percent,'sz',sz);
	let [w, h] = [sz, sz];

	let sym = o.obj_type;
	if (sym in SPEC.symbols) { sym = SPEC.symbols[sym]; }
	if (!(sym in iconChars)) {
		//console.log("didn't find key", sym);
		symNew = Object.keys(iconChars)[randomNumber(5, 120)]; //abstract symbols
		//console.log('will rep', sym, 'by', symNew)
		SPEC.symbols[sym] = symNew;
		sym = symNew;
	}
	//console.log(iconChars,sym,iconChars[sym])
	mk.ellipse({ w: w, h: h, fill: color, alpha: .3 });
	let pictoColor = color == 'black' ? randomColor() : color;
	mk.pictoImage(sym, pictoColor, sz * 2 / 3); //colorDarker(color),sz*2/3);
}
function makeMainPlayer(oid, o, areaName) {
	let id = 'm_p_' + oid;
	if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }
	let mk = new MK();
	mk.id = id;
	let title = 'player: ' + oid + '(' + getPlayerColorString(oid) + ', ' + getUser(oid) + ')';
	// _makeDefault(makeIdDefaultPlayer(oid), oid, o, areaName, ); }
	let domel = document.createElement('div');
	domel.style.cursor = 'default';
	mk.elem = domel;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(domel);
	mk.cat = DOMCATS[mk.domType];
	let idParent = areaName;
	mk.idParent = idParent;
	let parent = UIS[idParent];
	parent.children.push(id);

	let sTitle = title;
	let color = G.playersAugmented[oid].color;
	mk.title(sTitle, 'title', color);

	mk.o = o;
	mk.isa.player = true;

	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	UIS[id] = mk;
	mk.attach();
	return mk;

}

//#region tableElemX
function tableElemX(o, keys) {
	//console.log(o,keys)
	let t = document.createElement('table');
	t.classList.add('tttable');
	let refs = [];//collect references to objects and players inside of table {oids:[oids],clid:clid,type:'p'|'t'} => parts
	let s = '';
	for (const k in o) {
		if (isdef(keys) && !keys.includes(k)) continue;
		s += '<tr><th>' + k + '</th><td>';
		let sval = transformToString(k, o[k], refs);
		s += sval + '</td>';
	}
	t.innerHTML = s;
	return { table: t, refs: refs };
}
function tableHTMLX(o, refs) {
	let s = '<table class="tttable up10">';
	for (const k in o) {
		s += '<tr><th>' + k + '</th><td>';
		let sval = transformToString(k, o[k], refs);
		s += sval + '</td>';
	}
	s += '</table>';
	return s;
}

function atleastOneElementOfXIsDictWithKey(lst, k) {
	for (const x of lst) { if (!x) continue; if (isDict(x) && k in x) return true; }
	return false;
}
function isListOf(x, key = '_obj') {
	return isList(x) && !isEmpty(x) && atleastOneElementOfXIsDictWithKey(x, key); //isDict(x[0]) && '_obj' in x[0];
}
function makeRefLinkDiv(val, refs, prop, prefix) {
	let cl = prefix + '_r_' + getUID(); let ref = { oids: [val[prop]], id: cl }; refs.push(ref);
	let sval = `<div id=${cl} class='up10 hallo'>${val[prop].toString()}</div>`;
	return sval;
}
function makeRefLinkDiv4_obj(val, refs) { return makeRefLinkDiv(val, refs, '_obj', 't'); }
function makeRefLinkDiv4_player(val, refs) { return makeRefLinkDiv(val, refs, '_player', 'p'); }
function makeRefLinkDivList(val, refs, prop, prefix, className = 'up10 hallo') {
	let cl = prefix + '_r_' + getUID(); let ref = { oids: val.filter(x => isdef(x)).map(x => x[prop]), id: cl }; refs.push(ref);
	let sval = `<div id=${cl} class='${className}'>${val.map(x => !x ? '_' : x[prop]).toString()}</div>`;
	return sval;
}
function makeRefLinkDiv4ListOf_obj(val, refs, className = 'up10 hallo') {
	return makeRefLinkDivList(val, refs, '_obj', 't', className);
}
function makeRefLinkDiv4ListOf_player(val, refs, className = 'up10 hallo') {
	return makeRefLinkDivList(val, refs, '_player', 'p', className);
}
function makeRefLinkDiv4MatrixOf_obj(val, refs) {
	let rows = val._ndarray;
	let sval = `<div>`;
	let rowClass = 'up2 hallo';
	for (const row of rows) {
		sval += makeRefLinkDiv4ListOf_obj(row, refs, rowClass) + '<br>';
		rowClass = 'hallo';
	}
	sval += '</div>';
	return sval;
}
function transformToString(k, val, refs) {
	if (val && isDict(val) && '_set' in val) { val = val._set; }
	if (k == 'visible' && !isEmpty(val) && !isDict(val[0])) { val = val.map(x => { return { _player: x } }); }

	let sval = null;
	if (isList(val) && isEmpty(val)) { sval = '{ }'; }
	else if (isList(val) && isString(val[0])) { sval = '{' + val.join(',') + '}' }
	else if (isListOf(val, '_obj')) { sval = makeRefLinkDiv4ListOf_obj(val, refs); }
	else if (isListOf(val, '_player')) { sval = makeRefLinkDiv4ListOf_player(val, refs); }
	else if (val && isDict(val) && '_obj' in val) { sval = makeRefLinkDiv4_obj(val, refs); }
	else if (val && isDict(val) && '_ndarray' in val) { sval = makeRefLinkDiv4MatrixOf_obj(val, refs) }
	else if (val && isDict(val) && '_player' in val) { sval = makeRefLinkDiv4_player(val, refs); }
	else if (isDictOrList(val)) {// || isList(val)) { 
		// if (isList(val)) {
		// 	//console.log('##############ERROR!!! transformToString list would be lost!!!!',val)
		// }
		sval = tableHTMLX(val, refs); 
	}
	else sval = simpleRep(val);

	// if (k == 'ports'){
	// 	//console.log('ports:',k,val,sval)
	// }

	return sval;
}
//#endregion





















