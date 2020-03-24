//using keys, assets, divs for opps,table,players, full serverData in use!, preProcessedData, handle playerChange/restart
//placement list
window.onload = () => _start();
var divMain, divPlayer, divOpps, colors, iColor, packageList, presentationLists, timit;

//#region control flow
async function _start() {
	timit = new TimeIt('*timer', TIMIT_SHOW);
	await loadAssets();
	await loadSpec();
	await loadCode();
	await loadInitialServerData();
	initUI();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
	//interaction(); //to test 2nd step
}
async function gameStep() {

	if (serverData.waiting_for) { await sendStatus(getUsernameForPlid(serverData.waiting_for[0])); }
	if (serverData.end) { d3.select('button').text('RESTART').on('click', restartGame); }
	//console.log('>>player is:',USERNAME);
	timit.showTime('* vor package: *')

	preProcessData();
	//have: serverData (processed), tupleGroups, boats, SPEC, CODE

	//serverData ist aus d14, uspec aus u14

	//test14 should look at placements and gather all items from serverData.players and
	//serverData.table that match a placement and return for each placement
	//list of objects,their concrete path,oids,evaluated area name
	let placements = SPEC.placement;

	//expected result:
	//>system areas should always be ALL CAPITALS
	// GamePlayer.items: self.name
	// path:Player1.items,omap:{_set:[{_obj:3},{_obj:4}],loc: PLAYER1
	//>omap is 1 object, ?or should I say getElements?
	//val is list of object
	// path:Tick,omap:[{_obj:0},{_obj:1},{_obj:3},{_obj:4}],loc: MAIN 
	//val is list of object w/ value Tick


	//falsch


	console.log(placements);
	for (const placement of placements) {
		let path = Object.keys(placement)[0];
		let loc = placement[path];
		console.log(path, loc);
		let matches=[];

		//path is obj_type.prop1.prop2...propN or .prop1.prop2...propN (regardless of obj_type)
		//eg. GamePlayer.items
		//find all objects in serverData that match this path
		let isTyped = path[0] != '.';
		let parts = path.split('.');
		let otype = isTyped ? parts[0] : null;
		let props = isTyped ? parts.slice(1) : parts;

		console.log('isTyped', isTyped, otype, 'props', props)

		for (const kPool of ['table', 'players']) {
			let pool = serverData[kPool];
			let isTable = kPool == 'table';
			for (const oid in pool) {

				let o = pool[oid];
				if (isTyped && o.obj_type != otype) continue;

				let omap = lookup(o, props);
				if (!omap) continue;

				let oidlist = getElements(omap);
				if (isEmpty(oidList)) {
					//this is a leaf item: put in placement list
					matches.push([omap]);
				}
				if (isElementList(omap))

					console.log('found match:', oid, omap);






				//loc is self.prop1.prop2...propN or areaName
			}

		}
	}



	// //here I could insert computing diffed serverData
	// sData = serverData; //computeUpdatedServerDataOnly()
	// if (sData == serverData) sData=sData.table; //simplification for now to make package easier!!!

	// packageList = package(sData, SPEC);

	// console.log('packages',packageList);

	// //console.log(fromPath,fromPath('0.buildings.farms'))

	// showServerData(sData);
	// //showPackages(packageList);

	// //present(presentationLists);
	// timit.showTime('* nach package: *')
}







//#region rest
async function restartGame() {
	await sendRestart();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
}


function updateSelection(data, area) {
	console.log('______ *** updateSelection *** ', data)
	//console.log('data', data.map(x => x.id)); 

	let virtualSelection = d3.select('#' + area).selectAll("div");
	let n = virtualSelection.size();
	//console.log('#containers:'+ n, '#items:'+ data.length, 'area:'+area)
	//console.log('n', n, 'd.len', data.length, 'color', colors[iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(data).enter().append('div');
		//console.log('*****binding.nodes()', binding.nodes());
	} else {
		binding = virtualSelection.data(data, x => x.id);
		//console.log('.....binding.nodes()', binding.nodes());
		//leave other nodes unchanged: no exit() clause!
	}

	gestalte(binding, colors[iColor]);
	iColor = (iColor + 1) % colors.length;
}
function cardFace(d, i) { return 'para ' + i + ': card ' + d.rank; }
function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }

async function interaction() {
	await sendAction();
	gameStep();
}

function initUI() {
	document.title = 'HA!';
	divMain = d3.select('#MAIN');
	divPlayer = d3.select('#PLAYER');
	divOpps = {};
	let dOpps = d3.select('#OPPS');
	for (const plid in playerConfig[GAME].players) {
		let dPlid = dOpps.append('div').attr('id', plid);
		divOpps[plid] = dPlid;
	}

	colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
	iColor = 0;
}
