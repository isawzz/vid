const MIN_CARD_HEIGHT = 60;
const MAX_CARD_HEIGHT = 100;
var PREFERRED_CARD_HEIGHT = 0;

//#region make...MK
function makeArea(areaName, idParent) {
	let mk = new MK();
	let id = getAreaId(areaName);
	mk.id = id;
	let domel = document.createElement('div');
	domel.style.position = 'absolute';
	mk.elem = domel;
	mk.elem.id = id;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(mk.elem);
	mk.cat = DOMCATS[mk.domType];
	mk.idParent = idParent;
	let parent = UIS[idParent];
	parent.children.push(id);
	mk.attach();
	UIS[id] = mk;
	linkObjects(id, areaName);
	listKey(IdOwner, id[2], id);
	return mk;
}
//#region hand of cards

function makeHand(key, idParent, color, padding = 4, margin = 4) {
	let mk = makeArea(key, idParent);
	if (SPEC.showCardHandBackground) mk.setBg(isdef(color) ? color : randomColor());

	let dParent = mById(idParent);
	let bParent = getBounds(dParent);
	
	let areaTitleHeight = SPEC.showAreaNames ? getTextSize('happy', dParent).h : 0;
	let clearBoth = bParent.height > bParent.width;

	let zusatz = 2 * (padding + margin) + areaTitleHeight;
	let hCard =PREFERRED_CARD_HEIGHT ? PREFERRED_CARD_HEIGHT 
			 : bParent.height ? bParent.height - zusatz
			 : 100;
	if (hCard < MIN_CARD_HEIGHT) hCard=MIN_CARD_HEIGHT;
	if (hCard > MAX_CARD_HEIGHT) hCard=MAX_CARD_HEIGHT;
	hParent= hCard + zusatz;
	// let hParent = PREFERRED_CARD_HEIGHT ? PREFERRED_CARD_HEIGHT + 2 * (padding + margin) + areaTitleHeight
	// 		: bParent.height ? bParent.height : 100;
	
	//dParent.style.setProperty('max-height', hParent + 'px');
	//console.log('>>>>>>>hParent',hParent)
	
	let hTotal = hParent - 2 * (padding + margin) - areaTitleHeight;//wegen title of area!!!!
	h = hTotal - 2 * padding;
	if (h > MAX_CARD_HEIGHT) {
		h = MAX_CARD_HEIGHT;
		hTotal = h + 2 * padding;
	}
	//console.log('_________________makeHand key,',key,'\narea width',bParent.width,'\narea height',bParent.height,'\nhParent', hParent, '\nhTotal', hTotal, '\nhCard', h)
	

	let bTitle = { height: 0 };
	if (SPEC.showCardHandName) {
		mk.title(stringAfter(key, '.'));
		bTitle = getBounds(mk.parts.title);
		mk.parts.title.style.setProperty('width', bTitle.width + 'px');
	}
	let hBody = h - bTitle.height;
	mk.body();
	let dBody = mk.parts.body;
	dBody.style.setProperty('height', hBody + 'px');
	let d = mk.elem;
	d.style.setProperty('padding', padding + 'px');
	d.style.setProperty('border-radius', padding + 'px');
	d.style.setProperty('margin', margin + 'px');
	//d.style.setProperty('margin-top', '15px');
	d.style.setProperty('position', 'relative');
	//d.style.setProperty('max-height', hTotal + 'px');
	d.style.setProperty('float', 'left');
	if (clearBoth) d.style.setProperty('clear', 'both');
	mk.hCard = hCard; //TODO: hand title height abziehen!!!
	mk.collectionKey = key;
	mk.adjustSize = true;

	return mk;
}
//#region single card
function cardFace({ rank, suit, key } = {}) {
	let cardKey, svgCode;
	//console.log('cardFace',rank,suit,key)
	if (isdef(key)) {
		cardKey = key;
		svgCode = testCards[cardKey];
		if (!svgCode) svgCode = vidCache.getRandom('c52');
	} else {
		if (nundef(rank)) { rank = '2'; suit = 'B'; }
		if (rank == '10') rank = 'T';
		if (rank == '1') rank = 'A';
		if (nundef(suit)) suit = 'H';//joker:J1,J2, back:1B,2B
		cardKey = 'card_' + rank + suit;
		svgCode = c52[cardKey]; //c52 is cached asset loaded in _start
		//console.log(cardKey,c52[cardKey])
	}
	svgCode = '<div>' + svgCode + '</div>';
	let el = createElementFromHTML(svgCode);
	return el;
}
function makeCardDomel(oCard) {
	//look at card typeMappings
	if (lookup(SPEC, ['typeMappings', 'card'])) {
		for (const k in SPEC.typeMappings.card) {
			oCard[k] = oCard[SPEC.typeMappings.card[k]];
		}
	}
	let el = cardFace(oCard);
	return el;
}
function _bringCardToFront(id) { let elem = document.getElementById(id); maxZIndex += 1; elem.style.zIndex = maxZIndex; }
function _sendCardToBack(id) { let c = UIS[id]; let elem = document.getElementById(id); elem.style.zIndex = c.zIndex; }

function isFaceUp(oCard) { return oCard.obj_type; }

function magnifyFront(id) {
	id = id;
	magCounter += 1;
	let card = UIS[id];
	if (isFaceUp(card.o)) card.setScaleLT(1.5); //TODO!!! achtung! wie kann herausfinden ob visible?
	maxZIndex += 1;
	card.elem.style.zIndex = maxZIndex;
}
function minifyBack(id) {
	//console.log(arguments,'this',this)
	//ev.stopPropagation();
	magCounter += 1;
	let card = UIS[id];
	//card.elem.onmouseout = null;
	//card.elem.onmouseover = ev => { magnifyFront(ev, id); };

	card.setScale(1);//resetMKTransform();
	card.elem.style.zIndex = card.zIndex;
	//console.log('minify!', card.o.short_name,  magCounter)
}
var magCounter = 0;
var evAddCounter = 0;
function makeCard123(oid, o) {
	let mk = new MK();
	let id = getIdForOid(oid);
	mk.id = id;
	let domel = makeCardDomel(o);
	evAddCounter += 1;
	//console.log('adding events:', evAddCounter);

	// d3.select(domel).on('mouseenter',magnifyFront);
	// d3.select(domel).on('mouseleave',minifyBack);



	//domel.onmouseover = ev => { magnifyFront(ev, domel.id); };
	// domel.onmouseout=ev=> {minifyBack(ev,domel.id); };

	// domel.addEventListener('mouseenter', ev=> {magnifyFront(ev,domel.id); },true);
	// domel.addEventListener('mouseleave', ev=> {minifyBack(ev,domel.id); }, true);
	// $(d).on("mouseenter", function () { magnifyFront(this.id); });// bringCardToFront(this.id); }); //this.parentNode.appendChild(this);})
	// $(d).on("mouseleave", function () { minifyBack(this.id); });// { sendCardToBack(this.id); })

	domel.style.position = 'absolute';
	mk.elem = domel;
	mk.elem.id = id;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(mk.elem);
	mk.cat = DOMCATS[mk.domType];
	mk.o = o;
	mk.oid = oid;
	mk.isa.card = true;
	UIS[id] = mk;
	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	return mk;
}
//#region layout of collections
function layoutCardsOverlapping(mkHand, mkCardList) {
	//both mkHand and mkCards exist!
	let dHand = mkHand.elem;
	let cardContainer = mkHand.parts.body;
	let bds = getBounds(cardContainer);

	//console.log('layoutCardsOverlapping',bds);
	if (bds.height < 10) {
		console.log('>>')
		//mkHand.setSize(100, 100);
		//bds = getBounds(cardContainer);
		// cardContainer.style.setProperty('height','80px')
	}


	// let hhNet = bds.height;
	// let whNet = bds.width;
	// let hCard = hhNet - 2 * gap;
	// if (PREFERRED_CARD_HEIGHT && hCard > PREFERRED_CARD_HEIGHT) {
	// 	hCard = PREFERRED_CARD_HEIGHT;
	// 	console.log('correcting card height for', GAMEPLID);
	// } else {
	// 	PREFERRED_CARD_HEIGHT = hCard;
	// 	console.log('set PREFERRED_CARD_HEIGHT to',hCard)
	// }

	//ab hier soll alles nur noch von hCard abhaengen!
	let gap = 2;
	let hCard = mkHand.hCard;
	//console.log('>>>>>',getBounds(mkHand.parts.body).height);
	if (!PREFERRED_CARD_HEIGHT) PREFERRED_CARD_HEIGHT = hCard; //*.9;
	let wCard = hCard * .7;
	mkCardList.map(x => mStyle(x.elem, { height: hCard, width: wCard, position: 'absolute' }, 'px'));

	let ovl = wCard / 4;
	let numCards = mkCardList.length;
	let wHand = (numCards - 1) * ovl + wCard + gap;
	//let hHand = hhNet;
	//console.log('wCard', wCard, 'hCard', hCard, 'wHand', wHand, 'hHand', hHand)
	cardContainer.style.setProperty('width', wHand + 'px');
	cardContainer.style.setProperty('position', 'relative');
	// console.log(dHand);
	let x = gap; let y = gap;
	for (const card of mkCardList) {
		card.setPos(x, y);
		x += ovl;
	}
	//now have to attach cards to hand!
	let iz = 10;
	for (const card of mkCardList) {
		card.idParent = mkHand.id;
		card.attach('body');
		card.zIndex = card.elem.style.zIndex = iz;
		iz += 1;
		mkMan.setDone(card.oid);
		// console.log(card)
	}
}

//#region pictoCard
function makePictoCardDomel(oCard) {
	//look at card typeMappings
	if (lookup(SPEC, ['typeMappings', 'card'])) {
		for (const k in SPEC.typeMappings.card) {
			oCard[k] = oCard[SPEC.typeMappings.card[k]];
		}
	}
	let el = cardFace(oCard);
	return el;
}
function makePictoCard(oid, o) {
	let mk = new MK();
	let id = getIdForOid(oid);
	mk.id = id;
	console.log(o);
	let domel = makePictoCardDomel(o);
	domel.style.position = 'absolute';
	mk.elem = domel;
	mk.elem.id = id;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(mk.elem);
	mk.cat = DOMCATS[mk.domType];
	mk.o = o;
	mk.oid = oid;
	mk.isa.picto = true;
	UIS[id] = mk;
	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	return mk;
}
function makePictoCard(oid, o) {
	let symbolKeyPropName = 'name'; //detectSymbolKey(o);
	let key = _getSymbolKey(o[symbolKeyPropName]); //replaceAll(o[symbolKeyPropName],' ','_').toLowerCase(); //_getSymbolKey(o[symbolKeyPropName]);
	let symbol = symbols[key]; //getMatchingPictoKey(o,key); //symbols[key]; //sollte sein: getPictoChar
	let color = symbolColors[key]; //detectColor(o,key); // //sollte sein: detectColor
	//console.log('_makeCardDivCatan', 'prop', symbolKeyPropName, 'key', key, 'icon', symbol, 'color', color);

	let d = document.createElement('div');
	$(d).on("mouseenter", function () { magnifyFront(this.id); });// bringCardToFront(this.id); }); //this.parentNode.appendChild(this);})
	$(d).on("mouseleave", function () { minifyBack(this.id); });// { sendCardToBack(this.id); })
	//$(d).on("click", function () { removeCardFromHand(oid); })

	d.innerHTML = 'hallo';
	d.style.position = 'absolute';
	let dx = 0;
	d.style.left = '' + dx + 'px';
	// d.style.width='100px';
	// d.style.height='200px';
	d.style.top = '0px';
	//d.style.backgroundColor = randomColor();

	let ch = iconChars[symbol];
	let text = String.fromCharCode('0x' + ch);
	let family = (ch[0] == 'f' || ch[0] == 'F') ? 'pictoFa' : 'pictoGame';

	d.innerHTML = `
		<div class="cardCatan">
			<p style='font-size:22px;'>${o.name}</p>
			<div class="cardCenter">
				<div class="circular" style='background:${color}'><span style='color:white;font-size:70px;font-weight:900;font-family:${family}'>${text}</span></div>
			</div>
			<hr>
			<p style='font-size:20px;'>${o.desc}</p>
			<div style='color:${color};position:absolute;left:8px;top:8px;width:35px;height:35px'>
				<span style='font-family:${family}'>${text}</span>
			</div>
		</div>
	`;
	return d;
}









