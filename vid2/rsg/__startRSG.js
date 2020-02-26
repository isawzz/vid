var COND = {};
var FUNCS = {};
var mkMan = null; //manages UIS
var tupleGroups = null;

function vidStart(){
	mkMan = new MKManager();
	clear();
	pageHeaderInit();

	rStart();

}
function rStart() {

	rMergeSpec();

	rAreas();

	rMappings();

	vidStep();

}
function vidStep() {
	//pre process data: check for player change needed
	processData();  //does NOTHING

	rStep();
}
function rStep() {

	//preProcess
	rPreProcessPlayers(); //adds obj_type='opponent' to all players that do not have an obj_type
	rPreProcessActions();

	//present
	mkMan.presentationStart();
	rPresentSpec();

	rPresentBehaviors(); //should enter completed oids in DONE dict

	rPresentDefault();//???

	presentActions();	

	getReadyForInteraction();

	timit.showTime('*presentation done!');

}
function rClear(){

}
function presentActions() {
	deleteActions(); //clear rest of action data from last round
	if (!tupleGroups) return;
	let areaName = 'a_d_divSelect';
	let div = mById(areaName);
	div.scrollTop = 0;
	let iGroup = 0;
	let iTuple = 0;

	for (const tg of tupleGroups) {
		for (const t of tg.tuples) {
			let boatInfo = { obj_type: 'boat', oids: [], desc: tg.desc, tuple: t, iGroup: iGroup, iTuple: iTuple, text: t.map(x => x.val), weg: false };
			let mobj = makeDefaultAction(boatInfo, areaName);
			iTuple += 1;
		}
		iGroup += 1;
	}
}



function rPreProcessPlayers() { for (const plid in serverData.players) { let pl = serverData.players[plid]; if (nundef(pl.obj_type)) pl.obj_type == 'opponent'; } }
function rPreProcessActions() {
	if (!serverData.options) tupleGroups = null;
	tupleGroups = getTupleGroups();
	console.log(tupleGroups);
}

function getReadyForInteraction(){
	startInteraction();
}
async function interaction(action,data) {
	//interaction(INTERACTION.selected,mk.o);
	//action type can be option selected, game interrupted, or some other action...
	if (action == INTERACTION.selected) {
		//send option to server and come back at vidStep
		let boat = data;
		console.log('selected',data);
		let route = '/action/' + USERNAME + '/' + serverData.key + '/' + boat.desc + '/';
		let t = boat.tuple;
		console.log('tuple is:',t);
		route += t.map(x => _pickStringForAction(x)).join('+');
		console.log('sending action...',route);
		// /action/felix/91b7584a2265b1f5/loc-settlement/96
		// /action/felix/91b7584a2265b1f5/loc-settlement/95
		let result = await route_server_js(route);
		console.log('server returned',result);
		serverData = result;
		vidStart();

	} else if (action == INTERACTION.stop) {
		// stop game etc.... send restart or whatever and come out at _start
		console.log('interrupt!')
	} else {
		console.log('other action')
	}
}

//#region tupleGroups
function getTupleGroups() {
	let act = serverData.options;

	//console.log('options', act)
	// json_str = JSON.stringify(act);
	// saveFile("yourfilename.json", "data:application/json", new Blob([json_str], { type: "" }));

	let tupleGroups = [];
	for (const desc in act) {
		let tg = { desc: desc, tuples: [] };
		//let tuples = expand99(act[desc].actions);
		let tuples = expand1_99(act[desc].actions);
		//console.log('*** ', desc, '........tuples:', tuples);

		if (tuples.length == 1 && !isList(tuples[0])) tuples = [tuples];
		//console.log(tuples)
		tg.tuples = tuples;
		tupleGroups.push({ desc: desc, tuples: tuples });
	}
	//console.log('tupleGroups', tupleGroups);
	return tupleGroups;
}
function expand1_99(x) {
	//console.log('expand1_99 input', tsRec(x))
	//console.log('expand1_99');
	if (isList(x)) {
		console.log('expand1_99: x should be dict BUT is a list', x);
	}
	if (isDict(x)) { // TODO:  || isList(x)) {
		// if (isList(x)) {
		// 	console.log('process: list',x)
		// }
		if ('_set' in x) {
			//console.log('handleSet wird aufgerufen')
			return handleSet(x._set);
		} else if ('_tuple' in x) {
			//console.log('handleTuple wird aufgerufen')
			return handleTuple(x._tuple);
		} else if ('type' in x) {
			return handleAction(x);
		} else { error('IMPOSSIBLE OBJECT', x); return null; }
	} else { error('IMPOSSIBLE TYPE', x); return null; }
}
function handleSet(x) {
	let irgend = x.map(expand1_99);
	let res = stripSet(irgend);
	return res;
}
function handleTuple(x) {
	let irgend = x.map(expand1_99);
	return multiCartesi(...irgend);
}
function handleAction(x) {
	return [[x]];
}
function isActionElement(x) {
	return typeof x == 'object' && 'type' in x;
}
function isListOfListOfActions(x) {
	return isList(x) && x.length > 0 && isList(x[0]) && x[0].length > 0 && isActionElement(x[0][0]);
}
function cartesi(l1, l2) {
	//l1,l2 are lists of list
	let res = [];
	for (var el1 of l1) {
		for (var el2 of l2) {
			res.push(el1.concat(el2));
		}
	}
	return res;
}
function multiCartesi() {
	//each arg is a list of list
	let arr = Array.from(arguments);
	if (arr.length > 2) {
		return cartesi(arr[0], stripSet(multiCartesi(...arr.slice(1))));
	} else if (arr.length == 2) return cartesi(arr[0], arr[1]);
	else if (arr.length == 1) return arr[0];
	else return [];
}
function stripSet(x) {
	if (isListOfListOfActions(x)) return x;
	else if (isActionElement(x)) return [[x]];
	else if (isList(x) && isActionElement(x[0])) return [x];
	else return [].concat(...x.map(stripSet));
	//return isList(x)&&x.length>0?stripSet(x[0]):x;
}
//#endregion tupleGroups

//#region helpers
function _pickStringForAction(x) {
	//x is a tuple element, eg., {type:'fixed', val:'pass'} or {ID: "0", val: "hex[0]", type: "obj"}
	//console.log('pickStringForAction',x)
	if (x.type == 'fixed') return x.val;
	if (x.type == 'obj') return x.ID;
	if (x.type == 'player') return x.val;
}






