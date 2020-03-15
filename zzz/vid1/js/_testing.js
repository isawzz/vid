var TEST_NUM = 1;
var USPEC_PATH = '/vid1/tests/';
var CODE_PATH = '/vid1/tests/';
var SERVERDATA_PATH = '/vid1/tests/';

async function reloadTest() {
	userSpec.invalidate();
	userCode.invalidate();
	serverDataCache.invalidate();
	await loadTest(1, 1, 1);
}
async function loadTest(nUspec, nCode, nServerData) {
	let url = USPEC_PATH + 'uspec' + nUspec + '.yaml';
	userSpec = await vidCache.load('userSpec',async() => await route_test_userSpec(url));

	url = CODE_PATH + 'code' + nCode + '.js';
	userCode = await vidCache.load('userCode', async() =>{ return {asText: await route_path_text(url)};}); //route_userCode(GAME, fname));//, true); //set true to reload from server!
	loadCode(GAME, userCode.live.asText);

	url = SERVERDATA_PATH + 'data' + nServerData + '.yaml';
	serverDataCache = initialData[GAME] = await vidCache.load('data' + nServerData, async() => await route_path_yaml_dict(url)); //, true); //set true to reload from server
	serverData = initialData[GAME].live;

}




