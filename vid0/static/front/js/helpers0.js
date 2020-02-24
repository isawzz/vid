//#region file IO
function loadScript(path, callback) {
	var script = document.createElement('script');
	script.onload = ev => {
		if (callback) callback(path);
	};
	script.src = path;
	document.head.appendChild(script);
}
function loadStyle(href, callback) {
	let style = document.createElement('link');
	style.rel = href == 'favicon' ? 'shortcut icon' : 'stylesheet';
	style.onload = function () {
		if (callback) callback(href);
	};
	style.href = href;
	document.head.appendChild(style);
}
function loadText(path, callback) {
	$.ajax({
		url: path,
		type: 'GET',
		success: response => {
			//console.log(response);
			if (callback) {
				callback(response);
			}
		},
		error: err => {
			error(err);
		}
	});
	return 'ok';
}
function loadYML(path, callback) {
	res = undefined;
	$.get(path) // eg. '/common/resources/LessonContentsLv01Ln01.yml'
		.done(function (data) {
			var yml = jsyaml.load(data);
			var jsonString = JSON.stringify(data);
			var json = $.parseJSON(jsonString);
			callback(yml);
		});
}
function saveFile(name, type, data) {
	// Function to download data to a file
	//usage:
	// json_str = JSON.stringify(G);
	// saveFile("yourfilename.json", "data:application/json", new Blob([json_str], {type: ""}));

	// console.log(navigator.msSaveBlob);
	if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);

	var a = $("<a style='display: none;'/>");
	var url = window.URL.createObjectURL(new Blob([data], { type: type }));
	a.attr('href', url);
	a.attr('download', name);
	$('body').append(a);
	a[0].click();
	setTimeout(function () {
		// fixes firefox html removal bug
		window.URL.revokeObjectURL(url);
		a.remove();
	}, 500);
}
//#endregion

//#region DOM helpers only vid0


class VidCache_dep {
	constructor(resetStorage = false) {
		this.live = {};
		if (resetStorage) this.resetAll();
	}
	load(key) {
		////console.log(key);
		let keys = null; let sKey = key;
		if (isList(key)) { skey = key.shift(); keys = key; }
		let res = this.live[sKey];
		if (res && keys) res = lookup(res, keys);
		if (res) return res;

		// //console.log(sKey)
		let sData = localStorage.getItem(sKey);
		// //console.log(sData);
		if (sData) {
			////console.log('found',sKey,'in local storage:',sData)
			let data = sData[0] == '{' || sData[0] == '[' ? JSON.parse(sData) : isNumber(sData) ? Number(sData) : sData;
			if (keys) { this.live[sKey] = data; return lookup(data, keys); }
			return data;
		} else {
			return null;
		}
	}
	reset() { this.live = {}; }
	resetAll() { localStorage.clear(); this.reset(); }
	saveComplexObject(keys, o) {
		//for this to work, have to retrieve dict(keys[0]) from localstorage,transform to json,setKeys to o,then store again
	}
	save(key, data) {
		//key MUST be string!
		//console.log('saving', key, data)
		this.live[key] = data;
		localStorage.setItem(key, JSON.stringify(data));
	}
}

async function loadAllGames_dep() {
	if (allGames) return;
	allGames = vidCache_dep.load('allGames');
	if (!allGames) {
		allGames = await route_allGames();
		console.log(allGames)
		//vidCache.save('allGames', allGames);
	}
}
async function loadIcon_dep(key) {
	if (!iconChars) iconChars = await route_iconChars();
	return iconChars[key];
}

//get or set attributes of a dom elem
(function ($) {
	$.fn.attrs = function (attrs) {
		var t = $(this);
		if (attrs) {
			// Set attributes
			t.each(function (i, e) {
				var j = $(e);
				for (var attr in attrs) {
					j.attr(attr, attrs[attr]);
				}
			});
			return t;
		} else {
			// Get attributes
			var a = {},
				r = t.get(0);
			if (r) {
				r = r.attributes;
				for (var i in r) {
					var p = r[i];
					if (typeof p.nodeValue !== 'undefined') a[p.nodeName] = p.nodeValue;
				}
			}
			return a;
		}
	};
})(jQuery);
