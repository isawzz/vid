

function clearStep() {
	//TODO: better naming!!!

	mkMan = new MKManager();
	PREFERRED_CARD_HEIGHT=0;

	pageHeaderClearAll();
	for(const name of ['actions','status','table','a_d_objects','a_d_players']) clearElement(name);
	mById('status').innerHTML='status';
}












