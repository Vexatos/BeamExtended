function beam_init()
{
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "https://exudev.ca/BeX/dev/bex.js?"+Math.random();
	thehead = document.getElementsByTagName('head')[0];
	if(thehead) thehead.appendChild(script);
	scripts = document.createElement('script');
	scripts.type = 'text/javascript';
	scripts.src = "https://exudev.ca/BeX/dev/background.js?"+Math.random();
	theheads = document.getElementsByTagName('head')[0];
	if(theheads) thehead.appendChild(script);

}
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

beam_init();