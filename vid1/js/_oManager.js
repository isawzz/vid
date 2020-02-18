class ObjectManager {
	constructor() {
		this.main4Oid = {};
		this.oid4Id = {};
		this.gos = {};
	}
	regMainId(oid) { let id = 'm_' + oid; this.main4Oid[oid] = id; this.oid4Id[id] = oid; return id; }

	getMainId(oid) { return this.main4Oid[oid]; }
	getOid(id) { return this.oid4Id[id]; }
	getRSG(oid){ return this.gos[oid].rsg; }
	getRSGProperty(oid,propName){
		//console.log('getRSGProperty',oid,propName,this.gos[oid]);
		return this.gos[oid].rsg[propName];
	}

	addRSG(oid, o, domel=null) {
		this.gos[oid]=o;
		let rsg = {}; o.rsg = rsg; rsg.oid = oid; rsg.uids = {};
		let id = this.regMainId(oid); rsg.uids.mainId = id;
		if (domel) {
			RUI[id] = domel.id = id;
			d3.select(domel).attr('oid', oid);
		}
		return rsg;
	}
}




