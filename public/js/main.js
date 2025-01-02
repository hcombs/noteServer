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

	const initializeEdit = (initial)=>{ 
		document.querySelector("#title").innerHTML = initial.title;
		document.querySelector("#content").innerHTML = initial.content;
	};

	const closeEdit = ()=>{ 
		document.querySelector("#title").innerHTML = "";
		document.querySelector("#content").innerHTML = "";
	};

	const saveNote = ()=>{ 
		console.log('save implimentation');
	};

	const deleteNote = ()=>{ }

	return{
		initializeEdit,
		closeEdit,
		saveNote,
		deleteNote
	};	
})();


const testEditor = ()=>{ 
	editNote.initializeEdit({
		title:"edit note",
		content:"This note is a test of the note initializer",
		filename:""
	});

	editNote.closeEdit();

}

window.onload = ()=>{

	document.querySelector("#save").onclick = editNote.saveNote
	document.querySelector("#delete").onclick = editNote.deleteNote
}
