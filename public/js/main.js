const getFile = async (filename) => {
	const response =  await fetch(window.location.href + "getFile/"+filename)	
	const json = await response.json();
	return json;
};

const updateFile = async (fileObject) => {
	const response = await fetch(window.location.href + "/updateFile/", {
		body:JSON.stringify(fileObject)
	});
	const json = await response.json();
	return json;
}


const deleteFile = async (fileObject) => {
	const response = await fetch(window.location.href + "/deleteFile/", {
		body:JSON.stringify(fileObject)
	});
	const json = await response.json();
	return json;
}

const test = async ()=> {

	console.log(await getFile("example.json"));

	//console.log(await updateFile(fileObject));	
	//console.log(await deleteFile(fileObject));	
}
