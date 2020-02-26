//#region vars
var timit = null;

window.onload = () => _start();
//#endregion

async function _start(resetLocalStorage = false) {

	timit = new TimeIt('*timer',true); // [true] | false (false fuer tacit)

	//resetLocalStorage = true; //********** true for LOCALSTORAGE CLEAR!!!!! */
	await loadAssets(resetLocalStorage);

	timit.showTime('*load asset and server done!');

	updatePlayerConfig();

	vidStart();

//	makeCard52_test(1, null, { key: 'green2', area: 'decks' });
}


function clear() {
	//TODO: better naming!!!
	pageHeaderClearAll();
	gamePlayerId=null;
	for(const name of ['a_d_divSelect','status','tableTop','a_d_log','a_d_objects']) clearElement(name);
	mById('status').innerHTML='status';
	G={};//do I really need that??? TODO: eliminate
}
