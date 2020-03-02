
var scenarioQ = [];
var scenarioRunning = false;

function onClickPushScenario(cheatCode, actionCode) {
	//scenarioQ = [];
	scenarioQ.push(async () => {await route_server('/cheat/' + cheatCode);onClickRunToAction(actionCode)});
	scenarioQ.push(() => onClickSelectTuple(null, strategicBoat([actionCode])));
	//console.log('...scenario',scenarioQ)
	if (!scenarioRunning) { scenarioRunning = true; onClickStep(); }
}










