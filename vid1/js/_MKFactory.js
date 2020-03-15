function makeBoard(oid, o) {

}

function makeCard52_test(oid, o, { rank, suit, area, hand }) {
	if (nundef(rank)) { rank = '2'; suit = 'B'; } if (rank == '10') rank = 'T'; if (nundef(suit)) suit = 'H';//joker:J1,J2, back:1B,2B

	let cardKey = 'card_' + rank + suit; let svgCode = '<div>' + c52.get(cardKey) + '</div>'; //c52 is cached asset loaded in _start

	let el = createElementFromHTML(svgCode);
	//console.log(el)

	let sz = 90; 
	el.style=`height:${sz}px;width:${sz * 0.7}px;margin:5px;margin-top:20px;float:left;display:inline-box`;

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
function makeHand(oid, o) {

}
function makePicto(oid, o) {

}
function makeVisual(oid, o) {

}