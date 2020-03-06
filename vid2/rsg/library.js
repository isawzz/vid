

function pictoDiv(key, color, w, h) { let d = mPic(key); mColor(d, color); mSizePic(d, w, h); return d; }
function showPictoDivCentered(key, area, color = 'blue', sz = 50) { let d = pictoDiv(key, color, sz, sz); posCIC(d); return mAppPos(area, d); }
function showPictoDiv(key, area, color = 'blue', x = 0, y = 0, w = 50, h = 0) { let d = pictoDiv(key, color, w, h ? h : w); mAppPos(area, d); mPos(x, y); return d; }
function addPictoDiv(key, area, color = 'blue', w = 50, h = 0) {
	let d = pictoDiv(key, color, w, h ? h : w);
	mAppend(area, d);
	return d;
}

function showPicLabel(key, label, area, color = 'blue', x = 0, y = 0, sz = 50, gap=4) {
	let dOuter = mCreate('div');

	mStyle(dOuter, {
		color:'black',
		width:sz+'px',
		padding:gap,
		position:'absolute',
		left:x,
		top:y,
		'text-align': 'center',
		'background-color':'yellow',
		display:'inline' });
	let dPic = addPictoDiv(key, dOuter, color, sz-2*gap);
	//mStyle(dPic,{margin:'auto'})
	let dText = mAppendText(dOuter,label);
	mAppend(area,dOuter);
}

function picLabelList(olist,area){
	//mach ein div
	let dList=mCreate('div');
	
	//fuelle es mit lauter pic labels, horizontally
	let sz=50;
	let x=0;
	let y=0;
	for(const o of olist){
		let key=o.key; if (nundef(key)) key='crow';
		let label=o.name; if (nundef(label)) label=key;
		let color = o.color; if (nundef(label)) color=randomColor();
		showPicLabel(key,label,dList,color,x,y,sz);
		x+=sz;
	}
	//add it to area
	mAppend(area,dList);
}




















