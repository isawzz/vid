//using keys, assets, divs for opps,table,players, full serverData in use!, preProcessedData, handle playerChange/restart
//packaging steps: 1. mapping placement, 2. flattening lists, 3. adding types (list,item)
window.onload = () => _start();
var divMain, divPlayer, divOpps, colors, iColor, packageList, presentationLists, timit;

//#region control flow
async function _start() {
	timit = new TimeIt('*timer', TIMIT_SHOW);
	await loadAssets();
	await loadSpec();
	await loadCode();
	await loadInitialServerData();
	initUI();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
	//interaction(); //to test 2nd step
}
function findLoc(o, prop) { return o[prop] ? o[prop].toUpperCase() : null; }
async function gameStep() {

	if (serverData.waiting_for) { await sendStatus(getUsernameForPlid(serverData.waiting_for[0])); }
	if (serverData.end) { d3.select('button').text('RESTART').on('click', restartGame); }
	//console.log('>>player is:',USERNAME);
	timit.showTime('* vor package: *')

	worldMap('OPPS'); 

	preProcessData();
	//have d14, u14 ==> serverData (processed), tupleGroups, boats, SPEC, CODE

	// TODO: here I could insert computing diffed serverData

	sData = serverData; //these are the data that I actually want to present!

	//test ob Board object auf getELements anspricht
	// let boardEls = getElements(serverData.table['9'], elKey = '_obj', arrKey = 'fields'); 
	// //console.log('boardEls',boardEls,serverData.table['9']);
	// return;

	//************ createMappings ************* */
	//step1: find placements
	let placements = findPlacements(SPEC.placement, sData);
	//console.log('placements', placements);

	//step2: flatten lists
	let mappings = detectLists(placements);
	//console.log('flattened', mappings);

	//jedes mapping hat jetzt eine olist (ev layoutInfo) wenn es ein compound ist und nur omap wenn es simple object ist
	//step 4: give each mapping a listType (if compound) and an itemType
	for (const m of mappings) {
		let vis = SPEC.visualize;
		if (vis && vis[m.path]) {
			//for now only consider exact path!
			let visPath = vis[m.path];
			m.listType = visPath.listType;
			m.itemType = visPath.itemType;
			m.params = visPath;
		} else {
			m.listType = DEF_LIST_TYPE;
			m.itemType = DEF_ITEM_TYPE;
		}
	}

	//hier muss ueberlegt werden ob sonst noch objects created werden sollen????? die nicht in spec sind!
	//bisher wurden ja nur spec objects created!
	//koennt ein default haben das sagt was zB mit objects geschehen soll
	//koennt auch hier noch eine runde machen und alle objects auffangen die nicht in UIS sind
	//das kann auch schon in findPlacements gemacht werden!!!

	//************ create Objects ************* */
	//step 4: create all objects
	//for each item mapping: create 1 object
	//for each list mapping create 1 object + 1 for each item in olist
	for (const m of mappings) {
		if (m.olist) {
			//this is a container mapping
			let oContainer = registerObject(m.oid, m.props, m);
			let oItems = m.olist.map(x => registerObject(x, [], m, oContainer.id));
			oContainer.childIds = oItems.map(x=>x.id);

		} else {
			let oItem = registerObject(m.oid, m.props, m); //can props ever be != [] with item objects???
		}
	}
	//console.log(UIS);

	//step 5: create ui: P0 SIMPLEST!!!!!!!!
	//UIS have been registered but they dont have dom els yet!
	//UIS have childIds and mParentId (domParentId will be id of domHierarchy parent!)
	//jedes mapping hat mapping von parent (if child) else own mapping (if listType)
	//what if it is both child AND parent?!?!?!?!?
	//wie komm ich dann von child zu parent?
	//parent-child rel muss gesetzt werden in reg object!!!
	//each registered object at this point should have enough information to present itself!!!
	//if it is a leaf, it should call itemType, otherwise listType.createContainer and then
	//listType.arrangeChildren
	//for now can provide listType_create,listType_arrange functions

	//mks are ready
	//

	//1. need player and opp areas named w/ pl.name.toUpperCase(): hardcoded for now!!!
	// OK

	//2. need to create other areas as per layout if any! ==>spare that for now!
	// OK

	//3. for each UIS el create an elem acc to container / listType | child / itemType
	// no pos yet!
	//what about size???!!!
	//can I resolve location at this point?
	//robber: self.loc
	//ja, versuch ma es
	//1. damit locations correctly resolved werden koennen muss zuerst alle ui elems createn,
	for(const uid in UIS){
		let mk = UIS[uid];
		let uiFunc = defaultUIFunc; //TODO: findUIFunc(mk);
		uiFunc(mk);
	}

	//2. dann alle appendChilds machen (mit loc berechnung!!!)
	
	for(const uid in UIS){
		let mk = UIS[uid];
		//berechne loc!
		// mach einfach beispiele hier!!!!!
		//beispiel fuer UIS 1 ... 7
		//fuer board gilt:
		if (mk.oid == mk.mapping.oid){
			let loc = mk.mapping.loc;
			let elLoc=mBy(loc);
			if (elLoc) {
				mAppend(elLoc,mk.elem);
				//console.log('appending',mk.id,'to',elLoc);
			}else if (startsWith(loc,'self.')){
				let props=loc.split('.').slice(1);
				let o=mk.o;
				for(const prop of props){
					if (o[prop]) o=o[prop];

				}
				//console.log('o',o);
				let oid = o._obj?o._obj:o; //getServerObject(o._obj);
				//console.log('oid',oid);
				//jetzt brauch ich aber die id von der main ui von o, also das mk!
				//wenn es mehrere main uis fuer o gibt, muss JEDES davon so ein object bekommen!!!
				//das ist schwierig!!!
				//ausserdem weiss ich garnicht, welches eines bekommen muss!!!
				//just for now assume there is only 1 main uid for each oid

				let uidLoc = getFirstId(oid);
				//console.log('getVisual('+oid+')',uidLoc);

				//hier ist jetzt die frage wie finde ich heraus dass ich den robber nicht AUF das field 
				//sondern auf das Board in der POSITION vom field appenden muss?!?!?!?!?!?!?
				//or, andere frage, wie kann ich zu einem g elem ein anderes g elem appenden?
				elLoc = UIS[uidLoc].elem; //mBy(uidLoc);
				//console.log('elLoc',elLoc)
				mAppend(elLoc,mk.elem); //append geht nicht weil div el noch nicht appended ist
			}
		} else if (mk.mParentId){
			//hier ist der fall wo
			let elLoc = UIS[mk.mParentId].elem; //mBy(uidLoc);
			//console.log('elLoc',elLoc)
			mAppend(elLoc,mk.elem); //append geht nicht weil div el noch nicht appended ist


		}
	}


	//dann erst kann measuren! (getBounds geht erst dann!)
	//kann ich fuer jetzt einfach nur divs verwenden??? fuer itemType UND fuer listType???


	// timit.showTime('* nach package: *')
}







//#region rest
async function restartGame() {
	await sendRestart();
	d3.select('button').text('NEXT MOVE').on('click', interaction);
	gameStep();
}


function updateSelection(data, area) {
	//console.log('______ *** updateSelection *** ', data)
	//console.log('data', data.map(x => x.id)); 

	let virtualSelection = d3.select('#' + area).selectAll("div");
	let n = virtualSelection.size();
	//console.log('#containers:'+ n, '#items:'+ data.length, 'area:'+area)
	//console.log('n', n, 'd.len', data.length, 'color', colors[iColor])

	let binding;
	if (n == 0) {
		binding = virtualSelection.data(data).enter().append('div');
		//console.log('*****binding.nodes()', binding.nodes());
	} else {
		binding = virtualSelection.data(data, x => x.id);
		//console.log('.....binding.nodes()', binding.nodes());
		//leave other nodes unchanged: no exit() clause!
	}

	gestalte(binding, colors[iColor]);
	iColor = (iColor + 1) % colors.length;
}
function cardFace(d, i) { return 'para ' + i + ': card ' + d.rank; }
function gestalte(sel, color) { sel.text(cardFace); sel.style('color', color); }

async function interaction() {
	await sendAction();
	gameStep();
}

function initUI() {
	document.title = 'HA!';
	divMain = d3.select('#MAIN');
	divPlayer = d3.select('#PLAYER');
	divOpps = {};
	let dOpps = d3.select('#OPPS');
	for (const plid in playerConfig[GAME].players) {
		let dPlid = dOpps.append('div').attr('id', plid);
		divOpps[plid] = dPlid;
	}

	colors = ['blue', 'red', 'green', 'purple', 'black', 'white'];
	iColor = 0;
}
