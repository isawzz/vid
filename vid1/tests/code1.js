COND = {
	board_setup: (o) => { if (o.map && o.fields) return { f: 'board_setup' }; },
};

FUNCS = {
	board_setup(oid, o) {
		console.log('board_setup', oid, o);
		showBoard(oid, o, 'hex', 'board');
	},
};

console.log('code1 loaded hahaha...')


