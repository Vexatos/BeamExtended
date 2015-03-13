chrome.storage.sync.get("options", function(items) {
	if(Object.keys(items).length != 2) {
		chrome.storage.sync.set({options: {twitchemotes: true, linkimages: false, usercolors: true, globalcolors: false}});
	}
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message == "showicon") {
		chrome.pageAction.show(sender.tab.id);
	}
});