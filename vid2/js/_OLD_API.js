var DELETED_IDS = [];
var DELETED_THIS_ROUND = [];
//#region create MK 
//#region board
function makeBoard(idBoard, o, areaName) {
	let id = 'm_s_' + idBoard;
	if (isdef(UIS[id])) { error('CANNOT create ' + id + ' TWICE!!!!!!!!!'); return; }
	let mk = new MK();
	mk.id = id;
	// let domel = addSvggViewbox(UIS[areaName].elem, id, { originInCenter: true });
	//console.log(areaName)
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
		mk[shape]({ className: 'ground', w: w, h: h });//,fill:color });
		mk[shape]({ className: 'overlay', w: w, h: h });
		mk.setPos(x, y);
	}
	mk.setBg(color, shape != 'line');
	mk.orig.bg = color;
	mk.originalBg = color;
	mk.orig.shape = shape;
	mk.originalSize = { w: w, h: h };
	mk.orig.w = w;
	mk.orig.h = h;
	return mk;
}

//#region von infobox
const IB_PARENT = 'table';
function calcMainVisualPosCenterInGameArea(mk) {
	//let area = UIS[IB_PARENT];

	//mobj parent could be someuser area inside but not fully covering IB_PARENT
	//let parent = UIS[mk.idParent];
	//if this parent does not have coords, look at his parent
	//if (nundef(parent.x)) parent = UIS[parent.idParent];

	let dInfobox = mById(IB_PARENT);
	//dInfobox.style.position = 'absolute';

	let parent = mById(mk.idParent);
	let bParent = getBounds(parent);
	let bIb = getBounds(dInfobox);
	let bMK = getBounds(mk.elem);

	console.log('__________parent', parent, '\ndiv ib', dInfobox);
	console.log('bdsparent', bParent, '\nbds ib', bIb);
	console.log('bds mk', bMK);

	let offX = 0;
	let offY = 0;
	if (mk.cat == 'g') {
		offX = bIb.bParent.width / 2;
		offY = parent.h / 2;
	}
	//if (mk.cat == 'g'){offX=bParent.w/2;offY=parent.h/2;}

	let x = offX + parent.x + mk.x;
	let y = offY + parent.y + mk.y;

	return { x: x, y: y };

}
function destroyInfoboxFor(oid) { let id = makeIdInfobox(oid); if (UIS[id]) deleteRSG(id); }


















