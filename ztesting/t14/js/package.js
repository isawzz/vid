
function findPlacements(dPlacements, data) {
	let placements = [];
	//console.log(SPEC.placement);

	for (const placement of SPEC.placement) {
		let path = Object.keys(placement)[0];
		let loc = placement[path];
		let isSelfLoc = startsWith(loc, 'self.');
		let locProperty = isSelfLoc ? stringAfter(loc, '.') : null; //only allow simple val here! (not nested)
		//console.log(path, loc, 'isSelfLoc:' + isSelfLoc);

		let matchingOids = [];

		//path is obj_type.prop1.prop2...propN or .prop1.prop2...propN (regardless of obj_type)
		//eg. GamePlayer.items
		//find all objects in serverData that match this path
		let isTyped = path[0] != '.';
		let parts = path.split('.');
		let otype = isTyped ? parts[0] : null;
		let props = isTyped ? parts.slice(1) : parts;
		//TODO: add indexing: farms.0 zum beispiel!
		//or
		//interpret prop that is a number as index when val is a list

		//console.log('isTyped', isTyped, otype, 'props', props)

		for (const kPool of ['table', 'players']) {
			let pool = serverData[kPool];
			let isTable = kPool == 'table';
			for (const oid in pool) {

				let o = pool[oid];
				if (isTyped && o.obj_type != otype) continue;

				//omap is always just 1 element!!!
				let omap = lookup(o, props);
				if (!omap) continue;

				// TODO!!!! eval loc if self loc: kann ich auch bei rep machen!!!
				//denn es koennte auch ein object sein das noch nicht existiert!
				//in dem fall braeuchte ich uid von dem object!
				//let myLoc = isSelfLoc ? findLoc(o, locProperty) : loc;

				let match = { omap: omap, loc: loc, path: path, oid: oid, props: props };
				matchingOids.push(match);

				//loc is self.prop1.prop2...propN or areaName
			}

		}
		placements.push(matchingOids);
	}
	// console.log('placements',placements);
	return placements;
}

function flattenMappings(placements) {
	let flattened = [];
	for (const plc of placements) {
		for (const match of plc) {
			let result = [];
			flattenMatch(match, result);
			flattened = flattened.concat(result);
		}
	}
	//console.log(flattened);
	//for (const c of flattened) { consoutput(c.path, c.olist, c.loc); }
	return flattened;

}
function flattenMatch(m, matches) {
	// returns list of matches made of this single match 
	//console.log(m);
	//example: Board 
	if (SPEC.visualize && SPEC.visualize[m.path]) { matches.push(m); return; }
	//example: GamePlayer.items
	//if it is a set of objects, look what type objects are
	//if objects are sets also, need to go deeper! otherwise just return item list
	let els = getElements(m.omap);
	//console.log(els)
	if (!isEmpty(els)) {
		//check if els[0] is a literal if yes, return m
		if (isLiteral(els[0])) {
			//console.log('literal:', els[0])
			m.olist = els; matches.push(m); return;
		} else if (isList(els[0]) || els[0]._set) {
			//console.log('muss ich jetzt einen neuen match machen?', els[0], m);
			let i = 0;
			for (const el of els) {
				//TODO: soll ich da einen index dazugeben??? glaub schon!!!

				let mNew = { omap: el, loc: m.loc, myLoc: m.myLoc, path: m.path + '.' + i, oid: m.oid, props: m.props };
				flattenMatch(mNew, matches);
				i += 1;
				// //els[0] is dict or array
				// //only support sets of similar element types!!!
				// let els1 = getElements(els[0]);
				// console.log('recursion deeper:', els1);
			}
		} else {
			//console.log('WEISS NICHT WAS TUN MIT', m.omap);
		}

	} else if (isEmpty(m.props)) {
		if (!m.omap.obj_type) {
			console.log('DAS GIBT ES NICHT!!!!! oid omap does NOT have obj_type', m.omap);
		} else {
			//console.log('omap is an object w/o visualize directive', m.omap);
			matches.push(m); return;
			//should be using detection and default itemType

		}
		//omap is an object w/ oid
	} else {
		//it is some kind of property that happens to be an object, but not an object w/ oid
		//example player.resources in catan
		//console.log('WEISS NICHT', m.omap);
		let itemType = null;
		for (const key in m.omap) {
			let val = m.omap[key];
			if (isLiteral(val) && itemType && itemType != 'literal'
				|| isList(val) && itemType && itemType != 'list'
				|| val._set && itemType && itemType != 'list'
				|| isDict(val) && itemType && itemType != 'obj') {
				console.log('omap is a mixed object and unknown: DONT KNOW WHAT TO DO!!!!!');
				console.log('...ignoring this match', m.path, m.omap);
				//alternatively, could allow such objects and treat them as uniform key-val lists
				// olist = olist.filter(x => isLiteral(x.value)); // could still do the simplification step!
				return;
			} else if (!itemType) {
				if (isLiteral(val)) itemType = 'literal';
				else if (isList(val) || val._set) itemType = 'list';
				else itemType = 'obj';
			}
		}
		//2 cases: either the object has only literal values (resources: {wood:2, brick:3})
		if (itemType == 'literal') {
			//da jedes object eine key-value list ist, nimm default rep fuer key-value lists!
			let olist = dict2olist(m.omap, 'key');
			m.olist = olist;
			matches.push(m);
			return;
		} else if (itemType == 'list') {
			//or the object has all sets/lists as values: {farms:[blablabl]}
			//effectively throws away the keys! but adds olists!
			for (const key in m.omap) {
				m.props.push(key);
				let mNew = { omap: m.omap[key], loc: m.loc, myLoc: m.myLoc, path: m.path + '.' + key, oid: m.oid, props: m.props };
				flattenMatch(mNew, matches);
				// //els[0] is dict or array
				// //only support sets of similar element types!!!
				// let els1 = getElements(els[0]);
				// console.log('recursion deeper:', els1);
			}
		}
	}
}












