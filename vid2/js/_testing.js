var testCounter = 100;
function runTest() {
}


//#region testing
function getOlist() {
	let keyList = ['female', 'male', 'spy', 'frog', 'fairy'];
	let olist = [];
	for (const k of keyList) {
		olist.push({ key: k, label: k, color: randomColor() });
	}
	return olist;
}
function stressTest01(area) {
	timit.showTime('*test')
	let n = 500;
	for (let index = 0; index < n; index++) {
		showPictoDivCentered('crow', area, randomColor(), n + 25 - index); //ok
	}
	timit.showTime('*test done...');
	if (testCounter > 0) { testCounter -= 1; setTimeout(_startStep, 0); }
	else {
		let t = timit.getTotalTimeElapsed();
		console.log('avg msecs per cycle:', t / 100, 'cycle size:', n)
	}
}
function layRow(olist, area, size = 50, gap = 4) {
	let res = [];
	let w = size, x = gap;
	olist.map(o => {
		let d = showPictoDiv(o.key, area, o.color, x, gap, w);
		res.push(d);
		x += w + gap;
	});
	return res;
}

//#region keine ahnung ob das frueher war
function test98(){
	let area = mBy(table);
	
}
function test99(){
	console.log('ah');

	let area = mBy('board'); mPosRel(area);
	let olist = getOlist();

	//showPictoDivCentered('crow', area, 'red', 100); //ok
	//showPictoDivCentered('crow', area); //ok
	//stressTest01(area); //ok

	//let w = 50, x = gap = 4; olist.map(o => { showPictoDiv(o.key, area, randomColor(), x, gap, w); x += w + gap; }); //ok

	//let uis = layRow(olist, area, 50, 4); 	console.log(uis); //ok aber need to separate layout from ui generation

	//let uis = getUis(olist, picDiv50);	let [w,h] = layoutRow(uis,area,50,50,10);	console.log('dims of row layout',w,h); //ok

	//was passiert wenn layout change?
	//nimmt er automatisch die divs von einem platz weg in den anderen platz? JA, GEHT!!!!
	let size=50,gap=10;

	//picDiv test: OK!!!
	// test fuer colorPicRow
	// let uis = getUis(olist, picDiv(size));
	// let container = mDivPosAbs(100,100,area);
	// let [w,h] = layoutRow(uis,container,size,size,gap);
	// mStyle(container,{width:w,height:h,'background-color':'white','border-radius':gap});
	// layoutRow(uis,area,size,size,gap);

	//picLabelDiv test: (picLabelRow)
	// let uis = getUis(olist, picLabelDiv(size));
	// let container = mDivPosAbs(100,100,area);
	// let [w,h] = layoutRow(uis,container,size,size,gap);
	// mStyle(container,{width:w,height:h,'background-color':'white','border-radius':gap});

	//colorLabelDiv test: (picLabelRow)
	let uis = getUis(olist, colorLabelDiv(size));
	let container = mDivPosAbs(100,100,area);
	let [w,h] = layoutRow(uis,container,size,size,gap);
	mStyle(container,{width:w,height:h,'background-color':'white','border-radius':gap});

	//composite function tests: RSG types
	colorLabelRow(o)




}













