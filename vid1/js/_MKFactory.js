function makeBoard(oid, o) {

}

//#region card
function divStyle(d,styles){styleElement(d,styles);}
function styleElement(elem, styles, unit = 'px') { for (const k in styles) { elem.style.setProperty(k, makeUnitString(styles[k], unit)); } }
function divSize(d,w,h,unit='px'){	styleElement(d,{width:w,height:h},unit);}
function posTL(d){divPos(d,0,0)}
function posTR(d){styleElement(d,{right:0,top:0,position:'absolute'});}
function posBL(d){styleElement(d,{left:0,bottom:0,position:'absolute'});}
function posBLR(d){styleElement(d,{left:0,bottom:0,position:'absolute'});divRot(d,180)}
function posBR(d){styleElement(d,{right:0,bottom:0,position:'absolute'});}
function posBRR(d){styleElement(d,{right:0,bottom:0,position:'absolute'});divRot(d,180)}
function divPos(d,x,y,unit='px'){styleElement(d,{left:x,top:y,position:'absolute'},unit);}
function divRot(d,angle){divStyle(d,{transform:'rotate('+angle+'deg)'});}
function makeDiv(dParent=null){let d=document.createElement('div');if (dParent) dParent.appendChild(d); return d;}
function dGap(d,gap){d.style.setProperty('margin',gap+'px');}
function asList(x){return isList(x)?x:[x];}
function posCIC(d){d.classList.add('centerCentered');}
function posCICT(d){d.classList.add('centerCenteredTopHalf');}
function posCICB(d){d.classList.add('centerCenteredBottomHalf');}
function cardContent(card,{topLeft,topRight,bottomLeft,bottomRight,reverseBottom=false,title,footer,middle,text}){
	//get card svg
	//wenn innerhalb von svg arbeit dann use viewbox w=240,h=336 und px
	//wenn in div arbeite, use percentages!!!!
	let svg=card.firstChild;
	let div=card;
	card.style.setProperty('position','relative');
	card.style.setProperty('font-size','3mm');
	console.log('svg',svg,'div',div);
	topLeft=['A','2'];
	bottomRight=['A',2];
	let gap=2;let d;
	let fBL = reverseBottom?posBLR:posBL;
	let fBR = reverseBottom?posBRR:posBR;
	if (isdef(topLeft)){d=makeDiv(card);dGap(d,gap);posTL(d);asList(topLeft).map(x=>makeDiv(d).innerHTML=x);}
	if (isdef(topRight)){d=makeDiv(card);dGap(d,gap);posTR(d);asList(topRight).map(x=>makeDiv(d).innerHTML=x);}
	if (isdef(bottomLeft)){d=makeDiv(card);dGap(d,gap);fBL(d);asList(bottomLeft).map(x=>makeDiv(d).innerHTML=x);}
	if (isdef(bottomRight)){d=makeDiv(card);dGap(d,gap);fBR(d);asList(bottomRight).map(x=>makeDiv(d).innerHTML=x);}
	if (isdef(middle)){
		d=makeDiv(card);
		//centerDiv
		divSize(d,50,50,'%');
		d.style.setProperty('font-size','6mm');
		// posCenterInCenter(d);
		let dContent = makeDiv(d);
		dContent.innerHTML=middle;
		if (isdef(text)) posCICT(dContent); else posCIC(dContent);
	}
	if (isdef(text)){
		d=makeDiv(card);
		
		let dContent = makeDiv(d);

		//dGap(dContent,0)
		if (isdef(middle)) posCICB(d); else posCIC(d);
		//centerDiv
		divSize(d,80,50,'%');
		d.style.setProperty('font-size','2mm');
		// posCenterInCenter(d);
		dContent.innerHTML='<hr></hr>'+text;
		// dContent.style.setProperty('max-width','120%');
		// d.style.setProperty('max-width','90%');
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
function emptyCard(){
	return cardFace({key:'empty'});
}
function makeCard(info, styles, classes) {
	//makes a card object but does not place it anywhere!
	//returns domel for card
	//TODO: should give the card an id! if oid and o are present
	let el = cardFace(info);
	return el;
}
function showCard(card, {size=90, area, hand, layout}={}) {//sz=80,{area,layout='overlap'}){
	let d = document.getElementById(area);
	//console.log('area',d);

	styleElement(card, { width: size * .66, height: size }); //standard ratio waere 0.71 fuer 2.5x3.5 cards 78x110
	if (nundef(layout)) card.style.setProperty('float', 'left');
	//how many hands does this area have already???
	//if no hand id is given, the area only has 1 hand by definition
	//this hand is named 'hand'
	let dHand = isdef(hand) ? d.getElementById(hand) : d.childElementCount >= 1 ? d.lastChild : addDivPosTo(d, 12, 25, 'auto', 90, 'px', null);

	//console.log('area', area, 'has', d.childElementCount, 'hands')
	dHand.appendChild(card);
}


function makeHand(area) {

}
function cardFace({ rank, suit, key }={}) {
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
function makeCard52_test(oid, o, { html, rank, suit, key, func, area, hand }) {
	//console.log(el)
	//console.log(...arguments)
	let el;
	if (isdef(func)) {
		el = func(oid, o, { key: 'wiebitte???' });
	} else {
		el = cardFace({ rank, suit, key }); //got a div w/ svg inside
	}
	console.log(el)

	let sz = 90;
	el.style.setProperty('float', 'left');
	styleElement(el, { width: sz * .6 + 'px', height: sz + 'px', margin: 5 + 'px', marginTop: '20px', display: 'inline-box' });
	//el.style = `height:${sz}px;width:${sz * 0.7}px;margin:5px;margin-top:20px;float:left;display:inline-box`;

	if (nundef(area)) area = 'objects';
	let dParent = document.getElementById(area); dParent.appendChild(el);
}

function makeCard52(oid, o, { rank, suit, area, hand }) {
	if (nundef(rank)) { rank = '1'; suit = 'B'; }//if no rank is told, show back of card!
	if (rank == '10') rank = 'T';
	//joker is supposed to have suit 'J' and rank '1' or '2'
	if (nundef(suit)) suit = 'H';

	console.log('presenting card', rank, suit)

	let cardKey = 'card_' + rank + suit;
	let svgCode = c52.get(cardKey); //c52 is cached asset loaded in _start

	svgCode = `<div><svg xmlns=\"http://www.w3.org/2000/svg\"
  xmlns:xlink=\"http://www.w3.org/1999/xlink\" class=\"card\" face=\"2C\" height=\"100%\"
  preserveAspectRatio=\"none\" viewBox=\"-120 -168 240 336\" width=\"100%\"><symbol
  id=\"SC2\" viewBox=\"-600 -600 1200 1200\" preserveAspectRatio=\"xMinYMid\"><path
  d=\"M30 150C35 385 85 400 130 500L-130 500C-85 400 -35 385 -30 150A10 10 0 0 0 -50
  150A210 210 0 1 1 -124 -51A10 10 0 0 0 -110 -65A230 230 0 1 1 110 -65A10 10 0 0
  0 124 -51A210 210 0 1 1 50 150A10 10 0 0 0 30 150Z\" fill=\"black\"></path></symbol><symbol
  id=\"VC2\" viewBox=\"-500 -500 1000 1000\" preserveAspectRatio=\"xMinYMid\"><path
  d=\"M-225 -225C-245 -265 -200 -460 0 -460C 200 -460 225 -325 225 -225C225 -25 -225
  160 -225 460L225 460L225 300\" stroke=\"black\" stroke-width=\"80\" stroke-linecap=\"square\"
  stroke-miterlimit=\"1.5\" fill=\"none\"></path></symbol><rect width=\"239\" height=\"335\"
  x=\"-119.5\" y=\"-167.5\" rx=\"12\" ry=\"12\" fill=\"white\" stroke=\"black\"></rect><use
  xlink:href=\"#VC2\" height=\"32\" x=\"-114.4\" y=\"-156\"></use><use xlink:href=\"#SC2\"
  height=\"26.769\" x=\"-111.784\" y=\"-119\"></use><use xlink:href=\"#SC2\" height=\"70\"
  x=\"-35\" y=\"-135.588\"></use><g transform=\"rotate(180)\"><use xlink:href=\"#VC2\"
  height=\"32\" x=\"-114.4\" y=\"-156\"></use><use xlink:href=\"#SC2\" height=\"26.769\"
  x=\"-111.784\" y=\"-119\"></use><use xlink:href=\"#SC2\" height=\"70\" x=\"-35\"
  y=\"-135.588\"></use></g></svg></div>`;
	let el = createElementFromHTML(svgCode);

	let sz = 110;
	el.style.margin = 0;
	//el.style.backgroundColor='red';
	if (nundef(area)) area = 'objects';
	let bds = getBounds(area); let h = bds.height;
	//sz=bds.height;
	el.style.height = sz + 'px'; //110px';
	el.style.width = sz * 0.7 + 'px';
	el.style.margin = '5px';

	console.log(bds);
	console.log(el);

	//el.setAttribute('background-color','red')
	// el.setAttribute('transform','scale(.2)'); //e.g.
	// //console.log(svgCode);

	let dParent = document.getElementById(area);
	//clearElement(dParent);
	//dParent.style.height=h+'px';
	console.log(dParent);
	dParent.appendChild(el);

	// let d=document.createElement('div');


	// //d.style.transform='scale(.5)';

	// //d.style.backgroundColor = 'black';
	// d.innerHTML = svgCode;

	// dParent.appendChild(d);
	// // let x = d3.select('zone');
	// // console.log(x)
}



function makeDeck(oid, o) {

}
function makePicto(oid, o) {

}
function makeVisual(oid, o) {

}