//#region card
function cardContent(card, { topLeft, topRight, bottomLeft, bottomRight, reverseBottom = false, title, footer, middle, text }) {
	//get card svg
	//wenn innerhalb von svg arbeit dann use viewbox w=240,h=336 und px
	//wenn in div arbeite, use percentages!!!!
	let svg = card.firstChild;
	let div = card;
	card.style.setProperty('position', 'relative');
	card.style.setProperty('font-size', '3mm');
	//console.log('svg', svg, 'div', div);
	topLeft = ['A', '2'];
	bottomRight = ['A', 2];
	middle = null;
	let gap = 2; let d;
	let fBL = reverseBottom ? posBLR : posBL;
	let fBR = reverseBottom ? posBRR : posBR;
	if (isdef(topLeft)) { d = mDiv(card); mGap(d, gap); posTL(d); asList(topLeft).map(x => mDiv(d).innerHTML = x); }
	if (isdef(topRight)) { d = mDiv(card); mGap(d, gap); posTR(d); asList(topRight).map(x => mDiv(d).innerHTML = x); }
	if (isdef(bottomLeft)) { d = mDiv(card); mGap(d, gap); fBL(d); asList(bottomLeft).map(x => mDiv(d).innerHTML = x); }
	if (isdef(bottomRight)) { d = mDiv(card); mGap(d, gap); fBR(d); asList(bottomRight).map(x => mDiv(d).innerHTML = x); }
	if (isdef(middle)) {
		d = mDiv(card); mSize(d, 50, 50, '%'); mFont(d, '7mm');
		let dContent = mDiv(d); dContent.innerHTML = middle; if (isdef(text)) posCICT(dContent); else posCIC(dContent);
	}
	if (isdef(text)) {
		d = mDiv(card); mSize(d, 80, 50, '%'); mFont(d, '1.8mm');
		let lines = 4; if (isdef(middle)) { posCICB(d); d.appendChild(document.createElement('hr')); } else { posCIC(d); lines = 8; }
		let dContent = mDiv(d); dContent.innerHTML = text; dContent.classList.add('textEllipsis4Lines'); dContent.style.setProperty('-webkit-line-clamp', lines);
	}



	// if (isdef(topLeft)){
	// 	console.log('topLeft',topLeft);
	// 	//topLeft,topRight,midLeft,midRight,bttomLeft,bottomRight are lists of symbol keys,numbers,or text
	// 	if (!isList(topLeft)) topLeft =[topLeft];
	// 	let d=document.createElement('div');
	// 	//divSize(d,0,0,25,25,'%');
	// 	//divPos(d,0,0);
	// 	//d.style.transform='rotate(180deg)';
	// 	posTL(d);
	// 	//divRot(d,180);
	// 	for(const sym of topLeft){
	// 		let dsym=document.createElement('div');
	// 		dsym.textContent=sym;
	// 		d.appendChild(dsym);
	// 	}
	// 	div.appendChild(d);

	// }
}
function cardFace({ rank, suit, key } = {}) {
	let cardKey, svgCode;
	if (isdef(key)) {
		cardKey = key;
		svgCode = testCards[cardKey];
		if (!svgCode) svgCode = vidCache.getRandom('c52');
	} else {
		if (nundef(rank)) { rank = '2'; suit = 'B'; } if (rank == '10') rank = 'T'; if (nundef(suit)) suit = 'H';//joker:J1,J2, back:1B,2B
		cardKey = 'card_' + rank + suit;
		svgCode = c52[cardKey]; //c52 is cached asset loaded in _start
	}

	svgCode = '<div>' + svgCode + '</div>';

	let el = createElementFromHTML(svgCode);
	return el;

}
function emptyCard() {
	return cardFace({ key: 'empty' });
}
function makeCard(info, styles, classes) {
	//makes a card object but does not place it anywhere!
	//returns domel for card
	//TODO: should give the card an id! if oid and o are present
	let el = cardFace(info);
	return el;
}
function showCard(card, { size = 90, area, hand, layout } = {}) {//sz=80,{area,layout='overlap'}){
	let d = document.getElementById(area);
	//console.log('area',d);

	mStyle(card, { width: size * .66, height: size }); //standard ratio waere 0.71 fuer 2.5x3.5 cards 78x110
	if (nundef(layout)) card.style.setProperty('float', 'left');
	//how many hands does this area have already???
	//if no hand id is given, the area only has 1 hand by definition
	//this hand is named 'hand'
	let dHand = isdef(hand) ? d.getElementById(hand) : d.childElementCount >= 1 ? d.lastChild : addDivPosTo(d, 12, 25, 'auto', 90, 'px', null);

	//console.log('area', area, 'has', d.childElementCount, 'hands')
	dHand.appendChild(card);
}
//#endregion

//#region hand of cards
function getAreaId(key) { return 'm_A_' + key; }
function getCollectionArea(key, idParent) {
	console.log('getCollectionArea', key)
	let a = UIS[getAreaId(key)];
	//console.log(a)
	if (nundef(a)) {

		a = makeCollectionArea(key, idParent);

	}
	return a;
}

const MAX_CARD_HEIGHT=100;
function makeCollectionArea(key, idParent, padding = 4, margin = 4) {

	let idHand = key;

	let dParent = mById(idParent);
	let bParent = getBounds(dParent);
	let clearBoth = bParent.height > bParent.width;
	let hParent = bParent.height;
	dParent.style.setProperty('max-height',hParent+'px');

	let hTotal=hParent - 2*(padding + margin) - 15;//wegen title of area!!!!
	h = hTotal-2*padding;
	if (h>MAX_CARD_HEIGHT){
		h=MAX_CARD_HEIGHT;
		hTotal = h+2*padding;
	}
	console.log('_________________hParent',hParent,'\nhTotal',hTotal,'\nhCard',h)

	let mk = makeArea(idHand, idParent);
	mk.setBg(randomColor());

	mk.title(stringAfter(key, '.'));
	let bTitle = getBounds(mk.parts.title);
	console.log('---------title bounds:', bTitle); //getBounds(mobj.parts.title));

	let hBody = h - bTitle.height;
	mk.body();
	let bBody = getBounds(mk.parts.body);
	let dBody = mk.parts.body;
	dBody.style.setProperty('background-color', colorTrans('black',.3));
	dBody.style.setProperty('height', hBody + 'px');

	console.log('---------body bounds:', bBody); //getBounds(mobj.parts.title));
	let d = mk.elem;
	d.style.setProperty('padding', padding+'px');
	d.style.setProperty('border-radius', padding+'px');
	//d.style.setProperty('margin', '12px');
	d.style.setProperty('margin', margin+'px');
	d.style.setProperty('margin-top','15px');
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

