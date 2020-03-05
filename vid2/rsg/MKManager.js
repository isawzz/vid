var UIS=null;
var IdOwner = {}; //lists of ids by owner
var id2oids = {}; // { uid : list of server object ids (called oids) }
var oid2ids = {}; // { oid : list of mk ids (called ids or uids) }
var id2uids = {}; // { uid : list of mk ids related to same oid }

var UPD={}; //all oids that have already been processed
var PRES={};
var DONE={};

class MKManager{
	constructor(){
		this.clear();
	}
	clear(){
		UIS = {}; // holds MS objects 
		IdOwner = {}; //lists of ids by owner
		id2oids = {}; // { uid : list of server object ids (called oids) }
		oid2ids = {}; // { oid : list of mk ids (called ids or uids) }
		id2uids = {}; // { uid : list of mk ids related to same oid }
	
	}
	getDone(oid){return DONE[oid];}
	setDone(oid){DONE[oid]=true;}
	presentationStart(){DONE={};}
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
	//console.log('deleting',id)
	let mk = UIS[id];
	if (nundef(mk)) {
		error('object that should be deleted does NOT exist!!!! ' + id);
		//console.log(DELETED_IDS);
		//console.log(DELETED_THIS_ROUND);
		//return;
	}
	unhighlightMsAndRelatives(null, mk)
	unlink(id);
	_deleteFromOwnerList(id);
	mk.destroy();
	DELETED_IDS.push(id);
	DELETED_THIS_ROUND.push(id);
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

