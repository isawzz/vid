function gridLayout(layout){
	
}

















function setBodyColor(){
	let color = SPEC.color && SPEC.color.theme?SPEC.color.theme:"#668dff";
	document.body.style.backgroundColor = color;
	let fg = colorIdealText(color)
	document.body.style.color = fg;

}
































//TODO: ist grad nicht in verwendung!
function columnGrid(areaNames, loc) {
	//transforms loc into equal-sized flex grid of columns or rows
	//each cell gets name from areaNames and is a div, usable as area
	let dLoc = mById(loc);

	clearElement(dLoc);
	dLoc.style.display = 'grid';

	if (SPEC.collapseEmptySmallLetterAreas) {
		dLoc.style.gridTemplateRows = 'repeat(' + areaNames.length + 'fit-content)'; //',min-max(0,min-content))';
		dLoc.style.gridTemplateColumns = 'fit-content';// 'min-max(0,min-content)';
	} else {
		dLoc.style.gridTemplateRows = 'repeat(' + areaNames.length + ',1fr)';
		dLoc.style.gridTemplateColumns = '1fr';
	}

	let bds = getBounds(dLoc);
	//let maxHeight = bds.height / areaNames.length;
	//console.log(dLoc, bds,maxHeight);return;
	let palette = getTransPalette9('white');
	for (let i = 0; i < areaNames.length; i++) {
		let a = mDiv(dLoc);
		a.id = areaNames[i];

		//a.style.setProperty('max-height',maxHeight+'px');
		//console.log('settings max-height of',areaNames[i],'to',maxHeight);

		//a.style.maxHeight = '100px'; // bds.height / areaNames.length + 'px';
		//a.style.minWidth='fit-content';//min-max(0px,min-content)';
		//a.style.width='auto';
		if (SPEC.shadeAreaBackgrounds) a.style.backgroundColor = palette[i];
		if (SPEC.showAreaNames) a.innerHTML = makeAreaNameDomel(areaNames[i]);
		UIS[areaNames[i]] = { elem: a, children: [], maxHeightFunc: () => getBounds(loc).height / areaNames.length };
	}
}
//keine ahnung ob das func? soll so catan cards machen
function pictoHand(objectPool, loc, o, oid, path, oDict) {
	//console.log('_______cardHand')
	//console.log(objectPool, '\nloc', loc, '\noHand', oHand, '\npath', path);

	let key = oid + '.' + path;
	let mkHand = getVisual(key);
	let hPadding = 4;
	let hMargin = 4;
	if (!mkHand) mkHand = makeHand(key, loc, getColorHint(o), hMargin, hPadding);
	// //console.log('_______________\nmkHand', mkHand, '\nbounds', getBounds(mkHand.elem));

	//let ores={wood: 2, brick: 0, sheep: 2, ore: 0, wheat: 0};
	//let oCardDict = oDict;
	let oCardList = [];
	for (const k in oDict) {
		let card = { name: k, desc: oDict[k] };
		oCardList.push(card);
	}
	//let oCardList = dict2list(oCardDict, 'id');
	//console.log('_______________\ncardList', oCardList, oDict);
	return;

	let mkCardList = [];
	for (const oCard of oCardList) { mkCardList.push(makePictoCard(oCard.id, oCard)); }
	// //console.log('cards',mkCardList);

	layoutCardsOverlapping(mkHand, mkCardList);
}
//TODO
function cardHandCompact(objectPool, loc, o, oid, path, oHand) {
	//console.log('_______cardHand')
	//console.log(objectPool, '\nloc', loc, '\noHand', oHand, '\npath', path);
	// return _hexGrid(loc, path, oHand, objectPool);
	let ids = getElements(oHand);
	//console.log('have to present',ids,'in area',loc)
}
//TODO


//#region old code UNUSED!!!!!!!!!!!!!!!!!


function cardHand_dep(objectPool, loc, o, oid, path, oHand) {
	//console.log('_______cardHand')
	//console.log(objectPool, '\nloc', loc, '\noHand', oHand, '\npath', path);

	//do NOT present empty hands!
	let ids = oHand ? getElements(oHand) : [];
	if (isEmpty(ids)) {
		//console.log('no data in',oid,'...returning to spec')
		return;
	}
	let oCardDict = {};
	for (const id of ids) { oCardDict[id] = objectPool[id]; }
	let oCardList = dict2list(oCardDict, 'id');
	// //console.log('_______________\nhave to present', ids, 'in area', mkHand.id);


	let key = oid + '.' + path;
	let mkHand = getVisual(key);
	let hPadding = 4;
	let hMargin = 4;
	if (!mkHand) mkHand = makeHand(key, loc, getColorHint(o), hMargin, hPadding);
	// //console.log('_______________\nmkHand', mkHand, '\nbounds', getBounds(mkHand.elem));


	let mkCardList = [];
	for (const oCard of oCardList) { mkCardList.push(makeCard123(oCard.id, oCard)); }
	// //console.log('cards',mkCardList);

	layoutCardsOverlapping(mkHand, mkCardList);
}


function cardHand_verb(objectPool, loc, o, oid, path, omap) {
	let [size, gap] = [80, 4];
	let [w, h] = [size * .66, size];

	let uis = stage1_makeUis(omap, objectPool, w, h, gap, sizedCard123);
	if (!uis) return null;

	//TODO: if any cards are present: need to create corresponding mks and link them to oid (because care correspond to objects and resources dont!!!)

	let area = stage2_prepArea(loc);

	//testing 
	// for (const ui of uis) mAppend(area, ui)

	let container = stage3_prepContainer(area);
	//after this step, the area already contains an element (of size 0!) and is therefore expanded to flex wrap margin!!!

	//TODO: shall I create an mk for container??? not needed in step_from_scratch!!!! because hand does not need to be highlighted
	//TODO: naeher testen und ueberlegen ob das auch stimmt wenn ein object fuer hand existiert (market.neutral)

	//=>layout!
	// *** stage 4: create layout of objects within container *** >>returns size needed for collection
	stage4_layout(uis, container, w, h, gap, layoutHand);
}
function colorLabelRow_verb(objectPool, loc, o, oid, path, omap) {
	// //console.log('colorLabelRow NOT IMPLEMENTED!!!');
	//console.log('_______ colorLabelRow')
	//console.log(objectPool)
	//console.log('loc', loc, 'o', o, 'oid', oid)
	//console.log('oHand', omap, 'path', path);

	// *** stage 1: convert objects into uis ***
	//convert collection into color,label list
	let olist = mapOMap(omap);

	//if olist is empty: no presentation at all!
	if (isEmpty(olist)) return;

	//console.log('olist',olist);
	let otrans = olist.map(item => ({ color: convertToColor(item.key), label: convertToLabel(item.value) }));
	//console.log('otransformed',otrans);
	let size = 40, gap = 4;
	let uis = getUis(otrans, colorLabelDiv(size));

	// *** stage 2: prep area ***
	let area = mBy(loc);
	mClass(area, 'flexWrap');
	// mFlex1(area);

	// *** stage 3: create container for uis ***
	let container = mDiv(area); mPosRel(container);

	// *** stage 4: create layout of objects within container *** >>returns size needed for collection
	let [w, h] = layoutRow(uis, container, size, size, gap);
	// set container to appropriate size: area should adapt to that!!!
	mStyle(container, { width: w, height: h, 'background-color': 'white', 'border-radius': gap });



	// let key = oid + '.' + path;
	// let mkHand = getVisual(key);
	// let hPadding = 4;
	// let hMargin = 4;
	// if (!mkHand) mkHand = makeHand(key, loc, getColorHint(o), hMargin, hPadding);
	// // //console.log('_______________\nmkHand', mkHand, '\nbounds', getBounds(mkHand.elem));

	// let mkCardList = [];
	// for (const oCard of oCardList) { mkCardList.push(makeCard123(oCard.id, oCard)); }
	// // //console.log('cards',mkCardList);

	// layoutCardsOverlapping(mkHand, mkCardList);

}

function addVisuals(board, { f2nRatio = 4, opt = 'fitRatio', gap = 4, margin = 20, edgeColor, fieldColor, nodeColor, iPalette = 1, nodeShape = 'circle', factors, w, h } = {}) {
	//opt can be  fitRatio | fitStretch | none
	//coloring: if iPalette is set, board object will set this as its palette
	//if fieldColor is a number 0-8, it will be interpreted as ipal into board palette, and all fields will be given ipal and iPalette in addition to bg
	//if fieldColor is a color, field members will just be given that bg, and they wont have an ipal or iPalette
	//if fieldColor is undefined, in getMemberColors the default colors will be set which are from board palette (board will inherit palette if not set!)
	//same for nodeColor, edgeColor
	let area = UIS[board.loc];
	let div = area.elem;
	console.log(area.elem)
	mStyle(div,{width:400,height:400,position:'relative'});
	let dim = getBounds(div);

	w = Math.max(dim.width,400); //NEIN, hier muss ich aendern!!!!
	h = Math.max(dim.height,300);
	//area.setBounds(0,0,400,400);
	console.log(dim)

	let pal = getTransPalette('silver');
	[fieldColor, nodeColor, edgeColor] = [pal[1], 'dimgray', pal[5]];
	let [fw, fh, nw, nh, ew] = getBoardScaleFactors(board, { factors: factors, opt: opt, f2nRatio: f2nRatio, w: w, h: h, margin: margin });

	//console.log('---------------',w,h,fieldColor,fw,fh,nw,nh,ew)

	for (const id of board.structInfo.fields) {
		let o = getVisual(id);
		makeVisual(o, o.memInfo.x * fw, o.memInfo.y * fh, board.structInfo.wdef * fw - gap, board.structInfo.hdef * fh - gap, fieldColor, o.memInfo.shape);
		o.attach();
	}
	if (isdef(board.structInfo.corners)) {
		for (const id of board.structInfo.corners) {
			let mk = getVisual(id);
			makeVisual(mk, mk.memInfo.x * fw, mk.memInfo.y * fh, Math.max(board.structInfo.wdef * nw, ew), Math.max(board.structInfo.hdef * nh, ew), nodeColor, nodeShape);

		}
	}
	if (isdef(board.structInfo.edges)) {

		//get reference val for nodesize to compute edge length
		//TODO: what if irregular node shape? 
		let nodeSize = getVisual(board.structInfo.corners[0]).w;

		for (const id of board.structInfo.edges) {
			let mk = getVisual(id);
			//console.log('edge info',mk.memInfo,ew);

			makeVisual(mk, mk.memInfo.x * fw, mk.memInfo.y * fh, mk.memInfo.thickness * ew, 0, edgeColor, 'line', { x1: mk.memInfo.x1 * fw, y1: mk.memInfo.y1 * fh, x2: mk.memInfo.x2 * fw, y2: mk.memInfo.y2 * fh });
			//set length of line!
			mk.length = mk.h = mk.distance - nodeSize;
			mk.attach();
			//break;
		}
	}
	if (isdef(board.structInfo.corners)) {
		for (const id of board.structInfo.corners) getVisual(id).attach();
	}
}
/**
 * 
 * @param {id of parent object} areaName 
 * @param {id of board object to be created} idBoard 
 * @param {server object that has at least rows,cols,fields} sBoard 
 * @param {server object dict containing fields,corners,edges} sMemberPool 
 * @param {hex or quad} shape 
 */
function createGrid(areaName, idBoard, sBoard, sMemberPool, shape) {
	let board = makeBoard(idBoard, sBoard, areaName);
	board.structInfo = shape == 'hex' ? getHexGridInfo(sBoard.rows, sBoard.cols) : getQuadGridInfo(sBoard.rows, sBoard.cols);

	//ausser fuer board object, sind neighborhood infos (fields.corners,...) NUR im G.table object
	makeFields(sMemberPool, board, sBoard, shape);
	if (isdef(sBoard.corners)) makeCorners(sMemberPool, board, sBoard);
	if (isdef(sBoard.edges)) makeEdges(sMemberPool, board, sBoard);

	return board;
}
function areaRows(soDict, loc) {
	//for each object in soDict makes a row div
	let area = getVisual(loc);
	let [w, areaH] = area.getSize();
	let keys = getKeys(soDict);
	let n = keys.length;
	let h = areaH / n;
	let extra = areaH - n * h;
	let x = 0;
	let y = 0;
	let [iPalette, ipal] = area.getColorInfo();
	let pal = S.pals[iPalette];
	ipal = n <= pal.length - ipal ? ipal : n <= pal.length ? pal.length - n : ipal;
	let i = 0;
	for (const k in soDict) {
		//console.log(loc,x,y,w,h,iPalette,ipal)
		let id = k;
		i += 1;
		let o = createMainDiv(id, loc);
		let h1 = i == n - 1 ? h + extra : h;
		o.setBounds(x, y, w, h1);
		//console.log('h',h1, areaH)
		o.setPalette(iPalette, ipal);
		y += h1;
		ipal = (ipal + 1) % pal.length;
	}
}
function detectBoard(soDict, loc) {
	timit.showTime('*** board start ***')
	let idBoard = firstCondDict(soDict, x => isBoardObject(x)); // isdef(x.map) && isdef(x.fields));
	if (isdef(idBoard)) {
		let sBoard = soDict[idBoard];
		//detect shape of board fields
		//look at first field
		//guess hex if field has 6 neighbors...
		let idField0 = sBoard.fields._set[0]._obj;
		let f0 = soDict[idField0];
		let numNei = f0.neighbors.length;
		if (numNei == 6) return _hexGrid(loc, idBoard, sBoard, soDict); else return _quadGrid(loc, idBoard, sBoard, soDict);
	}
	return null;

}

function _quadGrid(loc, idBoard, sBoard, soDict) {
	let board = createGrid(loc, idBoard, sBoard, soDict, 'quad');
	addVisuals(board);
	return board;
}
function _hexGrid(loc, idBoard, sBoard, soDict) {
	//console.log(loc,idBoard,sBoard,soDict);
	let board = createGrid(loc, idBoard, sBoard, soDict, 'hex');

	//setTimeout(()=>addVisuals(board),0);
	addVisuals(board);
	return board;
}
function findMatch(odict, condList) {
	if (isListOfLiterals(condList)) condList = [condList];
	//console.log('odict',odict);//console.log('condList',condList)

	let Board = lastCondDictPlusKey(odict, x => {
		for (const tuple of condList) {
			if (x[tuple[0]] != tuple[1]) return false;
		}
		return true;
	});
	//console.log('findMatchDict',Board);
	return Board;
}
function getBoardScaleFactors(board, { factors, opt, f2nRatio, w, h, margin } = {}) {
	let [fw, fh, nw, nh, ew] = isdef(factors) ? factors : [43, 50, 12, 12, 10];
	if (startsWith(opt, 'fit')) {
		if (w == 0) {
			let g = document.getElementById(board.id);
			let transinfo = getTransformInfo(g);
			w = transinfo.translateX * 2;
			h = transinfo.translateY * 2;
		}
		let divBy = 2 * (f2nRatio - 2);
		fw = Math.floor((w - margin) / (board.structInfo.w + board.structInfo.wdef / divBy));
		fh = Math.floor((h - margin) / (board.structInfo.h + board.structInfo.hdef / divBy));

		let maintainRatio = (opt[3] == 'R');
		if (maintainRatio) {
			let ff = Math.min(fw, fh);
			fw = ff;
			fh = ff;
		}
		nw = Math.floor(fw / f2nRatio);
		nh = Math.floor(fh / f2nRatio);
		if (ew > nw) ew = nw * 1.2;
	}
	return [fw, fh, nw, nh, ew];
}
function makeFields(pool, board, serverBoard, shape) {
	//console.log(board, serverBoard)
	let serverFieldIds = _setToList(serverBoard.fields).map(x => x._obj);
	board.structInfo.fields = serverFieldIds;
	for (const fid of serverFieldIds) {
		let sField = pool[fid];
		let r = sField.row;
		let c = sField.col;
		let field = makeBoardElement(fid, sField, board.id, 'field');
		field.memInfo = shape == 'hex' ? getHexFieldInfo(board.structInfo, r, c) : getQuadFieldInfo(board.structInfo, r, c);
	}
	//console.log(board,board.structInfo,board.structInfo.fields);
	//for(const oid of board.structInfo.fields) //console.log(oid2ids[oid],getMainId(oid));
	board.structInfo.vertices = correctPolys(board.structInfo.fields.map(x => getVisual(x).memInfo.poly), 1);
	//console.log(board.structInfo.vertices)
}
function makeCorners(pool, board, serverBoard) {
	let serverFieldIds = _setToList(serverBoard.fields).map(x => x._obj);
	board.structInfo.corners = _setToList(serverBoard.corners).map(x => x._obj);
	let dhelp = {}; //remember nodes that have already been created!!!
	for (const fid of serverFieldIds) {
		let sfield = pool[fid];
		let ffield = getVisual(fid);
		if (nundef(sfield.corners)) continue;
		let iPoly = 0;
		let cornerIds = sfield.corners.map(x => x._obj);
		for (const cid of cornerIds) {
			if (!cid) {
				iPoly += 1;
				continue;
			} else if (isdef(dhelp[cid])) {
				iPoly += 1;
				continue;
			} else {
				//create a new corner object
				let corner = makeBoardElement(cid, pool[cid], board.id, 'corner');//createMainG(cid, board.id);
				let poly = ffield.memInfo.poly[iPoly];
				corner.memInfo = { shape: 'circle', memType: 'corner', x: poly.x, y: poly.y, w: 1, h: 1 };
				dhelp[cid] = corner;
				iPoly += 1;
			}
		}
	}
}
function makeEdges(pool, board, serverBoard) {
	let serverFieldIds = _setToList(serverBoard.fields).map(x => x._obj);
	board.structInfo.edges = _setToList(serverBoard.edges).map(x => x._obj);
	dhelp = {}; //remember nodes that have already been created!!!
	for (const fid of serverFieldIds) {
		let sfield = pool[fid];
		if (nundef(sfield.edges)) continue;
		let edgeIds = sfield.edges.map(x => x._obj);
		for (const eid of edgeIds) {
			if (!eid) {
				continue;
			} else if (isdef(dhelp[eid])) {
				continue;
			} else {
				//create an edge object
				let edge = makeBoardElement(eid, pool[eid], board.id, 'edge');

				//find end corners (server objects):
				let el = pool[eid];
				let n1 = getVisual(el.corners[0]._obj);
				let n2 = getVisual(el.corners[1]._obj);
				//console.log(el, n1, n2)

				edge.memInfo = {
					shape: 'line',
					memType: 'edge',
					x1: n1.memInfo.x,
					y1: n1.memInfo.y,
					x2: n2.memInfo.x,
					y2: n2.memInfo.y,
					x: (n1.x + n2.x) / 2,
					y: (n1.y + n2.y) / 2,
					thickness: 1,
					w: 1,
					h: 1,
				};
				dhelp[eid] = edge;
			}
		}
	}
}

