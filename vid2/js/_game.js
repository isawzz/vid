var LOG = {};
var LOGDIVS = [];

//#region log
function logRenew() {
	for (const d of LOGDIVS) {
		makeSimpleString(d);
	}
}
function logAddLine(div) { LOGDIVS.push(div); }
function logUpdateVisibility(plid, players) {
	for (const pl in players) { if (pl != plid) hideLog(pl); else showLog(pl); }

}
function logGetDiv(plid) {
	let d = LOG[plid];

	if (!d) {
		let idParent = 'logDiv';
		let id = idParent + '_' + plid;
		let el = document.createElement('div');
		el.style.position = 'relative';
		el.style.left = '0px';
		el.style.top = '0px';
		el.style.width = '100%';
		el.style.height = '100%';
		//el.style.setProperty('overflow-y','scroll');//overflow = 'auto';
		el.id = id;
		mAppend(idParent, el);
		d = el;
		LOG[plid] = d;
	}
	return d;
}
function logClearAll(){
	LOG = {};
	clearElement('logDiv');
	LOGDIVS = [];
}

function hideLog(pl) { let d = LOG[pl]; if (d) hide(d); }
function showLog(pl) { let d = LOG[pl]; if (d) show(d); }
function makeSimpleString(d) {
	show(d);
	// for(const ch of arrChildren(d)){
	// 	console.log(ch,typeof(ch),ch.innerHTML);
	// }
	// console.log(d.childNodes);
	let html = '';
	for (const node of d.childNodes) {
		if (isdef(node.innerHTML)) html += node.innerHTML; else html += node.nodeValue;
		//console.log(typeof(node),node,node.innerHTML)
	}
	console.log(html)
	d.innerHTML = html;
	// console.log(d.innerHTML);
	// let s = d.innerHTML;
	// //<div class="hallo">White</div> builds a <div class="hallo">settlement[148]</div> (gaining 1 victory point)
	// s.replace('<div class="hallo">',' ');
	// s.replace('</div>',' ');
	// d.innerHTML = 'hallo';
	// <div class="hallo" style="">Red</div>
}


//#endregion log









