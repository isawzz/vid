function setTableSize(w, h, unit = 'px') {
	//console.log(w,h);
	setCSSVariable('--hTable', h + unit);
	setCSSVariable('--wTable', w + unit);
	mById('tableTop').style.setProperty('width', w + unit);
}

function rAreas_works() {
	let color = SPEC.color.theme;
	//mById('rsg').style.backgroundColor = 'orange';
	document.body.style.backgroundColor = color;
	let fg = colorIdealText(color)
	document.body.style.color = fg;
	let palette = getPalette(color); let ipal = 2;//palette.length-1;
	let d = document.getElementById('tableTop');
	setTableSize(...SPEC.tableSize);
	// d.style.width = SPEC.tableSize[0] + 'px';
	// d.style.minHeight = SPEC.tableSize[1] + 'px';
	d.style.display = 'grid';
	// d.style.justifyContent = 'center'
	let s = '';
	for (const line of SPEC.layout) {
		s += '"' + line + '" ';
	}
	d.style.gridTemplateAreas = s; //style.gridTemplateAreas = '"z z z" "a b c" "d e f"';
	for (const k in SPEC.areas) {
		let areaName = SPEC.areas[k];
		//console.log(k, areaName)
		let d1 = document.createElement('div');
		d1.id = areaName;
		d1.style.gridArea = k;
		d1.style.backgroundColor = palette[ipal]; ipal = (ipal + 1) % palette.length; if (ipal == 5) ipal += 1;// randomColor();
		d1.innerHTML = areaName;
		d1.classList.add('area');
		UIS[areaName] = { elem: d1, children: [] };
		d.appendChild(d1);
	}
}


function rAreas() {
	let color = SPEC.color.theme;
	//mById('rsg').style.backgroundColor = 'orange';
	document.body.style.backgroundColor = color;
	let fg = colorIdealText(color)
	document.body.style.color = fg;
	let palette = getTransPalette9(); //getPalette(color);//palette.length-1;
	let ipal = 1;
	let d = document.getElementById('tableTop');
	setTableSize(...SPEC.tableSize);
	// d.style.width = SPEC.tableSize[0] + 'px';
	// d.style.minHeight = SPEC.tableSize[1] + 'px';
	d.style.display = 'grid';
	// d.style.justifyContent = 'center'
	let s = '';
	let m = [];
	for (const line of SPEC.layout) {
		s += '"' + line + '" ';
		let letters=line.split(' ');
		let arr=[];
		for(const l of letters){if (!isEmpty(l)) 	arr.push(l);}
		m.push(arr);
	}
	//console.log(m);
	d.style.gridTemplateAreas = s;// eg. '"z z z" "a b c" "d e f"';

	if (SPEC.collapseEmptySmallLetterAreas) { collapseSmallLetterAreas(m, d); }

	for (const k in SPEC.areas) {
		let areaName = SPEC.areas[k];
		//console.log(k, areaName)
		let d1 = document.createElement('div');
		d1.id = areaName;
		d1.style.gridArea = k;
		if (SPEC.shadeAreaBackgrounds) { d1.style.backgroundColor = palette[ipal]; ipal = (ipal + 1) % palette.length; }
		if (SPEC.showAreaNames) { d1.innerHTML = areaName; }
		UIS[areaName] = { elem: d1, children: [] };
		d.appendChild(d1);
	}
}

function collapseSmallLetterAreas(m, d) {
	//how many columns does this grid have?
	let rows = m.length;
	let cols = m[0].length;
	console.log(m);

	let gtc = [];
	for (let c = 0; c < cols; c++) {
		gtc[c] = 'min-content';
		for (let r = 0; r < rows; r++) {
			let sArea = m[r][c];
			//console.log(c, r, m[r], m[r][c]);
			if (sArea == sArea.toUpperCase()) gtc[c] = '1fr';
		}
	}
	let cres = gtc.join(' ');
	//console.log('cols', cres);
	d.style.gridTemplateColumns = gtc.join(' '); //'min-content 1fr 1fr min-content';// 'min-content'.repeat(rows);

	let gtr = [];
	for (let r = 0; r < rows; r++) {
		gtr[r] = 'min-content';
		for (let c = 0; c < cols; c++) {
			let sArea = m[r][c];
			//console.log(r, c, m[r], m[r][c]);
			if (sArea == sArea.toUpperCase()) gtr[r] = '1fr';
		}
	}
	let rres = gtr.join(' ');
	//console.log('rows', rres);
	d.style.gridTemplateRows = gtr.join(' '); //'min-content 1fr 1fr min-content';// 'min-content'.repeat(rows);

	// d.style.gridTemplateRows = '1fr 1fr min-content min-content';// 'min-content'.repeat(cols);

}
