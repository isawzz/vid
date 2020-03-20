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
	console.log('>>>change',nChange,'items!')
	sDataUpdated = [];
	for (let i = 0; i < nChange; i++) {
		let r=serverData[i].rank;
		serverData[i].rank = ranks[(ranks.indexOf(r)+1)%ranks.length];
		sDataUpdated.push(serverData[i]);
		//console.log('mod item',i,'from rank',r,'to',serverData[i].rank);
	}
}
function updateSelection(d) {
	console.log('______ *** updateSelection *** ')
	console.log('data', d); //d is odict2olist(updatedServerData,'id'), each item has 'id'

	let virtualSelection = div.selectAll("div");
	let n = virtualSelection.size();
	console.log('n', n, 'd.len', d.length, 'color', colors[iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(d).enter().append('div');
		console.log('*binding.nodes()', binding.nodes());
	}else {
		binding = div.selectAll("div").data(d,x=>x.id);
		console.log('...binding.nodes()', binding.nodes());
		//leave other nodes unchanged: no exit() clause!
	}

	gestalte(binding, colors[iColor]); 
	iColor = (iColor + 1) % colors.length;
}

var dServerData = { '0': { rank: 'K' }, '1': { rank: 'Q' }, '2': { rank: '2' }, '3': { rank: '4' } };
var serverData = odict2olist(dServerData);
var dPrevServerData = [];
var sDataUpdated;

var body = d3.select('body');
document.title = 'key binding';
var div = body.select('div');
var colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
var iColor = 0;
body.select('button').text('UPDATE UI').on('click', () => { modifyServerData(); updateSelection(sDataUpdated); });

updateSelection(serverData);









