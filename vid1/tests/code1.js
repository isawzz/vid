COND = {
	dummy: (o) => { if (o.someprop == 'x') return { f: 'some_key_in_FUNCS' }; },
	card: (o) => { if (o.generic_type == 'card') return { f: 'card' } }
};

FUNCS = {
	dummy(oid, o) { console.log('dummy', oid, o); },

	card(oid, o) {
		
		let card = makeCard52_test(oid, o, { rank: o.short_name, area: 'zone' });
		for (let i = 0; i < 1; i++) {
			card = makeCard52_test(oid, o, { rank: o.short_name, suit: 'C', area: 'player' });
			card = makeCard52_test(oid, o, { rank: '2', suit: 'S', area: 'hand' });
			card = makeCard52_test(oid, o, { rank: 'T', suit: 'S', area: 'hand' });
			card = makeCard52_test(oid, o, { area: 'hand' });
		}
	}
};

//console.log('code1 loaded hahaha...')


