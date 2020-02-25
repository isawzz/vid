var COND = {};
var FUNCS = {};
var mkMan=null; //manages UIS


function rStart() {

	mkMan = new MKManager();
	rMergeSpec();

	rAreas();

	rMappings();

	vidStep();

}
function vidStep() {
	//pre process data: check for player change needed
	processData();  //does NOTHING

	pageHeaderInit();

	rStep();
}
function rStep() {

	rPreProcessPlayers(); //adds obj_type='opponent' to all players that do not have an obj_type

	mkMan.presentationStart();
	rPresentSpec();

	rPresentBehaviors(); //should enter completed oids in DONE dict

	rPresentDefault();//???

	//getReadyForInteraction();

	//timit.showTime('*presentation done!');

}
function rPreProcessPlayers() { for (const plid in serverData.players) { let pl = serverData.players[plid]; if (nundef(pl.obj_type)) pl.obj_type == 'opponent'; } }
function interaction(action) {
	//process interaction
	//action type can be option selected, game interrupted, or some other action...
	if (action.type == 'optionSelected') {
		//send option to server and come back at vidStep

	} else if (action.type == 'interrupt') {
		// stop game etc.... send restart or whatever and come out at _start
	} else {
		console.log('other action')
	}
}



