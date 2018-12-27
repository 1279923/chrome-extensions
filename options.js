window.onload = function(){

var contentDetails = document.getElementById("contentDetails");
var searchBox = document.getElementById("search");
var searchAC = document.getElementById("searchAC");
var currentList = [];
var currentIndex = 0;

var DLlist = [];
var tagIndex = [];

var searchSiteType = "all";

//searchAC.setAttribute("size", 40);
//Math.round((window.innerHeight-40)/18)
//searchAC.style.height = window.innerHeight-50 + "px";
contentDetails.style.height = window.innerHeight-120 + "px";
document.getElementById("content").style.width = window.innerWidth-700 + "px";
document.getElementById("content").style.height = window.innerHeight-15 + "px";

document.getElementById("siteType").addEventListener("change", function(){ searchSiteType = this.value})

function setArray(data){
	DLlist = [];
	if((searchSiteType == "chan") || (searchSiteType == "all")) DLlist.push.apply(DLlist, data.DLlistC);
	if((searchSiteType == "idol") || (searchSiteType == "all")) DLlist.push.apply(DLlist, data.DLlistI);
	
	tagIndex = [];
	if((searchSiteType == "chan") || (searchSiteType == "all")) tagIndex.push.apply(tagIndex, data.tagIndexC);
	if((searchSiteType == "idol") || (searchSiteType == "all")) tagIndex.push.apply(tagIndex, data.tagIndexI);
}
searchBox.addEventListener("input", function(){
	if(searchBox.value !== ""){
		searchAC.innerHTML = "";

		function makeOption(name, type, subType, siteType){
			let a = document.createElement('option');	
			a.setAttribute('value', type);
			a.innerHTML = name;
			if(subType == "copyright") a.style.color = "#B800A7";
			if(subType == "character") a.style.color = "#61B537";
			if(subType == "idol") a.style.color = "#F72C8C";
			if(subType == "medium") a.style.color = "#3E94D0";
			if(subType == "artist") a.style.color = "#A30015";
			if(subType == "general") a.style.color = "#F87236";
			if(subType == "content") a.style.color = (siteType == "c")? "#F87236" : "#F72C8C";
			a.dataset.siteType = siteType;
			searchAC.appendChild(a);
		}

		chrome.storage.local.get(null, function(data){
			setArray(data);
			
			DLlist.filter(x => x[1].includes(searchBox.value)).forEach(function(item){ makeOption(item[1], "content", "content", item[0]) });
			tagIndex = tagIndex.filter(x => x[2].includes(searchBox.value))
			tagIndex.forEach(function(item){ makeOption(item[2], "tag", item[1], item[0]) });
			
			//console.log((searchSiteType == "chan") || (searchSiteType == "all"))
			//searchAC.setAttribute("size", (document.getElementById("searchAC").length > 45)? 45 : document.getElementById("searchAC").length);
			//while(searchAC.length<46){ makeOption("", "content")}
		})
	}
})


searchAC.addEventListener("change", function(){
	console.log(searchAC.value)
	updateContent(searchAC.options[searchAC.selectedIndex].text ,searchAC.value, searchAC[searchAC.selectedIndex].dataset.siteType);
})

function updateContent(name, type, siteType){
	currentList = [];
	currentIndex = 0;
	console.log(name, type)
	contentDetails = "";
	document.getElementById("contentDetails").innerHTML = "";
	chrome.storage.local.get(null, function(data){
		setArray(data);
		if(type == "content"){
			document.getElementById("contentID").innerHTML = name;
			document.getElementById("contentDetails").innerHTML = "";
			let x = DLlist.findIndex(x => x[1] == name);
			if(x !== -1){
				for(let i=14; i<DLlist[x].length; i++){
					addItem("tag", DLlist[x][0], DLlist[x][i], (DLlist[x][0] == "c")? tagIndex[tagIndex.findIndex(y => y[2] == DLlist[x][i])][1] : tagIndex[tagIndex.findIndex(y => y[2] == DLlist[x][i])][1]);
					currentList.push(DLlist[x][i]);
				}
			}
			let item = DLlist[x];
			createContent(item[2], item[1], item[0] , item[3], item[4]);
		}
		if(type == "tag"){
			DLlist = DLlist.filter(x => x.some(y => y == name))
			DLlist.forEach(function(x){
				addItem("content", x[0], x[1]);
				currentList.push(x[1]);
			});
			//let item = data.DLlistC[0];
			let item = DLlist[Math.floor(Math.random() * DLlist.length)];
			createContent(item[2], item[1], item[0], item[3], item[4]);
			document.getElementById("contentID").innerHTML = name + "(" + DLlist.length + ")";
		}
		document.getElementById("contentID").href = (type == "content")? "https://" + ((siteType == "c")? "chan" : "idol") + ".sankakucomplex.com/post/show/" + name : "https://" + ((siteType == "c")? "chan" : "idol") + ".sankakucomplex.com/?tags=" + name.replace(/ /g, "_");
	})
}

function createContent(fileType, id, siteType, height, width){
	document.getElementById("content").innerHTML = "";
	let a = ((fileType == "mp4") || (fileType == "webm"))? document.createElement("video") : document.createElement("img");
	a.src = ((siteType == "c")? "chan" : "idol") + "/" + id + "." + fileType;
	if(!((fileType == "mp4") || (fileType == "webm"))){
		(height/document.getElementById("content").offsetHeight > width/document.getElementById("content").offsetWidth)? a.style.height = "100%" : a.style.width = "100%";
	}else{
		a.addEventListener("loadedmetadata", function(){ (this.videoHeight / document.getElementById("content").offsetHeight > this.videoWidth / document.getElementById("content").offsetWidth)? this.style.height = "100%" : this.style.width = "100%" });
	}
	a.dataset.id = id;
	a.autoplay = true;
	a.loop = true;
	a.controls = true;
	a.addEventListener("click", function(){ updateContent(id, "content", siteType)});
	document.getElementById("content").appendChild(a);
}

function addItem(type, siteType, name, data1, data2, data3, data4){
	
	var contentDetails = document.getElementById("contentDetails");
	let a;
	a = document.createElement('a');
	a.innerHTML = "[" + siteType.toUpperCase().bold() + "] ";
	a.href = (type == "content")? "https://" + ((siteType == "c")? "chan" : "idol") + ".sankakucomplex.com/post/show/" + name : "https://" + ((siteType == "c")? "chan" : "idol") + ".sankakucomplex.com/?tags=" + name.replace(/ /g, "_");
	a.setAttribute("target", "_blank");
	contentDetails.appendChild(a);
	a = document.createElement('a');
	a.className = "details";
	//a.dataset.type = type;
	if(type == "content"){
		a.innerHTML = name;
		a.style.color = (siteType == "c")? "#F87236" : "#F72C8C";
		a.addEventListener("click", function(){
			for(let i=0; i<document.getElementsByClassName("details").length; i++){ document.getElementsByClassName("details")[i].style.border = "" };
			this.style.border = "solid 1px black";
			currentIndex = currentList.indexOf(this.innerHTML);
			let html = this.innerHTML;
			chrome.storage.local.get(null, function(data){
				setArray(data);
				
				let item = DLlist[DLlist.findIndex(x => x[1] == html)]
				createContent(item[2], item[1], item[0], item[3], item[4]);
			})
		})
	}else if(type == "tag"){
		a.innerHTML = name;
		if(data1 == "copyright") a.style.color = "#B800A7";
		if(data1 == "character") a.style.color = "#61B537";
		if(data1 == "idol") a.style.color = "#F72C8C";
		if(data1 == "medium") a.style.color = "#3E94D0";
		if(data1 == "artist") a.style.color = "#A30015";
		if(data1 == "general") a.style.color = "#F87236";
		a.addEventListener("click", function(){
			updateContent(this.innerHTML, "tag", siteType);
		})
	}else if(type == "tagWithCount"){
		a.innerHTML = "(" + data2 + ") "
		if(data1 == "copyright") a.style.color = "#B800A7";
		if(data1 == "character") a.style.color = "#61B537";
		if(data1 == "idol") a.style.color = "#F72C8C";
		if(data1 == "medium") a.style.color = "#3E94D0";
		if(data1 == "artist") a.style.color = "#A30015";
		if(data1 == "general") a.style.color = "#F87236";
		a.dataset.parentTag = name;
		a.addEventListener("click", function(){
			updateContent(this.dataset.parentTag, "tag", siteType);
		})
		contentDetails.appendChild(a);
		a = document.createElement("a")
		a.innerHTML = name;
		if(data1 == "copyright") a.style.color = "#B800A7";
		if(data1 == "character") a.style.color = "#61B537";
		if(data1 == "idol") a.style.color = "#F72C8C";
		if(data1 == "medium") a.style.color = "#3E94D0";
		if(data1 == "artist") a.style.color = "#A30015";
		if(data1 == "general") a.style.color = "#F87236";
		a.addEventListener("click", function(){
			updateContent(this.innerHTML, "tag", siteType);
		})
	}
	contentDetails.appendChild(a);
	a = document.createElement('br')
	contentDetails.appendChild(a);
}

var actions = document.getElementById("actions");
actions.addEventListener("change", function(){
	if(actions.value == "none") return;
	document.getElementById("contentDetails").innerHTML = "";
	document.getElementById("contentID").innerHTML = "loading...";
	chrome.storage.local.get(null, function(data){
		setArray(data);
		
		if(actions.value == "tag:num(global)"){
			tagIndex.push.apply(tagIndex, tagIndex);
			tagIndex.sort((a,b) => b[4]-a[4]).forEach(function(item){ addItem("tagWithCount", item[0], item[2], item[1], item[4]) });
			document.getElementById("contentID").innerHTML = "sorted by tag amount (global)";
		}
		if(actions.value == "tag:num(user)"){
			console.time("tag:num(user)");
			tagIndex = tagIndex.map(item => [item[0], item[1], item[2], item[3], DLlist.filter(x => x.some(y => y == item[2])).length])
			tagIndex = tagIndex.map(item => [item[0], item[1], item[2], item[3], DLlist.filter(x => x.some(y => y == item[2])).length])
			tagIndex.push.apply(tagIndex, tagIndex)
			tagIndex.sort((a,b) => b[4]-a[4]).forEach(function(item){ addItem("tagWithCount", item[0], item[2], item[1], item[4]) });
			document.getElementById("contentID").innerHTML = "sorted by tag amount (user)";
			console.timeEnd("tag:num(user)")
		}
		if(actions.value == "tag:recommended"){
			tagIndex.push.apply(tagIndex, tagIndex);
			tagIndex = tagIndex.map(function(item){
				item.push(0);
				return item;
			})
			DLlist.push.apply(DLlist, DLlist);
			DLlist.forEach(function(item, index){
				for(let i=14; i<item.length; i++) tagIndex[tagIndex.findIndex(x => x[2] == item[i])][5]++;
			})
			tagIndex.map(function(x){
				x[6] = (x[4]>8)? Math.round((x[5]/x[4])*Math.cbrt(x[4])*10000) : 0;
				return x;
			}).sort((a,b) => b[6]-a[6]).forEach(function(item){ addItem("tagWithCount", item[0], item[2], item[1], item[6]) });
			document.getElementById("contentD").innerHTML = "sorted by recommendation";
		}
	})
})

document.addEventListener("keydown", function(e){
	//if([38, 40].includes(e.keyCode)) e.preventDefault();
	if(document.getElementsByClassName("details").length !== 0){
		for(let i=0; i<document.getElementsByClassName("details").length; i++){ document.getElementsByClassName("details")[i].style.border = "" };
		if(e.keyCode == 38 && currentIndex>0) currentIndex--;
		if(e.keyCode == 40 && currentIndex<currentList.length-1) currentIndex++;
		document.getElementsByClassName("details")[currentIndex].click();
		console.log(currentList)
		console.log(currentIndex)
	}
})

document.addEventListener("click", function(e){
	if(e.target.className == "details") detailSelected = true;
})

document.getElementById("DLdata").addEventListener("click", function(){ chrome.storage.local.get(null, function(data){ downloadFileFromText('sankaku manager data.json',JSON.stringify(data)) }) });

function onChange(event) {
	var reader = new FileReader();
	reader.onload = onReaderLoad;
	reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event){
	console.log(event.target.result);
	var obj = JSON.parse(event.target.result);
	if(confirm("do you want to override the saved data?")){
		chrome.storage.local.set({tagIndexC: obj.tagIndexC, tagIndexI: obj.tagIndexI, DLlistC: obj.DLlistC, DLlistI: obj.DLlistI})
	}
}

document.getElementById('upload').addEventListener('change', onChange);

function downloadFileFromText(filename, content) {
	var a = document.createElement('a');
	var blob = new Blob([ content ], {type : "text/plain;charset=UTF-8"});
	a.href = window.URL.createObjectURL(blob);
	a.download = filename;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	delete a;
}

	
	
	
	
}