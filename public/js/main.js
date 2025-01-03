const getFile = async (filename) => {
	const response =  await fetch(window.location.href + "getFile/"+filename);	
	const json = await response.json();
	return json;
};

const getList = async () => {
	const response =  await fetch(window.location.href +"getNotes/" );	
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
	const response = await fetch(window.location.href + "deleteFile/", {
		method:'post',
		headers:{
			'Content-Type': 'application/json'
		},
		body:JSON.stringify(fileObject)
	});
	const json = await response.json();
	return json;
}

const test = async ()=> {

	const fileObject = {
		'filename':'test.json',
		'content':JSON.stringify({
			'method':'updateTest',
			'array':['1',2,3]
		})
	}

	console.log(await updateFile(fileObject));	
	console.log(await getFile("test.json"));
	console.log(await deleteFile(fileObject));	
	console.log(await getList());
}


const editNote = (()=>{ 
	var file;

	const initializeEdit = (initial)=>{ 
		file = initial.filename;
		document.querySelector("#title").innerHTML = initial.title;
		document.querySelector("#content").innerHTML = initial.note;
	};

	const closeEdit = ()=>{ 
		file = "";
		document.querySelector("#title").innerHTML = "";
		document.querySelector("#content").innerHTML = "";
	};

	const saveNote = ()=>{ 
		(async ()=>{
			await updateFile({
				filename:file,
				content:JSON.stringify({
					title:document.querySelector("#title").innerHTML,
					note:document.querySelector("#content").innerHTML
				})
			});
		})();

	};

	const deleteNote = ()=>{ 
		if(window.confirm(`Are you sure you want to delete ${file}?`)){
			(async ()=>{ await deleteFile({filename:file, content:''}); })();
		}
	};

	return{
		initializeEdit,
		closeEdit,
		saveNote,
		deleteNote
	};	
})();


window.onload = ()=>{
	document.querySelector("#save").onclick = editNote.saveNote
	document.querySelector("#delete").onclick = editNote.deleteNote
}
