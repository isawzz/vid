//UI generation simple
function rBehaviors() {
	//console.log('________________rBehaviors');
	for (const key in serverData) {
		//console.log('im for in serverData', key)
		if (key != 'table' && key != 'players') continue; //TODO actions also!
		let group = serverData[key];
		for (const oid in group) {
			let o = group[oid];
			//console.log('o',o);

			for (const cond in COND) {
				//console.log('try',cond)
				let todo = COND[cond](o);
				if (isdef(todo)) {
					//console.log('todo',todo,oid)
					FUNCS[todo.f](oid, o);
				}
			}
		}
	}
}
