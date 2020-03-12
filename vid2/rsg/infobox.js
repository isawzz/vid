var maxZIndex = 110;

var ibox4oid={};


function bringInfoboxToFront(mobj) {
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
function makeRandomElement(){
	let domel=document.createElement('div');
	mStyle(domel,{width:100,height:100,'background-color':'red',position:'fixed',left:0,top:0});
	//domel.innerHTML='hallo';
	//document.body.appendChild(domel);
	//console.log(mBy('table'))
	return domel;
}
function openInfobox(oid,mk) {
	console.log(oid)
	if (nundef(oid)) return;

	//if no mk is given: take first mk that can find! (for now)
	if (nundef(mk)){
		mk=firstCond(oid2ids[oid],x=>UIS[id].idType == 'm');
		console.log(mk);
		console.log(oid2ids[oid]);
	}
	//if none is found, return!
	if (!mk) return;
	//if mk is given, object will be mk.o, so this is exactly what I will present! works for both table and players!
	let id = ibox4oid[oid];
	let ibox=UIS[id];

	if (!ibox){
		//now make one!!! have mk(for pos) and o(for info)
		//makeRandomElement(); //works
		let domel=mDiv(); //makeRandomElement();//ok
		mAppend(mBy('root'),domel);
		domel.style.cursor = 'default';
		domel.style.border = '2px solid dimgray';
		// domel.style.width='1000px';
		// domel.style.height='100px';
		let o={o:mk.o,oid:mk.oid,ui:domel};

		ibox = registerObject(o,'i','root','ibox');
		ibox4oid[oid]=ibox.id;
		console.log(oid,mk,ibox);//////////////////////////////
		// console.log('elem',ibox.elem);//////////////////////////////

		// //additional ui props & interactivity
	
		let sTitle = oid + ': ' + ibox.o.obj_type;
		ibox.title(sTitle);
		ibox.setBg('sienna');
		// console.log('elem',ibox.elem);//////////////////////////////
		//console.log(ibox.o);
		//let trefs=tableElemX(ibox.o);
		//domel.appendChild(trefs.table);
		// for(const k in ibox.o){
		// 	let txt=ibox.o[k];
		// 	let tel=document.createTextNode(txt);
		// 	domel.appendChild(tel);
		// }
		ibox.tableNoAttach(ibox.o);
		//console.log(xx)
		//ibox.tableX(ibox.o);
		ibox.addMouseEnterHandler('title', highlightMsAndRelatives);
		ibox.addMouseLeaveHandler('title', unhighlightMsAndRelatives);
		ibox.addMouseEnterHandler('', () => bringInfoboxToFront(ibox));
		ibox.addClickHandler('', () => mk.hide())
		ibox.refs['table'].map(x => {
			UIS[x].addMouseEnterHandler('title', highlightMsAndRelatives);
			UIS[x].addMouseLeaveHandler('title', unhighlightMsAndRelatives);
		});
		bringInfoboxToFront(ibox);
		
	}
	// //pos ibox acc to mk
	let bmk = getBounds(mk.elem);
	//console.log(bmk);
	let el = ibox.elem;
	//console.log('elem',ibox.elem);//////////////////////////////
	el.style.position = 'fixed';
	el.style.left = (bmk.left + bmk.width / 2) + 'px';
	el.style.top = (bmk.top + bmk.height / 2) + 'px';
	// console.log('elem',ibox.elem);//////////////////////////////

	//---------------------- THE END -------------------------
}
function hideInfobox(oid) { let id = ibox4oid[oid]; if (UIS[id]) UIS[id].hide(); }
function clearInfoboxes() {
	//let ids = Array.from(getIdsInfobox());
	for (const id of Object.values(ibox4oid)) { deleteRSG(id); }
	ibox4oid={};
	maxZIndex = 10;
}









