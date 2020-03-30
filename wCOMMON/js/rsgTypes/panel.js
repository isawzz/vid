const DEF_ORIENTATION = 'rows';
const DEF_SPLIT = 0.5;

function staticArea(areaName, o) {
	//console.log('_______ staticArea', areaName,o)
	let func = o.type;
	switch (func) {
		case 'list': func = 'liste'; break;
		case undefined: func = 'panel'; break;
	}
	//console.log(func,areaName);
	o.ui = window[func](areaName, o);
	//console.log(func, areaName, 'returns', o.ui.id);

	// if (nundef(func)){
	// 	//console.log('type undefined');
	// 	if (o.id) {
	// 		let d=mBy(areaName);
	// 		d.id=o.id;
	// 		mColor(d,randomColor(),'black')
	// 		d.innerHTML = o.id;
	// 	}
	// }else{
	// }
}
function panel(areaName, o) {

	//console.log('________ panel', areaName, o)

	let params = o.params ? o.params : {}; //all defaults here!!!!!
	let panels = o.panels ? o.panels : [];

	let num = panels.length;
	let or = params.orientation ? params.orientation == 'h' ? 'rows'
		: 'columns' : DEF_ORIENTATION;
	let split = params.split ? params.split : DEF_SPLIT;
	let bg = o.color ? o.color : null;
	let fg = bg ? colorIdealText(bg) : null;
	let id = o.id ? o.id : areaName;
	//console.log(num, or, split, bg, fg, id);

	let parent = mBy(areaName);

	if (num == 0) {
		if (id) { 
			parent.id = id; 
			AREAS[id]=o;
			// //console.log('area',id,o)
			parent.innerHTML = id;  
		}
		if (bg) { mColor(parent, bg, fg); }
	} else {
		// tree.children=[];
		parent.style.display = 'inline-grid';
		clearElement(parent);

		if (or == 'rows') {
			parent.style.gridTemplateColumns = `${split}fr ${1 - split}fr`;
		}

		for (let i = 0; i < num; i++) {
			let d = mDiv100(parent);
			d.id = getUID();
			if (panels.length > i) {
				staticArea(d.id, panels[i]);
				// tree.children.push(a);
			}
			//d.innerHTML='wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww';
		}

	}

	return parent;
	o.ui=parent;
	//console.log(areaName,o.ui.id)
}
function liste(areaName, o) {

	//console.log('________ liste', areaName, o);

	let params = o.params ? o.params : {}; //all defaults here!!!!!
	let or = params.orientation ? params.orientation == 'h' ? 'rows'
		: 'columns' : DEF_ORIENTATION;
	let bg = o.color ? o.color : null;
	let fg = bg ? colorIdealText(bg) : null;
	let id = o.id ? o.id : areaName;
	//console.log(or, bg, fg, id);

	let parent = mBy(areaName);

	parent.style.display = 'inline-grid';

	if (id) { 
		parent.id = id; 
		AREAS[id]=o;
		parent.innerHTML = id; 
	}
	if (bg) { mColor(parent, bg, fg); }

	return parent;
	o.ui=parent;
	//console.log(areaName,o.ui.id)
}











//helpers
function setTableSize(areaName, w, h, unit = 'px') {
	//console.log(w,h);
	let d = mBy(areaName);
	mStyle(d, { 'min-width': w, 'min-height': h }, unit);
	// setCSSVariable('--hTable', h + unit);
	// setCSSVariable('--wTable', w + unit);
	//mById('tableTop').style.setProperty('width', w + unit);
}



