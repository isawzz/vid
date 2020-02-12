//#region convert
function promUrlText(url) { }
function yamlJson(str) { return jsyaml.load(str); }

//#endregion

//#region DOM

function append(parent, el) { return parent.appendChild(el); }
function createNode(element) { return document.createElement(element); }
//#endregion

//#region load
function loadScript(path, callback) {
	var script = document.createElement('script');
	script.onload = ev => {
		console.log('ev', ev);
		console.log('this', this);
		console.log('script', ev.target);
		console.log('inner', ev.target.innerHTML);
		if (callback) callback(path);
	};
	script.src = path;
	document.head.appendChild(script);
}

//#endregion


