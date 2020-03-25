var counter = 0;
function incCounter(){console.log(counter);counter+=1;}

function cardFace(d, i) { incCounter(); return 'para ' + i + ': card ' + d; }

function updateSelection(d) {
	let multi = div.selectAll("p");
	multi.data(d).exit().remove();
	multi.data(d).enter().append('p').text(cardFace);
	multi.data(d).text(cardFace);
}
function modifyServerDataInPlace() { for (let i = 0; i < 3; i++) { serverData[i] += 1; } }
function modifyServerDataGlobal() { serverData = serverData.map(x => x + 1); }

var serverData = [0, 1, 2];
var body = d3.select('body');
var div = body.select('div');
body.select('button').text('UPDATE UI').on('click', () => { modifyServerDataGlobal(); updateSelection(serverData); });
updateSelection(serverData);















