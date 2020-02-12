//send a fetch command to backend
//console.log('loaded...');

var S = {};

async function initGame(game) {
	await loadSpec(game);
	if (S.spec) await loadCode(game, S.spec.CODE);
	console.log('spec and code loaded', S.code);
}

function rsgPath(game,fname,ext){return }

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
initGame('catan')


// const request = async () => {
// 	const response = await fetch(url1);
// 	const t = await response.text();
// 	console.log('hallo',t);
// }
// request();

