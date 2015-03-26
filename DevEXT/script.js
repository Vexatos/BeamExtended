var loaddmt = false;
var adder = Math.random();
function beam_init()
{
	if (!loaddmt && $(".messages")[0]){
		loaddmt = true;
			script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = "https://exudev.ca/BeX/bex.js?"+adder;
			thehead = document.getElementsByTagName('head')[0];
			if(thehead) thehead.appendChild(script);
			scripts = document.createElement('script');
			scripts.type = 'text/javascript';
			scripts.src = "https://exudev.ca/BeX/background.js?"+adder;
			theheads = document.getElementsByTagName('head')[0];
			if(theheads) thehead.appendChild(scripts);
			scriptz = document.createElement('script');
			scriptz.type = 'text/javascript';
			scriptz.src = "LINKTOSOME.js?"+adder;
			theheads = document.getElementsByTagName('head')[0];
			if(theheads) thehead.appendChild(scriptz);
		}else if(loaddmt && !$(".messages")[0]) {
			loaddmt = false;
        	var i = document.createElement("script");
        	$(i).text("BeamExtendedInstance.close();");
        	$("head")[0].appendChild(i);
        	$(i).remove();
        }
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

setInterval(function() {
		beam_init();
}, 2000);
