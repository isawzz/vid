

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


