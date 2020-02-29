//#region vars
var COND = {};
var FUNCS = {};
var mkMan = null; //manages UIS
var tupleGroups = null;
var prevPlayerId = null;
var gamePlayerId = null;
var nextPlayerId = null;
var plWaitingFor;
var prevWaitingFor;
var timit = null;

window.onload = () => _start();
//#endregion

async function _start(resetLocalStorage = false) {

	timit = new TimeIt('*timer',true); // [true] | false (false fuer tacit)

	//resetLocalStorage = true; //********** true for LOCALSTORAGE CLEAR!!!!! */
	await loadAssets(resetLocalStorage);
	timit.showTime('*load asset and server done!');

	updatePlayerConfig();

	vrStep();

//	makeCard52_test(1, null, { key: 'green2', area: 'decks' });
}
function vrStep() {
	mkMan = new MKManager();
	clear();
	pageHeaderInit();
	checkPlayerChange();

	rMergeSpec();

	rAreas();

	rMappings();

	//preProcess
	rPreProcessPlayers(); //adds obj_type='opponent' to all players that do not have an obj_type
	rPreProcessActions();

	//present
	mkMan.presentationStart();
	rPresentSpec();

	rPresentBehaviors(); //should enter completed oids in DONE dict

	rPresentDefault();//???
	timit.showTime('*presentation done!');

	if (serverData.options) {
		presentActions();
		getReadyForInteraction();
	} else if (serverData.waiting_for) {
		presentWaitingFor(); //das ist async!!!
	}


	//calcScreenSizeNeeded();
	openTab(mById('bObjects'))

}


function clear() {
	//TODO: better naming!!!
	pageHeaderClearAll();
	gamePlayerId=null;
	for(const name of ['a_d_divSelect','status','tableTop','a_d_log','a_d_objects']) clearElement(name);
	mById('status').innerHTML='status';
}
