var activeTabId;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ activeTabId = tabs[0].id });

//document.getElementById("test").addEventListener("click", function(){ chrome.tabs.sendMessage(activeTabId, {test: ""}, function(data){ chrome.downloads.download({url: data.url, filename: "chan sankaku/" + data.name + "." + data.type}) }) });

document.getElementById("DLall").addEventListener("click", function(){
	chrome.tabs.sendMessage(activeTabId, {turnOffAP: ""});
	chrome.runtime.sendMessage({DLall: activeTabId});
});

document.getElementById("usernameButton").addEventListener("click", function(){ chrome.storage.local.set({username: document.getElementById("username").value })});

//document.getElementById("test2").addEventListener("click", function(){ chrome.runtime.sendMessage({DLtest: {task: "zero", one: "ok"} })});