function rMergeSpec() {
	let defaultSpec = {
		table: { layout_alias: [{ main: [800, 600] }] }
	};
	SPEC = deepmerge(defaultSpec, vidCache.asDict('userSpec'), { arrayMerge: overwriteMerge });

	//SPEC is merged userSpec!
	//console.log(SPEC);
	
}
