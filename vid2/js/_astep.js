var mkMan = null; //manages UIS
var tupleGroups = null;
var prevPlayerId = null;
var gamePlayerId = null;
var nextPlayerId = null;
var plWaitingFor;
var prevWaitingFor;


function clearStep() {
	//TODO: better naming!!!
	pageHeaderClearAll();
	gamePlayerId=null;
	for(const name of ['a_d_divSelect','status','tableTop','a_d_objects']) clearElement(name);
	mById('status').innerHTML='status';
}











