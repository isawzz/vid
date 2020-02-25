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
			// enumerate: function (target) { return Symbol.iterator(target.live);},//.iterator(); }, //[Symbol.iterator]();},
			// // 	var props = [];
			// // 	for (name in target.live) { props.push(name); };
			// // 	return props;
			// // },
			// iterate: function () {
			// 	var props = target.enumerate(), i = 0;
			// 	return {
			// 		next: function () {
			// 			if (i === props.length) throw StopIteration;
			// 			return props[i++];
			// 		}
			// 	}
			// },
			// keys: function (target) { return Object.keys(target.live); },
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

	//#region NOT IMPLEMENTED!!!
	// //lazy load for objects only saved at client
	// getLocal(k) { return this.live[k] || this._local() && this.get(k); }
	// //async access: lazy load
	// async aget(k) { if (this.live || this._local() || await this._server()) return this.live[k]; }
	//#endregion 

}


//#region zoom_on_wheel_alt(), zoom_on_resize(), initZoom(), zoom(factor), zoomBy(factor)
var bodyZoom = 1.0;
var browserZoom = Math.round(window.devicePixelRatio * 100);
// function initBodyZoom() {
// 	//console.log('initBodyZoom!');
// 	let bz = localStorage.getItem('bodyZoom');
// 	if (bz && bz !== undefined) bz = Number(bz); else bz = 1.0;
// 	if (bz < .2) bz = .2;
// 	return bz;
// }
function initZoom() {
	let bz = localStorage.getItem('bodyZoom');
	//console.log('bodyZoom retrieved', bz);
	if (bz) bz = Math.max(Number(bz), .2);
	else bz = 1.0;
	zoom(bz);
}
function zoom_on_resize(referenceDivId) {
	if (!window.onresize) {
		window.onresize = () => {
			//console.log('resize!');
			let newBrowserZoom = Math.round(window.devicePixelRatio * 100);
			//let newBrowserZoom=window.outerWidth / window.document.documentElement.clientWidth; //doesn't work!!!
			////console.log('new zoom:',newBrowserZoom, 'browserZoom',browserZoom);
			if (isdef(browserZoom) && browserZoom != newBrowserZoom) { browserZoom = newBrowserZoom; return; }
			////console.log('RESIZE WINDOW!!!!!!!!!!!!');
			//only if browser has not been zoomed!
			if (nundef(browserZoom) || browserZoom == newBrowserZoom) {
				let wNeeded = document.getElementById(referenceDivId).getBoundingClientRect().width;
				let wNeededReally = wNeeded / bodyZoom;
				let wHave = window.innerWidth;
				let zn = wHave / wNeeded;
				let znr = wHave / wNeededReally;
				//console.log('wNeeded', wNeeded, 'wNeededReally', wNeededReally, 'wHave', wHave, 'zn', zn, 'znr', znr, 'bodyZoom', bodyZoom)
				//do not zoom if reasonably close!
				if (Math.abs(znr - bodyZoom) > .01) zoom(znr); //wHave/wNeeded);
				//onClickAreaSizes();
			}
			browserZoom = newBrowserZoom;
		};
	}
}
function zoom_on_wheel_alt() {
	//console.log('zoom_on_wheel_alt', window.onwheel)
	if (!window.onwheel) {
		//console.log('adding ev handler zoom_on_wheel_alt', window.onwheel)
		window.addEventListener("wheel", ev => {
			//console.log('wheel!')
			if (!ev.altKey || ev.ctrlKey) return;
			////console.log('@@@WHEEL', ev);
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
	//console.log('stored new bodyZoom', bodyZoom)
	////console.log('body scaled to',percent+'%')
}
function zoomBy(x) { if (nundef(bodyZoom)) bodyZoom = 1; zoom(bodyZoom * x); }
function zoomIn() { zoomBy(1.5); }
function zoomOut() { zoomBy(.7); }
// 	document.body.style.transformOrigin = '0% 0%';
// 	////console.log('current zoom:',bodyZoom);
// 	if (nundef(bodyZoom)) bodyZoom = 1;
// 	bodyZoom *= 1.5;
// 	stabilizeBodyZoom();
// 	document.body.style.transform = 'scale(' + bodyZoom + ')'; //.5)'; //+(percent/100)+")";
// 	////console.log('bodyZoom',bodyZoom);
// }
// function zoomOut() {
// 	document.body.style.transformOrigin = '0% 0%';
// 	////console.log('current zoom:',bodyZoom);
// 	if (nundef(bodyZoom)) bodyZoom = 1;
// 	bodyZoom /= 1.5;
// 	stabilizeBodyZoom();
// 	document.body.style.transform = 'scale(' + bodyZoom + ')'; //.5)'; //+(percent/100)+")";
// 	////console.log('bodyZoom',bodyZoom);
// }
//#endregion


