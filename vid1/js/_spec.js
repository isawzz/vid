function rMergeSpec() {
	let defaultSpec = {
		table: { areas: [{ main: [800, 600] }] }
	};
	SPEC = deepmerge(defaultSpec, vidCache.asDict('userSpec'), { arrayMerge: overwriteMerge });

	//SPEC is merged userSpec!
	//console.log(SPEC);
	
}
