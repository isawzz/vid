//muss ueberschrieben werden von vidHelpers!
function getPlayer(id) { return G.playersAugmented[id]; }
function openTab(cityName) {
	//console.log('opening',cityName)
	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName('tabcontent');
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = 'none';
	}
	tablinks = document.getElementsByClassName('tablinks');
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(' active', '');
	}
	document.getElementById('a_d_' + cityName).style.display = 'block';
	document.getElementById('c_b_' + cityName).className += ' active';
	//evt.currentTarget.className += ' active';
}
function getPageHeaderDivForPlayer(oid) { return document.getElementById('c_c_' + G.playersAugmented[oid].username); }

