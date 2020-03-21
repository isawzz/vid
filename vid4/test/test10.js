//using keys, assets, divs for opps,table,players, full serverData in use!, preProcessServerData
window.onload = () => _start();
var divRsg, divTable, divPlayer, divOpps, colors, iColor, sData, sPackage, dPrevServerData, sDataUpdated;

var currentServerData, prevServerData; //dictionaries

async function _start() {
	await loadAssets();
	await loadSpec();
	await loadCode();
	await loadInitialServerData();
	initUI();
	d3.select('button').text('STEP').on('click', interaction);
	gameStep();
}
function gameStep() {

	sData = serverData;
	showServerData(sData);
	present();
}
function present() {
	if (isdef(listOfUpdatedObjects)) updateSelection(listOfUpdatedObjects);
	else {
		let lst = dict2olist(sData);
		updateSelection(lst);
		console.log(lst)
	}
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
function updateSelection(d) {
	//console.log('______ *** updateSelection *** ')
	//console.log('data', d.map(x => x.id)); //d is odict2olist(updatedServerData,'id'), each item has 'id'

	let virtualSelection = divTable.selectAll("div");
	let n = virtualSelection.size();
	//console.log('n', n, 'd.len', d.length, 'color', colors[iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(d).enter().append('div');
		//console.log('*binding.nodes()', binding.nodes());
	} else {
		binding = divTable.selectAll("div").data(d, x => x.id);
		//console.log('...binding.nodes()', binding.nodes());
		//leave other nodes unchanged: no exit() clause!
	}

	gestalte(binding, colors[iColor]);
	iColor = (iColor + 1) % colors.length;
}
function cardFace(d, i) { return 'para ' + i + ': card ' + d.rank; }
function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }
async function interaction() {
	console.log('sending action now...');
	await sendActionStub();
	gameStep();
}
function modifyServerDataRandom() {
	prevServerData = jsCopy(serverData);
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
		serverData[id].rank = chooseRandom(ranks);

		let o = { id: id, rank: sData[id].rank };
		sDataUpdated.push(o);
	}
	shuffle(sDataUpdated);

}
