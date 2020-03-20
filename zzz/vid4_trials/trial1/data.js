//#region interface: this interface CANNOT EVER CHANGE!!!!!!!
//versioning: just by replacing this module and keeping same interface
// initAssets, load_, send_ functions
async function initAssets(options){
	daman = new _Assets0();	
	//load standard assets
	await loadStandardAssets();
	await loadGameInfo();
	return daman; //return asset manager: brauch ich den?
}
async function initSpecAndCode(){

}
async function initGame(options){
	//can I play more than 1 game at same time? no
}
async function loadGameAssets(){}
async function loadGameInfo(){}
async function loadBehaviors(){}
async function loadSPEC(){
	//loads user spec
	//loads default spec 
	//merges specs
	//returns merged spec
}
async function sendInitGame(){}
async function sendAction(){}
async function sendBegin(){}


async function _loadStandardAssets(options){

}


class _Assets0 {
	constructor() {
		_sMan = new _Server0(); //global in diesem file aber NICHT part of interface!!!
		this.code = null;
		this.uspec = null;
		this.sData = null;
		this.psData = null;
		this.c52 = null;
		this.icons = null;
	}
	async initServerData() {
		this.sData = await _sMan.getInitialData();
	}
}











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
	let ranks = ['2', '3', '4', 'Q', 'J', 'T', 'A', '9'];

	let keys = Object.keys(dServerData);
	let nChange = randomNumber(1, keys.length);
	shuffle(keys);
	console.log('>>>change', nChange, 'items!')

	sDataUpdated = [];
	for (let i = 0; i < nChange; i++) {
		let id = keys[i];
		console.log('change rank of id', id)

		//cycle rank:
		//let r = dServerData[id].rank;
		// dServerData[id].rank = ranks[(ranks.indexOf(r) + 1) % ranks.length];

		//just choose random rank:
		dServerData[id].rank = chooseRandom(ranks);

		let o = { id: id, rank: dServerData[id].rank };
		sDataUpdated.push(o);
	}
	shuffle(sDataUpdated);

}
async function initAssets0() {
	if (VERBOSE) console.log('...initializing assets');
	return new Assets0();
}
async function getCode() { }
async function getSpec() { }
async function getServerData() {
	var dServerData = { '0': { rank: 'K' }, '1': { rank: 'Q' }, '2': { rank: '2' }, '3': { rank: '4' }, '4': { rank: 'A' }, '5': { rank: 'T' } };
	var serverData = odict2olist(dServerData); //NUR in modifyServerData gebraucht!!!
	var dPrevServerData = [];
	var sDataUpdated;


}
























//#region internal
var _sMan = null;
var serverData = null;
var prevServerData = null;
//this is a stub!
class _Server0 {
	constructor() { }

	async getInitialData() { return { '0': { rank: 'K' } }; }

	// async getInitialData{
	// return { '0': { rank: 'K' }, '1': { rank: 'Q' }, '2': { rank: '2' }, '3': { rank: '4' }, '4': { rank: 'A' }, '5': { rank: 'T' } };

}

























