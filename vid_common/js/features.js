//#region CacheDict
//holds a dictionary with key-value pairs,
//dictionary is saved each time accessing a key that has not been found
//three tier access to entries: 
//1. looks in live data, if entry is not found,
//2. looks in localStorage, if entry not found
//3. loads data from server
//usage example: 
//var iconChars = new CacheDict({primaryKey = 'iconChars', accessFunc = })
class CacheDict {
	constructor(key, { func = null} = {}) {
		this.key = key;
		this.func = func;
		this.data = {};
	}

	_localToLive(key,data){this.data = data[0] == '{' || data[0] == '[' ? JSON.parse(data) : isNumber(data) ? Number(data) : data;}
	_serverToLocal(key,data){
		localStorage.setItem(key,JSON.stringify(data));
		this.data = data;
	}
	tryLoadLive(key) { return this.data[key]; }

	tryLoadLocal(key) {
		let res = localStorage.getItem(key);
		if (res) this._localToLive(key,res);
		return res;
	}
	async tryLoadFunc(key){
		if (!func) return null;
		let res = await this.func(key);
		if (res) this._serverToLocal(key,res);
		console.log('loaded from server:',res);
		return res;
	}
	async get(key) {
		return this.tryLoadLive(key) || this.tryLoadLocal(key) || await this.tryLoadFunc(key);
	}

	// load(key) {
	// 	//console.log(key);
	// 	let keys = null; let sKey = key;
	// 	if (isList(key)) { skey = key.shift(); keys = key; }
	// 	let res = this.data[sKey];
	// 	if (res && keys) res = lookup(res, keys);
	// 	if (res) return res;

	// 	// console.log(sKey)
	// 	let sData = localStorage.getItem(sKey);
	// 	// console.log(sData);
	// 	if (sData) {
	// 		//console.log('found',sKey,'in local storage:',sData)
	// 		let data = sData[0] == '{' || sData[0] == '[' ? JSON.parse(sData) : isNumber(sData) ? Number(sData) : sData;
	// 		if (keys) { this.data[sKey] = data; return lookup(data, keys); }
	// 		return data;
	// 	} else {
	// 		return null;
	// 	}
	// }
	// save(key, data) {
	// 	//key MUST be string!
	// 	console.log('saving', key, data)
	// 	this.data[key] = data;
	// 	localStorage.setItem(key, JSON.stringify(data));
	// }
	// reset() { this.data = {}; }
	// resetAll() { localStorage.clear(); this.reset(); }
	// saveComplexObject(keys, o) {
	// 	//for this to work, have to retrieve dict(keys[0]) from localstorage,transform to json,setKeys to o,then store again
	// }
}
//#endregion

//#region LazyCache
class LazyCache {
	constructor(resetStorage = false) {
		this.caches = {};
		if (resetStorage) localStorage.clear();
	}
	async init(primKey, dictOptions, {key,load=false}) {
		let cd = new CacheDict(primKey, dictOptions);
		this.caches[primKey] = cd;
		if (load) return await cd.get(isdef(key)?key:primKey);
	}
	// load(key) {
	// 	//console.log(key);
	// 	let keys = null; let sKey = key;
	// 	if (isList(key)) { skey = key.shift(); keys = key; }
	// 	let res = this.live[sKey];
	// 	if (res && keys) res = lookup(res, keys);
	// 	if (res) return res;

	// 	// console.log(sKey)
	// 	let sData = localStorage.getItem(sKey);
	// 	// console.log(sData);
	// 	if (sData) {
	// 		//console.log('found',sKey,'in local storage:',sData)
	// 		let data = sData[0] == '{' || sData[0] == '[' ? JSON.parse(sData) : isNumber(sData) ? Number(sData) : sData;
	// 		if (keys) { this.live[sKey] = data; return lookup(data, keys); }
	// 		return data;
	// 	} else {
	// 		return null;
	// 	}
	// }
	// save(key, data) {
	// 	//key MUST be string!
	// 	console.log('saving', key, data)
	// 	this.live[key] = data;
	// 	localStorage.setItem(key, JSON.stringify(data));
	// }
	// reset() { this.live = {}; }
	// saveComplexObject(keys, o) {
	// 	//for this to work, have to retrieve dict(keys[0]) from localstorage,transform to json,setKeys to o,then store again
	// }
}
//#endregion



//#region zoom_on_wheel_alt(), zoom_on_resize(), initZoom(), zoom(factor), zoomBy(factor)
var bodyZoom = 1.0;
var browserZoom = Math.round(window.devicePixelRatio * 100);
// function initBodyZoom() {
// 	console.log('initBodyZoom!');
// 	let bz = localStorage.getItem('bodyZoom');
// 	if (bz && bz !== undefined) bz = Number(bz); else bz = 1.0;
// 	if (bz < .2) bz = .2;
// 	return bz;
// }
function initZoom() {
	let bz = localStorage.getItem('bodyZoom');
	console.log('bodyZoom retrieved', bz);
	if (bz) bz = Math.max(Number(bz), .2);
	else bz = 1.0;
	zoom(bz);
}
function zoom_on_resize(referenceDivId) {
	if (!window.onresize) {
		window.onresize = () => {
			console.log('resize!');
			let newBrowserZoom = Math.round(window.devicePixelRatio * 100);
			//let newBrowserZoom=window.outerWidth / window.document.documentElement.clientWidth; //doesn't work!!!
			//console.log('new zoom:',newBrowserZoom, 'browserZoom',browserZoom);
			if (isdef(browserZoom) && browserZoom != newBrowserZoom) { browserZoom = newBrowserZoom; return; }
			//console.log('RESIZE WINDOW!!!!!!!!!!!!');
			//only if browser has not been zoomed!
			if (nundef(browserZoom) || browserZoom == newBrowserZoom) {
				let wNeeded = document.getElementById(referenceDivId).getBoundingClientRect().width;
				let wNeededReally = wNeeded / bodyZoom;
				let wHave = window.innerWidth;
				let zn = wHave / wNeeded;
				let znr = wHave / wNeededReally;
				console.log('wNeeded', wNeeded, 'wNeededReally', wNeededReally, 'wHave', wHave, 'zn', zn, 'znr', znr, 'bodyZoom', bodyZoom)
				//do not zoom if reasonably close!
				if (Math.abs(znr - bodyZoom) > .01) zoom(znr); //wHave/wNeeded);
				//onClickAreaSizes();
			}
			browserZoom = newBrowserZoom;
		};
	}
}
function zoom_on_wheel_alt() {
	console.log('zoom_on_wheel_alt', window.onwheel)
	if (!window.onwheel) {
		console.log('adding ev handler zoom_on_wheel_alt', window.onwheel)
		window.addEventListener("wheel", ev => {
			console.log('wheel!')
			if (!ev.altKey || ev.ctrlKey) return;
			//console.log('@@@WHEEL', ev);
			ev.preventDefault();
			if (ev.deltaY > 0) { zoomOut(); } else if (ev.deltaY < 0) zoomIn();
			//window.scrollTo(0, 0); //geht nicht!!!
		}, { passive: false });
	}
}
function zoom(factor) {
	bodyZoom = factor;
	if (Math.abs(bodyZoom - 1) < .2) bodyZoom = 1;
	document.body.style.transformOrigin = '0% 0%';
	document.body.style.transform = 'scale(' + bodyZoom + ')'; //.5)'; //+(percent/100)+")";
	localStorage.setItem('bodyZoom', bodyZoom);
	console.log('stored new bodyZoom', bodyZoom)
	//console.log('body scaled to',percent+'%')
}
function zoomBy(x) { if (nundef(bodyZoom)) bodyZoom = 1; zoom(bodyZoom * x); }
function zoomIn() { zoomBy(1.5); }
function zoomOut() { zoomBy(.7); }
// 	document.body.style.transformOrigin = '0% 0%';
// 	//console.log('current zoom:',bodyZoom);
// 	if (nundef(bodyZoom)) bodyZoom = 1;
// 	bodyZoom *= 1.5;
// 	stabilizeBodyZoom();
// 	document.body.style.transform = 'scale(' + bodyZoom + ')'; //.5)'; //+(percent/100)+")";
// 	//console.log('bodyZoom',bodyZoom);
// }
// function zoomOut() {
// 	document.body.style.transformOrigin = '0% 0%';
// 	//console.log('current zoom:',bodyZoom);
// 	if (nundef(bodyZoom)) bodyZoom = 1;
// 	bodyZoom /= 1.5;
// 	stabilizeBodyZoom();
// 	document.body.style.transform = 'scale(' + bodyZoom + ')'; //.5)'; //+(percent/100)+")";
// 	//console.log('bodyZoom',bodyZoom);
// }
//#endregion


