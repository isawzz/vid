//#region primitives
function pictoLabelDiv(key, label, color = 'blue', sz=50, gap=2, fz) {
	let dOuter = mCreate('div');
	let wOuter = sz;
	let wInner = sz - 2 * gap;

	mStyle(dOuter, {
		width: wOuter,
		padding: 0,
		display: 'inline',
		position: 'absolute',
		'text-align': 'center',
		'background-color': randomColor(),
		// color: 'black',
	});
	let dPic = pictoDiv(key, color, wInner, wInner);
	mAppend(dOuter,dPic)
	mStyle(dPic, { margin: gap, 'margin-bottom': 1 })
	let dText = mAppendText(dOuter, label);
	dText.classList.add('truncate');
	mStyle(dText, { 'margin-bottom': gap, width: wOuter });
	// area=asElem(area);
	// mPosRel(area);
	// mAppend(area, dOuter);
	return dOuter;
}
function pictoDiv(key, color, w, h) { let d = mPic(key); mColor(d, color); mSizePic(d, w, h); return d; }
function labelDiv(label, color, w, h) { 
	let d = mDiv(); 
	let dText = mAppendText(d, label);
	dText.classList.add('truncate');
	dText.classList.add('centerCentered');

	//TODO fuer color nachdunkeln damit text besser lesbar
	//mFg(dText,colorIdealText(color))
	//mMarginAuto(d);
	mColor(d, color); 
	mSize(d, w, h); 
	return d; 
}
//#region items
function picLabelDiv(size) { return o=>pictoLabelDiv(o.key, o.label, o.color, size); }
function picDiv(size) { return o=>pictoDiv(o.key, o.color, size, size); }
function colorLabelDiv(size) { return o=>labelDiv(o.label, o.color, size, size); }
function getUis(olist, func) { return olist.map(o => func(o)); }

//#region layouts
function layoutRow(uis, area, size, gap) {
	if (isEmpty(uis)) return [0,0];
	let x = y = gap;
	uis.map(d => {
		mAppend(area, d);
		mPos(d, x, y);

		x += size + gap;
	});
	let h=getBounds(uis[0]).height; //getBounds kann erst NACH appendChild benuetzt werden!!!!!!!!!!!!!!!!!!!
	//console.log('h',h)
	return [x,y+h+gap]; //x is total width for layout
}

//#RSG types main functions
function colorLabelRow(olist,area,size,gap){
	
}



//#region older code not separating ui creation and layout!
function showPictoDivCentered(key, area, color = 'blue', sz = 50) { 
	let d = pictoDiv(key, color, sz, sz); 
	mAppend(area,d);
	posCIC(d); 
	return d;
}
function showPictoDiv(key, area, color = 'blue', x = 0, y = 0, w = 50, h = 0) { 
	let d = pictoDiv(key, color, w, h ? h : w); 
	mAppend(area, d); 
	mPos(d, x, y); 
	return d; 
}
function addPictoDiv(key, area, color = 'blue', w = 50, h = 0) {
	let d = pictoDiv(key, color, w, h ? h : w);
	mAppend(area, d);
	return d;
}
function showPicLabel(key, label, area, color = 'blue', x = 0, y = 0, sz = 50, gap = 4) {
	console.log(key, label, area, color, x, y, sz, gap)
	let dOuter = mCreate('div');
	let wOuter = sz;
	let wInner = sz - 2 * gap;

	mStyle(dOuter, {
		color: 'black',
		width: wOuter,
		left: x,
		top: y,
		padding: 0,
		position: 'absolute',
		'text-align': 'center',
		'background-color': randomColor(),
		display: 'inline'
	});
	let dPic = addPictoDiv(key, dOuter, color, wInner);
	mStyle(dPic, { margin: gap, 'margin-bottom': 1 })
	let dText = mAppendText(dOuter, label);
	dText.classList.add('truncate');
	mStyle(dText, { 'margin-bottom': gap, width: wOuter });
	area=asElem(area);
	mPosRel(area);
	mAppend(area, dOuter);
}
function showPicLabelCentered(key, label, area, color = 'blue', sz = 50, gap = 4) {
	let d=showPicLabel(key,label,area,color,0,0,sz,gap);
}
//#endregion older code not separating ui creation and layout!




















