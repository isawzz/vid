//#region FUNCTIONS
var FUNCTIONS={
	instanceof: 'instanceOf',
	obj_type: (o,v)=> o.obj_type == v,
	prop: (o,v)=>isdef(o[v]),
	no_prop: (o,v)=>nundef(o[v]),

}
function evalCond(o,node){
	let qualifies=true;
	//console.log('o',o,'node',node)
	for(const fCond in node.cond){
		let valOf=node.cond[fCond];
		// console.log(fCond,valOf)
		let func=FUNCTIONS[fCond];
		if (isString(func)) func=window[func];
		if (!func) {qualifies=false;break;}
		let val = func(o,node.cond[fCond]);
		//console.log('outcome',fCond,valOf,'is',val);
		if (!val) {qualifies=false;break;}
	}
	return qualifies;

}

function instanceOf(o,className){
	let otype = o.obj_type;
	switch(className){
		case '_player': return otype=='GamePlayer'||otype =='opponent';break;
		case 'building': return otype == 'farm'||otype=='estate'||otype=='chateau'||otype=='settlement'||otype=='city'||otype =='road';break;
	}
}






//#region helpers
function makeDefaultPool(fromData) {
	let data = jsCopy(fromData.table);
	for (const k in fromData.players) {
		data[k] = jsCopy(fromData.players[k]);
	}
	return data;

}
function makePool(node){
	let kpool=node._source?node._source:'augData';
	//console.log(kpool);
	if (nundef(POOLS[kpool])){
		//_source has not been made!
		let pool = POOLS.augData;
		POOLS[kpool]={};
		let node1=SPEC.dynamicSpec[kpool];
		//console.log(node1);
		for(const oid in pool){
			let o=pool[oid];
			//console.log('checking',oid)
			if (!evalCond(o, node1)) continue;
			//console.log('passed', oid);
			POOLS[kpool][oid]=o;
		}
	}
	return POOLS[kpool];
}
//#endregion








