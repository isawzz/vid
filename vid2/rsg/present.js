function rPresentDefault() {
	for (const kPool of ['table', 'players']) {
		let pool = serverData[kPool];
		let isTable = kPool == 'table';
		for (const oid in pool) {

			let o = pool[oid];
			let otype = o.obj_type;

			//if no main visual has been created for this oid, try creating one
			let mk = getVisual(oid);
			let mkDefault = getDefaultVisual(oid);
			if (!mk) {
				if ('loc' in o && isBoardElement(o.loc._obj)) mk = makeMainBoardElementVisual(oid, o);
			}
			if (!mk && !mkDefault && SPEC.table.createDefault != false) {
				mkDefault = makeDefaultObject(oid, o, SPEC.table.defaultArea);
				//console.log(mkDefault)
			}

			//if this oid has already been completely processed, it is in DONE and will be skipped here
			if (mkMan.getDone(oid)) continue;

			//update object presentation
			//means show relevant properties as specified in SPEC
			if (mk) {
				if (o.loc) _presentLocationChange(oid, o, mk, isTable);
				//console.log('presenting main!',oid)
				presentMain(oid, o, mk);
			}
			if (mkDefault) {
				presentDefault(oid, o, mkDefault, isTable);

			}


		}
	}

}
function _presentLocationChange(oid, o, mk) {
	if (mk.o.obj_type != 'robber'){
		console.log('loc shouldnt change!!!',oid);
		return;
	}
	let oidLoc = o.loc._obj;
	let visLoc = getVisual(oidLoc);
	mk.setPos(visLoc.x, visLoc.y);
}
function presentMain(oid, o, mk, isTableObject = true) {
	let validKeys = computePresentedKeys(o, isTableObject);
	//console.log(validKeys);

	let color = SPEC.useColorHintForProperties ? getColorHint(o) : mk.fg;
	//console.log(o,color)
	let akku = [];//isField(o)?[''+oid]:[];
	// let bg, fg;
	for (const k of validKeys) {
		let val = o[k];
		if (isSimple(val)) akku.push(val.toString());
	}
	if (!isEmpty(akku)) { mk.multitext({ txt: akku, fill: color }); } else mk.clearText();
}
function computePresentedKeys(o, isTableObject) {
	let optin = isTableObject ? SPEC.table.optin : SPEC.player.optin;
	//console.log(optin)

	if (optin) return intersection(Object.keys(o), optin);

	let optout;
	if (SPEC.useExtendedOptout) {
		let keys = [];
		optout = SPEC.extendedOptout;
		for (const k in o) { if (optout[k]) continue; keys.push(k); }
		return keys;
	}

	optout = isTableObject ? SPEC.table.optout : SPEC.player.optout;
	for (const k in o) { if (optout[k]) continue; keys.push(k); }
	return keys;

}

function presentDefault(oid, o, mk, isTableObject = true) {
	if (isPlain() && !isTableObject && G.player == oid) { mk.hide(); return null; }
	if (isPlain() && !isTableObject) mk.show();

	//filter keys using optin and optout lists
	let optin = isTableObject ? SPEC.table.optin : SPEC.player.optin;
	let optout = isTableObject ? SPEC.table.optout : SPEC.player.optout;

	keys = optout ? arrMinus(getKeys(o), optout) : optin ? optin : getKeys(o);

	let x = mk.tableX(o, keys); //adds or replaces table w/ prop values

	//if (!isPlain() && !isTableObject) { growIfDefaultMainAreaWidth(mk); }

	return x;
}
