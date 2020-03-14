function rPresentDefault() {
	for (const kPool of ['table', 'players']) {
		let pool = serverData[kPool];
		let isTable = kPool == 'table';
		for (const oid in pool) {

			let o = pool[oid];
			let otype = o.obj_type;

			//if no main visual has been created for this oid, try creating one
			let mk = getVisual(oid); //^^^NEW!
			let mkDefault = getDefaultVisual(oid);
			if (!mk) {
				// if ('loc' in o && isBoardElement(o.loc._obj) &&  SPEC.useLocPropertyForPlacement) mk = makeMainBoardElementVisual(oid, o);
				if ('loc' in o &&  SPEC.useLocPropertyForPlacement) mk = makeMainBoardElementVisual(oid, o);
			}
			if (!mk && !mkDefault && SPEC.table && SPEC.table.createDefault != false) {
				let loc =SPEC[kPool] && SPEC[kPool].defaultArea?SPEC[kPool].defaultArea:'a_d_objects';
				mkDefault = makeDefaultObject(oid, o, loc );
				//console.log(mkDefault)
			}

			//if this oid has already been completely processed, it is in DONE and will be skipped here
			if (mkMan.getDone(oid)) continue;

			//update object presentation
			//means show relevant properties as specified in SPEC
			if (mk) {
				if (o.loc && SPEC.useLocPropertyForPlacement) _presentLocationChange(oid, o, mk, isTable);
				//console.log(route_counter,'_______________presenting main!',oid,mk)
				if (otype in mappingTypes && SPEC.ignoreStructureTypesInPresentation) continue;
				//console.log(otype,otype in mappingTypes, SPEC.ignoreStructureTypesInPresentation)
				presentMain(oid, o, mk);
			}
			if (mkDefault) {
				presentDefault(oid, o, mkDefault, isTable);

			}


		}
	}

}
function _presentLocationChange(oid, o, mk) {
	// if (mk.o.obj_type != 'robber'){
	// 	let otype = mk.o.obj_type;
	// 	console.log('loc shouldnt change!!!',oid,otype);
	// 	if (otype == 'road' || otype == 'Edge') {
	// 		console.log(o);
	// 	}else return;
	// 	//return;
	// }
	if (mk.o.loc._obj ==o.loc._obj){
		//console.log('nothing to change!',oid); 
		return;
	}
	let oidLoc = o.loc._obj;
	let visLoc = getVisual(oidLoc);

	if (visLoc.isLine && mk.isLine){
		//set endPoints of new line same as visLoc
		//set x,y,center.x,center.y also same as visLoc
		//same as distance,h,length,thickness,w
		mk.ground.x1=mk.x1=visLoc.x1;
		mk.ground.y1=mk.y1=visLoc.y1;
		mk.ground.x2=mk.x2=visLoc.x2;
		mk.ground.y2=mk.y2=visLoc.y2;
		mk.x=visLoc.x;
		mk.y=visLoc.y;
		mk.center={x:visLoc.center.x,y:visLoc.center.y};
		mk.distance=visLoc.distance;
		mk.h=visLoc.h;
		mk.length=visLoc.length;
		mk.thickness=visLoc.thickness;
		mk.w=visLoc.w;
		mk.ground.x1=mk.x1;
	}else{
		mk.setPos(visLoc.x, visLoc.y);
	}

	
}
function presentMain(oid, o, mk, isTableObject = true) {
	//return;
	let validKeys = computePresentedKeys(o, isTableObject);
	//console.log(validKeys);

	let color = SPEC.useColorHintForProperties ? getColorHint(o) : mk.fg;
	//console.log(o,color)
	let akku = [];//isField(o)?[''+oid]:[];
	// let bg, fg;
	for (const k of validKeys) {
		let val = o[k];
		if (isSimple(val) || !SPEC.onlySimpleValues) akku.push(val.toString());
	}
	if (!isEmpty(akku)) { mk.multitext({ txt: akku, fill: color }); } else mk.clearText();
}
function computePresentedKeys(o, isTableObject) {
	let optin = isTableObject ? SPEC.table.optin : SPEC.players.optin;
	//console.log(optin)

	if (optin) return intersection(Object.keys(o), optin);

	let optout;
	if (SPEC.useExtendedOptout) {
		let keys = [];
		optout = SPEC.extendedOptout;
		for (const k in o) { if (optout[k]) continue; keys.push(k); }
		return keys;
	}

	optout = isTableObject ? SPEC.table.optout : SPEC.players.optout;
	for (const k in o) { if (optout[k]) continue; keys.push(k); }
	return keys;

}

function presentDefault(oid, o, mk, isTableObject = true) {
	if (isPlain() && !isTableObject && G.player == oid) { mk.hide(); return null; }
	if (isPlain() && !isTableObject) mk.show();

	//filter keys using optin and optout lists
	let optin = isTableObject ? SPEC.table.optin : SPEC.players.optin;
	let optout = isTableObject ? SPEC.table.optout : SPEC.players.optout;

	keys = optout ? arrMinus(getKeys(o), optout) : optin ? optin : getKeys(o);

	let x = mk.tableX(o, keys); //adds or replaces table w/ prop values

	//if (!isPlain() && !isTableObject) { growIfDefaultMainAreaWidth(mk); }

	return x;
}
