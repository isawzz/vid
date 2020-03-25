//using keys, assets, divs for opps,table,players, full serverData in use!, preProcessedData, handle playerChange/restart
//packaging,present => package.js
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

	//here I could insert computing diffed serverData
	sData = serverData; //computeUpdatedServerDataOnly()
	if (sData == serverData) sData=sData.table; //simplification for now to make package easier!!!

	packageList = package(sData, SPEC);

	console.log('packages',packageList);

	//console.log(fromPath,fromPath('0.buildings.farms'))

	showServerData(sData);
	//showPackages(packageList);

	//present(presentationLists);
	timit.showTime('* nach package: *')
}
async function restartGame() {
	await sendRestart();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
}


function updateSelection(data,area) {
	console.log('______ *** updateSelection *** ',data)
	//console.log('data', data.map(x => x.id)); 

	let virtualSelection = d3.select('#'+area).selectAll("div");
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
