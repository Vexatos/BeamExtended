chrome.storage.sync.get("options", function(items) {
	if(Object.keys(items).length != 5) {
		chrome.storage.sync.set({options: {twitchemotes: true, linkimages: false, usercolors: true, twitchbadges: false, bexbadges: false, splitchat: false}});
	}
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message == "showicon") {
		chrome.pageAction.show(sender.tab.id);
	}
});