function rMergeSpec() {
	let defaultSpec = {
		table: { areas: [{ main: [800, 600] }] }
	};
	delete userSpec.live.asText; //TODO deal with this before?!?
	SPEC = deepmerge(defaultSpec, userSpec.live, { arrayMerge: overwriteMerge });

	//SPEC is merged userSpec!
	console.log(SPEC);

}
