//using keys, assets, divs for opps,table,players, full serverData in use!, preProcessedData
window.onload = () => _start();
var divPresent, divMain, divPlayer, divOpps, colors, iColor, presentList, listOfUpdatedObjects;

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
	preProcessData();
	presentList = serverData;
	showServerData(presentList);
	present();
}
function present() {
	if (isdef(listOfUpdatedObjects)) {
		//incremental update
		updateSelection(listOfUpdatedObjects); 
	}else {
		//complete update
		let lst = dict2olist(presentList);
		updateSelection(lst);
		console.log(lst)
	}
}
function updateSelection(d) {
	//console.log('______ *** updateSelection *** ')
	//console.log('data', d.map(x => x.id)); //d is odict2olist(updatedServerData,'id'), each item has 'id'

	let virtualSelection = divPresent.selectAll("div");
	let n = virtualSelection.size();
	//console.log('n', n, 'd.len', d.length, 'color', colors[iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(d).enter().append('div');
		//console.log('*binding.nodes()', binding.nodes());
	} else {
		binding = divPresent.selectAll("div").data(d, x => x.id);
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
	if (TESTING) modifyServerDataRandom(); else await sendAction();
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

	divPresent = d3.select('#LOG');
	colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
	iColor = 0;
}
