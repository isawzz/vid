//#region zoom_on_wheel_alt()
var bodyZoom = null;
function zoom_on_wheel_alt() {
	if (!window.onwheel) {
		window.addEventListener("wheel", ev => {
			if (!ev.altKey || ev.ctrlKey) return;
			//console.log('@@@WHEEL', ev);
			ev.preventDefault();
			if (ev.deltaY > 0) { zoomOut(); } else if (ev.deltaY < 0) zoomIn();
			//window.scrollTo(0, 0); //geht nicht!!!
		}, { passive: false });
	}

}
function stabilizeBodyZoom() {
	if (Math.abs(bodyZoom - 1) < .2) bodyZoom = 1;
}
function zoomIn() {
	document.body.style.transformOrigin = '0% 0%';
	if (nundef(bodyZoom)) bodyZoom = 1;
	bodyZoom *= 1.5;
	stabilizeBodyZoom();
	document.body.style.transform = 'scale(' + bodyZoom + ')'; 
}
function zoomOut() {
	document.body.style.transformOrigin = '0% 0%';
	if (nundef(bodyZoom)) bodyZoom = 1;
	bodyZoom /= 1.5;
	stabilizeBodyZoom();
	document.body.style.transform = 'scale(' + bodyZoom + ')'; 
}
//#endregion


