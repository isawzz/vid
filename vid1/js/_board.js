function showBoard(oidBoard, oBoard, areaName, shape) {
	//console.log('showBoard','oidBoard',oidBoard,'oBoard',oBoard,'areaName',areaName,'shape',shape)
	let table = serverData.table;
	let div = document.getElementById(areaName);

	//console.log('showBoard', table, div);
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



