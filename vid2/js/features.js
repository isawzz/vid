class LazyCache {
	constructor(resetStorage = false) {
		this.caches = {};
		if (resetStorage) localStorage.clear(); //*** */
	}
	get(key) { return this.caches[key]; }

	asDict(key) { return this.caches[key].live; }

	getRandom(key) { let d = this.asDict(key); return chooseRandom(Object.values(d)); }
	getRandomKey(key) { return getRandomKey(this.asDict(key)); }
	getFirstKey(key, cond) { return firstCondDictKeys(this.asDict(key), cond); }

	invalidate(...keys) { for (const k of keys) if (this.caches[k]) this.caches[k].invalidate(); }

	async load(primKey, loaderFunc, reload = false, useLocal = true) {
		let cd = new CacheDict(primKey, { func: loaderFunc }, useLocal);
		this.caches[primKey] = cd;
		if (reload) await cd.reload(); else await cd.load();

		let handler = {
			get: function (target, name) { return target.live[name]; },
			set: function (target, name, val) { target.live[name] = val; return true; },
			has: function (target, name) { return name in target.live; },
			delete: function (target, name) { return delete target.live[name]; },
		};
		let proxy = new Proxy(cd, handler);
		return proxy;
	}
}

class CacheDict {
	constructor(primKey, { func = null } = {}, useLocal = true) {
		this.primKey = primKey; //this is key under which object is stored in localStorage/indexedDB
		this.func = func;
		this.live = null;
		this.useLocal = useLocal;
	}
	async load() {
		if (this.live) return this;
		return this._local() || await this._server();
	}
	invalidate() {
		//delete local copy and live
		localStorage.removeItem(this.primKey); //*** */
		this.live = null;
	}
	async reload() { this.invalidate(); return await this.load(); }

	_local() {
		if (!this.useLocal) return null;
		//console.log('....from local', this.primKey);
		let res = localStorage.getItem(this.primKey); //**** */
		if (res) this.live = JSON.parse(res);
		return res;
	}

	async _server() {
		//console.log('....from server', this.primKey);
		if (this.func) {
			this.live = await this.func();
			//console.log('after call: live',this.live)
			if (this.useLocal) localStorage.setItem(this.primKey, JSON.stringify(this.live)); //*** */
		}
		return this.func;
	}

}


//#region zoom_on_resize

var bodyZoom = 1.0;
var browserZoom = Math.round(window.devicePixelRatio * 100);
var justExpand = false;
//var countEvents = 0;
function initZoomToFit() { justExpand = true; zoom_on_resize(...arguments);}
function reset_zoom_on_resize(){
	window.onresize = null;
	bodyZoom = 1.0;
	document.body.style.transform = 'none';
}
function zoom_on_resize() {
	_zoomIfNeeded(arguments);
	if (!window.onresize) {

		window.onresize = () => {
			console.log(bodyZoom)
			if (justExpand && bodyZoom == 1.0) {
				window.onresize = null;
				return;
			}
			//console.log('onresize', countEvents); countEvents += 1;
			let newBrowserZoom = Math.round(window.devicePixelRatio * 100);
			if (isdef(browserZoom) && browserZoom != newBrowserZoom) { browserZoom = newBrowserZoom; return; }

			_zoomIfNeeded(arguments);

			if (nundef(browserZoom)) browserZoom = newBrowserZoom;
		};

	}
}
function _zoomIfNeeded(arr) {
	let wTotalNeeded = 0;
	for (const dName of arr) {
		let n=isNumber(dName)?dName*bodyZoom:getBounds(dName).width;
		wTotalNeeded += n;
		//console.log(dName,n,'=>',wTotalNeeded);
	}
	let wWindow = window.innerWidth;
	let newBodyZoom = (wWindow * bodyZoom / wTotalNeeded).toFixed(2);
	//console.log('w(win)', wWindow * bodyZoom, 'w(need)', wTotalNeeded, 'bz should be', newBodyZoom);
	if (newBodyZoom == bodyZoom || newBodyZoom > 1 && bodyZoom == 1.0) return;
	if (Math.abs(newBodyZoom-1.0)<=.03) {
		newBodyZoom = 1.0; 
		//console.log('JAJAJA');
	}
	bodyZoom = Math.min(1.0, newBodyZoom);
	// console.log('new bodyZoom:', bodyZoom);
	// let d=mById('root');
	// let bd=getBounds(d);
	// console.log('wRoot='+bd.width,'=>',bd.width*bodyZoom,'window=',wWindow,wWindow*bodyZoom);
	document.body.style.transformOrigin = '0% 0%';
	if (bodyZoom == 1.0) document.body.style.transform = 'none'; // 'scale(' + bodyZoom + ')';
	else document.body.style.transform = 'scale(' + bodyZoom + ')';

}

//#endregion


