var G, S, M, UIS, IdOwner, id2oids, id2uids, oid2ids;
var dHelp, counters, timit; //for testing
var DELETED_IDS = [];
var DELETED_THIS_ROUND = [];
var flags = {};


function gameStep(data) {
	DELETED_THIS_ROUND = [];
	//timit.showTime('start presentation!');

	//console.log(jsCopy(G.serverData))
	//console.log('*** gameStep ***, data',data)
	//console.log('flags',flags)
	//console.log('___________________________')

	processData(data); //from here no access to previous serverData


	//console.log('nach processData',data,G,S)

	if (flags.specAndDOM) specAndDOM([gameStepII]); else gameStepII();
}
function gameStepII() {

	//console.log('*** gameStepII ***, data',G.serverData)

	//console.log('S_useSimpleCode',S_useSimpleCode)
	if (S_useSimpleCode) { presentTableSimple(); presentPlayersSimple(); }
	else {presentTable(); presentPlayers(); }

	//timit.showTime('presentation done!!!s')
	presentStatus();

	presentLog();
	if (G.end) { presentEnd(); return; }

	//console.log('tupleGroups',G.tupleGroups);
	if (G.tupleGroups) {
		presentActions();
		//timit.showTime('...presentation done!');
		startInteraction();

		//testingMS();

		// if (!isEmpty(commandChain)) {
		// 	let nextCommand = commandChain.shift();
		// 	//unitTestGameloop('____________COMMAND=0/' + execOptions.commandChain.length, nextCommand.name);
		// 	nextCommand();
		// } 

	} else presentWaitingFor();
}







