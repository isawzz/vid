
function hexGrid(pool, loc, o, oid, path, omap) {

	//#region *** skeleton ***
	console.log('___________')
	console.log('omap=board', omap)

	//calc pos skeleton of board
	let board = { oid: oid + (isEmpty(path) ? '' : '.' + path), o: omap, info: getHexGridInfo(omap.rows, omap.cols) };
	console.log('path', path, 'board', board);

	let fields = {};
	for (const fid of getElements(omap.fields)) {
		let o = pool[fid];
		fields[fid] = { oid: fid, o: pool[fid], info: getHexFieldInfo(board.info, o.row, o.col) };
	}
	console.log('fields', fields);

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
	console.log('corners', corners);

	//now edges
	dhelp = {}; //remember edges that have already been created!!!
	edges = {};
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
	console.log('edges', edges);
	//#endregion

	//hab hiermit board,fields,corners,edges dicts mit {o,oid,info}

	let size = 120;//FIELD_SZ;//sollte multiple of 4 sein! weil wdef=4
	let gap=4;
	let [fw, fh, wField, hField] = [size / board.info.wdef, size / board.info.hdef, size-gap, size-gap];
	let szCorner = Math.max(wField/4,20);
	let [wBoard, hBoard] = [fw * board.info.w+szCorner, fh * board.info.h+szCorner];

	//area is div element treated as always (flexWrap)
	//container=board is a div (posRel) with svg and g inside =>3 containers!
	//fields,edges,corners are g elements within board g

	// *** stage 1: convert objects into uis ***
	for (const oid in fields) { let el = gG(); agHex(el, wField, hField); gBg(el, '#00000060'); fields[oid].ui = el; }
	for (const oid in edges) { let el = gG(); gFg(el, 'dimgrey', 4); edges[oid].ui = el; }
	for (const oid in corners) { let el = gG(); agCircle(el, szCorner); gBg(el, '#202020'); corners[oid].ui = el; }

	// //TODO: if any cards are present: need to create corresponding mks and link them to oid (because care correspond to objects and resources dont!!!)

	// *** stage 2: prep area div (loc 'table') as flexWrap ***
	let area = stage2_prepArea(loc);

	// *** stage 3: prep container div/svg/g (board) as posRel, size wBoard,hBoard ***
	let container = stage3_prepContainer(area); mColor(container, 'transparent'); //container is appended to area!!!!!!!

	let svgContainer = gSvg();
	let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;border-radius:${gap}px;`;
	svgContainer.setAttribute('style', style);
	container.appendChild(svgContainer);

	let gContainer = gG();
	svgContainer.appendChild(gContainer);

	board.div=container;
	board.svg=svgContainer;
	board.g=gContainer;

	let [wTotal, hTotal] = [wBoard+2*gap,hBoard+2*gap];
	mStyle(container, { width: wTotal, height: hTotal, 'border-radius': gap });
	gContainer.style.transform = "translate(50%, 50%)"; //geht das schon vor append???
	console.log(wTotal, hTotal);

	// *** stage 4: layout! means positioning = transforms... ***
	for(const [id,f] of Object.entries(fields)){
		gContainer.appendChild(f.ui);
		gPos(f.ui,fw*f.info.x,fh*f.info.y);
	}
	for(const [id,f] of Object.entries(edges)){
		agLine(f.ui,f.info.x1*fw,f.info.y1*fw,f.info.x2*fw,f.info.y2*fw);
		gContainer.appendChild(f.ui);
	}
	for(const [id,f] of Object.entries(corners)){
		gContainer.appendChild(f.ui);
		gPos(f.ui,fw*f.info.x,fh*f.info.y);
	}

}







