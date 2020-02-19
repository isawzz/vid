function getVisual(oid){return RUI[oManager.main4Oid[oid]];}

//each serverData object is attached a property rsg={oid:oid,iuds:{mainId:main4Oid(oid),...}}
//eigentlich ist das immer noch zu kompliziert!!!
//warum kann ich nicht einfach o.ui machen oder mindestens rsgData[oid] ist main ui fuer serverData[oid]
// ich find das vorige system war einfacher
class ObjectManager {
	constructor() {
		this.main4Oid = {};
		this.oid4Id = {};
		this.gos = {};
	}
	addRSG(oid, o, domel=null) {
		this.gos[oid]=o;
		let rsg = {}; o.rsg = rsg; rsg.oid = oid; rsg.uids = {};
		let id = this.regMainId(oid); 
		rsg.uids.mainId = id;
		if (domel) {
			domel.id = id;
			RUI[id] = domel;
			d3.select(domel).attr('oid', oid);
		}
		return rsg;
	}

	getMainId(oid) { return this.main4Oid[oid]; }
	getOid(id) { return this.oid4Id[id]; }
	getRSG(oid){ return this.gos[oid].rsg; }
	getRSGProperty(oid,propName){
		//console.log('getRSGProperty',oid,propName,this.gos[oid]);
		return this.gos[oid].rsg[propName];
	}
	hasRSG(o){ return o.rsg; }
	regMainId(oid) { let id = 'm_' + oid; this.main4Oid[oid] = id; this.oid4Id[id] = oid; return id; }

}




