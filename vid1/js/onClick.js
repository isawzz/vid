async function onClickReloadAll() {
	userSpec.invalidate();
	userCode.invalidate();
	serverDataCache.invalidate();
	_start();
}
async function onClickReloadServerData() {
	serverDataCache.invalidate();
	gameStep();
}
