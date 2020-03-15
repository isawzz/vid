function makeVisual2(ms, x, y, w, h, color, shape, { x1, y1, x2, y2 } = {}) {
	let o=d3.select(ms);
	o.append(shape)
}
function makeVisual1(ms, x, y, w, h, color, shape, { x1, y1, x2, y2 } = {}) {
	//console.log('makeVisual', x, y, w, h, color, shape, x1, y1, x2, y2);
	if (shape == 'circle') {
		ms.ellipse({ w: w, h: h }).ellipse({ className: 'overlay', w: w, h: h });
		ms.setPos(x, y);
	} else if (shape == 'hex') {
		ms.hex({ w: w, h: h }).hex({ className: 'overlay', w: w, h: h });
		ms.setPos(x, y);
	} else if (shape == 'quad' || shape == 'rect') {
		ms.rect({ w: w, h: h }).rect({ className: 'overlay', w: w, h: h });
		ms.setPos(x, y);
	} else if (shape == 'triangle') {
		//TODO!!!!
		ms.triangle({ w: w, h: h }).triangle({ className: 'overlay', w: w, h: h });
		ms.setPos(x, y);
	} else if (shape == 'line') {
		let thickness = w;
		let fill = color;
		ms.line({ className: 'ground', x1: x1, y1: y1, x2: x2, y2: y2, fill: fill, thickness: thickness })
			.line({ className: 'overlay', x1: x1, y1: y1, x2: x2, y2: y2, thickness: thickness, });
	} else {
		ms[shape]({ className: 'ground', w: w, h: h });//,fill:color });
		ms[shape]({ className: 'overlay', w: w, h: h });
		ms.setPos(x, y);
	}
	ms.setBg(color, shape != 'line');
	ms.orig.bg = color;
	ms.originalBg = color;
	ms.orig.shape = shape;
	ms.originalSize = { w: w, h: h };
	ms.orig.w = w;
	ms.orig.h = h;
	return ms;
}














