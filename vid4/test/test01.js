function cardFace(d, i) { return 'para ' + i + ': card ' + d; }

function updateUI(d) {
	multi.data(d);
	multi.text(cardFace);//function (d, i) { return 'para ' + i + ': ' + d; });
}
function modifyServerData() { for (let i = 0; i < 3; i++) { serverData[i] += 1; } }

var serverData = [0, 1, 2];
var body = d3.select('body');

//this example only works if div actually HAS 3 p elements already!!!!
let div = body.append('div');
for (let i = 0; i < 3; i++) { div.append('p').text('was?').style('color', 'white'); }
let multi = div.selectAll('p');
body.append('button').text('UPDATE UI').on('click', () => { modifyServerData(); updateUI(serverData); });

//summary:
// cardFace produces content of each item (card)
// updateUI produces binding to container (hand)
// modifyServerData fetches new data from server via action route

//steps:
//1. create container for data (persistent!) this is done when spec is changed! (area)
//2. create update function for container content (mapping)
//3. fetch new data via status|action (server)
//4. process persistent data
//5. call update function w/ data

//means I could actually skip step 4 and just call update directly w/ serverData




















