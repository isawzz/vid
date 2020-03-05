const MAX_CARD_HEIGHT = 100;
var CARD_HEIGHT = 0;

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
	let dParent = mById(idParent);
	let bParent = getBounds(dParent);
	let clearBoth = bParent.height > bParent.width;
	let hParent = bParent.height;
	dParent.style.setProperty('max-height', hParent + 'px');
	let areaTitleHeight = SPEC.showAreaNames ? getTextSize('happy', dParent).h : 0;
	console.log('areaTitleHeight',areaTitleHeight);
	let hTotal = hParent - 2 * (padding + margin) - areaTitleHeight;//wegen title of area!!!!
	h = hTotal - 2 * padding;
	if (h > MAX_CARD_HEIGHT) {
		h = MAX_CARD_HEIGHT;
		hTotal = h + 2 * padding;
	}
	//console.log('_________________hParent', hParent, '\nhTotal', hTotal, '\nhCard', h)

	let mk = makeArea(key, idParent);
	if (SPEC.showCardHandBackground) mk.setBg(isdef(color) ? color : randomColor());

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
	d.style.setProperty('max-height', hTotal + 'px');
	d.style.setProperty('float', 'left');
	if (clearBoth) d.style.setProperty('clear', 'both');

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

function magnifyFront(id) {
	//ev.stopPropagation();
	//console.log(arguments,'\nthis',this)

	id = id;
	magCounter += 1;
	let card = UIS[id];
	card.setScaleLT(1.5);
	//card.elem.onmouseover = null;
	//card.elem.onmouseout = ev => { minifyBack(ev, id); };
	//console.log('magnify!', card.o.short_name, magCounter)
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
	mk.o=o;
	mk.isa.card=true;
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
	let hhNet = bds.height;
	let whNet = bds.width;
	let gap = 2;
	// let hCard = CARD_HEIGHT? CARD_HEIGHT: hhNet - 2 * gap;
	// CARD_HEIGHT=hCard;
	let hCard = hhNet - 2 * gap;
	let wCard = hCard * .7;
	mkCardList.map(x => mStyle(x.elem, { height: hCard, width: wCard, position: 'absolute' }, 'px'));

	let ovl = wCard / 4;
	let numCards = mkCardList.length;
	let wHand = (numCards - 1) * ovl + wCard + gap;
	let hHand = hhNet;
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
		// console.log(card)
	}
}










