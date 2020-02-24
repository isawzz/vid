async function onClickReloadAll() {
	vidCache.invalidate('testCards','allGames','userSpec','serverData','userCode');
	_start();
}
async function onClickResetLocal() {
	_start(true);
}
