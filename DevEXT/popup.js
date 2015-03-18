$("document").ready(function() {
	chrome.storage.sync.get("options", function(items) {
		for(var i = 0; i < $(".ch").length; i++) {
			$(".ch:eq(" + i + ")").prop("checked", items.options[$(".ch:eq(" + i + ")").attr("id")]);
		}
		$(".ch").click(function() {
			items.options[$(this).attr("id")] = $(this).prop("checked");
			chrome.storage.sync.set(items);
		});
		
		$("#bexbadges").click(function() {
			$("#twitchbadges").prop("checked", false);
			items.options.twitchbadges = false;
			chrome.storage.sync.set(items);
		});
		$("#twitchbadges").click(function() {
			$("#bexbadges").prop("checked", false);
			items.options.bexbadges = false;
			chrome.storage.sync.set(items);
		});
	});
});
