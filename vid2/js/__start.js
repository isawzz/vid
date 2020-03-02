window.onload = () => _startSession();

async function _startSession(resetLocalStorage = false) {

	timit = new TimeIt('*timer', true); // [true] | false (false fuer tacit)

	//resetLocalStorage = true; //********** true for LOCALSTORAGE CLEAR!!!!! */
	await loadAssets(resetLocalStorage);
	timit.showTime('*load asset and server done!');

	addEventListener('keyup', keyUpHandler);
	addEventListener('keydown', keyDownHandler);

	await _startNewGame();

	openTab(mById('bPlayers'));

	//	makeCard52_test(1, null, { key: 'green2', area: 'decks' });
}
async function _startNewGame(game) { 
	//need to reload spec & code!
	if (isdef(game)) GAME = game;
	await loadSpecAndCode();
	updatePlayerConfig(); //sets colors for current players from initial serverData
	_startGame(); 
}
function _startGame() {
	//existing log divs are cleared or LOG is cleared
	logClearAll();
	scenarioQ = [];
	_startStep();

}

function _startStep() {
	reset_zoom_on_resize();
	mkMan = new MKManager();
	clearStep();

	pageHeaderInit();

	checkPlayerChange();

	rMergeSpec();

	rAreas();

	rMappings();

	//preProcess
	rPreProcessPlayers(); //adds obj_type='opponent' to all players that do not have an obj_type
	rPreProcessActions();

	//present
	mkMan.presentationStart();
	rPresentSpec();

	rPresentBehaviors(); //should enter completed oids in DONE dict

	rPresentDefault();//???

	rPresentStatus();
	rPresentLog();

	timit.showTime('*presentation done!');

	if (serverData.options) {
		presentActions();
		getReadyForInteraction();
	} else if (serverData.waiting_for) {
		presentWaitingFor(); //das ist async!!!
	}

	zoom_on_resize('actions', 'table', 'logDiv', 30);

}

function rPresentStatus() {
	if (nundef(serverData.status)) { return; }

	let lineArr = serverData.status.line;

	let areaName = isPlain() ? 'statusInHeaderText' : 'status';
	let d = mById(areaName);
	//TODO delete refs in status line! only have to do that if not clear everything anyway!

	clearElement(d);

	//make aux for current player (TODO: could reuse these but maybe not necessary)
	let pl = gamePlayerId;
	let msStatus = makeAux(getUsername(pl) + ' (' + pl + ')', pl, areaName);
	let color = getPlayerColor(pl);
	msStatus.setBg(color);
	msStatus.setFg(colorIdealText(color));

	d.appendChild(document.createTextNode(': '));

	for (const item of lineArr) {
		if (isSimple(item)) {
			let s = trim(item.toString());
			if (!isEmpty(s)) {
				//console.log('adding item:', s, 'to log');
				d.appendChild(document.createTextNode(item)); //ausgabe+=item+' ';
			}
		} else if (isDict(item)) {
			//console.log(item);
			if (item.type == 'obj') {
				let oid = item.ID;
				let mobj = makeAux(item.val, oid, areaName);
			} else if (item.type == 'player') {
				let oid = item.val;
				let mobj = makeAux(item.val, oid, areaName);
			}
		}
	}
}
function setStatus(s) {
	let areaName = isPlain() ? 'statusInHeaderText' : 'status';
	let d = document.getElementById(areaName);
	//clearElement(d);
	d.innerHTML = s;
}

function rPresentLog() {
	if (nundef(serverData.log)) return;
	let pl = gamePlayerId;

	let dLog = logGetDiv(pl);
	let logId = dLog.id;

	logRenew();
	let BASEMARGIN = 16;
	for (const logEntry of serverData.log) {
		let lineArr = logEntry.line;
		let lineDiv = document.createElement('div');
		logAddLine(lineDiv);
		lineDiv.style.marginLeft = '' + (BASEMARGIN * (logEntry.level)) + 'px';
		for (const item of lineArr) {
			if (isSimple(item)) {
				let s = trim(item.toString());
				if (!isEmpty(s)) { lineDiv.appendChild(document.createTextNode(item)); }
			} else if (isDict(item)) {
				if (item.type == 'obj') {
					let oid = item.ID;
					let mobj = makeAux(item.val, oid, logId, lineDiv);
				} else if (item.type == 'player') {
					let oid = item.val;
					let mobj = makeAux(item.val, oid, logId, lineDiv);
				} else {
					error('unknown item in log:', item)
				}
			}
		}
		dLog.appendChild(lineDiv);
	}
	dLog.scrollTop = dLog.scrollHeight;

}


