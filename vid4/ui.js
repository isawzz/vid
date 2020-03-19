//#region interface: this interface CANNOT EVER CHANGE!!!!!!!
async function initUI(){
	_body = d3.select('body');
	document.title = 'vid4';
	_div = body.select('div');
	body.select('button').text('STEP').on('click', onClickStep);

	uiman = new UIManager0();
	return uiman;
}

var uiman=null;
var _div=null;
var _body = null;
class UIManager0{

}