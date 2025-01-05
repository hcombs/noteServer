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

const editNote = (()=>{ 
	var file = "";

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
		let noteTitle = document.querySelector("#title").innerHTML; 
		if(noteTitle + ".json" !== file){
			if(file !== ""){
				(async ()=>{ await deleteFile({filename:file, content:''}); })();
			}
			file = noteTitle +".json"
		}
		(async ()=>{
			await updateFile({
				filename:file,
				content:JSON.stringify({
					title:noteTitle,
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


const interfaceSwap = ()=>{ 
	document.querySelector("#listingContainer").className = document.querySelector("#listingContainer").className === "hide" ? "show":"hide";
	document.querySelector("#editNoteContainer").className = document.querySelector("#editNoteContainer").className === "hide" ? "show":"hide";
	editNote.initializeEdit({
		filename:"",
		title:"",
		note:""
	})
};

const addTile = (name) => {
	let div = document.createElement('div');
	div.setAttribute('filename',name);
	div.onclick = async (e) =>{
		let content = await getFile(e.target.getAttribute('filename'));
		interfaceSwap();
		content.filename = e.target.getAttribute('filename');
		editNote.initializeEdit(content);
	};
	name = name.split('.json').join('');
	div.innerHTML = name;
	document.querySelector('#noteListing').appendChild(div);
}

const init = async ()=> {
	document.querySelector('#noteListing').innerHTML = '';
	let list = await getList();
	list.list.map(addTile);
};

window.onload = async () =>{
	await init();
	document.querySelector("#newNote").onclick = interfaceSwap;
	document.querySelector("#save").onclick = editNote.saveNote;
	document.querySelector("#delete").onclick = editNote.deleteNote;
}
