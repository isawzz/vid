var UIS=null;
var IdOwner = {}; //lists of ids by owner
var id2oids = {}; // { uid : list of server object ids (called oids) }
var oid2ids = {}; // { oid : list of mk ids (called ids or uids) }
var id2uids = {}; // { uid : list of mk ids related to same oid }

var UPD={}; //all oids that have already been processed
var PRES={};
var DONE={};

//#region access objects:
function getVisual(oid){
	let mk = UIS[getMainId(oid)]; //legacy!elim as soon as all mks created in library and factory
	if (mk || USE_OLD_GRID_FUNCTIONS) return mk;
	let oids = oid2ids[oid];
	if (!oids || !IdOwner.m) return null;
	let id = intersection(IdOwner.m,oid2ids[oid])[0]; 
	return UIS[id];
}
function getVisuals(oid){
	let mk = UIS[getMainId(oid)]; //legacy!elim as soon as all mks created in library and factory
	if (mk || USE_OLD_GRID_FUNCTIONS) return mk;
	let oids = oid2ids[oid];
	if (!oids || !IdOwner.m) return null;
	return intersection(IdOwner.m,oid2ids[oid]).map(x=>UIS[x]); 
}


function registerUiFor(mk,ui){mk.elem=ui;mk.elem.id=mk.id;mk.parts.elem=ui;mk.domType = getTypeOf(ui);mk.cat=DOMCATS[mk.domType];}
function registerObject(o, idType, loc, rsgType) {
	// o must have oid (in path notation) and o
	// o.ui (if exists) => mk.elem
	// idType 'm','x','d','a','l' different kinds of interaction!
	// rsgType => mk.rsg 
	// loc is id of parent ui/mk (can be area or mk)
	let id = getUID();
	let mk = new MK();
	mk.o = o.o;
	mk.info = o.info;
	let oid = stringBefore(o.oid, '.');
	mk.oid = oid;
	mk.path = o.oid;

	//if (idType=='i') console.log('dadada')///////////////////////////

//	mk.cat = cat;
	mk.rsg = rsgType;
	mk.id = id;
	mk.idType = idType;
	mk.loc = loc; //id of containing ui (can be in UIS or just a div)
	if (o.ui) registerUiFor(mk,o.ui); // { mk.elem = mk.parts.elem = o.ui; mk.elem.id = id; }
	
	//if (idType=='i') console.log('mk.elem',mk.elem);///////////////////////////
	
	linkObjects(id, oid);
	listKey(IdOwner, idType, id);
	//console.log(idType)
	UIS[id] = mk;
	return mk;
}

class MKManager{
	clear(){this.clearUIS();this.clearDONE();}
	clearUIS(){
		UIS = {}; // holds MS objects 
		IdOwner = {}; //lists of ids by owner
		id2oids = {}; // { uid : list of server object ids (called oids) }
		oid2ids = {}; // { oid : list of mk ids (called ids or uids) }
		id2uids = {}; // { uid : list of mk ids related to same oid }
		UIDCounter=0;
	}
	getDone(oid){return DONE[oid];}
	setDone(oid){DONE[oid]=true;}
	clearDONE(){DONE={};}
}

//#region helpers: linking UIS ...
function _addRelatives(id, oid) {
	// if (isdef(oid2ids[oid])) oid2ids[oid].map(x => listKey(id2uids, id, x)); //all other already existing uis are linked to newly created element!
	if (isdef(oid2ids[oid])) {
		for (const idOther of oid2ids[oid]) {
			if (idOther == id) {
				console.log('object', id, 'already exists in oid2ids[', oid, ']');
				continue;
			}
			listKey(id2uids, id, idOther);
			listKey(id2uids, idOther, id);
		}
	}
}
function linkObjects(id, oid) {
	// if (HALLO) console.log('linkObjects',id,oid)
	_addRelatives(id, oid);
	listKey(id2oids, id, oid);
	listKey(oid2ids, oid, id);
}
function unlink(id) {
	let oids = id2oids[id];
	let uids = id2uids[id];
	//console.log('unlink', 'oids', oids)
	//console.log('unlink', 'uids', uids)
	if (isdef(uids)) for (const uid of uids) removeInPlace(id2uids[uid], id);
	if (isdef(oids)) for (const oid of oids) removeInPlace(oid2ids[oid], id);
	delete id2uids[id];
	delete id2oids[id];
}

//#region delete MS 
function _deleteFromOwnerList(id) { let owner = IdOwner[id[2]]; if (isdef(owner)) removeInPlace(owner, id); }
function deleteRSG(id) {
	console.log('deleting',id)
	let mk = UIS[id];
	if (nundef(mk)) {
		error('object that should be deleted does NOT exist!!!! ' + id);
		//return;
	}
	unhighlightMsAndRelatives(null, mk)
	unlink(id);
	_deleteFromOwnerList(id);
	mk.destroy();
	delete UIS[id];
}
function deleteAll(rsgType, idoType) {
	let ids = IdOwner[idoType];
	//console.log(ids);
	ids = isdef(IdOwner[idoType]) ? IdOwner[idoType].filter(x => x[0] == rsgType) : []; for (const id of ids) deleteRSG(id);
}
function deleteDefaultObjects() { deleteAll('d', 't'); }
function deleteDefaultPlayers() { deleteAll('d', 'p'); }
function deleteActions() { deleteAll('d', 'a'); }
function deleteOid(oid) {
	let uids = jsCopy(oid2ids[oid]);

	//console.log('related to', oid, 'are', uids)
	//of these only have to delete main object and default object
	//no need to delete auxes?
	//no need to delete because these will be updated in all objects that have changed via table update!
	for (const uid of uids) {
		if (uid[2] == 'r' || uid[2] == 'l') continue;
		//console.log('deleting', uid);
		if (UIS[uid]) deleteRSG(uid);
	}
}
//#endregion

