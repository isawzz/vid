var TABLE_UPDATE = {};
var FUNCS = {};
var PLAYER_UPDATE = {};
var TABLE_CREATE = {};
var PLAYER_CREATE = {};
var V = {};

//UI generation simple
function runBehaviors(oid, pool, behaviors) {
	//console.log('runBehaviors:', oid, pool, behaviors)
	let res = [];
	for (const name in behaviors) {
		let o = pool[oid];
		let todo = behaviors[name](oid, o, G.serverData.phase);
		if (isdef(todo)) {
			let visualsToBeUpdated = isdef(todo.vis) ? todo.vis.map(x => getVisual(x)) : [];
			let updated = FUNCS[todo.f](oid, o, ...visualsToBeUpdated);
			if (updated) res.push(oid);
		}
	}
	return res;
}

var BINDINGS = {}
function runBindings(oid, pool) {
	for (const k in BINDINGS) {
		//console.log(k,BINDINGS[k],oid,pool);
	}
}