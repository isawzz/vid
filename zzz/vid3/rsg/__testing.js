//#region modify serverData (stubs)
function modifyServerData() {
	let pl = serverData.players[GAMEPLID];
	let o = GAME == 'catan' ? pl.devcards : pl.hand;
	if (!o) {
		for (const plid in serverData.players) {
			serverData.players[plid].hand = { _set: [] };
		}
		o = pl.hand;
	}
	let cards = getElements(o);
	if (cards.length > 5) resetPlayerCards(); else addCardsToPlayers();

	let opt = serverData.options;
	if (opt) {
		let keys = Object.keys(opt);
		let firstKey = keys[0];
		let actions = opt[firstKey].actions._set[0]._tuple[0]._set;
		if (actions.length > 50) removedActions = actions.splice(0, 8);
		else if (actions.length > 33) removedActions = removedActions.concat(actions.splice(0, 30));
		else removedActions.map(x => actions.push(x));
		//console.log(actions);

	}


}
function restoreServerData(){
	resetPlayerCards();
	let opt = serverData.options;
	if (opt) {
		let keys = Object.keys(opt);
		let firstKey = keys[0];
		let actions = opt[firstKey].actions._set[0]._tuple[0]._set;
		removedActions.map(x => actions.push(x));
		removedActions=[];
	}

}

function addCardsToPlayers(n = 1) {
	// if (GAME != 'catan') return;
	for (const plid in serverData.players) {
		let res = [];
		for (let i = 0; i < n; i++) {
			let card = {
				id: getUID(),
				short_name: 'K',
				obj_type: 'card',
				// visible: { _set: [{ _player: Player1 }] },
				// name: 'King',
				generic_type: 'card'
			};
			res.push({ _obj: card.id });
			serverData.table[card.id] = card;
		}
		let pl = serverData.players[plid];
		res = GAME == 'catan' ? pl.devcards._set.concat(res) : pl.hand._set.concat(res);

		if (GAME == 'catan') pl.devcards = { _set: res }; else pl.hand = { _set: res };
	}


}
function addCardsToMainPlayer(n = 1) {
	if (GAME != 'catan') return;
	for (const plid in serverData.players) {
		let res = [];
		for (let i = 0; i < n; i++) {
			let card = {
				id: getUID(),
				short_name: 'K',
				obj_type: 'card',
				// visible: { _set: [{ _player: Player1 }] },
				// name: 'King',
				generic_type: 'card'
			};
			res.push({ _obj: card.id });
			serverData.table[card.id] = card;
		}
		let pl = serverData.players[plid];
		res = GAME == 'catan' ? pl.devcards._set.concat(res) : pl.hand._set.concat(res);

		if (GAME == 'catan') pl.devcards = { _set: res }; else pl.hand = { _set: res };
		break;
	}


}
function resetPlayerCards() {
	for (const plid in serverData.players) {
		let pl = serverData.players[plid];
		if (GAME == 'catan') pl.devcards = { _set: [] }; else pl.hand = { _set: [] };
	}
}
