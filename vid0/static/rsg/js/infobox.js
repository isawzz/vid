function bringInfoboxToFront(mobj){
	mobj.elem.style.zIndex = maxZIndex;
	maxZIndex += 1;
}
function checkControlKey(ev) {
	//console.log('key released!', ev);
	if (ev.key == 'Control') {
		isControlKeyDown = false;
		clearInfoboxes();
	}
}
function openInfobox(ev, mobj, part) {
	//von mobj hol ich mir oid

	let oid = getOidForMainId(mobj.id);
	if (!oid) return;

	let id = makeIdInfobox(oid);
	let ibox=UIS[id];
	if (ibox) {
		let elem = ibox.elem;
		if (isVisible(elem)){
			//console.log('infobox',ibox.id,'VISIBLE',elem);
			hide(elem);
		}else{
			//console.log('infobox',ibox.id,'NOT visible',elem);
			show(elem);
		}
	} else {
		let msInfobox = makeInfobox(mobj.id, oid, G.table[oid]);
		//von ev hol ich mir pos
		//console.log('pos von mobj',mobj.x,mobj.y,mobj.w,mobj.h)
		//let pos = mobj.calcCenterPos(ev); //mach hier ein posAtCenterOf(msOther)???
		//msInfobox.setPos(pos.x, pos.y);
		let area = UIS['a_d_game'];

		//mobj parent could be someuser area inside but not fully covering a_d_game!
		// //

		// let parentOfMs = UIS[mobj.idParent];
		// let parentX=parentOfMs.x;
		// let parentY = parentOfMs.y;
		// let objX = mobj.x;
		// let objY = mobj.y;
		// let x=parentX+objX;
		// let y=parentY+objY;

		// console.log('idParent:',mobj.idParent)
		// console.log('ccord in a_d_game:',parentX,parentY,objX,objY,x,y)

		// let defX=mobj.x+area.w/2;
		// let defY=mobj.y+area.h/2;
		// console.log('...using:',defX,defY);
		let pos = calcMainVisualPosCenterInGameArea(mobj)
		msInfobox.setPos(pos.x,pos.y); //mobj.x+area.w/2, mobj.y+area.h/2);
	}

}
function calcMainVisualPosCenterInGameArea(mobj){
	let area = UIS['a_d_game'];

	//mobj parent could be someuser area inside but not fully covering a_d_game!
	let parent = UIS[mobj.idParent];
	//if this parent does not have coords, look at his parent
	if (nundef(parent.x)) parent = UIS[parent.idParent];

	let offX=0;
	let offY=0;
	if (mobj.cat == 'g'){offX=parent.w/2;offY=parent.h/2;}

	let x=offX+parent.x+mobj.x;
	let y=offY+parent.y+mobj.y;

	return {x:x,y:y};

}
function hideInfobox(oid) { let id = makeIdInfobox(oid); if (UIS[id]) UIS[id].hide(); }
function destroyInfoboxFor(oid) { let id = makeIdInfobox(oid); if (UIS[id]) deleteRSG(id); }
function clearInfoboxes() {
	let ids = Array.from(getIdsInfobox());
	for (const id of ids) { deleteRSG(id); }
	maxZIndex = 10;
}

// function staticPos(mobj) {
// 	let gameArea = UIS['a_d_game'];
// 	let actionArea = UIS['a_d_actions'];
// 	let pageHeaderArea = UIS['a_d_header'];
// 	let statusArea = UIS['a_d_status'];
// 	let x = actionArea.w + gameArea.w / 2 + mobj.x;
// 	let y = pageHeaderArea.h + statusArea.h + gameArea.h / 2 + mobj.y;
// 	return { x: x, y: y };
// }








