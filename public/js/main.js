var fileList;

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
		document.querySelector("#tag").innerHTML = initial.tag;
		document.querySelector("#content").innerHTML = initial.note;
	};

	const closeEdit = ()=>{ 
		file = "";
		document.querySelector("#title").innerHTML = "";
		document.querySelector("#content").innerHTML = "";
	};

	const saveNote = ()=>{
		let noteTitle = document.querySelector("#title").innerHTML; 
		let tagName = document.querySelector("#tag").innerHTML;
		if(tagName+'~'+noteTitle + ".json" !== file){
			if(file !== ""){
				(async ()=>{ await deleteFile({filename:file, content:'',tag:''}); })();
			}
			file = tagName+'~'+noteTitle +".json"
		}
		(async ()=>{
			await updateFile({
				filename:file,
				content:JSON.stringify({
					title:noteTitle,
					note:document.querySelector("#content").innerHTML,
					tag:tagName
				})
			});
		})();
	};

	const deleteNote = ()=>{ 
		if(window.confirm(`Are you sure you want to delete ${file}?`)){
			(async ()=>{ await deleteFile({filename:file, content:'',tag:''}); })();
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
		note:"",
		tag:""
	});
	(async ()=> await init())();
};

const getUniqueTags = (list)=>{
	let tags = new Set(list.map(e =>{
		if(e.indexOf('~') > -1){
			return e.split('~')[0];
		}
		return 'No tag';
	}));
	return [...tags];
};

const addTile = (name) => {
	let tag = "";
	let displayName = name;
	if(name.indexOf('~') > -1){
		tag = name.split('~')[0];
		displayName = name.split('~')[1];
	}

	displayName = displayName.split('.json').join('');
	let div = document.createElement('div');
	div.setAttribute('filename',name);
	div.setAttribute('tag',tag);
	div.onclick = async (e) =>{
		let content = await getFile(e.target.getAttribute('filename'));
		interfaceSwap();
		content.filename = e.target.getAttribute('filename');
		content.tag = e.target.getAttribute('tag');
		editNote.initializeEdit(content);
	};
	div.innerHTML = displayName;
	document.querySelector('#noteListing').appendChild(div);
}

const displayTags = (tag) => {
	let div = document.createElement('div');
	div.setAttribute('tag',tag);
	div.onclick = (e) =>{
		let key = e.target.getAttribute('tag');
		let files = fileList.filter(e=> e.indexOf(tag) > -1);
		if(key == 'No tag'){
			files = fileList.filter(e=>e.indexOf('~') < 0);
		}
		document.querySelector('#noteListing').innerHTML = '';
		files.map(addTile);
	}
	div.innerHTML = tag;
	document.querySelector('#noteListing').appendChild(div);
}


const init = async ()=> {
	document.querySelector('#noteListing').innerHTML = '';
	let list = await getList();
	let tags = getUniqueTags(list.list);
	fileList = list.list;
	tags.map(displayTags);
};



window.onload = async () =>{
	await init();
	document.querySelector("#newNote").onclick = interfaceSwap;
	document.querySelector("#save").onclick = ()=>{
		editNote.saveNote();
		interfaceSwap();
	};
	document.querySelector("#delete").onclick = ()=>{
		editNote.deleteNote();
		interfaceSwap();
	};
	document.querySelector("#cancel").onclick = interfaceSwap;
}
