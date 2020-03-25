
var body=d3.select('body');
body.data(['red']); //gives body DOM element a __data__ property
body.style('background-color',function(d,i){return d;}); //whatever function I enter will be bound to __data__
console.log(d3.select('body').node())

var div1=body.append('div');
//div1.text('hallo');
div1.data(['hallo','du','bist']);
div1.text(function(d,i){return d + '.' + i;});
div1.append('p').text(function(d,i){return d + '.' + i;});
div1.append('p').text(function(d,i){return d + '.' + i;});
div1.append('p').text(function(d,i){return d + '.' + i;});
//div1.enter().append('p',function(d,i){return i;});

var multi = div1.selectAll('p');
multi.text(function(d,i){return d + '.' + i;}); //i is ith element in selection, not ith data element! d is always just 'hallo'

//but if I do this:
multi.text(function(d,i){return d[i] + '.' + i;}); // now d[i] returns 'h', 'a', 'l' !!! still unwanted!

//might have to bind data to selectAll instead of div1
multi.data(['now','it','works']);
multi.text(function(d,i){return d + '.' + i;}); // YES!!! now d returns 'now', 'it', 'works' as expected!!!!!!!!!!!!!!

//now change data
multi.data(['a','b','c']); // no update occurs! have to repeat update function!
multi.text(function(d,i){return d + '.' + i;}); // YES!!! now d returns 'now', 'it', 'works' as expected!!!!!!!!!!!!!!

//put update in a function:
function updateMulti(d){
	multi.data(d);
	multi.text(function(d,i){return d + '.' + i;});
}

updateMulti([1,2,3]);
var serverData=[1,2,3];
function modifyServerData(){
	serverData[0]+=1;
	serverData[1]+=1;
	serverData[2]+=1;
}
body.append('button').text('update').on('click',()=>{modifyServerData();updateMulti(serverData);});









