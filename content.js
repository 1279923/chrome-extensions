var contentDetails;
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
	console.log(msg)
	console.log(sender)
	if(msg.test == ""){
		/*var item = document.getElementById("image");
		var src = item.src;
		if(document.getElementById("image-link")) src = document.getElementById("image-link").href
		sendResponse({url: src, type: item.src.split('.').pop().split('?')[0], name: window.location.href.split("/")[5]});
		*/
		console.log("test")
		window.scrollTo(0, document.documentElement.scrollHeight)
	};
	if(msg.test2 == ""){
		/*var item = document.getElementById("image");
		var src = item.src;
		if(document.getElementById("image-link")) src = document.getElementById("image-link").href
		sendResponse({url: src, type: item.src.split('.').pop().split('?')[0], name: document.getElementById("hidden_post_id").innerHTML});
		*/
	};
	if(msg.downloadContent == ""){
		let tagList = [];
		let i;
		let tag;
		for(i=0; i<document.getElementById("tag-sidebar").children.length; i++){
			tag = document.getElementById("tag-sidebar").children[i]
			tagList.push([tag.className.split("-")[2], tag.children[0].innerText, tag.children[0].getAttribute("title"), (window.location.href.substring(8,12) == "chan")? tag.children[1].children[1].innerText : tag.children[2].innerText]);
		}
		
		sendResponse({tagList: tagList, url: (document.getElementById("image-link") && document.getElementById("image-link").href !== "")? src = document.getElementById("image-link").href : document.getElementById("image").src, siteType: window.location.href.substring(8,12), fileType: document.getElementById("image").src.split('.').pop().split('?')[0], extraData: [document.getElementById("image").getAttribute("orig_height"), document.getElementById("image").getAttribute("orig_width"), document.getElementById("image").height, document.getElementById("image").width, document.getElementById("post_source").value, (document.getElementById("highres"))? document.getElementById("highres").title.replace(" bytes", "").replace(/,/g, "") : 0, document.getElementById("stats").children[1].children[0].children[0].title, (document.getElementById("remaining-favs"))? document.getElementById("favorited-by").children.length-2+document.getElementById("remaining-favs").children.length : document.getElementById("favorited-by").children.length, (document.querySelector("span[itemprop='ratingValue']"))? document.querySelector("span[itemprop='ratingValue']").innerText : 0, (document.querySelector("span[itemprop='reviewCount']"))? document.querySelector("span[itemprop='reviewCount']").innerText : 0, document.getElementById("stats").children[1].children[document.getElementById("stats").children[1].children.length-1].innerText.split(" ")[1]]});
		
		/*
		taglist url siteType fileType extraData
		extraData: favNum, vote rating, vote count, orig_height, orig_width, resize_height, resize_width, source, rating, size
		
		url: (document.getElementById("image-link") && document.getElementById("image-link").href !== "")? src = document.getElementById("image-link").href : document.getElementById("image").src
		siteType: window.location.href.substring(8,12)
		fileType: document.getElementById("image").src.split('.').pop().split('?')[0]
		favNum: (document.getElementById("remaining-favs"))? document.getElementById("favorited-by").children.length-2+document.getElementById("remaining-favs").children.length : document.getElementById("favorited-by").children.length;
		vote rating: (document.querySelector("span[itemprop='ratingValue']"))? document.querySelector("span[itemprop='ratingValue']").innerText : 0
		vote count: (document.querySelector("span[itemprop='reviewCount']"))? document.querySelector("span[itemprop='reviewCount']").innerText : 0
		orig_height: document.getElementById("image").getAttribute("orig_height")
		orig_width: document.getElementById("image").getAttribute("orig_width")
		resize_height: document.getElementById("image").height
		resize_width: document.getElementById("image").width
		source: document.getElementById("post_source").value
		rating: document.getElementById("stats").children[1].children[document.getElementById("stats").children[1].children.length-1].innerText.split(" ")[1]
		size: (document.getElementById("highres"))? document.getElementById("highres").title.replace(" bytes", "").replace(/,/g, "") : 0;
		date: document.getElementById("stats").children[1].children[0].children[0].title
		
		[contentID, fileType, oh, ow, rh, rw, src, size, date, favNum, vote rating, vote count, rating, [taglist]]
		*/
	};
	if(msg.sendList == ""){
		let tempArr = [];
		let i = (document.getElementsByClassName("current")[0].innerHTML == 1)? 4 : 0;
		for(i; i<document.getElementsByClassName("thumb").length; i++){ tempArr.push(document.getElementsByClassName("thumb")[i].getAttribute("id").substring(1)) };
		sendResponse({contentIDlist: tempArr, favNum: document.getElementById("user-excerpt").children[2].innerHTML.split(" ")[3].replace(/,/g, "")});
		
		//add(tempArr + "\n" + document.getElementById("user-excerpt").children[2].innerHTML.split(" ")[3].replace(/,/g, "") + "\n" + window.location.href.split("/")[2].substring(0,4));
	}
	if(msg.turnOffAP == ""){
		let APbutton = document.getElementById("sc-auto-toggle");
		if(APbutton && APbutton.children[0].innerText == "On") APbutton.click();	
	}

})

if(document.getElementsByClassName("favoriteIcon").length !== 0){
	document.getElementsByClassName("favoriteIcon")[0].addEventListener("click", function(){
		let tagList = [];
		let i;
		let tag;
		for(i=0; i<document.getElementById("tag-sidebar").children.length; i++){
			tag = document.getElementById("tag-sidebar").children[i];
			tag = [tag.className.split("-")[2], tag.children[0].innerText, tag.children[0].getAttribute("title"), (window.location.href.substring(8,12) == "chan")? tag.children[1].children[1].innerText : tag.children[2].innerText]
			tag.unshift(window.location.href.substring(8,9))
			tagList.push(tag);
			//console.log(tag)
		}
		
		//console.log(tagList)
		
		chrome.runtime.sendMessage({DLthis: {id: window.location.href.split("/")[5], tagList: tagList, url: (document.getElementById("image-link") && document.getElementById("image-link").href !== "")? src = document.getElementById("image-link").href : document.getElementById("image").src, siteType: window.location.href.substring(8,12), fileType: document.getElementById("image").src.split('.').pop().split('?')[0], extraData: [document.getElementById("image").getAttribute("orig_height"), document.getElementById("image").getAttribute("orig_width"), document.getElementById("image").height, document.getElementById("image").width, document.getElementById("post_source").value, (document.getElementById("highres"))? document.getElementById("highres").title.replace(" bytes", "").replace(/,/g, "") : 0, document.getElementById("stats").children[1].children[0].children[0].title, (document.getElementById("remaining-favs"))? document.getElementById("favorited-by").children.length-2+document.getElementById("remaining-favs").children.length : document.getElementById("favorited-by").children.length, (document.querySelector("span[itemprop='ratingValue']"))? document.querySelector("span[itemprop='ratingValue']").innerText : 0, (document.querySelector("span[itemprop='reviewCount']"))? document.querySelector("span[itemprop='reviewCount']").innerText : 0, document.getElementById("stats").children[1].children[document.getElementById("stats").children[1].children.length-1].innerText.split(" ")[1]]}})
		
		//turn bytes into integer rather than replacing all the non-number strings?
		
		console.log("download data sent")
	});
}

function add(string){ document.getElementById("site-title").innerText += "\n" + String(string) };

chrome.runtime.sendMessage({tabLoaded: ""});
console.log("tab loaded");