function hexGrid(o, loc, pool) {
	function boardInfo(rows, cols) {
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
	function fieldInfo(boardInfo, row, col) {
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
	return new _grid(o, loc, pool, boardInfo, fieldInfo);
}
function quadGrid(o, loc, pool) {
	function boardInfo(rows, cols) {
		[wdef, hdef] = [4, 4];
		let info = {
			structType: 'quadGrid',
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
	function fieldInfo(boardInfo, row, col) {
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
	return new _grid(o, loc, pool, boardInfo, fieldInfo);
}


class _grid {
	constructor(o, loc, pool, boardInfo, fieldInfo) {
		this.boardInfo = boardInfo;
		this.fieldInfo = fieldInfo;
		let {board,fields,corners,edges} = this.skeleton = this.gridSkeleton(o, pool, this.boardInfo, this.fieldInfo);
		board.oid = o.oid;

		console.log('board', board);
		console.log('fields', fields);
		console.log('corners', corners);
		console.log('edges', edges);
		console.log('location', loc)

		console.log(this.skeleton);
		//generalGrid(board, fields, corners, edges, loc, agHex);

	}
	gridSkeleton(omap, pool, gridInfoFunc, fieldInfoFunc) {
		//calc pos skeleton of board
		let board = { o: omap, info: gridInfoFunc(omap.rows, omap.cols) };

		let fields = {};
		for (const fid of getElements(omap.fields)) {
			let o = pool[fid];
			fields[fid] = { oid: fid, o: pool[fid], info: fieldInfoFunc(board.info, o.row, o.col) };
		}
		// console.log('fields', fields);

		//now vertices
		board.info.vertices = correctPolys(Object.values(fields).map(x => x.info.poly), 1);

		let dhelp = {}; //remember nodes that have already been created!!!
		let corners = {};
		for (const fid in fields) {
			let f = fields[fid];
			let i = 0;
			for (const cid of getElements(f.o.corners)) {
				if (cid && nundef(dhelp[cid])) {
					let pt = f.info.poly[i];
					corners[cid] = { oid: cid, o: pool[cid], info: { shape: 'circle', memType: 'corner', x: pt.x, y: pt.y, w: 1, h: 1 } };
					dhelp[cid] = true;
				}
				i += 1;
			}
		}
		// console.log('corners', corners);

		//now edges
		dhelp = {}; //remember edges that have already been created!!!
		let edges = {};
		for (const fid in fields) {
			let f = fields[fid];
			for (const eid of getElements(f.o.edges)) {
				if (eid && nundef(dhelp[eid])) {
					let el = pool[eid];
					let n1 = corners[el.corners[0]._obj];
					let n2 = corners[el.corners[1]._obj];
					let [x1, y1, x2, y2] = [n1.info.x, n1.info.y, n2.info.x, n2.info.y];
					//console.log(el, n1, n2)
					edges[eid] = { oid: eid, o: el, info: { shape: 'line', memType: 'edge', x1: x1, y1: y1, x2: x2, y2: y2, x: (x1 + x2) / 2, y: (y1 + y2) / 2, thickness: 1, w: 1, h: 1 } };
					dhelp[eid] = true;
				}
			}
		}
		// console.log('edges', edges);

		return {board:board, fields:fields, corners:corners, edges:edges};

	}
	generalGrid(board, fields, corners, edges, loc, fieldFunc) {
		console.log('generalGrid', loc)
		//hab hiermit board,fields,corners,edges dicts mit {o,oid,info}

		// *** stage 0: sizing info ***
		let size = 100;//FIELD_SZ;//sollte multiple of 4 sein! weil wdef=4
		let gap = 4;

		let [fw, fh, wField, hField] = [size / board.info.wdef, size / board.info.hdef, size - gap, size - gap];
		let szCorner = Math.max(wField / 4, 20);
		let [wBoard, hBoard] = [fw * board.info.w + szCorner, fh * board.info.h + szCorner];

		// *** stage 1: convert objects into uis ***

		let pal = getTransPalette('silver');
		[fieldColor, nodeColor, edgeColor] = [pal[1], 'dimgray', pal[5]];

		let mk = registerObject(board, 'm', loc, RSGTYPES.board);

		for (const oid in fields) { let o = fields[oid]; let el = gG(); fieldFunc(el, wField, hField); gBg(el, fieldColor); o.ui = el; registerObject(o, 'm', mk.id, RSGTYPES.field); }
		for (const oid in edges) { let o = edges[oid]; let el = gG(); gFg(el, edgeColor, 10); o.ui = el; registerObject(o, 'm', mk.id, RSGTYPES.edge); }
		for (const oid in corners) { let o = corners[oid]; let el = gG(); agCircle(el, szCorner); gBg(el, nodeColor); o.ui = el; registerObject(o, 'm', mk.id, RSGTYPES.corner); }

		//uis sind board,fields,corners,edges .map(x=>x.ui)
		timit.showTime('stage 1 done');

		//area is div element treated as always (flexWrap)
		//container=board is a div (posRel) with svg and g inside =>3 containers!
		//fields,edges,corners are g elements within board g


		// *** stage 2: prep area div (loc 'areaTable') as flexWrap ***
		//let area = mBy(loc);// 
		let area = stage2_prepArea(loc);

		timit.showTime('stage 2 done');
		// *** stage 3: prep container div/svg/g (board) as posRel, size wBoard,hBoard ***
		let container = stage3_prepContainer(area); //mColor(container, 'transparent'); //container is appended to area!!!!!!!

		let svgContainer = gSvg();
		let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;border-radius:${gap}px;`;
		svgContainer.setAttribute('style', style);
		container.appendChild(svgContainer);

		let gContainer = gG();
		svgContainer.appendChild(gContainer);

		board.ui = board.div = container;
		board.svg = svgContainer;
		board.g = gContainer; gContainer.id = board.id; //this counts as loc for board elements
		registerUiFor(mk, container);

		let [wTotal, hTotal] = [wBoard + 2 * gap, hBoard + 2 * gap];
		mStyle(container, { width: wTotal, height: hTotal, 'border-radius': gap });
		gContainer.style.transform = "translate(50%, 50%)"; //geht das schon vor append???
		//console.log(wTotal, hTotal);

		timit.showTime('stage 3 done');
		// *** stage 4: layout! means append & positioning = transforms... ***
		layoutGridInfo(board.g, fields, corners, edges, fw, fh);


	}
}













