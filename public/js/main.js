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
	//const json = await response.json();
	//return json;
	return;
}


const deleteFile = async (fileObject) => {
	const response = await fetch(window.location.href + "deleteFile/", {
		method:'post',
		headers:{
			'Content-Type': 'application/json'
		},
		body:JSON.stringify(fileObject)
	});
	//const json = await response.json();
	//return json;
	return
}

const test = async ()=> {

	const fileObject = {
		'filename':'test.json',
		'content':JSON.stringify({
			'method':'updateTest',
			'array':['1',2,3]
		})
	}

	await updateFile(fileObject);	
	console.log(await getFile("test.json"));
	await deleteFile(fileObject);	
}
