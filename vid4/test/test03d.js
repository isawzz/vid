var counter = 0;
function incCounter() { console.log(counter); counter += 1; }

function cardFace(d, i) { incCounter(); return 'para ' + i + ': card ' + d; }

function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }

//how exactly do selections, .data(), .enter(), .exit() look like???
function changed(d, i) {
	console.log('*** changed ***', this, d, i, i==iChanged);
	return i == iChanged;
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

	let additionalDomels,existingDomels;
	if (n < d.length) {
		additionalDomels = binding.enter().append('div');
		console.log('*** additional domels',additionalDomels.nodes());
		console.log('type of additionalDomels:', getTypeOf(additionalDomels)); //binding is of type Selection
	}

	if (additionalDomels) gestalte(additionalDomels,'green'); //should be new nodes
	gestalte(binding, 'dimgray'); //existing domels that changed!
}

//serverData modification: does NOT make a difference in updateSelection!!!
var serverData = [0, 1, 2];
var iChanged=0;
function modifyServerData() { iChanged=randomNumber(0,serverData.length-1); serverData[iChanged] += 10; }
function doNotModify() { console.log('nothing changing!') }
function modifyServerDataInPlace() { for (let i = 0; i < 2; i++) { serverData[i] += 1; } }
function modifyServerDataGlobal() { serverData = Array(randomNumber(1, 10)).fill(4); } //serverData.map(x => x + 1); }

var body = d3.select('body');
var div = body.select('div');
body.select('button').text('UPDATE UI').on('click', () => { modifyServerData(); updateSelection(serverData); });

updateSelection(serverData);

//next learn how to partially update














