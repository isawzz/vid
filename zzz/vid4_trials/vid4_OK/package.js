
function fromPath(path){
	//pat could be 0.buildings.farms (first is oid!)
	//return: value of that path (can be list,object, or literal)
	let parts = path.split('.');
	let oid = path[0];
	let o = serverData.table[oid];
	if (!o) o=serverData.players[oid];
	let props = parts.slice(1);
	let res = lookup(o,props);
	console.log(props,res);
	return res;
}
function matchPath(path){
	//eg. path: Tick.buildings.farms (first is obj_type!)
	//return: list of matching oids (can be [] or [oid1,oid2,...]), ie., oids that provide this path!

}
function toPath(oid,keys){}
function prepPackaging(pool,spec){
	let res = [];
	let placement = spec.placement;
	// for (const (x,y) of placement) {
	// 	console.log(getTypeOf(x),x); //path,loc)
	// }

}
function prepPackaging1(pool, spec) {
	//im ersten vorlauf muss ich table durchgehen und alle objects die in placements vorkommen in 
	//order of placements in eine liste arrangen

	let res = [];
	let placement = spec.placement;
	for (const place of placement) {
		//console.log(place);
		let otype = Object.keys(place)[0];  //eg. Tick
		let loc = place[otype];

		let olist = [];
		//look for corresponding object(s) for this placement!
		for (const oid in pool) {
			let o = pool[oid];
			//o.oid = oid;
			let gsmType = o.obj_type; //only consider type placements! no paths
			if (gsmType == otype) { olist.push({oid:oid}); }
		}
		let vis = spec.visualize[otype];
		if (!vis || isEmpty(olist)) continue; //no visualization means NO presentation for now (sonst: default)
		let rsgType = vis.rsgType;
		let pack = { olist: olist, pool: pool, loc: loc, rsgType: rsgType, params: vis };
		res.push(pack);
	}
	return res;
}

function package(pool, spec) {	
	let res = prepPackaging(pool, spec);	

	//res.map(pack=>pack.olist.map(o=>o.ui=window[pack.rsgType](o,pack)));

	return res;
}


