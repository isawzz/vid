//#region vars
var timit = null;

window.onload = () => _start();
//#endregion

async function _start(resetLocalStorage = false) {

	clear();

	timit = new TimeIt('*timer',false);//,false); // [true] | false (false fuer tacit)

	//resetLocalStorage = true; //********** true for LOCALSTORAGE CLEAR!!!!! */
	await loadAssets(resetLocalStorage);


	updatePlayerConfig();

	rStart();

//	makeCard52_test(1, null, { key: 'green2', area: 'decks' });
}


function clear() {
	for(const name of ['a_d_actions','status','tableTop','a_d_log','a_d_objects']) clearElement(name);
	mById('status').innerHTML='status';
	if (mkMan) mkMan.clear();
	G={};//do I really need that??? TODO: eliminate
}
