const DOMCATS = { rect: 'g', g: 'g', circle: 'g', text: 'g', polygon: 'g', line: 'g', body: 'd', svg: 'h', div: 'd', p: 'd', table: 'd', button: 'd', a: 'd', span: 'd', image: 'd', paragraph: 'd', anchor: 'd' };
//#region legacy one liners / getters
function getPlayer(id) { return serverData.players[id]; }
function getUser(idPlayer) { return playerConfig[GAME].players[idPlayer].username; }
function getUsername(idPlayer){return getUser(idPlayer);} //TODO: eliminate!
function getUsernameForPlayer(idPlayer){return getUser(idPlayer);} //TODO: eliminate!
function getPlid(username) {
	console.log(playerConfig[GAME].players, username);
	let res = firstCondDict(playerConfig[GAME].players, x => x.username == username);
	console.log(res)
	return res;
}
function getPlayerColor(id) { return playerConfig[GAME].players[id].color; }
function getPlayerColorString(id) { return playerConfig[GAME].players[id].altName; }
function getColorHint(o) {
	if (o.name && serverData.players[o.name]) return getPlayerColor(o.name);
	for (const k in o) {
		if (k.toLowerCase() == 'color') return o[k];
		if (isDict(o[k]) && isdef(o[k]._player)) return getPlayerColor(o[k]._player);
	}
	return null;
}
function getIdsInfobox() { return IdOwner.i ? IdOwner.i : []; }
function getSimpleSetElements(o) { return getValueArray(o); }
function getMainArea(areaName) { return UIS[getIdArea(areaName)]; }
function getStandardAreaNameForPlayerProp(pid, propName) { return 'area_' + pid + '_' + propName; }
function getStandardAreaNameForKey(key) { return 'm_A_' + key; }
function getOidForMainId(id) { return id[0] == 'm' ? id.substring(4) : null; }
function getAreaName(id) { return startsWith(id, 'm_A') ? id.substring(4) : id; }
function getAreaId(key) { return 'm_A_' + key; }
function getIdArea(areaName) { if (startsWith(areaName, 'a_d_')) { return areaName; } else if (startsWith(areaName, 'm_A_')) { return areaName; } else { return 'm_A_' + areaName; } }
function getMainId(oid) { return firstCond(oid2ids[oid], x => x[0] == 'm'); }
function getIdForOid(oid){return 'm_t_'+oid;}
function getVisual(oid) { return UIS[getMainId(oid)]; }
function getDefId(oid) { return firstCond(oid2ids[oid], x => x[0] == 'd'); }
function getDefVisual(oid) { return UIS[getDefId(oid)]; }
function getDefaultVisual(oid) { return UIS[getDefId(oid)]; }
function getFirstVisual(oid) { let res = getVisual(oid); return res ? res : getDefVisual(oid); }
function _getChildrenOf(id) { let ui = UIS[id]; return ui.children; }
function getList(lst) { return isdef(lst) ? lst : []; }
function getDefaultObjectIds() { return _getChildrenOf(SPEC.table.defaultArea); }
function getDefaultObjects() { return getDefaultObjectIds(x => UIS[x]); }
function getDefaultPlayerIds() { return _getChildrenOf(SPEC.players.defaultArea); }
function getDefaultPlayers() { return getDefaultPlayerIds(x => UIS[x]); }
function getAuxIds() { return getList(IdOwner.l); }
function getAux() { return getAuxIds.map(x => UIS[x]); }
function getBoatIdByIdx(idx) {
	if (!IdOwner.a || isEmpty(IdOwner.a)) return null;
	if (idx < 0) idx += IdOwner.a.length;
	idx = idx % IdOwner.a.length;
	return IdOwner.a[idx];
}
function getFirstBoatId() { if (!IdOwner.a || isEmpty(IdOwner.a)) return null; return IdOwner.a[0]; }
function getLastBoatId() { if (!IdOwner.a || isEmpty(IdOwner.a)) return null; return IdOwner.a[IdOwner.a.length - 1]; }
function getFirstBoat() { if (!IdOwner.a || isEmpty(IdOwner.a)) return null; return UIS[getFirstBoatId()]; }
function getBoatIds() { return getList(IdOwner.a); }
function getBoats() { return getBoatIds().map(x => UIS[x]); }
function getRandomBoat() { return UIS[chooseRandom(getBoatIds())]; }
function getBoatWith(lst, isGood = true) {
	let boats = getBoats();
	if (!isGood) {
		let goodBoats = [];
		for (const b of boats) { if (isEmpty(lst.filter(x => b.o.text.includes(x)))) goodBoats.push(b); }
		return goodBoats.length > 0 ? chooseRandom(goodBoats) : null;
	} else {
		for (const b of boats) { if (!isEmpty(lst.filter(x => b.o.text.includes(x)))) return b; }
	}
	return null;
}
function makeIdDefaultObject(oid) { return 'd_t_' + oid; }
function makeIdDefaultPlayer(oid) { return 'd_p_' + oid; }
function strategicBoat(goodlist, badlist) {
	let boats = getBoats();
	let goodBoats = boats;
	if (isdef(badlist)) {
		goodBoats = [];
		for (const b of boats) {
			//console.log(b.o.text)
			if (isEmpty(badlist.filter(x => b.o.text.join(',').includes(x)))) goodBoats.push(b);
		}
	}
	if (isdef(goodlist)) { //take it by priority! first one is highest priority!
		for (const kw of goodlist) {
			for (const b of boats) {
				if (b.o.text.join(',').includes(kw) || b.o.desc.includes(kw)) return b;
			}
		}
	}
	//if still here didnt find goodlist match!
	return chooseRandom(goodBoats);
}
//checkers
function isStructuralElement(oid) { if (nundef(G.table) || !(oid in G.table)) return false; return 'map' in G.table[oid]; }
function defaultVisualExists(oid) { return firstCond(oid2ids[oid], x => x[0] == 'd'); }
function someVisualExists(oid) { return firstCond(oid2ids[oid], x => x[0] == 'd' || x[0] == 'm'); }
function mainVisualExists(oid) { return firstCond(oid2ids[oid], x => x[0] == 'm'); }
function isBoardElementObject(o) { return o.edges || o.corners; }
function isBoardElement(oid) { let mk = getVisual(oid); return mk && mk.loc[2] == 's'; }
function isBoardObject(o) { return o.map && o.fields; }
function isDeckObject(o) { return isdef(o.deck_count); }
function isField(o) { return o.neighbors; }
function isPlain() { return !SPEC.boardDetection && !SPEC.deckDetection && !SPEC.userStructures }
function isDetection() { return (SPEC.boardDetection || SPEC.deckDetection) && !SPEC.userStructures }
function isMyPlayer(id) { let uname = getUsernameForPlayer(id); return startsWith(uname, USERNAME_ORIG); }

//#endregion





