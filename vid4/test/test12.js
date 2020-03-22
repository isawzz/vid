//using keys, assets, divs for opps,table,players, full serverData in use!, preProcessedData, handle playerChange/restart
//packaging 
window.onload = () => _start();
var divMain, divPlayer, divOpps, colors, iColor, presentList, plidTurn;

//#region control flow
async function _start() {
	await loadAssets();
	await loadSpec();
	await loadCode();
	await loadInitialServerData();
	initUI();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
	//interaction();
}
async function gameStep() {

	if (serverData.waiting_for) { await sendStatus(getUsernameForPlid(serverData.waiting_for[0])); }
	if (serverData.end) { d3.select('button').text('RESTART').on('click', restartGame); }
	//console.log('>>player is:',USERNAME);

	preProcessData();
	//have: serverData (processed), tupleGroups, boats, SPEC, CODE

	//here I could insert computing diffed serverData
	sData = serverData; //computeUpdatedServerDataOnly()
	presentList = package(sData, SPEC, CODE);
	//console.log(presentList)
	showServerData(presentList);
	present(presentList);
}
async function restartGame() {
	await sendRestart();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
}

//#region package
function package(sData, SPEC, CODE) {
	let sTable = sData.table ? sData.table : sData;
	let lst = dict2olist(sTable);
	let res = [{ olist: lst, loc: 'LOG' }]; //hier wird loc gesetzt!
	//console.log('package returns',res)
	return res;
}

//#region present
function present(listOfDict) {
	for (const dic of listOfDict) {
		area = dic.loc;
		console.log(area)
		let datalist = dic.olist;

		updateSelection(datalist, area)
	}
}
function updateSelection(data,area) {
	console.log('______ *** updateSelection *** ',data)
	//console.log('data', data.map(x => x.id)); 

	let virtualSelection = d3.select('#'+area).selectAll("div");
	let n = virtualSelection.size();
	//console.log('#containers:'+ n, '#items:'+ data.length, 'area:'+area)
	// //console.log('n', n, 'd.len', data.length, 'color', colors[iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(data).enter().append('div');
		//console.log('*****binding.nodes()', binding.nodes());
	} else {
		binding = virtualSelection.data(data, x => x.id);
		// binding = divPresent.selectAll("div").data(data, x => x.id);
		//console.log('.....binding.nodes()', binding.nodes());
		//leave other nodes unchanged: no exit() clause!
	}

	gestalte(binding, colors[iColor]);
	iColor = (iColor + 1) % colors.length;
}
function cardFace(d, i) { return 'para ' + i + ': card ' + d.rank; }
function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }

async function interaction() {
	//console.log('sending action now...');
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

	//divPresent = d3.select('#Player1'); //divOpps['Player1'];// d3.select('#LOG'); alle die sind ok!!!
	colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
	iColor = 0;
}
