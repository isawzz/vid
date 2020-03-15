async function onClickReloadAll() {
	userSpec.invalidate();
	userCode.invalidate();
	serverDataCache.invalidate();
	_start();
}
async function onClickResetLocal() {
	_start(true);
}
