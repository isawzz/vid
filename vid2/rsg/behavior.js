//UI generation simple
var COND = {};
var FUNCS = {};
function rPresentBehaviors() {
	
	//console.log('________________rBehaviors');
	for (const key of ['table','players']) {
		let pool = serverData[key];
		
		for (const oid in pool) {
			let o = pool[oid];
			//console.log('o',o);

			for (const cond in COND) {
				//console.log('try',cond)
				let todo = COND[cond](o);
				if (isdef(todo)) {
					//console.log('todo',todo,oid)
					FUNCS[todo.f](oid, o);
					DONE[oid]=true;
				}
			}
		}
	}
}





function placement(){
	let plac=SPEC.placement;

	
}






















