//using keys
var counter = 0;
function incCounter() { console.log(counter); counter += 1; }

function cardFace(d, i) { incCounter(); return 'para ' + i + ': card ' + d.rank; }

function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }

function modifyServerData() {
	dPrevServerData = jsCopy(dServerData);
	serverData = odict2olist(dServerData);
	let ranks = ['2', '3', '4', 'Q', 'J', 'T'];
	let keys = Object.keys(dServerData);
	let nChange = randomNumber(1, keys.length);
	console.log('>>>change', nChange, 'items!')
	sDataUpdated = [];
	for (let i = 0; i < nChange; i++) {
		let r = serverData[i].rank;
		serverData[i].rank = ranks[(ranks.indexOf(r) + 1) % ranks.length];
		sDataUpdated.push(serverData[i]);
		//console.log('mod item',i,'from rank',r,'to',serverData[i].rank);
	}
	shuffle(sDataUpdated);
	// console.log(serverData.map(x=>x.id))
	// console.log(sDataUpdated.map(x=>x.id))

}
function modifyServerDataRandom() {
	dPrevServerData = jsCopy(dServerData);
	//serverData = odict2olist(dServerData); //nicht mehr gebrauch!!!
	let ranks = ['2', '3', '4', 'Q', 'J', 'T','A','9'];

	let keys = Object.keys(dServerData);
	let nChange = randomNumber(1, keys.length);
	shuffle(keys);
	console.log('>>>change', nChange, 'items!')

	sDataUpdated = [];
	for (let i = 0; i < nChange; i++) {
		let id=keys[i];
		console.log('change rank of id',id)

		//cycle rank:
		//let r = dServerData[id].rank;
		// dServerData[id].rank = ranks[(ranks.indexOf(r) + 1) % ranks.length];

		//just choose random rank:
		dServerData[id].rank = chooseRandom(ranks);

		let o={id:id,rank:dServerData[id].rank};
		sDataUpdated.push(o);
	}
	shuffle(sDataUpdated);

}
function updateSelection(d) {
	console.log('______ *** updateSelection *** ')
	console.log('data', d.map(x=>x.id)); //d is odict2olist(updatedServerData,'id'), each item has 'id'

	let virtualSelection = div.selectAll("div");
	let n = virtualSelection.size();
	console.log('n', n, 'd.len', d.length, 'color', colors[iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(d).enter().append('div');
		console.log('*binding.nodes()', binding.nodes());
	} else {
		binding = div.selectAll("div").data(d, x => x.id);
		console.log('...binding.nodes()', binding.nodes());
		//leave other nodes unchanged: no exit() clause!
	}

	gestalte(binding, colors[iColor]);
	iColor = (iColor + 1) % colors.length;
}

function init() { updateSelection(odict2olist(dServerData)); }
function step() { modifyServerDataRandom(); updateSelection(sDataUpdated); }

var dServerData = { '0': { rank: 'K' }, '1': { rank: 'Q' }, '2': { rank: '2' }, '3': { rank: '4' }, '4': { rank: 'A' }, '5': { rank: 'T' } };
var serverData = odict2olist(dServerData); //NUR in modifyServerData gebraucht!!!
var dPrevServerData = [];
var sDataUpdated;

var body = d3.select('body');
document.title = 'step!';
var div = body.select('div');
var colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
var iColor = 0;
body.select('button').text('STEP').on('click', step);

init();









