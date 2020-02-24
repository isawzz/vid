var UIS=null;
var IdOwner = {}; //lists of ids by owner
var id2oids = {}; // { uid : list of server object ids (called oids) }
var oid2ids = {}; // { oid : list of mobj ids (called ids or uids) }
var id2uids = {}; // { uid : list of mobj ids related to same oid }

class MKManager{
	constructor(){

	}
	clear(){
		UIS = {}; // holds MS objects 
		IdOwner = {}; //lists of ids by owner
		id2oids = {}; // { uid : list of server object ids (called oids) }
		oid2ids = {}; // { oid : list of mobj ids (called ids or uids) }
		id2uids = {}; // { uid : list of mobj ids related to same oid }
	
	}
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
	// if (isdef(UIS[id])) {
	// 	console.log('linkObjects: ui', id, 'exists and CANNOT be overriden!!!!!');
	// }
	_addRelatives(id, oid);
	listKey(id2oids, id, oid);
	listKey(oid2ids, oid, id);

	//#region testcode
	// if (oid == '0' && id[0]=='m'){
	// 	console.log('link',id,'to',oid)
	// 	console.log(id2oids)
	// 	console.log(oid2ids)
	// }
	// if (isdef(UIS[id])) {
	// 	console.log('linkObjects: ui', id, 'exists and CANNOT be overriden!!!!!');
	// } else {
	// 	//console.log('*** created ***', id)
	// }
	// _addRelatives(id, oid);
	// listKey(id2oids, id, oid);
	// if (oid == '0') console.log('...................',oid2ids[oid], typeof oid, id, typeof id)
	// if (nundef(oid2ids[oid])) oid2ids[oid]=[];
	// if (oid == '0') console.log('...................',oid2ids[oid], typeof oid)
	// oid2ids[oid].push(id);
	// if (oid == '0') console.log('...................',oid2ids[oid], typeof oid)
	// //listKey(oid2ids, oid, id);
	// if (isdef(Number(oid))&& id[0]=='m'){
	// 	console.log('linked',id,'to',oid)
	// 	console.log(id2oids)
	// 	console.log(oid2ids)
	// 	console.log('__________________')
	// }
	// //console.log('after linking:',id2oids[id],oid2ids[oid]);
	//#endregion
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

