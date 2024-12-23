const getFile = async (filename) => {
	const response =  await fetch(window.location.href + "getFile/"+filename)	
	const json = await response.json();
	return json;
};

const updateFile = async (fileObject) => {
	const response = await fetch(window.location.href + "updateFile/", {
		method:'post',
		headers:{
			'Content-Type': 'application/json'
		},
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

	const fileObject = {
		'filename':'example.json',
		'content':'blah'
	}

	console.log(await updateFile(fileObject));	
	//console.log(await deleteFile(fileObject));	
}
