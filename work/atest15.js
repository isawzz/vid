//using keys, assets, divs for opps,table,players, full serverData in use!, preProcessedData, handle playerChange/restart
//packaging steps: 1. mapping placement, 2. flattening lists, 3. adding types (list,item)
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
function findLoc(o, prop) { return o[prop] ? o[prop].toUpperCase() : null; }
async function gameStep() {

	if (serverData.waiting_for) { await sendStatus(getUsernameForPlid(serverData.waiting_for[0])); }
	if (serverData.end) { d3.select('button').text('RESTART').on('click', restartGame); }
	//console.log('>>player is:',USERNAME);
	timit.showTime('* vor package: *')

	preProcessData();
	//have d14, u14 ==> serverData (processed), tupleGroups, boats, SPEC, CODE

	// TODO: here I could insert computing diffed serverData

	sData = serverData; //these are the data that I actually want to present!

	//test ob Board object auf getELements anspricht
	// let boardEls = getElements(serverData.table['9'], elKey = '_obj', arrKey = 'fields'); 
	// console.log('boardEls',boardEls,serverData.table['9']);
	// return;

	//************ createMappings ************* */
	//step1: find placements
	let placements = findPlacements(SPEC.placement, sData);
	console.log('placements', placements);

	//step2: flatten lists
	let flattened = detectLists(placements);
	console.log('flattened', flattened);

	//need to think about rsgTypes!
	//how about this:
	//each layoutType (or listType) must have its own way to generate its members
	//a listType does not create any object,it only creates mapping objects just like the ones created in createMappings
	

	//jedes object hat jetzt eine olist wenn es ein compound ist und nur omap wenn es simple object ist

	//step 4: give each mapping a listType (if compound) and an itemType
	for (const m of flattened) {
		let vis = SPEC.visualize;
		if (vis && vis[m.path]) {
			//for now only consider exact path!
			let visPath = vis[m.path];
			m.listType = visPath.listType;
			m.itemType = visPath.itemType;
			m.params = visPath;
		} else {
			m.listType = DEF_LIST_TYPE;
			m.itemType = DEF_ITEM_TYPE;
		}
	}

	//************ create Objects ************* */
	//step 4: create all objects
	//for each item mapping: create 1 object
	//for each list mapping create 1 object + 1 for each item in olist
	for (const m of flattened) {
		if (m.olist) {
			//this is a container mapping
			let oContainer = registerObject(m.oid, m.props, m);
			let oItems = m.olist.map(x => registerObject(x, [], m));
		} else {
			let oItem = registerObject(m.oid, m.props, m); //can props ever be != [] with item objects???
		}
	}

	//step 5: create ui


	//1. need player and opp areas named w/ pl.name.toUpperCase(): hardcoded for now!!!

	//2. need to create other areas as per layout if any! ==>spare that for now!



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
