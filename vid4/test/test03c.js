var counter = 0;
function incCounter() { console.log(counter); counter += 1; }

function cardFace(d, i) { incCounter(); return 'para ' + i + ': card ' + d; }

function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }

//how exactly do selections, .data(), .enter(), .exit() look like???
function updateSelection(d) {
	console.log('______ *** updateSelection *** ')
	console.log('data', d); //d is arr of objects to be presented, eg., [0,1,2]

	//analysing selection supposedly presenting data d:
	let virtualSelection = div.selectAll("div");
	let n = virtualSelection.size();
	console.log('current (virtual) selection', virtualSelection);
	console.log('size of current selection', n)
	console.log('type of _groups:' + getTypeOf(virtualSelection._groups));
	console.log('type of _groups[0]:' + getTypeOf(virtualSelection._groups[0]), '._groups[0]', virtualSelection._groups[0]);
	console.log('current selection nodes', virtualSelection.nodes());
	// selection._groups[0] == selection.nodes() (type: Nodelist)

	let binding = virtualSelection.data(d);
	console.log('*** performing binding!!!! ***');
	console.log('binding (.data(d)) result:', binding);
	console.log('binding.nodes()', binding.nodes())
	console.log('type of binding:', getTypeOf(binding));

	let updatedSelection = null;
	let newDomels = null;
	let existingDomels = virtualSelection;
	if (n > d.length) {
		console.log('*** exit ***')
		console.log('# of domels exceeds # of data by', n - d.length);
		let surplusDomels = binding.exit();
		console.log('=>exit: ', surplusDomels.nodes(), 'removing surplus nodes...')
		let result = surplusDomels.remove();
		console.log('result of remove: ', result);
		console.log('selection after removing:', virtualSelection.nodes());
		updatedSelection = div.selectAll('div');
		console.log('selection after removing:', updatedSelection.nodes());
	} else if (n < d.length) {
		console.log('*** enter ***')
		console.log('# of data exceeds # of domels by', d.length - n);
		let additionalDomels = binding.enter();
		//newDomels = additionalDomels; NEIN!!!! es muessen die appended ones genommen werden!!!
		console.log('=>enter: ', additionalDomels.nodes(), 'adding needed nodes...');
		let result = additionalDomels.append('div');
		newDomels = result;
		console.log('result of adding:', result.nodes());
		console.log('selection after adding:', virtualSelection.nodes());
		updatedSelection = div.selectAll('div');
		console.log('selection after adding:', updatedSelection.nodes());
	} else {
		console.log('*** Exactly the correct number!!! ***')
		console.log('# of data == # of domels by', n, d.length);
		updatedSelection = virtualSelection;
		console.log('updatedSelection == virtualSelection:', updatedSelection.nodes());
	}
	//now updatedSelection has to be styled using data properties!
	//see difference between newly added and just updated domels:
	// if (newDomels) gestalte(newDomels,'green');
	// if (existingDomels) gestalte(existingDomels,'blue');

	//kann aber auch gleich:
	gestalte(updatedSelection, 'dimgray'); //actually ALL domels are updated!
}

//serverData modification: does NOT make a difference in updateSelection!!!
var serverData = [0, 1, 2];
function doNotModify() { console.log('nothing changing!') }
function modifyServerDataInPlace() { for (let i = 0; i < 2; i++) { serverData[i] += 1; } }
function modifyServerDataGlobal() { serverData = Array(randomNumber(1, 10)).fill(4); } //serverData.map(x => x + 1); }

var body = d3.select('body');
var div = body.select('div');
// body.select('button').text('UPDATE UI').on('click', () => { modifyServerDataGlobal(); updateSelection(serverData); });
// updateSelection(serverData);

//__________________ call data() without args to get data bound to selection:
let currentData = div.selectAll('div').data();
console.log(currentData);


//__________________ next learn how to partially update
function updateSelectionKeys(d, color) {
	console.log('______ *** updateSelection *** ')
	console.log('data', d); //d is arr of key/value objects to be presented, [{key:k1,value:v1}, ...]

	//analysing selection supposedly presenting data d:
	let virtualSelection = div.selectAll("div");
	let n = virtualSelection.size();
	console.log('current (virtual) selection', virtualSelection);
	console.log('size of current selection', n)
	console.log('type of _groups:' + getTypeOf(virtualSelection._groups));
	console.log('type of _groups[0]:' + getTypeOf(virtualSelection._groups[0]), '._groups[0]', virtualSelection._groups[0]);
	console.log('current selection nodes', virtualSelection.nodes());

	let binding = virtualSelection.data(d.map(x => x.value), x => x.key);//**** CHANGE!!! */
	console.log('*** performing binding!!!! ***');
	console.log('binding (.data(d)) result:', binding);
	console.log('binding.nodes()', binding.nodes())
	console.log('type of binding:', getTypeOf(binding));

	let updatedSelection = null;
	let newDomels = null;
	let existingDomels = virtualSelection;
	//leave data that remain unchanged!
	if (n < d.length) {
		console.log('*** enter ***')
		console.log('# of data exceeds # of domels by', d.length - n);
		let additionalDomels = binding.enter();
		//newDomels = additionalDomels; NEIN!!!! es muessen die appended ones genommen werden!!!
		console.log('=>enter: ', additionalDomels.nodes(), 'adding needed nodes...');
		let result = additionalDomels.append('div');
		newDomels = result;
		console.log('result of adding:', result.nodes());
		console.log('selection after adding:', virtualSelection.nodes());
		updatedSelection = div.selectAll('div');
		console.log('selection after adding:', updatedSelection.nodes());
	} else {
		console.log('*** Exactly the correct number!!! ***')
		console.log('# of data == # of domels by', n, d.length);
		updatedSelection = virtualSelection;
		console.log('updatedSelection == virtualSelection:', updatedSelection.nodes());
	}
	//now updatedSelection has to be styled using data properties!
	//see difference between newly added and just updated domels:
	if (newDomels) gestalte(newDomels,'green');
	if (existingDomels) gestalte(existingDomels,color);

	//kann aber auch gleich:
	//gestalte(updatedSelection, color); //actually ALL domels are updated!
}
function modifyServerDataKeys() {
	updatedServerData = [];
	for (let i = 1; i < 2; i++) { 
		serverData[i].value += 10; 
		console.log('update serverData',i,'to',serverData[i].value);

		updatedServerData.push(serverData[i]); }

}


//partial updates: in data, only supply data that should actually be updated, each data item needs a key:
var color = 'red';
body.select('button').text('UPDATE UI W/ KEYS').on('click', () => { modifyServerDataKeys(); color = color == 'red' ? 'green' : 'red'; updateSelectionKeys(updatedServerData, color); });
serverData = [{ key: '0', value: 0 }, { key: '1', value: 1 }, { key: '2', value: 2 }];
updatedServerData = [];
//start with a complete update:
updateSelectionKeys(serverData, color);











