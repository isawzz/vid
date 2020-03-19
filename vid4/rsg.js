//#region interface: this interface CANNOT EVER CHANGE!!!!!!!
var _colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
var _iColor = 0;
var _rMan;

async function initRsg(){
	_rMan = new Rsg0();
	return _rMan;
}

function cardFace(d, i) { return 'para ' + i + ': card ' + d.rank; }

function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }

function updateSelection(d) {
	console.log('______ *** updateSelection *** ')
	console.log('data', d.map(x=>x.id)); //d is dict2list(updatedServerData,'id'), each item has 'id'

	let virtualSelection = div.selectAll("div");
	let n = virtualSelection.size();
	console.log('n', n, 'd.len', d.length, 'color', _colors[_iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(d).enter().append('div');
		console.log('*binding.nodes()', binding.nodes());
	} else {
		binding = div.selectAll("div").data(d, x => x.id);
		console.log('...binding.nodes()', binding.nodes());
		//leave other nodes unchanged: no exit() clause!
	}

	gestalte(binding, _colors[_iColor]);
	_iColor = (_iColor + 1) % _colors.length;
}


class Rsg0{
	constructor(){
		this.tree=null;
		this.list = null;
	}
	augment(o){
		this.list = dict2list(o,'id');
		//return this.list;
	}
	present(){

	}
}










