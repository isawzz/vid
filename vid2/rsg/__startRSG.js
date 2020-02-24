var COND = {};
var FUNCS = {};

function rStart() {

	rMergeSpec();

	rAreas();//TODO: need to be UIS!!!

	vidStep();

}
function vidStep() {
	//pre process data: check for player change needed

	rStep();
}
function rStep() {


	rBehaviors();

	//rDefault();//???

	//getReadyForInteraction();

	//timit.showTime('*presentation done!');

}
function interaction(action) {
	//process interaction
	//action type can be option selected, game interrupted, or some other action...
	if (action.type == 'optionSelected'){
		//send option to server and come back at vidStep

	}else if (action.type == 'interrupt'){
		// stop game etc.... send restart or whatever and come out at _start
	}else{
		console.log('other action')
	}
}



