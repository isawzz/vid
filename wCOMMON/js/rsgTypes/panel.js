const DEF_ORIENTATION = 'rows';
const DEF_SPLIT = 0.5;

function staticArea(areaName, o) {
	//console.log('_______ staticArea', areaName,o)
	let func = o.type;
	switch (func) {
		case 'list': func = 'liste'; break;
		case 'dict': func = 'dicti'; break;
		case undefined: func = 'panel'; break;
	}
	//console.log(func,areaName);
	o.ui = window[func](areaName, o);
}

//#region dynamic spec helpers
function mergeSpecNodes(o){
	let merged = {};
	//console.log('------------',o.RSG);
	let interpool=null;
	for (const nodeId in o.RSG) {
		let node = jsCopy(dynSpec[nodeId]);
		let pool = node.pool;
		if (pool) {
			if (!interpool) interpool=pool;
			else interpool = intersection(interpool,pool);
		}
		//console.log('node',node)
		merged = deepmerge(merged, node);
	}
	merged.pool = interpool;
	//console.log('pool:',interpool)
	return merged;
}
function getDynId(loc,oid){return loc+'@'+oid;}
function prepParentForChildren(loc,numChildren){
	let parent=mBy(loc);
	clearElement(loc);
	parent.style.display='inline-grid';
	let uiNode = AREAS[loc];
	if (!uiNode.type) uiNode.type='panel';
	if (!uiNode.params) uiNode.params ={split:'equal'};
	uiNode.params.num=numChildren;

	if (!uiNode.panels) uiNode.panels=[];
}
function addPanel(areaName,oid){
	//mach so einen spec node
	let id=getDynId(areaName,oid);

	let color=randomColor();
	let parent = mBy(areaName);
	let ui=mDiv100(parent);ui.id=id;mColor(ui,color);
	let n={type:'panel',id:id,color:color,ui:ui};
	AREAS[areaName].panels.push(n);
	addAREA(id,n);
}
function dynamicArea(areaName,oSpec,oid,o){
	//console.log('_______ staticArea', areaName,o)
	let func = oSpec.type;
	switch (func) {
		case 'list': func = 'liste'; break;
		case 'dict': func = 'dicti'; break;
		case undefined: func = 'panel'; break;
	}
	//console.log(func,areaName);
	oSpec.ui = window[func](areaName, oSpec, oid, o);
}


//#region layout functions TODO: code cleanup!
function panel(areaName, oSpec, oid, o) {

	//console.log('________ panel', areaName, o)

	let params = oSpec.params ? oSpec.params : {}; //all defaults here!!!!!
	let panels = oSpec.panels ? oSpec.panels : [];

	let num = panels.length;
	let or = params.orientation ? params.orientation == 'h' ? 'rows'
		: 'columns' : DEF_ORIENTATION;
	let split = params.split ? params.split : DEF_SPLIT;
	let bg = oSpec.color ? oSpec.color : randomColor();
	let fg = bg ? colorIdealText(bg) : null;
	let id = oSpec.id ? oSpec.id : areaName;
	if (oid) {
		id+='@'+oid;
		//console.log('dynamic!',id);
	}
	//console.log(num, or, split, bg, fg, id);

	let parent = mBy(areaName);
	//console.log(areaName,parent)

	if (num == 0) {
		if (id) { 
			parent.id = id; 
			addAREA(id,oSpec); //AREAS[id]=o;
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
				if (oid) dynamicArea(d.id,panels[i],oid,o); else staticArea(d.id, panels[i]);
				// tree.children.push(a);
			}
			//d.innerHTML='wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww';
		}

	}

	return parent;
	//oSpec.ui=parent;
	//console.log(areaName,o.ui.id)
}
function liste(areaName, oSpec, oid, o) {

	//console.log('________ liste', areaName, o);

	let params = oSpec.params ? oSpec.params : {}; //all defaults here!!!!!
	let or = params.orientation ? params.orientation == 'h' ? 'rows'
		: 'columns' : DEF_ORIENTATION;
	let bg = oSpec.color ? oSpec.color : randomColor();
	let fg = bg ? colorIdealText(bg) : null;
	let id = oSpec.id ? oSpec.id : areaName;
	if (oid) {
		id+='@'+oid;
		//console.log('dynamic!',id);
	}
	//console.log(or, bg, fg, id);

	let parent = mBy(areaName);

	parent.style.display = 'inline-grid';

	if (id) { 
		parent.id = id; 
		addAREA(id,oSpec); //AREAS[id]=o;
		parent.innerHTML = id; 
	}
	if (bg) { mColor(parent, bg, fg); }

	return parent;
	//oSpec.ui=parent;
	//console.log(areaName,o.ui.id)
}
function dicti(areaName, oSpec, oid, o) {

	//console.log('________ liste', areaName, o);

	let params = oSpec.params ? oSpec.params : {}; //all defaults here!!!!!
	let or = params.orientation ? params.orientation == 'h' ? 'rows'
		: 'columns' : DEF_ORIENTATION;
	let bg = oSpec.color ? oSpec.color : null;
	let fg = bg ? colorIdealText(bg) : null;
	let id = oSpec.id ? oSpec.id : areaName;
	if (oid) {
		id+='@'+oid;
		//console.log('dynamic!',id);
	}
	//console.log(or, bg, fg, id);

	let parent = mBy(areaName);

	parent.style.display = 'inline-grid';

	if (id) { 
		parent.id = id; 
		addAREA(id,oSpec); //AREAS[id]=o;
		parent.innerHTML = id; 
	}
	if (bg) { mColor(parent, bg, fg); }

	return parent;
	//oSpec.ui=parent;
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



