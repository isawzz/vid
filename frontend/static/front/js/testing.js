//#region test iconChars after changing it to cacheDict
function addPicto(IdBoard, key, sz, x, y) {
	let mobj = makeDrawingElement(getUID(), 'board');
	let ch;
	try {
		ch = iconChars.get(key);
		if (!ch) {
			key = iconChars.getRandomKey(); 
			//console.log(iconChars.live)
			//key = firstCondDictKeys(iconChars.live,x=>x.includes('s')); 
			//key = iconChars.getFirstKey(x=>x.includes('box'));
			console.log(key)
			ch = iconChars.get(key);
		}
	} catch{
		ch = iconChars[key];
	}
	console.log('in addPicto got key', key, ch);
	mobj._pictoFromChar(ch, x, y, sz, sz, randomColor());
	mobj.attach();
}
function testPicto_dep(n) {
	initRSGData(); showGame(); initDom();
	let board = makeDrawingArea('board', 'a_d_game', true);
	let keys = ['achievement', 'wheat', 'criminal', 'police', 'cop', 'trophy', 'victory', 'plenty', 'fruit', 'bounty', 'house', 'castle', 'building', 'settlement', 'city', 'robber', 'thief', 'street', 'road'];
	let y = -300;
	let x = -300;
	let i = 0;
	loadIconChars([() => {
		console.log(iconChars);
		for (const k of keys) {
			addPicto('board', k, 50, x, y);
			if (y > 250) { y = -300; x += 60; } else y += 60;
			i += 1; if (i >= n) break;
		}
	}]);
}

async function testPicto(n) {
	initRSGData(); showGame(); initDom();
	let board = makeDrawingArea('board', 'a_d_game', true);
	let keys = ['achievement', 'wheat', 'criminal', 'police', 'cop', 'trophy', 'victory', 'plenty', 'fruit', 'bounty', 'house', 'castle', 'building', 'settlement', 'city', 'robber', 'thief', 'street', 'road'];
	let y = -300;
	let x = -300;
	let i = 0;
	timit.showTime('************server');
	iconChars = await vidCache.load('iconChars', route_iconChars);
	timit.showTime('iconChars');
	console.log(iconChars);
	for (const k of keys) {
		addPicto('board', k, 50, x, y);
		if (y > 250) { y = -300; x += 60; } else y += 60;
		i += 1; if (i >= n) break;
	}
}

//#region test pictos w/ icons that are same in gameIcons and faIcons, new route_rsg_asset async function
function addPictoFromChar(IdBoard, ch, sz, x, y) {
	let mobj = makeDrawingElement(getUID(), 'board');
	mobj._pictoFromChar(ch, x, y, sz, sz, randomColor());
	mobj.attach();
}
async function testFaKeysNotInGa() {
	initRSGData(); showGame(); initDom();
	let gaIcons = await route_rsg_asset('gameIconCodes');
	let faIcons = await route_rsg_asset('faIconCodes');
	let smallIcons = await route_rsg_asset('iconTest');
	faKeys = [];
	for (const k in faIcons) {
		if (nundef(gaIcons[k])) faKeys.push(k);
	}
	console.log('common keys:', faKeys);
	let board = makeDrawingArea('board', 'a_d_game', true);
	setAreaWidth('a_d_game', 2400);
	setAreaHeight('a_d_game', 1500);

	// let mobj = makeDrawingElement('el1', 'board');

	let keys = faKeys; //.slice(0,100);//['achievement', 'wheat', 'criminal', 'police', 'cop', 'trophy', 'victory', 'plenty', 'fruit', 'bounty', 'house', 'castle', 'building', 'settlement', 'city', 'robber', 'thief', 'street', 'road'];
	let xStart = -1100;
	let yStart = -670;
	let y = yStart;//-300;
	let x = xStart;//-300;
	// for (const k of keys) {
	// 	addPictoFromChar('board', gaIcons[k], 50, x, y);
	// 	if (y > -yStart) { y = yStart; x += 60; } else y += 60;
	// }
	// y=yStart;x+=60;
	for (const k of keys) {
		addPictoFromChar('board', faIcons[k], 50, x, y);
		if (y > -yStart) { y = yStart; x += 60; } else y += 60;
	}
	// let key = chooseRandom(Object.keys(faChars));//'clock';
	// mobj._picto('crow', -100, -100, 100, 100, randomColor());

	//mobj.text({txt:fasym(key),family:'FontAwesome',fill:'white',fz:100});
	//mobj._picto('knight',0,0,50,100,'white','blue');
	//_makeGroundShape(mobj, 0, 0, 100, 100, 'blue', 'quad', { scaleY: 2, rot: 45 });
	//mobj.setScaleX(1);
	//mobj.text({txt:'hallo',fill:'white'})

	// mobj.attach();
	// console.log(mobj)
}
async function testCommonKeys() {
	initRSGData(); showGame(); initDom();
	let gaIcons = await route_rsg_asset('gameIconCodes');
	let faIcons = await route_rsg_asset('faIconCodes');
	let smallIcons = await route_rsg_asset('iconTest');
	faKeys = [];
	for (const k in gaIcons) {
		if (isdef(faIcons[k])) faKeys.push(k);
	}
	console.log('common keys:', faKeys);
	let board = makeDrawingArea('board', 'a_d_game', true);
	setAreaWidth('a_d_game', 1400);
	setAreaHeight('a_d_game', 1000);

	// let mobj = makeDrawingElement('el1', 'board');

	let keys = faKeys; //.slice(0,100);//['achievement', 'wheat', 'criminal', 'police', 'cop', 'trophy', 'victory', 'plenty', 'fruit', 'bounty', 'house', 'castle', 'building', 'settlement', 'city', 'robber', 'thief', 'street', 'road'];
	let xStart = -600;
	let yStart = -400;
	let y = yStart;//-300;
	let x = xStart;//-300;
	for (const k of keys) {
		addPictoFromChar('board', gaIcons[k], 50, x, y);
		if (y > -yStart) { y = yStart; x += 60; } else y += 60;
	}
	y = yStart; x += 60;
	for (const k of keys) {
		addPictoFromChar('board', faIcons[k], 50, x, y);
		if (y > -yStart) { y = yStart; x += 60; } else y += 60;
	}
	// let key = chooseRandom(Object.keys(faChars));//'clock';
	// mobj._picto('crow', -100, -100, 100, 100, randomColor());

	//mobj.text({txt:fasym(key),family:'FontAwesome',fill:'white',fz:100});
	//mobj._picto('knight',0,0,50,100,'white','blue');
	//_makeGroundShape(mobj, 0, 0, 100, 100, 'blue', 'quad', { scaleY: 2, rot: 45 });
	//mobj.setScaleX(1);
	//mobj.text({txt:'hallo',fill:'white'})

	// mobj.attach();
	// console.log(mobj)
}
async function atestLoadIcons() {

	timit.showTime('_______start gameIconCode');
	let gaIcons = await route_rsg_asset('gameIconCodes');
	timit.showTime('_______start faIconCodes');
	let faIcons = await route_rsg_asset('faIconCodes');
	timit.showTime('_______start iconTest');
	let smallIcons = await route_rsg_asset('iconTest');
	timit.showTime('nach atestLoadIconst');
	faKeys = [];
	for (const k in gaIcons) {
		if (isdef(faIcons[k])) faKeys.push(k);
	}
	console.log('common keys:', faKeys);

}

function _test01_load_game_info() {
	timit = new TimeIt('*');
	timit.showTime('hallo');
	ensureAllGames([() => timit.showTime('done')]);

}


//#region test async await
async function loadAsset() {
	let response = await fetch('/frontend/static/rsg/assets/gameIconCodes.yml');
	console.log(response);
}
async function atest01() {
	let url = '/frontend/static/rsg/assets/gameIconCodes.yml';
	let response = await fetch(url);

	if (response.ok) { // if HTTP-status is 200-299
		// get the response body (the method explained below)
		//console.log(response);
		// let asjs=await response.json(); //GEHT NICHT!!!!!
		// console.log(asjs)
		let t = await response.text();
		//console.log(t);
		let iconDict = jsyaml.load(t);
		timit.showTime('nach atest01')
		console.log(iconDict);
		//console.log(jsyaml.dump(iconDict));
	} else {
		alert("HTTP-Error: " + response.status);
	}
}
function _startTest01() {
	//muss irgendeine function schreiben die ein file laded!
	//lets take loadYML
	console.log('HALLOOOOO');
	atest01(); // loadAsset | atest01
}


//#region test Lines
function testLines() {
	initRSGData(); showGame(); initDom();
	let board = makeDrawingArea('board', 'a_d_game', true);

	let mobj = makeDrawingElement('el1', 'board');
	mobj.line({ thickness: 10, cap: 'round' }).setBg('red').attach();

	console.log(mobj)
	console.log(mobj.elem)

	let [x1, y1, x2, y2] = mobj.getEndPointsOfLineSegmentOfLength(40);
	let ms2 = makeDrawingElement('el2', 'board');
	ms2.line({ thickness: 15, x1: x1, y1: y1, x2: x2, y2: y2 }).setBg('blue').attach();

	[x1, y1, x2, y2] = mobj.getEndPointsOfLineSegmentOfLength(120);
	let ms3 = makeDrawingElement('el3', 'board');
	ms3.line({ thickness: 5, x1: x1, y1: y1, x2: x2, y2: y2 }).setBg('green').attach();
}

//#region test picto
function testAndSave2() {

	let newDictFont = {};

	for (const key in faIcons) {
		newDictFont[key] = faIcons[key][3];

	}
	let json_str = JSON.stringify(newDictFont);
	saveFile("yourfilename.json", "data:application/json", new Blob([json_str], { type: "" }));
	console.log('DONE!')

}
function testAndSave() {
	sendRoute('/loadYML/icons', d => {
		console.log(d);
		let dictFont = JSON.parse(d);
		console.log(dictFont);

		let newDictFont = {};

		for (const key in dictFont) {
			newDictFont[key] = dictFont[key].unicode;

		}
		let json_str = JSON.stringify(newDictFont);
		saveFile("yourfilename.json", "data:application/json", new Blob([json_str], { type: "" }));
		console.log('DONE!')
		//testPicto();
	})

}
function addPicto_dep(IdBoard, key, sz, x, y) {
	if (!(key in iconChars)) key = 'crow';

	console.log('found key:', key);
	let mobj = makeDrawingElement(getUID(), 'board');
	mobj._picto(key, x, y, sz, sz, randomColor());
	mobj.attach();
}




//#region older tests
function testingMS() {
	if (isdef(IdOwner.t)) IdOwner.t.map(x => addTestInteraction1(x));
}
function addTestInteraction1(id) {
	let mobj = UIS[id];
	mobj.addClickHandler('', onClick1);
}
function onClick1(ev, mobj, part) {
	console.log(mobj)
	if (mobj.scaleValue == 2) { mobj.setScale(1); delete mobj.scaleValue; }
	else { mobj.setScale(2); mobj.scaleValue = 2; }
}
//#endregion

// #region testing new MSOB API
function drawTest(board, num) {
	clearElement(board.elem);
	let d = 10;
	let coll = [];
	for (let row = 0; row < board.h; row += d) {
		for (let col = 0; col < board.w; col += d) {
			let y = row - board.h / 2 + d / 2;
			let x = col - board.w / 2 + d / 2;
			let mobj = makeDrawingElement('el1', 'board');
			mobj.x = x; mobj.y = y;
			coll.push(mobj);
		}
	}
	timit.showTime('nach compute: number of elements=' + coll.length);
	const colors = ['red', 'green', 'yellow', 'blue', 'orange', 'violet', 'skyblue', 'sienna'];
	let keys = Object.keys(iconChars);
	//console.log(keys)
	let numPictos = Math.min(coll.length, keys.length);
	for (let i = 0; i < numPictos; i++) {
		let mobj = coll[i];
		let c = chooseRandom(colors); //colors[i%4];
		let key = keys[i];
		mobj._picto(key, mobj.x, mobj.y, d, d, c);

		//version 2:
		// if (i>=keys.length) _makeGroundShape(mobj, mobj.x, mobj.y, d, d, c, 'quad',{rounding:'4'});
		// else {
		// 	let key = keys[i];//chooseRandom(Object.keys(faIcons));//'clock';
		// 	mobj._picto(key,mobj.x,mobj.y,d,d,c);		
		// 	}

		//version 1:
		// _makeGroundShape(mobj, mobj.x, mobj.y, d, d, c, 'quad',{rounding:'4'});
	}
	timit.showTime('nach shape');
	for (const mobj of coll) {
		mobj.attach();
	}
	timit.showTime('nach attach');
	if (num > 0) setTimeout(() => drawTest(board, num - 1), 0);
	else return coll;
}
function change(arr, n) {
	//randomly change n elements
	for (let i = 0; i < n; i++) {
		let mobj = chooseRandom(arr);
		//destr
	}
}
function stressTest() {
	initRSGData(); showGame(); initDom();
	timit.reset();
	let board = makeDrawingArea('board', 'a_d_game', true);

	//console.log(board)
	coll = drawTest(board, 3);



}
function testNewMSAPI() {
	initRSGData(); showGame(); initDom();
	let board = makeDrawingArea('board', 'a_d_game', true);


	let mobj = makeDrawingElement('el1', 'board');

	_makeGroundShape(mobj, 0, 25, 100, 100, 'blue', 'quad', { scaleY: 2, rot: 45 });
	//mobj.setScaleX(1);
	//mobj.text({txt:'hallo',fill:'white'})
	mobj.attach();
	console.log(mobj)
}
function testShapes() {
	initRSGData(); showGame(); initDom();

	let board = makeDrawingArea('board', 'a_d_game', true);
	//console.log('board:',board)
	let mobj = makeDrawingElement('el1', 'board');
	//console.log('shape:',mobj)
	let sz = 200;
	let c = 'blue';
	let c1 = anyColorToStandardString('green', .1);
	console.log(c1);



	makeVisual(mobj, 0, 0, sz, sz, c1, 'quad');
	mobj.text({ txt: 'hallo', fill: colorDarker(c), fz: 30, y: -sz / 3 });
	//mobj.rect({w:sz/2,h:sz/2,fill:'red'});



	mobj.ellipse({ w: sz / 2, h: sz / 2, fill: 'green', alpha: .5 })
	mobj.attach();

	//mobj.setBg('transparent')
	//console.log(mobj.elem);
	//console.log(mobj.ground,mobj.overlay)

	mobj.addClickHandler('', () => {
		mobj.setShape('star');
		//console.log(mobj.ground,mobj.overlay);
	});

	let ms1 = makeDrawingElement('el2', 'board');
	makeVisual(ms1, -sz, 0, sz, sz, c1, 'triangle');
	ms1.attach();

}
// #endregion

//#region test cards
var cards1 = {
	'c1':
	{
		desc: "Move the Robber. Steal 1 resource card from the owner of an adjacent settlement or city.",
		name: "Knight",
		obj_type: "devcard",
		visible: { _set: ["White", "Red", "Blue", "Orange"] },
	},
	'c2':
	{
		desc: "1 Victory Point!",
		name: "Victory Point",
		obj_type: "devcard",
		visible: { _set: ["White", "Red", "Blue", "Orange"] },
	},
	'c3':
	{
		desc: "Take any 2 resources from the bank. Add them to your hand. They can be 2 of the same or 2 different resources.",
		name: "Year of Plenty",
		obj_type: "devcard",
		visible: { _set: ["White", "Red", "Blue", "Orange"] },
	},
	'c4':
	{
		desc: "Place 2 new roads as if you had just built them.",
		name: "Road Building",
		obj_type: "devcard",
		visible: { _set: ["White", "Red", "Blue", "Orange"] },
	},
	'c5':
	{
		desc: "When you play this card, announce 1 type of resource. All other players must give you all their resource cards of that type.",
		name: "Monopoly",
		obj_type: "devcard",
		visible: { _set: ["White", "Red", "Blue", "Orange"] },
	},

};
var card1 = cards1['c1'];
function testCards() {
	initRSGData(); hideLobby(); hideLogin(); showGame(); initDom();

	//testShowCards1();
	testPlayerHand1();
}
function testPlayerHand1() {
	G.table = cards1;

	G.playersAugmented = {
		White: {
			devcards: { _set: [{ _obj: 'c1' }, { _obj: 'c3' }] }
		}
	};
	_showHand(['c1', 'c2', 'c3'], 'a_d_game');
}
//#endregion


//#region test page header
function testPageHeader() {
	pageHeaderClearAll();
	pageHeaderSetGame();
	pageHeaderAddPlayer('username', 'playerId', 'green', true);

}
//#endregion

//#region testing table
function _testTable() {
	initRSGData(); hideLobby(); hideLogin(); showGame(); initDom();
	let gplayers = {
		White: {
			altName: "White",
			buildings: {
				city: { _set: [] },
				road: { _set: [{ _obj: "149" }] },
				settlement: { _set: [{ _obj: "148" }, { _obj: "158" }] },
			},
			color: "white",
			devcards: { _set: [] },
			id: { _player: "White" },
			opps: [{ _player: "Red" }, { _player: "Blue" }],
			opps2: { _set: ["White", "Red", "Blue"] },
			opps3: { _set: [{ _player: "Red" }, { _player: "Blue" }] },
			index: 0,
			name: "White",
			num_res: 3,
			obj_type: "GamePlayer",
			past_devcards: { _set: [] },
			reserve: { road: 14, settlement: 3, city: 4 },
			resources: { wood: 1, brick: 0, sheep: 1, ore: 0, wheat: 1 },
			username: "felix",

		},
		Red: {
			altName: "Red",
			buildings: {
				city: { _set: [] },
				road: { _set: [{ _obj: "149" }] },
				settlement: { _set: [{ _obj: "148" }, { _obj: "158" }] },
			},
			color: "Red",
			devcards: { _set: [] },
			id: "Red",
			index: 0,
			name: "Red",
			num_res: 3,
			past_devcards: { _set: [] },
			reserve: { road: 14, settlement: 3, city: 4 },
			resources: { wood: 1, brick: 0, sheep: 1, ore: 0, wheat: 1 },
			username: "maus",

		}
	};
	let gtable = {
		2: {
			col: 6,
			corners: [{ _obj: "101" }, { _obj: "102" }, { _obj: "103" }, { _obj: "104" }, { _obj: "99" }, { _obj: "98" }],
			edges: [{ _obj: "27" }, { _obj: "26" }, { _obj: "25" }, { _obj: "24" }, { _obj: "23" }, { _obj: "22" }],
			neighbors: [null, null, { _obj: "78" }, { _obj: "79" }, { _obj: "70" }, null],
			num: 11,
			obj_type: "hex",
			res: "ore",
			row: 0,
			visible: { _set: ["White", "Red", "Blue"] }
		},
		148: {
			loc: { _obj: "131" },
			obj_type: "settlement",
			player: {
				_player: "White"
			},
			opps: { opp1: { _player: "Red" }, opp2: { _player: "Blue" } },
			visible: {
				_set: [{ _player: "Red" }, { _player: "Blue" }]
			},
		},
		149: {
			loc: { _obj: "138" },
			obj_type: "settlement",
			player: {
				_player: "White"
			},
			visible: {
				_set: ["White", "Red", "Blue"]
			},
		},
		158: {
			loc: { _obj: "134" },
			obj_type: "road",
			player: {
				_player: "Red"
			},
			visible: { _set: ["White", "Red", "Blue"] },
		},
		145: {
			cols: 9,
			corners: { _set: [{ _obj: "101" }, { _obj: "102" }, { _obj: "103" },] },
			edges: { _set: [{ _obj: "101" }, { _obj: "102" }, { _obj: "103" },] },
			fields: { _set: [{ _obj: "101" }, { _obj: "102" }, { _obj: "103" },] },
			map: {
				_ndarray: [
					[null, { _obj: "3" }, null, { _obj: "4" }],
					[{ _obj: "5" }, null, { _obj: "6" }, null, { _obj: "7" }],
					[null, { _obj: "8" }, null],
				]
			},
			obj_type: "board",
			rows: 5,
			visible: { _set: ["White", "Red", "Blue"] }
		}
	};
	console.log('gplayers', gplayers);
	console.log('gtable', gtable);
	addTableToArea(gtable[145], 'a_d_game');
	addTableToArea(gtable[148], 'a_d_game');

	addTableToArea(gplayers.White, 'a_d_objects');
}
function addTableToArea(o, areaName) {
	let d = UIS[areaName].elem;
	let t = tableElemX(o);
	console.log('d', d)
	console.log('t', t.table)
	d.appendChild(t.table)
	d.appendChild(document.createElement('hr'));
}
function _test() {
	//test tuples
	let o1 = {
		"_set": [
			{
				"_tuple": [
					{
						"_set": [
							{ "ID": "91", "val": "Corner[91]", "type": "obj" },
							{ "ID": "92", "val": "Corner[92]", "type": "obj" },
							{ "ID": "93", "val": "Corner[93]", "type": "obj" },
						]
					}
				]
			}
		]
	};
	let o3 = {
		"_set": [
			{
				"_tuple": [
					{
						"_set": [
							{ "ID": "1", "val": "Corner[1]", "type": "obj" },
							{ "ID": "2", "val": "Corner[2]", "type": "obj" },
						]
					},
					{
						"_set": [
							{ "ID": "3", "val": "Corner[3]", "type": "obj" },
						]
					},
				]
			}
		]
	};
	let o4 = {
		"_tuple": [
			{
				"_set": [
					{ "ID": "1", "val": "Corner[1]", "type": "obj" },
					{ "ID": "2", "val": "Corner[2]", "type": "obj" },
				]
			},
			{
				"_set": [
					{ "ID": "3", "val": "Corner[3]", "type": "obj" },
				]
			},
			{
				"_set": [
					{ "ID": "4", "val": "Corner[3]", "type": "obj" },
					{ "ID": "5", "val": "Corner[3]", "type": "obj" },
				]
			},
		]
	};
	let o2 = {
		"_set": [
			{ "ID": "1", "val": "Corner[1]", "type": "obj" },
			{ "ID": "2", "val": "Corner[2]", "type": "obj" },
			{ "ID": "3", "val": "Corner[2]", "type": "obj" },
		]
	};
	let o5 = {
		"_set": [
			{
				"_tuple": [
					{
						"_set": [
							{ "ID": "1", "val": "Corner[1]", "type": "obj" },
							{ "ID": "2", "val": "Corner[2]", "type": "obj" },
						]
					},
					{
						"_set": [
							{ "ID": "3", "val": "Corner[3]", "type": "obj" },
						]
					},
				]
			},
			{
				"_tuple": [
					{
						"_set": [
							{ "ID": "4", "val": "Corner[1]", "type": "obj" },
							{ "ID": "5", "val": "Corner[2]", "type": "obj" },
						]
					},
					{
						"_set": [
							{ "ID": "6", "val": "Corner[3]", "type": "obj" },
						]
					},
				]
			}
		]
	};
	let o6 = {
		"_tuple": [
			{
				"_set": [
					{ "ID": "4", "val": "Corner[1]", "type": "obj" },
					{ "ID": "5", "val": "Corner[2]", "type": "obj" },
				]
			},
			{
				"_set": [
					{ "ID": "6", "val": "Corner[3]", "type": "obj" },
				]
			},
		]
	};
	let o7 = {
		"_tuple": [
			{
				"_set": [
					{ "ID": "1", "val": "Corner[1]", "type": "obj" },
					{ "ID": "2", "val": "Corner[2]", "type": "obj" },
				]
			},
			{
				"_set": [
					{ "ID": "3", "val": "Corner[3]", "type": "obj" },
				]
			},
		]
	};
	let o = o5;
	console.log('output', exp(o) ? tsRec(exp(o)) : 'undefined');
}

//#endregion














//#region older code?!?!?
function onClickGetUIS(mobj, part) {
	let id = mobj.id;
	//console.log('',counters.click,' ______ visuals for', id, id2uids[id])
}
function onClickAddInteraction() { for (const id in UIS) { addTestInteraction(UIS[id]); } }
function onClickRemoveInteraction() {
	timit.showTime('start ' + getFunctionCallerName());
	for (const id in UIS) UIS[id].removeEvents();
	timit.showTime('...end ' + getFunctionCallerName());
}
function onClickRemoveActions() {
	timit.showTime('start ' + getFunctionCallerName());
	deleteActions();
	timit.showTime('...end ' + getFunctionCallerName());
}
function onClickAddActions() {
	if (M.boats) {
		//console.log('actions already presented!'); 
		return;
	}
	timit.showTime('start ' + getFunctionCallerName());
	presentActions();
	activateActions();
	timit.showTime('...end ' + getFunctionCallerName());

}
function onClickRemoveDefaultObjects() {
	timit.showTime('start ' + getFunctionCallerName());
	deleteDefaultObjects();
	timit.showTime('...end ' + getFunctionCallerName());
}
function onClickAddDefaultObjects() {
	timit.showTime('start ' + getFunctionCallerName());

	for (const oid in G.table) {
		let mobj = makeDefaultObject(oid, G.table[oid], S.settings.table.defaultArea);
		presentDefault(oid, G.table[oid]);
		//addTestInteraction(mobj);
	}
	timit.showTime('...end ' + getFunctionCallerName());
}
function onClickRemoveDefaultPlayers() {
	timit.showTime('start ' + getFunctionCallerName());
	deleteDefaultPlayers();
	timit.showTime('...end ' + getFunctionCallerName());
}
function onClickAddDefaultPlayers() {
	timit.showTime('start ' + getFunctionCallerName());

	for (const oid in G.players) {
		let mobj = makeDefaultPlayer(oid, G.playersAugmented[oid], S.settings.player.defaultArea);
		presentDefault(oid, G.playersAugmented[oid], false);
		//addTestInteraction(mobj);
	}
	timit.showTime('...end ' + getFunctionCallerName());
}
function onClickToggle(b, key) {
	let content = b.textContent;
	//console.log(content);
	let isOn = (content[0] == '-');
	if (isOn) {
		window['S_' + key] = false;
		b.textContent = '+' + content.substring(1);
	} else {
		window['S_' + key] = true;
		b.textContent = '-' + content.substring(1);
	}
	//console.log('toggle is now:', S_showEvents, b.textContent)
}














//#endregion