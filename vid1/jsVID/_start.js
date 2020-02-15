window.onload = ()=>_start();
var timit = new TimeIt('*');
var vidCache = new LazyCache(true);
var vidCache_dep = new VidCache_dep(); 

async function _start(){
	//resetAllGames();
	timit.showTime('*timer');

	// allGames =  await vidCache.init('allGames',{func:loadGameInfo},{load:true});
	// //allGames = await loadAllGames_dep(); //old way to do that
	// playerConfig = stubPlayerConfig(allGames); //stub to get player info

	iconChars =  await vidCache.init('iconChars',{func:route_icons},{load:true,k:'settlement'}); //,{k:'crow',load:true});

	

	timit.showTime('done');
	console.log(iconChars, typeof iconChars);
	// console.log('allGames',allGames,playerConfig);
	// console.log(allGames.catan);

	//dauert fast 1 sekunde!!!! kann ich das nicht irgendwie cachen???

}


//send a fetch command to backend
//console.log('loaded...');

//goal: produce fastest possible:
//S.spec, S.code, allGames, playerConfig, G.serverData
async function initVid(){
	await loadGameInfo();
}

async function initGame(game) {
	await loadSpec(game);
	if (S.spec) await loadCode(game, S.spec.CODE);
	console.log('spec and code loaded', S.code);
}

async function loadCode(game, fname) {
	try {
		S.codePath = '/games/' + game + '/_rsg/' + fname + '.js';
		let url = SERVER + '/code/' + game + (isdef(fname) ? '/' + fname : '');
		let data = await fetch(url);
		let text = await data.text();
		//console.log(text)
		S.code = text;
		var scriptTag = document.createElement("script");
		scriptTag.onload = () => console.log('script loaded');
		scriptTag.setAttribute("type", "text/javascript");
		scriptTag.innerHTML = text; // "console.log('HALLOOOOOOOOOO DU!!!!!!!');";
		document.getElementsByTagName("body")[0].appendChild(scriptTag);
	} catch{ S.code = null; }

}

//load spec from server, sets S.spec (object | null if not found!) and S.specText
async function loadSpec(game, fname) {
	try {
		let url = SERVER + '/spec/' + game + (isdef(fname) ? '/' + fname : '');
		let data = await fetch(url);
		let text = await data.text();
		S.specText = text;
		//console.log(text);
		S.spec = jsyaml.load(text);
		// document.getElementById('table').innerHTML = jsyaml.dump(S.spec) //NO!!!
		// document.getElementById('table').textContent = `${jsyaml.dump(S.spec)}`; //NO!!!
		//document.getElementById('table').innerHTML = '<pre>'+jsyaml.dump(S.spec)+'</pre>'; //YES!!!
		document.getElementById('table').innerHTML = '<pre>' + text + '</pre>'; //PERFECT!!!!!!!!!!
		//console.log('done loading spec', S.spec);
	} catch{
		S.spec = null;
	}
}


function loadSpec_dep(game) {
	let url1 = SERVER + '/hallospec/' + game;
	fetch(url1)
		.then(resp => resp.text())
		.then(d => {
			console.log(d);
			let ymljs = jsyaml.load(d);
			console.log(ymljs);
			// let json = JSON.stringify(d);
			// console.log(json);
			// let jsonObject = JSON.parse(json);
			// console.log(jsonObject);
		});
}

//let spec=loadSpec_dep('catan'); //geht
//let spec=loadSpec('catan'); //geht
//initGame('catan')


// const request = async () => {
// 	const response = await fetch(url1);
// 	const t = await response.text();
// 	console.log('hallo',t);
// }
// request();

