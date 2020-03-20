var daman = null; //asset manager: also has userCode,userSpec,serverData,prevServerData as code,spec,sData,psData
var rsman = null; //rsg manager
var uiman = null; //user interaction/interface manager

//#region prelims
window.onload = () => _startSession();

async function _startSession() {
	timit = new TimeIt(getFunctionCallerName(), TIMIT_SHOW);

	daman = await initAssets();
	rsman = await initRsg();
	uiman = await initUI();

	await _startNewGame();
}
async function _startNewGame(game) {
	await daman.initGameAssets(); //update playerConfig
	_startGame();
}
async function _startGame() {
	//merge spec => SPEC
	await daman.initSpecAndCode(); //load spec,code,initial serverData
	await daman.initServerData();
	_startStep();
}
//#endregion

function init() { updateSelection(odict2olist(dServerData)); }
function step() { modifyServerDataRandom(); updateSelection(sDataUpdated); }

async function _startStep() {
	let serverData = daman.getServerData();
	let augData = rsman.augment(serverData);
	//will ich da noch irgendwas mit den data machen???
	rsman.present(augData);

	



}

























