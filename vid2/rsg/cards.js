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
function emptyCard() {
	return cardFace({ key: 'empty' });
}
function makeCard(info, styles, classes) {
	//makes a card domel but does not place it anywhere!
	let el = cardFace(info);
	return el;
}
function showCardSimple(card, area) {
	let hCard = getBounds(mById(area)).height - 30;
	showCard(card, { size: 80, area: area });
}
function showCard(card, { size = 90, area, hand, layout } = {}) {//sz=80,{area,layout='overlap'}){
	let d = document.getElementById(area);
	//console.log('area',d);

	mStyle(card, { width: size * .66, height: size }); //standard ratio waere 0.71 fuer 2.5x3.5 cards 78x110

	//geht NICHT fuer overlapping!
	if (nundef(layout)) card.style.setProperty('float', 'left');

	//how many hands does this area have already???
	//if no hand id is given, the area only has 1 hand by definition
	//this hand is named 'hand'
	let dHand = isdef(hand) ? d.getElementById(hand)
		: d.childElementCount >= 1 ? d.lastChild
			: addDivPosTo(d, 12, 25, 'auto', size, 'px', null);

	//console.log('area', area, 'has', d.childElementCount, 'hands')
	dHand.appendChild(card);
}
//#endregion

