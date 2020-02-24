//#region new MS API
function _setRectDims(r, w, h, dx, dy) {
	r.setAttribute('width', w);
	r.setAttribute('height', h);
	r.setAttribute('x', -w / 2 + dx);
	r.setAttribute('y', -h / 2 + dy);
}
function _setEllipseDims(r, w, h, dx, dy) {
	r.setAttribute('rx', w / 2);
	r.setAttribute('ry', h / 2);
	r.setAttribute('cx', dx); //kann ruhig in unit % sein!!!
	r.setAttribute('cy', dy);

}
function _setLineDims(r, x1, y1, x2, y2) {
	r.setAttribute('x1', x1);
	r.setAttribute('y1', y1);
	r.setAttribute('x2', x2);
	r.setAttribute('y2', y2);
}
function _addShape(mobj, w, h, color, shape, { dx = 0, dy = 0, x1, y1, x2, y2, border, thickness, alpha, n = 6, path, idx, rounding } = {}) {
	//beide
	let r = mobj['_' + shape](); //did not add anything to elem yet!
	//console.log('type of mobj.ground:', getTypeOf(r));
	mobj.shape = shape;
	if (alpha) color = anyColorToStandardString(color, alpha);

	mobj.elem.setAttribute('fill', color);

	if (this.isLine) {
		dx = isdef(dx) ? dx + this.x : this.x;
		dy = isdef(dy) ? dy + this.y : this.y;
	}

	//rect,ellipse,line,polygon,image
	let t = getTypeOf(r);
	if (t == 'rect') { _setRectDims(r, w, h, dx, dy); }
	else if (t == 'ellipse') { _setEllipseDims(r, w, h, dx, dy); }
	else if (t == 'polygon') {
		let pts;
		if (shape == 'hex') { if (h <= 0) { h = (2 * w) / 1.73; } pts = size2hex(w, h, dx, dy); }
		else if (shape == 'triangle') { pts = size2triup(w, h, dx, dy); }
		else if (shape == 'triangleDown') { pts = size2tridown(w, h, dx, dy); }
		else if (shape == 'star') {
			h = h == 0 ? w : h;
			let rad = w / 2;
			let pOuter = getCirclePoints(rad, n);
			let pInner = getCirclePoints(rad / 2, n, 180 / n);
			//console.log(pOuter,pInner)
			let points = [];
			for (let i = 0; i < n; i++) {
				points.push(pOuter[i]);
				points.push(pInner[i]);
			}
			for (let i = 0; i < points.length; i++) {
				points[i].X = (points[i].X + w / 2) / w;
				points[i].Y = (points[i].Y + h / 2) / h;
			}
			pts = polyPointsFrom(w, h, dx, dy, points);

		}
		r.setAttribute('points', pts);
	} else if (t == 'image') { _setRectDims(r, w, h, dx, dy); r.setAttribute('href', path); }
	else if (t == 'line') { _setLineDims(r, x1, y1, x2, y2) }

	if (thickness) {
		r.setAttribute('stroke-width', thickness);
		r.setAttribute('stroke', border ? border : mobj.fg);
	}
	if (rounding){
		r.setAttribute('rx', rounding); // rounding kann ruhig in % sein!
		r.setAttribute('ry', rounding);
	}

	if (isdef(idx) && mobj.elem.childNodes.length > idx) {
		mobj.elem.insertBefore(r, mobj.elem.childNodes[idx]);
	} else {
		mobj.elem.appendChild(r);
	}
	return r;
}
function _makeGroundShape(mobj, x, y, w, h, color, shape, { dx = 0, dy = 0, x1, y1, x2, y2, overlay, scale, scaleX, scaleY, rot, color2, setFg, border, thickness, alpha, idx, rounding } = {}) {

	let r = _addShape(mobj, w, h, color, shape, { dx: dx, dy: dy, x1: x1, y1: y1, x2: x2, y2: y2, border: border, thickness: thickness, alpha: alpha, idx: idx, rounding: rounding })

	//nur ground
	//only ground
	mobj.orig.shape = shape;
	let ov = overlay ? mobj['_' + shape]() : null;
	if (ov) ov.setAttribute('class', 'overlay');

	let t = getTypeOf(r);
	if (ov) {
		if (t == 'rect' || t == 'image') { _setRectDims(ov, w, h, dx, dy); }
		else if (t == 'ellipse') { _setEllipseDims(ov, w, h, dx, dy); }
		else if (t == 'polygon') { let pts = r.getAttribute('points'); ov.setAttribute('points', pts); }
		else if (t == 'line') { _setLineDims(r, x1, y1, x2, y2) }

		if (rounding){
			ov.setAttribute('rx', rounding); // rounding kann ruhig in % sein!
			ov.setAttribute('ry', rounding);
		}
		mobj.elem.appendChild(ov); 
		mobj.overlay = ov; 
	}

	mobj.bg = mobj.orig.bg = color;
	if (setFg || color2) mobj.fg = mobj.orig.fg = color2 ? color2 : colorIdealText(color);

	mobj.orig.w = mobj.w = w;
	mobj.orig.h = mobj.h = h;
	mobj.orig.x = mobj.x = x;
	mobj.orig.y = mobj.y = y;
	if (isdef(scale)) { scaleX = scaleY = scale; }
	mobj.orig.scaleX = mobj.scaleX = scaleX ? scaleX : 1;
	mobj.orig.scaleY = mobj.scaleY = scaleY ? scaleY : 1;
	mobj.orig.scale = mobj.scale = scale ? scale : 1;
	mobj.orig.rot = mobj.rot = rot ? rot : 0;
	if (isdef(scaleX) || isdef(scaleX) || isdef(rot)) mobj._setTransform(mobj.elem, { x: x, y: y, scaleX: scaleX, scaleY: scaleY, rotDeg: rot });
	else mobj.setPos(x, y);

	mobj.ground = r;

	//console.log(mobj.elem);
	return mobj;

}







//#region misc helpers
//#endregion

//#region TODO
function disableClick(el) {
	let mobj = 'mobj' in el ? el.mobj : el;
	mobj.clickHandler = null;
	mobj.disable();
}
function enableClick(el, handler) {
	// //console.log('enableClick_________________start')
	let mobj = 'mobj' in el ? el.mobj : el;
	mobj.clickHandler = handler;
	mobj.enable();
	// //console.log(mobj,el,handler)
	// //console.log('enableClick_________________end')
}
function disableHover(el) {
	let mobj = 'mobj' in el ? el.mobj : el;
	mobj.mouseEnterHandler = null;
	mobj.mouseLeaveHandler = null;
	mobj.disable();
}
function enableHover(el, enterHandler, leaveHandler) {
	// //console.log('enableClick_________________start')
	// //console.log('enterHandler', enterHandler);
	// //console.log('leaveHandler', leaveHandler);
	let mobj = 'mobj' in el ? el.mobj : el;
	mobj.mouseEnterHandler = enterHandler;
	mobj.mouseLeaveHandler = leaveHandler;
	mobj.enable();

	// //console.log(mobj, el);
	// //console.log('enableClick_________________end')
}
function glabels(board, ids, func, { bg, fg, contrastBackground = false, force = true, shrinkFont = false, wrap = false, fz = 20 } = {}) {
	for (const id of ids) {
		let el = board.objects[id];
		let val = func(el);
		glabel(el, val, { bg: bg, fg: fg, contrastBackground: contrastBackground, force: force, shrinkFont: shrinkFont, wrap: wrap, fz: fz });
	}
}
function glabel(el, val, { bg, fg, contrastBackground = false, force = true, shrinkFont = false, wrap = false, fz = 20 } = {}) {
	let mobj = el.mobj;
	if (contrastBackground) {
		unitTestMS('.................fill black!!!');
		mobj.text({ txt: val, force: force, shrinkFont: shrinkFont, wrap: wrap, fz: fz, bg: 'white', fill: 'black' });
	} else {
		mobj.text({ txt: val, force: force, shrinkFont: shrinkFont, wrap: wrap, fz: fz, bg: bg, fill: fg });
	}
}
function updateColors(o) {
	let pal = S.pals[o.iPalette];
	let bg = pal[o.ipal];
	o.setBg(bg);
	if (o.strInfo && o.strInfo.ipals) {
		//hier muss ich aber wissen ob children colors via parent iPalette gesetzt wurden!
		let ipals = o.strInfo.ipals;
		for (const id of o.ids) {

			let o = getVisual(id);
			if (o.isManual) continue;
			let info = o.memInfo;
			if (info && info.isPal) {
				let ipal = ipals[info.memType == 'field' ? 0 : info.memType == 'corner' ? 1 : 2];
				// if (info.memType == 'edge'){
				// 	//console.log('updating edge color!!!',o.id)
				// }
				o.setBg(pal[ipal], false);
			}
		}
	}
}
function areaBlink(id) {
	let area = UIS[id];
	if (area) area.elem.classList.add('blink');
}
function stopBlinking(id) {
	let area = UIS[id];
	if (area) area.elem.classList.remove('blink');
}
//#endregion

//#region try commenting out!!!
function toggleTooltips(b) {
	if (S.settings.tooltips) {
		// deactivateTooltips();
		b.textContent = 'tooltips: OFF';
		S.settings.tooltips = false;
	} else {
		// activateTooltips();
		b.textContent = 'tooltips: ON';
		S.settings.tooltips = true;
	}
}
//#endregion











