var counter = 0;
function incCounter(){console.log(counter);counter+=1;}

//steps:
//0. init serverData
var serverData = [0, 1, 2];
var SPEC = {areas:['def']};

//1. create container for data (persistent!) this is done when spec is changed! (area)
var area = d3.select('#table').append('div').attr('id','def');

//2. indiv obj function
function cardFace(d, i) { incCounter(); return 'para ' + i + ': card ' + d; }
function makeItem(d,i){}

//2. create update function for container content (mapping)
//3. fetch new data via status|action (server)

//4. process persistent data
//5. call update function w/ data




















