function setTableSize(w,h,unit='px'){
	console.log(w,h);
	setCSSVariable('--hTable',h+unit);
	mById('tableTop').style.setProperty('width',w+unit);
}

function rAreas() {
	let d = document.getElementById('tableTop');
	setTableSize(...SPEC.tableSize);
	// d.style.width = SPEC.tableSize[0] + 'px';
	// d.style.minHeight = SPEC.tableSize[1] + 'px';
	d.style.display = 'grid';
	// d.style.justifyContent = 'center'
	let s='';
	for(const line of SPEC.layout){
		s+='"'+line+'" ';
	}
	d.style.gridTemplateAreas = s; //style.gridTemplateAreas = '"z z z" "a b c" "d e f"';
	for (const k in SPEC.areas) {
		let areaName = SPEC.areas[k];
		//console.log(k, areaName)
		let d1 = document.createElement('div');
		d1.id = areaName;
		d1.style.gridArea = k;
		d1.style.backgroundColor = randomColor();
		d1.innerHTML = areaName;
		d1.classList.add('area');
		UIS[areaName]={elem:d1,children:[]};
		d.appendChild(d1);
	}
}
