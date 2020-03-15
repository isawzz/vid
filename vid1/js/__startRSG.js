var COND = {};
var FUNCS = {};

function rStart() {

	rMergeSpec();
	rAreas();
	gameStep();

}
function gameStep(){

	rBehaviors();

	timit.showTime('*presentation done!');

}

//#region tests
function test12_flexbox() {
	let div1 = document.getElementById('table');
	clearElement('table')
	console.log(div1);
	let data = [{ name: 'wood', num: 2 }, { name: 'ore', num: 0 }, { name: 'brick', num: 3 }];
	//d3.select('#table').style("font-size", "40px");
	//d3.select('#table').remove(); //clone(); //.html("");
	// el = d3.select('#table').append("button");
	// el.text('again');

	d3.select('#table')
		.data(data)
		.enter()
		.append('p')
		.text(function (d) { return d.name + ":" + d.num; });
}
function test11_bindCreateElements() {
	let data = [4, 1, 6, 2, 8, 9];
	//let t='button';
	let t = 'div';
	let body = d3.select("#table").selectAll(t)
		.data(data)
		.enter()
		.append(t)
		.text(function (d) { return d + " "; })
		.style('display', function (d) { return 'inline-box'; })
		.style('height', function (d) { return '200px'; })
		.style('width', function (d) { return '200px'; })
		;

}
function test13() {
	let data = SPEC.table.areas;// [4, 1, 6, 2, 8, 9];
	console.log('data', data);
	let d = d3.select('#table').html('').append('div').style('background-color', 'black').style('position', 'relative')
		.style('width', '100%').style('height', '100%');
	//let t='button';
	let t = 'div';
	let extra = d.selectAll(t)
		.data(data)
		.enter()
		.append(t)
		.text(function (d) { return d.name + " "; })
		.style('position', function (d) { return 'absolute'; })
		.style('display', function (d) { return 'inline-box'; })
		.style('top', function (d) { return d.pos.y + 'px'; })
		.style('left', function (d) { return d.pos.x + 'px'; })
		.style('width', function (d) { return d.size[0] + 'px'; })
		.style('height', function (d) { return d.size[1] + 'px'; })
		.style('background-color', function (d) { return d.color; })
		;

}
function test14() {
	let data = SPEC.table.areas;// [4, 1, 6, 2, 8, 9];
	console.log('data', data[0]);
	let d = d3.select('#table').html('').append('div').style('background-color', 'black').style('position', 'relative')
		.style('width', '100%').style('height', '100%');
	//let t='button';
	let t = 'div';
	let extra = d.selectAll(t)
		.data(data)
		.enter()
		.append(t)
		.text(function (d) { return d.name; })
		.style('background-color', function (d) { return d['background-color']; });
	// let i=0;
	// let parent = d.node();
	// console.log(parent);
	// let children = arrChildren(parent);
	// for(const rec of data){
	// 	for(const att in rec){
	// 		let child = children[i]; i+=1;
	// 		let val = rec[att];
	// 		if (isNumber(val)) val = val + 'px';
	// 		d3.select(child).attr(att,val);
	// 	}
	// }
}
function test15() {
	let data = SPEC.table.areas;// [4, 1, 6, 2, 8, 9];
	console.log('data', data[0]);
	let d = d3.select('#table').html('').append('div').style('background-color', 'black').style('position', 'relative')
		.style('width', '100%').style('height', '100%');
	//let t='button';
	let t = 'div';
	let extra = d.selectAll(t)
		.data(data)
		.enter()
		.append(t)
		.each(function (d) {
			console.log('d', d, 'this', this);
			for (const k in d) {
				let val = d[k];
				if (isNumber(val)) val = val + 'px';
				this.style[k] = val; //attr(k, val)
			}
		})
}
function test16() {
	let data = SPEC.table.areas;
	console.log('data', data.map(x => x.name));
	console.log('data[0]', data[0]);
	let d = d3.select('#table'); 
	clearElement('table');
	let t = 'div';
	let extra = d.selectAll(t)
		.data(data)
		.enter()
		.append(t)
		.each(function (d) {
			console.log('d', d, 'this', this);
			for (const k in d) {
				let val = d[k];
				if (isNumber(val)) val = val + 'px';
				this.style[k] = val; 
			}
		})
}

//#endregion