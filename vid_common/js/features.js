//#region zoom_on_wheel_alt()
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
	console.log('zoom_on_wheel_alt',window.onwheel)
	if (!window.onwheel) {
		console.log('adding ev handler zoom_on_wheel_alt',window.onwheel)
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


