//#region vars
var timit = null;
var mkMan = new MKManager();

window.onload = () => _start();
//#endregion

async function _start(resetLocalStorage = false) {

	clear();

	timit = new TimeIt('*timer',false);//,false); // [true] | false (false fuer tacit)

	//resetLocalStorage = true; //********** true for LOCALSTORAGE CLEAR!!!!! */
	await loadAssets(resetLocalStorage);

	rStart();

//	makeCard52_test(1, null, { key: 'green2', area: 'decks' });
}


function clear() {
	for(const name of ['a_d_actions','status','tableTop','a_d_log','a_d_objects']) clearElement(name);
	mById('status').innerHTML='status';
	mkMan.clear();
}
