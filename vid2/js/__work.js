
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

	let size = 200;//FIELD_SZ;
	let [w, h, gap] = [size, size, 4];

	//hab hiermit board,fields,corners,edges dicts

	//container is a svg element
	//board is a g element
	//fields,edges,corners are g elements within board g
	let fw = size / board.info.wdef;
	let fh = size / board.info.hdef;

	let uis=[];

	//board should be a g element of size wBoard=fw*board.info.w,...
	let uiBoard = gG(); //document.createElementNS('http://www.w3.org/2000/svg', 'g');
	uiBoard.style.transform = "translate(50%, 50%)";
	agRect(uiBoard,fw*board.info.w,fh*board.info.h);
	gBg(uiBoard,'blue');
	console.log(uiBoard)

	uis.push(uiBoard);

	//fields
	for(const oid in fields){
		let el = gG(); 
		console.log(el);

		agHex(el,size,size);
		gBg(el,'grey');
		fields[oid].el=el;
		uis.push(el);
	}
	//makeVisual(o, o.memInfo.x * fw, o.memInfo.y * fh, board.structInfo.wdef * fw - gap, board.structInfo.hdef * fh - gap, fieldColor, o.memInfo.shape);
	console.log(uis);


	//every x,y,w,h in field.info has to be multiplied by ff to yield correct center,width,height of polys
	//add 

	// *** stage 1: convert objects into uis ***
	// let olist = mapOMap(omap.fields, pool); //fields only for now
	// //console.log(olist)
	// if (isEmpty(olist)) return null;
	// let uis = getUis(olist, hexhex(w, h));

	// //TODO: if any cards are present: need to create corresponding mks and link them to oid (because care correspond to objects and resources dont!!!)

	let area = stage2_prepArea(loc);

	let container = stage3_prepContainer(area); mColor(container,'red')
	let gContainer = gSvg();
	let style = 'margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;background-color:yellow';
	gContainer.setAttribute('style', style);
	container.appendChild(gContainer);

	//stage4_layout(uis, gContainer, w, h, gap, layoutHand);
	let [wTotal, hTotal] = [board.info.w*fw,board.info.h*fh];// layoutInfo(uis, gContainer, w, h, gap);
	mStyle(container, { width: wTotal, height: hTotal, 'border-radius': gap });
	console.log(wTotal,hTotal);

	

}
function layoutInfo(extuis, area, w,h, gap) {
	if (isEmpty(extuis)) return [0,0];
	for(const m of extuis){
		
	}
	let x = y = gap;
	let overlap = .25*w;
	uis.map(d => {
		mAppend(area, d);
		mPos(d, x, y);
		x += overlap;
	});
	//let h=getBounds(uis[0]).height; //getBounds kann erst NACH appendChild benuetzt werden!!!!!!!!!!!!!!!!!!!
	//console.log('h',h)
	return [x+w,y+h+gap]; //x is total width for layout
}







