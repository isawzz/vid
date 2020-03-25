//now do the same, but use enter to create needed data elements
function cardFace(d, i) { incCounter(); return 'para ' + i + ': card ' + d; }

function initMulti(d) {
	multi.data(d).enter().append('p').text(cardFace);
}
function updateMulti(d) {

	multi = div.selectAll("p");//.data(d);

	multi.data(d).exit().remove();
	multi.data(d).enter().append('p').text(cardFace);//.text(function(d,i){return d});
	multi.data(d).text(cardFace);
	console.log('hallooooo',div.selectAll('p').nodes().map(x=>x.__data__))
	console.log(multi)
	//multi.data(d).text(cardFace);
	//multi.text(cardFace);//function (d, i) { return 'para ' + i + ': ' + d; });
}
var counter = 0;
function incCounter(){console.log(counter);counter+=1;}
function updateMulti_01_WORKS(d) {

	multi = div.selectAll("p");//.data(d);

	multi.data(d).exit().remove();
	multi.data(d).enter().append('p');//.text(function(d,i){return d});
	multi.data(d).text(function(d,i){return d});
	console.log('hallooooo',div.selectAll('p').nodes().map(x=>x.__data__))
	console.log(multi)
	//multi.data(d).text(cardFace);
	//multi.text(cardFace);//function (d, i) { return 'para ' + i + ': ' + d; });
}
function modifyServerDataInPlace() { for (let i = 0; i < 3; i++) { serverData[i] += 1; } }
function modifyServerDataGlobal() { serverData = serverData.map(x => x + 1); }

var multi;
var serverData = [0, 1, 2];
var body = d3.select('body');
var div = body.select('div');
body.select('button').text('UPDATE UI').on('click', () => { modifyServerDataInPlace(); updateMulti(serverData); });
updateMulti(serverData);
//let multi = div.selectAll('p');
//multi.data(serverData).enter().append('p').text(cardFace);
//initMulti(serverData);
// //body.selectAll('p').data(serverData); //empty virtual selection


























