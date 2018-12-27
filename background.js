var targetIDs = [];

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
	console.log(msg)
	if(msg.DLall !== undefined){
		console.log("download all received");
		chrome.tabs.get(msg.DLall, function(tab){
			chrome.storage.local.get("username", function(u){
				if(u.username !== ""){
					var siteType = {name: tab.url.substring(8,12), boo: (tab.url.substring(8,12) == "chan")? true : false};
					chrome.windows.create({url: "https://" + siteType.name + ".sankakucomplex.com/?tags=fav%3A" + u.username, state: "maximized"}, function(Window){
						chrome.tabs.create({windowId: Window.id}, function(tab){
							targetIDs.push(Window.tabs[0].id);
							targetIDs.push(tab.id);
							targetIDs.push(Window.id);
							
							console.log("window and tabs created")
							console.log(siteType)
							var pageNum = 1;
							var checkedNum = 0;
							var tagIndex;
							var DLlist;
							
							DLall();
							function DLall(){
								chrome.storage.local.get(null, function(data){ console.log(data) });
								if(pageNum !== 1) chrome.tabs.update(targetIDs[0], {url: "https://" + siteType.name + ".sankakucomplex.com/?tags=fav%3ATheSleepster&page=" + pageNum})
								chrome.runtime.onMessage.addListener(function start(msg, sender){
									if(sender.tab.id == targetIDs[0]){
										console.log("page " + pageNum + " loaded / message sent to send list")
										console.log(checkedNum + "contents checked")
										chrome.runtime.onMessage.removeListener(start);
										chrome.tabs.sendMessage(targetIDs[0], {sendList: ""}, function(res){
											chrome.storage.local.get(["DLlistI", "tagIndexI", "DLlistC", "tagIndexC"], function(data){
												tagIndex = (siteType.boo)? data.tagIndexC : data.tagIndexI;
												DLlist = (siteType.boo)? data.DLlistC : data.DLlistI;
												DLcontent(0, res.favNum, res.contentIDlist);
											})
										})
									}
								})
							}
							function DLcontent(i, favNum, contentIDlist){
								console.log("process #" + i);
								if(checkedNum+1>favNum){
									chrome.windows.remove(targetIDs[2]);
									return;
								}
								if(i+1>contentIDlist.length){
									pageNum++;
									setTimeout(function(){ DLall() }, 1000);
									return;
								}
								checkedNum++;
								if(DLlist.some(x => x[1] == contentIDlist[i])){
									DLcontent(i+1, favNum, contentIDlist);
									return;
								}
								chrome.tabs.update(targetIDs[1], {url: "https://" + siteType.name +".sankakucomplex.com/post/show/" + contentIDlist[i]});
								chrome.runtime.onMessage.addListener(function waitForContent(msg, sender){
									if(sender.tab.id == targetIDs[1]){
										chrome.runtime.onMessage.removeListener(waitForContent);
										chrome.tabs.sendMessage(targetIDs[1], {downloadContent: ""}, function(content){
											chrome.downloads.download({url: content.url, filename: "chrome extension/sankaku manager/" + siteType.name + "/" + contentIDlist[i] + "." + content.fileType});
											content.tagList.forEach(function(tag){
												if(!tagIndex.some(x => x[2] == tag[2])) tagIndex.push(tag);
											})
											DLlist.push([content.siteType[0], contentIDlist[i], content.fileType].concat(content.extraData).concat(content.tagList.map(x => x[1])));
											(siteType.boo)? chrome.storage.local.set({tagIndexC: tagIndex, DLlistC: DLlist}) : chrome.storage.local.set({tagIndexI: tagIndex, DLlistI: DLlist});
											setTimeout(function(){ DLcontent(i+1, favNum, contentIDlist) }, 5000);
										});
									}
								})
							}
						})
					})
				}
			})
		})
	}
	if(msg.DLtest !== undefined){
		/*(chrome.tabs.sendMessage(msg.DLtest, {downloadContent: ""}, function(content){
			console.log(["11111", content.fileType].concat(content.extraData).concat(content.tagList.map(x => x[1])))
		})*/
		/*chrome.tabs.get(msg.DLtest, function(tab){
			var siteType = {name: tab.url.substring(8,12), boo: (tab.url.substring(8,12) == "chan")? true : false};
			console.log(siteType)
		})*/
		console.log(msg.DLtest)
		console.log(msg.DLtest.task)
	}
	if(msg.DLthis !== undefined){
		//console.log(msg.DLthis)
		//console.log([msg.DLthis.siteType[0] , msg.DLthis.id, msg.DLthis.fileType].concat(msg.DLthis.extraData).concat(msg.DLthis.tagList.map(x => x[2])))
		chrome.storage.local.get(["DLlistI", "tagIndexI", "DLlistC", "tagIndexC"], function(data){
			var tagIndex = (msg.DLthis.siteType)? data.tagIndexC : data.tagIndexI;
			var DLlist = (msg.DLthis.siteType)? data.DLlistC : data.DLlistI;
			if(!DLlist.some(x => x[1] == msg.DLthis.id)){
				chrome.downloads.download({url: msg.DLthis.url, filename: "chrome extension/sankaku manager/" + msg.DLthis.siteType + "/" + msg.DLthis.id + "." + msg.DLthis.fileType});
				msg.DLthis.tagList.forEach(function(tag){
					if(!tagIndex.some(x => x[2] == tag[2])) tagIndex.push(tag);
				})
				DLlist.push([msg.DLthis.siteType[0] , msg.DLthis.id, msg.DLthis.fileType].concat(msg.DLthis.extraData).concat(msg.DLthis.tagList.map(x => x[2])));
				(msg.DLthis.siteType == "chan")? chrome.storage.local.set({tagIndexC: tagIndex, DLlistC: DLlist}) : chrome.storage.local.set({tagIndexI: tagIndex, DLlistI: DLlist});
			}
		})
	}
});


chrome.storage.local.get(null, function(data){
	console.log(data)
	
	if(false){
		//removing broken items
		for(let i=0; i<1; i++){
			data.DLlistC.pop();
		}
		for(let i=0; i<4; i++){
			data.tagIndexC.pop();
		}
	}
	
	if(false){
		//adding "c" as the first item
		//fixing tag in item
		//data.DLlistC.push.apply(data.DLlistC, data.DLlistI);
		data.DLlistC = data.DLlistC.map(function(item){
			if(!(item[0] == "c" || item[0] == "i")){
				item.unshift("c")
				for(let i = 13; i<item.length; i++){
					item[i] = item[i][1];
				}
			}
			return item;
		})
	}
	
	
	if(false){
		//data.tagIndexC.push.apply(data.tagIndexC, data.tagIndexI);
		data.tagIndexC = data.tagIndexC.map(function(item){
			if(!(item[0] == "c" || item[0] == "i")){
				item.unshift("c")
				for(let i = 13; i<item.length; i++){
					//item[i] = item[i][1]
				}
			}
			return item;
		})
	}
	
	if(false){
		data.DLlistC = data.DLlistC.filter(function(item, pos) {
			return data.DLlistC.findIndex(x => x[1] == item[1]) == pos;
		})
		data.DLlistI = data.DLlistI.filter(function(item, pos) {
			return data.DLlistI.indexOf(item) == pos;
		})
		
		console.log(data.DLlistC)
		console.log(data.DLlistI)
	}
	
	if(true){
		data.DLlistC = data.DLlistC.filter(X => X[1] == 6412454);
		console.log(data.DLlistC)
	}
	
	
	//data.tagIndexC = data.tagIndexC.filter(x => x[0] == "c")
	
	/*
	//fix broken tagIndex
	data.tagIndexC = data.tagIndexC.map(function(item){
		if(item.length == 4) item.unshift("c");
		return item;
	})
	data.tagIndexI = data.tagIndexI.map(function(item){
		if(item.length == 4) item.unshift("i");
		return item.length;
	})
	*/
	
	//console.log(data)
	//chrome.storage.local.set({tagIndexC: data.tagIndexC});
	//chrome.storage.local.set({tagIndexI: data.tagIndexI});
	//chrome.storage.local.set({DLlistC: data.DLlistC});
	//chrome.storage.local.set({DLlistI: data.DLlistI});
	
});
chrome.storage.local.getBytesInUse(null, function(amount){ console.log(amount) });

chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId){
	targetIDs[targetIDs.indexOf(removedTabId)] = addedTabId;
});

chrome.runtime.onInstalled.addListener(function(details) {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'chan.sankakucomplex.com'},})],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'idol.sankakucomplex.com'},})],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
	if(details.reason == "install"){
		chrome.storage.local.set({tagIndexC: [], tagIndexI: [], DLlistC: [], DLlistI: [], username: ""});
	}
});