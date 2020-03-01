window.onload = () => _startSession();

async function _startSession(resetLocalStorage = false) {

	timit = new TimeIt('*timer',true); // [true] | false (false fuer tacit)

	//resetLocalStorage = true; //********** true for LOCALSTORAGE CLEAR!!!!! */
	await loadAssets(resetLocalStorage);
	timit.showTime('*load asset and server done!');

	updatePlayerConfig();

	_startNewGame();

	//	makeCard52_test(1, null, { key: 'green2', area: 'decks' });
}
function _startNewGame(){_startGame();}
function _startGame(){
	//existing log divs are cleared or LOG is cleared
	logClearAll();
	_startStep();

}

function _startStep() {
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

	rPresentLog();

	timit.showTime('*presentation done!');

	if (serverData.options) {
		presentActions();
		getReadyForInteraction();
	} else if (serverData.waiting_for) {
		presentWaitingFor(); //das ist async!!!
	}


	//calcScreenSizeNeeded();
	//if (firstTime) openTab(mById('bObjects'));
	//zoom_on_resize('actions','table','logDiv',30);
	//if (firstTime) {firstTime = false; initZoomToFit('actions','table','logDiv',30);}
}

function presentStatus() {
	if (isdef(serverData.status)) {
		let lineArr = serverData.status.line;

		let areaName = isPlain() ? 'statusInHeaderText' : 'status';
		let d = mById(areaName);
		//TODO delete refs in status line! only have to do that if not clear everything anyway!

		clearElement(d);

		//make aux for current player (TODO: could reuse these but maybe not necessary)
		let pl = G.player;
		let msStatus = makeAux(G.playersAugmented[pl].username + ' (' + pl + ')', pl, areaName);
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
}
function setStatus(s) {
	let areaName = isPlain() ? 'c_d_statusInHeaderText' : 'c_d_statusText';
	let d = document.getElementById(areaName);
	let mobj = UIS[areaName];
	mobj.clear(); clearElement(d);
	d.innerHTML = s;
}

function rPresentLog() {
	if (nundef(serverData.log)) return;
	let pl = gamePlayerId;

	let dLog=logGetDiv(pl);
	let logId = dLog.id;
	
	// let dLog=mTextDiv('hallo','logDiv');
	// mStyle(dLog,{'background-color':'red',color:'blue',width:100,height:100,position:'relative',left:0,top:0},'%');
	// mFont(dLog,20);
	// let logId = 'logDiv' + '_' + pl;
	// dLog.id = logId;
	logRenew();
	let BASEMARGIN = 16;
	//let lineDiv;
	for (const logEntry of serverData.log) {
		let lineArr = logEntry.line;
		let lineDiv = document.createElement('div');
		logAddLine(lineDiv);
		lineDiv.style.marginLeft = '' + (BASEMARGIN * (logEntry.level)) + 'px';
		for (const item of lineArr) {
			if (isSimple(item)) {
				let s = trim(item.toString());
				if (!isEmpty(s)) {
					//console.log('adding item:', s, 'to log');
					lineDiv.appendChild(document.createTextNode(item));
					//let node=document.createElement('div');
					//node.innerHTML = item;
					//d.appendChild(node); //ausgabe+=item+' ';
				}
			} else if (isDict(item)) {
				//console.log(item);
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
		
		//lineDiv.scrollIntoView();
	}
	dLog.scrollTop = dLog.scrollHeight;
	
}

function processLog(data) {
	if (nundef(serverData.log)) return;
	//if (!G.log) G.log = {};
	let pl = gamePlayerId;// G.player;
	//if (!G.log[pl]) G.log[pl] = {};
	//let dict = G.log[pl];
	//G.logUpdated = []; //keys to new logs
	for (const logEntry of data.log) {

		//save this log so it isnt created multiple times!!!
		//let key = logEntry.line.map(x => isSimple(x) ? x : x.val).join(' ');
		//	let key = '' + logCounter + '_' + logEntry.line.map(x => isSimple(x) ? x : x.val).join(' ');
		//	logCounter += 1;

		//	if (dict[key]) continue;
		//	dict[key] = logEntry;
		//	G.logUpdated.push(key);
	}
}

