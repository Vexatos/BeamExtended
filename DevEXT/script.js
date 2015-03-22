function beam_init()
{
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "https://mradder.com/cdn/bex.js?"+Math.random();
	thehead = document.getElementsByTagName('head')[0];
	if(thehead) thehead.appendChild(script);
	scripts = document.createElement('script');
	scripts.type = 'text/javascript';
	scripts.src = "https://mradder.com/cdn/background.js?"+Math.random();
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

$("document").ready(function() {
	chrome.storage.sync.get("options", function(items) {
		$("body").on("click", "chat-options input[data-bex]", function () {
			var d = $(this).data("bex");
			items.options[d] = $(this).prop("checked");

			if (d == "bexbadges") {
				$('.chat-dialog-menu-page.bexobj input[data-bex="twitchbadges"]').prop("checked", false);
				items.options.twitchbadges = false;
			}
			else if (d == "twitchbadges") {
				$('.chat-dialog-menu-page.bexobj input[data-bex="bexbadges"]').prop("checked", false);
				items.options.bexbadges = false;
			}

			chrome.storage.sync.set(items);
			console.log("Toggle State of: " + d);
		});
	});
});

beam_init();
