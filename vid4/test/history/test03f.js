var counter = 0;
function incCounter() { console.log(counter); counter += 1; }

function cardFace(d, i) { incCounter(); return 'para ' + i + ': card ' + d.rank; }

function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }

//how exactly do selections, .data(), .enter(), .exit() look like???
function changed(d, i) {
	console.log('*** changed ***', this);
	let res = prevServerData.length <= i || JSON.stringify(prevServerData[i]) != JSON.stringify(serverData[i]);
	console.log('d', d, 'i', i, 'changed', res);
	return res;
}
function updateSelection(d) {
	console.log('______ *** updateSelection *** ')
	console.log('data', d); //d is arr of objects to be presented, eg., [0,1,2]

	let virtualSelection = div.selectAll("div");
	let n = virtualSelection.size();

	let binding = virtualSelection.data(d);
	if (n > 0) binding = binding.filter(changed); //at first (n==0) all elements are presented
	console.log('*** performing binding!!!! ***');
	console.log('binding.nodes()', binding.nodes())
	console.log('type of binding:', getTypeOf(binding)); //binding is of type Selection

	let additionalDomels, existingDomels;
	if (n < d.length) {
		additionalDomels = binding.enter().append('div');
		console.log('*** additional domels', additionalDomels.nodes());
		console.log('type of additionalDomels:', getTypeOf(additionalDomels)); //binding is of type Selection
	}

	iColor = (iColor+1)%colors.length;
	if (additionalDomels) gestalte(additionalDomels, colors[iColor]); //should be new nodes
	gestalte(binding, colors[iColor]); //existing domels that changed!
}

//serverData modification: does NOT make a difference in updateSelection!!!
var serverData = [{ id: '0', rank: 'K' }, { id: '1', rank: 'Q' }, { id: '2', rank: '2' }, { id: '3', rank: '4' }];
var serverData2 = [{ id: '0', rank: 'Q' }, { id: '1', rank: 'J' }, { id: '2', rank: '2' }, { id: '3', rank: 'K' }];
var prevServerData = [];

function modifyServerData() {
	prevServerData = jsCopy(serverData);
	let ranks = ['2', '3', '4', 'Q', 'J', 'T'];
	let nChange = randomNumber(0, prevServerData.length);
	for (let i = 0; i < nChange; i++) {
		serverData[i].rank = chooseRandom(ranks);
	}

}

var body = d3.select('body');
var div = body.select('div');
var colors = ['blue','red','green','purple','black','white'];
var iColor=0;
body.select('button').text('UPDATE UI').on('click', () => { modifyServerData(); updateSelection(serverData); });

updateSelection(serverData);














