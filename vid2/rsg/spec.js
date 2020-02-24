function rMergeSpec() {
	SPEC = deepmerge(defaultSpec, userSpec, { arrayMerge: overwriteMerge });

	//SPEC is merged userSpec!
	//console.log(SPEC);
	document.getElementById('mergedSpec').innerHTML = '<pre id="spec-result"></pre>';
	document.getElementById("spec-result").innerHTML = JSON.stringify(SPEC, undefined, 2);
	
}
