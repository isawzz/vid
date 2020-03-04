//#region hand of cards
function getCollectionArea(key, idParent) {
	//console.log('getCollectionArea', key)
	let a = UIS[getAreaId(key)];
	//console.log(a)
	if (nundef(a)) {

		a = makeCollectionArea(key, idParent);

	}
	return a;
}
const MAX_CARD_HEIGHT = 100;
function makeCollectionArea(key, idParent, padding = 4, margin = 4) {

	let idHand = key;

	let dParent = mById(idParent);
	let bParent = getBounds(dParent);
	let clearBoth = bParent.height > bParent.width;
	let hParent = bParent.height;
	dParent.style.setProperty('max-height', hParent + 'px');

	let hTotal = hParent - 2 * (padding + margin) - 15;//wegen title of area!!!!
	h = hTotal - 2 * padding;
	if (h > MAX_CARD_HEIGHT) {
		h = MAX_CARD_HEIGHT;
		hTotal = h + 2 * padding;
	}
	//console.log('_________________hParent', hParent, '\nhTotal', hTotal, '\nhCard', h)

	let mk = makeArea(idHand, idParent);
	mk.setBg(randomColor());

	mk.title(stringAfter(key, '.'));
	let bTitle = getBounds(mk.parts.title);
	//console.log('---------title bounds:', bTitle); //getBounds(mobj.parts.title));

	let hBody = h - bTitle.height;
	mk.body();
	let bBody = getBounds(mk.parts.body);
	let dBody = mk.parts.body;
	dBody.style.setProperty('background-color', colorTrans('black', .3));
	dBody.style.setProperty('height', hBody + 'px');

	//console.log('---------body bounds:', bBody); //getBounds(mobj.parts.title));
	let d = mk.elem;
	d.style.setProperty('padding', padding + 'px');
	d.style.setProperty('border-radius', padding + 'px');
	//d.style.setProperty('margin', '12px');
	d.style.setProperty('margin', margin + 'px');
	d.style.setProperty('margin-top', '15px');
	d.style.setProperty('position', 'relative');
	//d.style.setProperty('margin', '12px');
	d.style.setProperty('max-height', hTotal + 'px');
	d.style.setProperty('float', 'left');
	if (clearBoth) d.style.setProperty('clear', 'both');
	// d.style.position = 'relative';
	// d.style.left = '10px';
	// d.style.top = '10px';
	// d.style.minWidth = '100px';
	// d.style.minHeight = '50px';
	// div.style.boxSizing = 'border-box';
	// div.style.margin='12px';
	mk.collectionKey = key;
	mk.adjustSize = true;
	// let divCollection = mk.elem;
	// divCollection.style.position = null;

	return mk;


}
function makeCardDomel(oCard){
	//look at card typeMappings
	if (lookup(SPEC,['typeMappings','card'])){
		for(const k in SPEC.typeMappings.card) {
			oCard[SPEC.typeMappings.card[k]]=oCard[k];
		}
	}
	//console.log(oCard);
	let el = cardFace(oCard);
	return el;
}
function makeCardNithya(oid,o) {
	let mk = new MK();
	let id = getIdForOid(oid);
	mk.id = id;

	let domel = makeCardDomel(o);
	domel.style.position = 'absolute';
	
	mk.elem = domel;
	mk.elem.id = id;
	mk.parts.elem = mk.elem;
	mk.domType = getTypeOf(mk.elem);
	mk.cat = DOMCATS[mk.domType];
	UIS[id] = mk;
	linkObjects(id, oid);
	listKey(IdOwner, id[2], id);
	return mk;
}










//NONONONONO--------------------------------------
function showCollection(oCollection, mkHand) {
	idCollection = mkHand.id;
	console.log('***showCollection', oCollection);
	let collectionAreaName = getAreaName(idCollection);
	// console.log('areaName for', idCollection, 'is', collectionAreaName, '\nmsHand', mkCollection);
	let els = getElements(oCollection);
	for (const oid of els) {
		let mkCard = getVisual(oid);
		if (nundef(mkCard)) {
			let oCard = serverData.table[oid];
			mkCard = makeCardMK(oid, oCard, idCollection);
			console.log('created card:', oid, mkCard.id, collectionAreaName);
			console.log('>>card MK',mkCard);
			let testCard = makeCard({rank:oCard.short_name});
			console.log('------------>>>',testCard)
			showCardSimple(testCard,'zone');
		}
		break;
	}
	//repositionCards(mkHand);
}
function repositionCards(mkHand) {
	console.log('mkHand',mkHand);//,'cards',hand.cards)

	mkHand.cards = mkHand.children;
	mkHand.numCards = mkHand.cards.length;

	if (mkHand.numCards == 0) return;
	// let el = hand.elem;
	//console.log(msHand)



	let dTitle = mkHand.parts.title;
	let dBody = mkHand.parts.body;
	let dHand = mkHand.elem;
	let bTitle = getBounds(dTitle);
	let bBody = getBounds(dBody, true);
	let bHand = getBounds(dHand); mkHand.hHand = bHand.height;
	let yBody = bTitle.height;
	let hHand = mkHand.hHand;
	let hAvailable = hHand - yBody;
	let wHand = bHand.width;
	console.log('hHand',hHand,'wHand',wHand,'yBody',yBody,'hAvailable',hAvailable)

	let W = wHand;
	let H = hHand;
	// let W = msHand.w;
	// let H = msHand.H;
	let w = mkHand.wCard;
	let h = mkHand.hCard;
	let n = mkHand.numCards;

	//kann entweder: adjust hand size oder adjust card size!
	//vielleicht sollte ich bei cardSize: adjust height und bei handSize: adjust width
	if (nundef(w) || nundef(h)){
		h=hAvailable-2;
		w=h*.7;
		mkHand.adjustSize=false;
	}
	console.log('W',W,'H',H,'wCard',w,'hCard',h);



	let x, y, dx, padding;
	// let offset = isdef(msHand.cardOffsetXY) ? msHand.cardOffsetXY : { x: 0, y: 0 };
	let offset = { x: 0, y: 0 };
	if (mkHand.adjustSize) {
		//hand has not been given a specific width, so adjust width to content and parent!!!
		//same as height!!!
		W = w + (n) * w / 4;
		H = h; // + 20;
		padding = 0;//10;
		let hWidth=W + 2 * padding + yBody;
		let hHeight=H;
		mkHand.setSize(hWidth, hHeight); //w + n * w / 4 + 20, h + 20);
		console.log('called hand.setSize',hWidth,hHeight)
		//		dx = w / 4;
		x = padding + offset.x;
		y = padding + offset.y;

	} else {
		padding = x = y = 0;//x = 10;
		//y = 10;
	}
	dx = n > 1 ? (W - w) / (n - 1) : 0;
	if (dx > w) dx = w;
	// let mobj=UIS[idHand];
	// mobj.setSize(300,140);

	// if (nundef(W)||nundef(H)){
	// 	dx=w/4;
	// }else{
	// 	dx = n > 1 ? (W - w) / (n - 1) : 0;
	// } 
	let i = 0;
	//console.log('---', 'W', W, 'H', H, 'w', w, 'h', h, 'n', n, 'padding', padding, 'x', x, 'y', y, 'dx', dx)
	for (const oidCard of mkHand.cards) {
		let id = oidCard;// getMainId(oidCard);
		let mkCard = UIS[id];
		mkCard.attach();
		console.log('.......card',oidCard,id,'\nmkCard',mkCard,'\npos',x,y)
		mkCard.zIndex = mkCard.elem.style.zIndex = i;
		i += 1;
		mkCard.setPos(x, y);
		x += dx;

	}
}
function addCardToCollectionArea(oid, collectionAreaName) {
	//idHand = isdef(idHand)?idHand:getMainId(areaName);
	//areaName = idHand[0]=='a'?idHand:getAreaName(idHand);
	let idCollection = getIdArea(collectionAreaName);
	let isCard = getMainId(oid);
	//console.log('....addCardToHand','oid',oid,'id',id,'areaName',areaName,'idHand',idHand);
	let msCard = UIS[isCard];
	let msCollection = UIS[idCollection];
	msCard.hand = idCollection;
	msCard.collectionKey = msCollection.collectionKey;
	if (nundef(msCollection.numCards)) {
		msCollection.numCards = 1;
		msCollection.dx = 0;
		msCollection.cards = [oid];
	} else {
		msCollection.numCards += 1;
		msCollection.cards.push(oid);
	}
	let n = msCollection.numCards;
	msCard.zIndex = n;
	//console.log('addCardToHand: isAttached=',mobj.isAttached, 'hand.numCards',n);
	msCard.attach('hand');
	//console.log('...isAttached=',mobj.isAttached)

	//calc card height
	let hCard = msCard.elem.offsetHeight;
	let bounds = getBounds(msCard.elem);
	let hCard1 = bounds.height;
	//console.log(hCard);
	//console.log('height of card: offsetHeight:',hCard,'bounds.height',hCard1)

	//calc hand height:
	let hHand = getBounds(msCollection.elem).height;
	let partHand = msCollection.parts['hand'];
	if (isdef(partHand)) hHand -= getBounds(partHand, true).y;
	//console.log('height of hand (part)',hHand);
	msCollection.hHand = hHand;

	//let hHand = bounds.height;// !!!!!
	//let hHand = hand.elem.offsetHeight;
	//console.log(hHand);
	let wCard = msCard.elem.offsetWidth;
	//console.log('w1',wCard);
	let scale = 1;
	if (hCard >= hHand) {
		scale = hHand / hCard;
		msCard.elem.style.transform = `scale(${scale})`;
		msCard.elem.style.transformOrigin = '0% 0%';
	}
	msCollection.scale = scale;

	wCard = msCard.elem.offsetWidth;
	//console.log('w2',wCard);
	let wReal = wCard * scale;
	let hReal = hCard * scale;
	msCollection.wCard = wReal;
	msCollection.hCard = hReal;


	repositionCards(msCollection);
}


