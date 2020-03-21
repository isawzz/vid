//using keys, assets, divs for opps,table,players, full serverData in use!, preProcessServerData
window.onload = () => _start();
var divRsg, divTable, divPlayer, divOpps, colors, iColor, sData, dPrevServerData, sDataUpdated;

async function _start() {
	await loadAssets();
	await loadSpec();
	await loadCode();
	await loadInitialServerData(); 
	//console.log('backfrom loadInitialServerData', serverData)
	initUI();
	//console.log('after init UI')
	d3.select('button').text('STEP').on('click', gameStep);
	//console.log('after button adding')
	gameStep();
}
function gameStep() {

	console.log('haaaaaaaaaaaaaaalllllllllllo')
	//have: serverData (processed), tupleGroups, SPEC, CODE available!

	//here need to form some kind of list or dict of objects to be presented!!!!!
	sData = serverData;


	present(); //just presents now, no serverData modification!!!



}
function present() {
	console.log('sData', sData)
	let lst = dict2olist(sData);
	console.log('__________ lst', lst);
	updateSelection(lst);
}
function sendActionStub() {
	//remember username sending action!
	//set prevServerData=serverData (preProcessed from last round!)

	//send an action
	//get new serverData (raw)
	//preProcess serverData

	//=>inject diffcompare (serverData-prevServerData) ... should this include SPEC changes?
	//package into: serverData+SPEC ==> object structure (should be forest but can start with simple dict of lists)
	//what does this list of list contain?
	//for each oid|path to be presented, contains 
	//- list of augmented objects
	//- layout (containerType) and area(=location) [zIndex?idParent?]
	//- rsgType of items
	//- for each item typeMappings/stringMappings for props in orig object => props needed by rsgType
	//=>maybe inject diffcompare packages: only info to be presented should be compared???
}
function cardFace(d, i) { return 'para ' + i + ': card ' + d.rank; }
function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }
function modifyServerData() {
	dPrevServerData = jsCopy(sData);
	let sDataList = odict2olist(sData);
	let ranks = ['2', '3', '4', 'Q', 'J', 'T'];
	let keys = Object.keys(sData);
	let nChange = randomNumber(1, keys.length);
	console.log('>>>change', nChange, 'items!')
	sDataUpdated = [];
	for (let i = 0; i < nChange; i++) {
		let r = sDataList[i].rank;
		sDataList[i].rank = ranks[(ranks.indexOf(r) + 1) % ranks.length];
		sDataUpdated.push(sDataList[i]);
		//console.log('mod item',i,'from rank',r,'to',serverData[i].rank);
	}
	shuffle(sDataUpdated);
	// console.log(serverData.map(x=>x.id))
	// console.log(sDataUpdated.map(x=>x.id))

}
function modifyServerDataRandom() {
	dPrevServerData = jsCopy(sData);
	//serverData = odict2olist(dServerData); //nicht mehr gebrauch!!!
	let ranks = ['2', '3', '4', 'Q', 'J', 'T', 'A', '9'];

	let keys = Object.keys(sData);
	let nChange = randomNumber(1, keys.length);
	shuffle(keys);
	console.log('>>>change', nChange, 'items!')

	sDataUpdated = [];
	for (let i = 0; i < nChange; i++) {
		let id = keys[i];
		console.log('change rank of id', id)

		//cycle rank:
		//let r = dServerData[id].rank;
		// dServerData[id].rank = ranks[(ranks.indexOf(r) + 1) % ranks.length];

		//just choose random rank:
		sData[id].rank = chooseRandom(ranks);

		let o = { id: id, rank: sData[id].rank };
		sDataUpdated.push(o);
	}
	shuffle(sDataUpdated);

}
function updateSelection(d) {
	console.log('______ *** updateSelection *** ')
	console.log('data', d.map(x => x.id)); //d is odict2olist(updatedServerData,'id'), each item has 'id'

	let virtualSelection = divTable.selectAll("div");
	let n = virtualSelection.size();
	console.log('n', n, 'd.len', d.length, 'color', colors[iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(d).enter().append('div');
		console.log('*binding.nodes()', binding.nodes());
	} else {
		binding = divTable.selectAll("div").data(d, x => x.id);
		console.log('...binding.nodes()', binding.nodes());
		//leave other nodes unchanged: no exit() clause!
	}

	gestalte(binding, colors[iColor]);
	iColor = (iColor + 1) % colors.length;
}
function initialServerData() {
	sData = { '0': { rank: 'K' }, '1': { rank: 'Q' }, '2': { rank: '2' }, '3': { rank: '4' }, '4': { rank: 'A' }, '5': { rank: 'T' } };
	dPrevServerData = [];
}
function initUI() {
	divRsg = d3.select('#rsg');
	document.title = 'HA!';

	divTable = divRsg.select('#table');

	divPlayer = divRsg.select('#player');
	divOpps = {};
	let dOpps = divRsg.select('#opps');
	for (const plid in playerConfig[GAME].players) {
		let dPlid = dOpps.append('div').attr('id', plid);
		divOpps[plid] = dPlid;
	}

	colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
	iColor = 0;
}
function updateUI(data) {
	let d = mBy('SERVERDATA');
	if (d && SHOW_SERVERDATA) { d.innerHTML = '<pre>' + jsonToYaml(data) + '</pre>'; }
	else console.log('serverData', data);

}









