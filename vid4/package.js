function prepPackaging(pool, spec) {
	//im ersten vorlauf muss ich table durchgehen und alle objects die in placements vorkommen in 
	//order of placements in eine liste arrangen

	let res = [];
	let placement = spec.placement;
	for (const place of placement) {
		console.log(place);
		let otype = Object.keys(place)[0];
		let loc = place[otype];

		let olist = [];
		//look for corresponding object(s) for this placement!
		for (const oid in pool) {
			let o = pool[oid];
			o.oid = oid;
			let gsmType = o.obj_type; //only consider type placements! no paths
			if (gsmType == otype) { olist.push(o); }
		}
		let vis = spec.visualize[otype];
		if (!vis || isEmpty(olist)) continue; //no visualization means NO presentation for now (sonst: default)
		let rsgType = vis.rsgType;
		let pack = { olist: olist, pool: pool, loc: loc, rsgType: rsgType };
		res.push(pack);
	}
	return res;
}

function package(pool, spec) {	let res = prepPackaging(pool, spec);	return res;}

//#region present
function present(packages) {
	for (const pack of packages) {
		console.log(pack)
		let area = pack.loc;
		let pool = pack.pool;
		let a = window[pack.rsgType];
		console.log('type',pack.rsgType,'a',a)
		//console.log('func',func)
		console.log('area',area)
		for(const o of pack.olist){
			let x=window[pack.rsgType](o,area,pool);
			
		}
		// console.log(area)
		// let datalist = pack.olist;

		// updateSelection(datalist, area)
	}
}

