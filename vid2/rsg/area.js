function rPlayerStatsAreas(){

	if (nundef(serverData.players)) return;

	if (nundef(SPEC.playerStatsAreas)) return;
	let loc = SPEC.playerStatsAreas.loc; 
	//loc has to be existing area in layout!
	let dOthers = mById(loc);
	if (nundef(dOthers)) return;
	//console.log('object to be mapped is',omap);
	let func = SPEC.playerStatsAreas.type;

	let objects=[];
	for(const plid in serverData.players){
		let o=serverData.players[plid];
		if (plid != GAMEPLID) {
			o.id=plid;
			objects.push(o)
		}
	}
	let areaNames = objects.map(x=>x.name);
	//console.log('objects',objects,'\nareaNames',areaNames);
	//console.log('func',window[func].name,'\nloc',loc);
	let structObject = window[func](areaNames, loc);
}


