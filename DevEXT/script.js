chrome.runtime.sendMessage("showicon");
var loadedmt = false;

chrome.storage.sync.get("options", function(items) {
	var i = document.createElement("script");
	$(i).text("var bexoptions = " + JSON.stringify(items.options) + ";");
	$("head")[0].appendChild(i);
	$(i).remove();
});
chrome.storage.onChanged.addListener(function() {
	chrome.storage.sync.get("options", function(items) {
		var i = document.createElement("script");
		$(i).text("bexoptions = " + JSON.stringify(items.options) + ";");
		$("head")[0].appendChild(i);
		$(i).remove();
	});
});

setInterval(function() {
	if(!loadedmt && $(".messages")[0]) {
		loadedmt = true;
		var i = document.createElement("script");
		i.src = chrome.extension.getURL("bex.js");
		$("head")[0].appendChild(i);
		$(i).remove();
	} else if(loadedmt && !$(".messages")[0]) {
		loadedmt = false;
		var i = document.createElement("script");
		$(i).text("BeamExtendedInstance.close();");
		$("head")[0].appendChild(i);
		$(i).remove();
	}
}, 2000);