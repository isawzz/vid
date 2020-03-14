//#region log
function logRenew() { for (const d of LOGDIVS) { makeSimpleString(d); } }
function logAddLine(div) { LOGDIVS.push(div); }
function logUpdateVisibility(plid, players) { for (const pl in players) { if (pl != plid) hideLog(pl); else showLog(pl); } }
function logGetDiv(plid) {
	let d = LOG[plid];
	if (!d) {
		let idParent = 'logDiv';
		let id = idParent + '_' + plid;
		//console.log(id)
		d = mDiv(mBy(idParent));
		mStyle(d, { position: 'relative', left: 0, top: 0, width: 100, height: 100 }, '%');
		d.id = id;
		LOG[plid] = d;
	}
	d.style.maxHeight = getBounds('areaTable').height+'px';
	return d;
}
function logClearAll() { LOG = {}; clearElement('logDiv'); LOGDIVS = []; }
//helpers...................
function hideLog(pl) { let d = LOG[pl]; if (d) hide(d); }
function showLog(pl) { let d = LOG[pl]; if (d) show(d); }
function makeSimpleString(d) {
	show(d);
	let html = '';
	for (const node of d.childNodes) { if (isdef(node.innerHTML)) html += node.innerHTML; else html += node.nodeValue; }
	d.innerHTML = html;
}


//#endregion log


