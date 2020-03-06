var mkMan = null; //manages UIS
var tupleGroups = null;

function clearStep() {
	//TODO: better naming!!!

	mkMan = new MKManager();
	PREFERRED_CARD_HEIGHT=0;

	pageHeaderClearAll();
	for(const name of ['a_d_divSelect','status','tableTop','a_d_objects','a_d_players']) clearElement(name);
	mById('status').innerHTML='status';
}











