let d = mBy('@root');

d3.select(d).style('color', 'red');

//make an object like what could be in a table
let serverData = {
	table: {
		'0': { name: 'K', obj_type: 'card' },
		'1': { name: 'Q', obj_type: 'card' },
		'2': { name: '3', obj_type: 'card' },
	}
};
//these data are processed to generate the following:
var data = [
	{ oid: '0', o: { name: 'K', obj_type: 'card' }, info: { rank: 'K' } },
	{ oid: '1', o: { name: 'Q', obj_type: 'card' }, info: { rank: 'Q' } },
	{ oid: '2', o: { name: '3', obj_type: 'card' }, info: { rank: '2' } },
];
function update(){
	
}
function changeProperty() {
	data[0].o.name = 'geht es?';
}
//jetzt will ich das als d3 function machen
//wie kann ich cardFace aufrufen?
console.log(data[0].o.name);


var container = d3.select(d).append('ul').selectAll('li').data(data);
container.exit().remove();
container.enter().append('li').text(x => x.o.name);

function changeObject() {
	data[0].o = { name: 'hallo', obj_type: 'card' };
	console.log('hallo', data[0].o.name)
	container.exit().remove();
	//container.enter().append('li').text(x => x.o.name);
}









