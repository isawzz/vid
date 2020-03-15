function showBoard(oidBoard, oBoard, shape, areaName) {
	//console.log('showBoard','oidBoard',oidBoard,'oBoard',oBoard,'areaName',areaName,'shape',shape)
	timit.showTime('*** board start ***')

	//#region create board
	let table = serverData.table;
	let div = document.getElementById(areaName);
	//console.log('showBoard', table, div);

	//so waer besser:
	//let board = irgendwas das id hat und gelinkt ist zu allen die damit zu tun haben
	//das linking ist eh nicht schlecht
	//es muss nur contained werden!

	let domel = addSvgg(div, null, { originInCenter: true, bg: 'blue' });
	let rBoard = oManager.addRSG(oidBoard, oBoard, domel);
	rBoard.structInfo = shape == 'hex' ? _getHexGridInfo(oBoard.rows, oBoard.cols) : _getQuadGridInfo(oBoard.rows, oBoard.cols);

	//fields
	let serverFieldIds = getElements(oBoard.fields); 
	//console.log('serverFieldIds', serverFieldIds);
	rBoard.structInfo.fields = serverFieldIds;
	for (const fid of serverFieldIds) {
		let oField = table[fid];
		let r = oField.row;
		let c = oField.col;
		let domelField = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		let rField = oManager.addRSG(fid, oField, domelField);
		rField.oidBoard = oBoard;
		rField.memInfo = shape == 'hex' ? _getHexFieldInfo(rBoard.structInfo, r, c) : _getQuadFieldInfo(rBoard.structInfo, r, c);
	}
	rBoard.structInfo.vertices = correctPolys(rBoard.structInfo.fields.map(x => oManager.getRSGProperty(x, 'memInfo').poly), 1);

	//corners
	if (isdef(oBoard.corners)) {
		rBoard.structInfo.corners = getElements(oBoard.corners); 
		let dhelp = {}; //remember nodes that have already been created!!!
		for (const fid of serverFieldIds) {
			let oField = table[fid];
			if (nundef(oField.corners)) continue;
			let iPoly = 0;
			//console.log('oField',oField,'rsg',oField.rsg);

			let poly = oManager.getRSGProperty(fid, 'memInfo').poly;
			//console.log('poly',poly)
			let cornerIds = oField.corners.map(x => x._obj);
			for (const cid of cornerIds) {
				if (!cid) {
					iPoly += 1;
					continue;
				} else if (isdef(dhelp[cid])) {
					iPoly += 1;
					continue;
				} else {
					//create a new corner object
					let oCorner = table[cid];
					let domelCorner = document.createElementNS('http://www.w3.org/2000/svg', 'g');
					let rCorner = oManager.addRSG(cid, oCorner, domelCorner);
					rCorner.oidBoard = oBoard;
					let pt = poly[iPoly]; 
					//console.log(poly,iPoly,poly[iPoly],pt)
					rCorner.memInfo = { shape: 'circle', memType: 'corner', x: pt.x, y: pt.y, w: 1, h: 1 };
					dhelp[cid] = rCorner;
					iPoly += 1;
				}
			}
		}

	}

	//edges
	if (isdef(oBoard.edges)) {
		rBoard.structInfo.edges = getElements(oBoard.edges); 
		dhelp = {}; 
		for (const fid of serverFieldIds) {
			let oField = table[fid];
			if (nundef(oField.edges)) continue;
			let edgeIds = oField.edges.map(x => x._obj);
			for (const eid of edgeIds) {
				if (!eid) {
					continue;
				} else if (isdef(dhelp[eid])) {
					continue;
				} else {
					//create an edge object
					let oEdge = table[eid];
					let domelEdge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
					let rEdge = oManager.addRSG(eid, oEdge, domelEdge);
					rEdge.oidBoard = oBoard;
					let n1 = oManager.getRSG(oEdge.corners[0]._obj);
					let n2 = oManager.getRSG(oEdge.corners[1]._obj);

					rEdge.memInfo = {
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
					dhelp[eid] = rEdge;
				}
			}
		}
	}

	//#endregion

	//#region add visuals
	visualizeBoard(oidBoard,oBoard,div);
}
function visualizeBoard(oidBoard,oBoard,div, { f2nRatio = 4, opt = 'fitRatio', gap = 4, margin = 20, edgeColor, fieldColor, nodeColor, iPalette = 1, nodeShape = 'circle', factors, w, h } = {}) {

	let board = oManager.getRSG(oidBoard);
	let dim = getBounds(div); //TODO: take into account transform???? muss ich bei ***zoom
	w=dim.width;
	h=dim.height;
	console.log(dim,w,h);
	let pal = getPalette('powderblue');
	[fieldColor, nodeColor, edgeColor] = [pal[2], pal[3], pal[4]];
	let [fw, fh, nw, nh, ew] = _getBoardScaleFactors(board, { factors: factors, opt: opt, f2nRatio: f2nRatio, w: w, h: h, margin: margin });


	for (const id of board.structInfo.fields) {
		console.log('field:',id)
		let o = getRSG(id);
		console.log('main visual',o);
		// //console.log(o)
		makeVisual(o, o.memInfo.x * fw, o.memInfo.y * fh, board.structInfo.wdef * fw - gap, board.structInfo.hdef * fh - gap, fieldColor, o.memInfo.shape);
		// o.memInfo.isPal = isPalField;
		// o.attach();
	}

	return;
	//opt can be  fitRatio | fitStretch | none
	//coloring: if iPalette is set, board object will set this as its palette
	//if fieldColor is a number 0-8, it will be interpreted as ipal into board palette, and all fields will be given ipal and iPalette in addition to bg
	//if fieldColor is a color, field members will just be given that bg, and they wont have an ipal or iPalette
	//if fieldColor is undefined, in getMemberColors the default colors will be set which are from board palette (board will inherit palette if not set!)
	//same for nodeColor, edgeColor
	let area = UIS[board.idParent];
	w = area.w;
	h = area.h;
	//console.log(w,h);
	let isPalField, isPalCorner, isPalEdge = [false, false, false];
	pal = S.settings.palette;
	[fieldColor, nodeColor, edgeColor] = [pal[2], pal[3], pal[4]];
	[fw, fh, nw, nh, ew] = _getBoardScaleFactors(board, { factors: factors, opt: opt, f2nRatio: f2nRatio, w: w, h: h, margin: margin });
	//---------------------------------------------------------da bin ich--------------
	//console.log('---------------',w,h,fieldColor,fw,fh)

	for (const id of board.strInfo.fields) {
		let o = getVisual(id);
		//console.log(o)
		makeVisual(o, o.memInfo.x * fw, o.memInfo.y * fh, board.strInfo.wdef * fw - gap, board.strInfo.hdef * fh - gap, fieldColor, o.memInfo.shape);
		o.memInfo.isPal = isPalField;
		o.attach();
	}
	if (isdef(board.strInfo.corners)) {
		for (const id of board.strInfo.corners) {
			let ms = getVisual(id);
			ms.memInfo.isPal = isPalCorner;
			makeVisual(ms, ms.memInfo.x * fw, ms.memInfo.y * fh, Math.max(board.strInfo.wdef * nw, ew), Math.max(board.strInfo.hdef * nh, ew), nodeColor, nodeShape);
			
		}
	}
	if (isdef(board.strInfo.edges)) {

		//get reference val for nodesize to compute edge length
		//TODO: what if irregular node shape? 
		let nodeSize = getVisual(board.strInfo.corners[0]).w;

		for (const id of board.strInfo.edges) {
			let ms = getVisual(id);
			ms.memInfo.isPal = isPalEdge;
			//edgeColor = 'green'
			//console.log('edge thickness',o.memInfo.thickness * ew)
			makeVisual(ms, ms.memInfo.x * fw, ms.memInfo.y * fh, ms.memInfo.thickness * ew, 0, edgeColor, 'line', { x1: ms.memInfo.x1 * fw, y1: ms.memInfo.y1 * fh, x2: ms.memInfo.x2 * fw, y2: ms.memInfo.y2 * fh });
			//set length of line!
			ms.length = ms.h = ms.distance-nodeSize;
			ms.attach();
		}
	}
	if (isdef(board.strInfo.corners)) {
		for (const id of board.strInfo.corners) getVisual(id).attach();
	}











	timit.showTime('*** board end ***')

}


//#region helpers
function _getQuadGridInfo(rows, cols) {
	[wdef, hdef] = [4, 4];
	let info = {
		structType: 'grid',
		rows: rows,
		cols: cols,
		wdef: 4,
		hdef: 4,
		dx: wdef,
		dy: hdef,
		w: wdef * cols,
		h: hdef * rows,
		minRow: 1,
		minCol: 1,
	};
	return info;
}
function _getHexGridInfo(rows, cols) {
	[wdef, hdef] = [4, 4];
	[dx, dy] = [wdef / 2, (hdef * 3) / 4];
	let info = {
		structType: 'hexGrid',
		rows: rows,
		cols: cols,
		wdef: 4,
		hdef: 4,
		dx: dx,
		dy: dy,
		w: wdef + (cols - 1) * dx,
		h: hdef + (rows - 1) * dy,
		minRow: 0,
		minCol: 0,
	};
	return info;
}
function _getQuadFieldInfo(boardInfo, row, col) {
	//is exactly same as for hex field except for shape! >so unify after testing!
	let info = {
		shape: 'rect',
		memType: 'field',
		row: row,
		col: col,
		x: -boardInfo.w / 2 + (col - boardInfo.minCol) * boardInfo.dx + boardInfo.wdef / 2,
		y: -boardInfo.h / 2 + (row - boardInfo.minRow) * boardInfo.dy + boardInfo.hdef / 2,
		w: boardInfo.wdef,
		h: boardInfo.hdef,
	};
	//console.log('col',col,'minCol',boardInfo.minCol,boardInfo.w,boardInfo.dx,boardInfo.wdef,'==>',info.x)
	info.poly = getQuadPoly(info.x, info.y, info.w, info.h);
	return info;
}
function _getHexFieldInfo(boardInfo, row, col) {
	let info = {
		shape: 'hex',
		memType: 'field',
		row: row,
		col: col,
		x: -boardInfo.w / 2 + (col - boardInfo.minCol) * boardInfo.dx + boardInfo.wdef / 2,
		y: -boardInfo.h / 2 + boardInfo.hdef / 2 + (row - boardInfo.minRow) * boardInfo.dy,
		w: boardInfo.wdef,
		h: boardInfo.hdef,
	};
	info.poly = getHexPoly(info.x, info.y, info.w, info.h);
	return info;
}

function _getBoardScaleFactors(board, { factors, opt, f2nRatio, w, h, margin } = {}) {
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
	}
	return [fw, fh, nw, nh, ew];
}


