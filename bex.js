// Created by ExuDev with love, feel free to share, edit, and even commit to our gitHub :)
// also, open new issues for feature requests!

var BeamExtendedInstance;
if (typeof BeamExtendedInstance != 'undefined') {
    BeamExtendedInstance.close();
}

BeamExtended = function() {
    var VERSION = '1.0.6.5';
    var COMMAND = ':'; // What is before a command?

    var twitchEmoteTemplate = '';
    var twitchEmotes = [];

    var customEmoteTemplate = {
        global: '',
        channel: ''
    };
    var customEmotes = [];
    var customChannelEmotes = [];

    var roles = {};
    var colors = {};
    var colorWheel = [
        "#FF0000",
        "#0000FF",
        "#008000",
        "#B22222",
        "#FF7F50",
        "#9ACD32",
        "#FF4500",
        "#2E8B57",
        "#DAA520",
        "#D2691E",
        "#5F9EA0",
        "#1E90FF",
        "#FF69B4",
        "#8A2BE2",
        "#00FF7F"
    ];
    var secondColors = {};

    var triggeredAlerts = [];

    var tssnCrew = ['mindlesspuppetz', 'siggy', 'blackhawk120', 'ziteseve', 'squeaker', 'akujitube', 'artdude543', 'lilmac21', 'icanhascookie69', 'cadillac_don'];

    var timeoutAlertChecker;
    var timeoutColorGetter;

    var styleChannel = 'style';

    var pathname = window.location.pathname;
    var channel = pathname.toLowerCase().replace("/", "");

    function GetStylesheet() {
        if (bexoptions.bexbadges == true) {
            return 'bexBadgesStyle'

        } else if (bexoptions.twitchbadges == true) {
            return 'bexTwitchBadgesStyle'

        } else {
            return 'bexStyle'

        }
    }
    styleChannel = GetStylesheet();

    setInterval(function() {
        if (bexoptions.bexbadges == true && styleChannel != 'bexBadgesStyle') {
            styleChannel = GetStylesheet();
            $cssLink.attr('href', 'https://exudev.ca/BeX/StyleSheets/' + styleChannel + '.css?' + Math.random());
        } else if (bexoptions.bexbadges == false && styleChannel == 'bexBadgesStyle') {
            styleChannel = GetStylesheet();
            $cssLink.attr('href', 'https://exudev.ca/BeX/StyleSheets/' + styleChannel + '.css?' + Math.random());
        } else if (bexoptions.twitchbadges == true && styleChannel != 'bexTwitchBadgesStyle') {
            styleChannel = GetStylesheet();
            $cssLink.attr('href', 'https://exudev.ca/BeX/StyleSheets/' + styleChannel + '.css?' + Math.random());
        } else if (bexoptions.twitchbadges == false && styleChannel == 'bexTwitchBadgesStyle') {
            styleChannel = GetStylesheet();
            $cssLink.attr('href', 'https://exudev.ca/BeX/StyleSheets/' + styleChannel + '.css?' + Math.random());
        }

    }, 1000);

    var username = '';

    // Create the tooltips only when document ready
    $(document).ready(function() {
        // MAKE SURE YOUR SELECTOR MATCHES SOMETHING IN YOUR HTML!!!
        $('.exu-emote').each(function() {
            $(this).qtip({
                content: {
                    text: function(api) {
                        return $($(this).attr('href'));
                    }

                }
            });
        });
    });



    var Utils = {
        proxifyImage: function(url) {
            if (Utils.startsWithIgnoreCase(url, 'http://')) {
                return 'https://api.plugCubed.net/proxy/' + url;
            }
            return url;
        },
        getBaseURL: function(url) {
            return url.indexOf('#') > -1 ? url.substr(0, url.indexOf('#')) : (url.indexOf('?') > -1 ? url.substr(0, url.indexOf('?')) : url);
        },
        startsWith: function(a, b) {
            if (typeof a === 'string') {
                if (typeof b === 'string' && a.length >= b.length) {
                    return a.indexOf(b) === 0;
                } else if ($.isArray(b)) {
                    for (var c in b) {
                        if (!b.hasOwnProperty(c)) continue;
                        var d = b[c];
                        if (typeof d === 'string' && Utils.startsWith(a, d)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        startsWithIgnoreCase: function(a, b) {
            if (typeof a === 'string') {
                if (typeof b === 'string' && a.length >= b.length) {
                    return Utils.startsWith(a.toLowerCase(), b.toLowerCase());
                } else if ($.isArray(b)) {
                    for (var c in b) {
                        if (!b.hasOwnProperty(c)) continue;
                        var d = b[c];
                        if (typeof d === 'string' && Utils.startsWithIgnoreCase(a, d)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        endsWith: function(a, b) {
            if (typeof a === 'string') {
                if (typeof b === 'string' && a.length >= b.length) {
                    return a.lastIndexOf(b) === a.length - b.length;
                } else if ($.isArray(b)) {
                    for (var c in b) {
                        if (!b.hasOwnProperty(c)) continue;
                        var d = b[c];
                        if (typeof d === 'string' && Utils.endsWith(a, d)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        endsWithIgnoreCase: function(a, b) {
            if (typeof a === 'string') {
                if (typeof b === 'string' && a.length >= b.length) {
                    return Utils.endsWith(a.toLowerCase(), b.toLowerCase());
                } else if ($.isArray(b)) {
                    for (var c in b) {
                        if (!b.hasOwnProperty(c)) continue;
                        var d = b[c];
                        if (typeof d === 'string' && Utils.endsWithIgnoreCase(a, d)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    };

    //region Loading data
    $.getJSON('https://beam.pro/api/v1/users/current', function(data) {
        if (data.username != null) {
            username = data.username.toLowerCase();
        }
    });

    //region Roles
    $.getJSON('https://exudev.ca/BeX/config.json?' + Math.random(), function(data) {
        roles = data;
    });
    //endregion

    // This is a cookie loader for the GlobalUsernames - Which makes every user on beam have a color
    // It is currenlty not working
    // document.cookie.split(';').forEach(function(part) {
    //    if (part.trim().indexOf('BeXColors') === 0) {
    //        secondColors = JSON.parse(part.split('=')[1].trim());
    //    }
    // })

    //region Chat Colors
    $.getJSON('https://exudev.ca/BeX/UsernameColors.json', function(data) {
        colors = data;
    });
    //endregion

    //region Emotes
    $.getJSON('https://exudev.ca/BeX/emotes/_index.json?' + Math.random(),
        /**
         * @param {{template: String, emotes: Object}} data
         */
        function(data) {
            customEmoteTemplate = data.template;
            customEmotes = data.emotes;
        });
    //endregion

    //region Twitch Emotes
    $.getJSON('https://api.plugcubed.net/twitchemotes',
        /**
         * @param {{
         *     template: {
         *         small: String
         *     },
         *     emotes: {
         *         image_id: Number
         *     }[]
         * }} data
         */
        function(data) {
            twitchEmoteTemplate = data.template.small;
            twitchEmotes = [];

            for (var i in data.emotes) {
                if (!data.emotes.hasOwnProperty(i)) continue;
                twitchEmotes.push({
                    emote: i,
                    image_id: data.emotes[i].image_id
                });
            }
        });
    //endregion

    //region Channel Emotes
    function onCustomChannelEmotesLoaded(emotes) {
        if (emotes != null) {
            customChannelEmotes = emotes;

            if (channel == 'exuviax') {
                $messages.prepend(
                    $('<div>')
                        .addClass('message')
                        .attr('data-role', 'ExuMessage').append(
                        $('<div>')
                            .addClass('message-body')
                            .html('Hey, I help create/maintain <a href="https://github.com/ExuDev/BeamExtended" target="_blank">Beam Extended</a> v' + VERSION + '!<br> To see all my channel emotes and bot commands, go <a href=\"http://beamalerts.com/bex/exuviax\" target=\"_blank\"> here</a>')
                    )
                );
            } else {

                var $message = $('<div>')
                    .addClass('message-body')
                    .html('<a href="https://github.com/ExuDev/BeamExtended" target="_blank">Beam Extended loaded</a> v' + VERSION + '<br><strong>This channel is using custom emotes!</strong><br> The emotes are: ');

                for (var i in emotes) {
                    if (!emotes.hasOwnProperty(i)) continue;
                    var emote = emotes[i];
                    $message.append($('<img title="' + emote.emote + '">').addClass('exu-emote').attr('src', customEmoteTemplate.channel.split('{image_pack}').join(emote.image_pack || channel).split('{image_id}').join(emote.image_id).split('{image_ext}').join(emote.image_ext || 'png')).data('emote', $('<span>').html(emote.emote).text()));
                }

                $messages.prepend(
                    $('<div>')
                        .addClass('message')
                        .attr('data-role', 'ExuMessage').append(
                        $message
                    )
                );

            }
        } else {
            $messages.prepend(
                $('<div>')
                    .addClass('message')
                    .attr('data-role', 'ExuMessage').append(
                    $('<div>')
                        .addClass('message-body')
                        .html('<a href="https://github.com/ExuDev/BeamExtended" target="_blank">Beam Extended loaded</a> v' + VERSION + '<br> Request custom emotes for your channel <a href=\"http://beamalerts.com/bex/\" target=\"_blank\"> here</a>')
                )
            );
        }
    }

    $.getJSON('https://exudev.ca/BeX/emotes/' + channel + '/_index.json?' + Math.random())
        .done(function(emotes) {
            onCustomChannelEmotesLoaded(emotes);
        })
        .fail(function() {
            onCustomChannelEmotesLoaded(null);
        });
    //endregion
    //endregion
    var $cssLink = $('<link rel="stylesheet" type="text/css" href="https://exudev.ca/BeX/StyleSheets/' + styleChannel + '.css? ' + Math.random() + '">');
    $('head').append($cssLink);

    if (channel == 'ifstudios') {
        var $cssLinkCustom = $('<link rel="stylesheet" type="text/css" href="https://exudev.ca/BeX/StyleSheets/IFstyle.css">');
        $('head').append($cssLinkCustom);
    } else if (tssnCrew.indexOf(channel) > -1) {
        var $cssLinkCustom = $('<link rel="stylesheet" type="text/css" href="https://exudev.ca/BeX/StyleSheets/tssnStyle.css">');
        $('head').append($cssLinkCustom);
    }

    function overrideMessageBody($messageBody) {
        var messageRole = $messageBody.parent().attr('data-role');

        // Replace image links with images
        if (bexoptions.linkimages == true) {
            $messageBody.find('a').each(function() {
                if (Utils.endsWithIgnoreCase(Utils.getBaseURL(this.href), ['.gif', '.jpg', '.jpeg', '.png', '.rif', '.tiff', '.bmp'])) {
                    var original = $('<div>').append($(this).clone()).html();

                    var $imgContainer = $('<div>').addClass('imgContainer').mouseover(function() {
                        $(this).find('.delete').show();
                    }).mouseout(function() {
                        $(this).find('.delete').hide();
                    });

                    $(this).replaceWith($imgContainer);

                    $imgContainer.append($('<img>').attr('src', this.href));

                    $imgContainer.append($('<a>').addClass('open btn').text('Open').attr({
                        target: '_blank',
                        href: this.href
                    })).append($('<div>').addClass('remove btn').text('Remove(Double-Click)').click(function() {
                        $imgContainer.replaceWith($('<div>').append(original))
                    }));

                }
            });
        }

        var messageBody = ' ' + $messageBody.html() + ' ';
        var oldMessageBody = messageBody;
        var emote, temp;

        // Replace Twitch Emotes (Global)
        if (bexoptions.twitchemotes == true) {
            for (var i in twitchEmotes) {
                if (!twitchEmotes.hasOwnProperty(i)) continue;
                emote = twitchEmotes[i];
                if (messageBody.indexOf(' ' + emote.emote + ' ') > -1 || messageBody.indexOf(':' + emote.emote + ':') > -1) {
                    temp = $('<div class="tooltip-content">' + emote.emote).append($('<img title="' + emote.emote + '">').addClass('exu-emote').attr('src', twitchEmoteTemplate.split('{image_id}').join(emote.image_id)).data('emote', $('<span>').html(emote.emote).text()));
                    messageBody = messageBody.split(' ' + emote.emote + ' ').join(' ' + temp.html() + ' ');
                    messageBody = messageBody.split(':' + emote.emote + ':').join(temp.html());
                }
            }
        }

        // Replace Custom Emotes (Global)
        for (i in customEmotes) {
            if (!customEmotes.hasOwnProperty(i)) continue;
            emote = customEmotes[i];
            if (messageBody.indexOf(' ' + emote.emote + ' ') > -1 || messageBody.indexOf(':' + emote.emote + ':') > -1) {
                temp = $('<div>').append($('<img title="' + emote.emote + '">').addClass('exu-emote').attr('src', customEmoteTemplate.global.split('{image_id}').join(emote.image_id).split('{image_ext}').join(emote.image_ext || 'png')).data('emote', $('<span>').html(emote.emote).text()));
                messageBody = messageBody.split(' ' + emote.emote + ' ').join(' ' + temp.html() + ' ');
                messageBody = messageBody.split(':' + emote.emote + ':').join(temp.html());
            }
        }

        // Replace Custom Emotes (Channel)
        for (i in customChannelEmotes) {
            if (!customChannelEmotes.hasOwnProperty(i)) continue;
            emote = customChannelEmotes[i];
            if (messageBody.indexOf(' ' + emote.emote + ' ') > -1 || messageBody.indexOf(':' + emote.emote + ':') > -1) {
                temp = $('<div>').append($('<img title="' + emote.emote + '">').addClass('exu-emote').attr('src', customEmoteTemplate.channel.split('{image_pack}').join(emote.image_pack || channel).split('{image_id}').join(emote.image_id).split('{image_ext}').join(emote.image_ext || 'png')).data('emote', $('<span>').html(emote.emote).text()));
                messageBody = messageBody.split(' ' + emote.emote + ' ').join(' ' + temp.html() + ' ');
                messageBody = messageBody.split(':' + emote.emote + ':').join(temp.html());
            }
        }

        if (oldMessageBody != messageBody) {
            $messageBody.html(messageBody.substr(1, messageBody.length - 1));
        }
    }

    function argsToString(args) {
        var string = "";

        if (args instanceof Array) {
            if (args.length > 1) {
                var iteration = 0,
                    delim = "";
                for (var x = 0; x < args.length; x++) {
                    if (iteration == 0) {
                        iteration = 1;
                        continue;
                    }

                    string += delim + args[x];
                    delim = " ";
                }
            }
        }

        return string;
    }

    $('textarea[ng-model="message.content"]').on("keyup", function(e) {
        var code = e.keyCode || e.which;
        if (code == '9') // 9 = TAB
        {
            var string = $(this).val();
            var msgSplit = string.split(" ");
            for (var x = 0; x < msgSplit.length; x++) { // Loop through words, to support commands mid-sentence.
                if (msgSplit[x].charAt(0) == COMMAND) { // Check first letter is command
                    switch(msgSplit[x].substring(1)) { // Remove the command executor
                        case "me":
                            if(x != 0) break; // The command "ME" only works if it's first. Due to it's arguments.
                            if(msgSplit.length <= 1) break; // No parameters are here, so... don't do it!
                            $(this).val("*" + argsToString(msgSplit) + "*"); // Completely override textarea with new structure.
                            break;
                        case "version":
                            $(this).val($(this).val().replace(COMMAND + "version", "BEx :: Beam Extended Version " + VERSION + "!")); // Just replace the command.
                            break;
                        case "link":
                            $(this).val($(this).val().replace(COMMAND + "link", "BEx :: You can grab Beam Extended from https://github.com/ExuDev/BeamExtended "));
                            break;
                    }
                }
            }
        }
    });

    function createSettingsPage() {
        var opts = $("chat-options"); // Get the div
        var parent = opts.find("div section"); // Find the section
        if (parent != null)
        {
            // Add the navigation element for our page
            var nav = parent.find(".chat-dialog-menu ul");
            nav.find("li").attr("data-apage", "0"); // Add them to my logic
            nav.append('<li class="" data-apage="Bex"><a href="#">Bex Settings</a></li>');
        }
    }

    // Selector is a bit annoying, but I can't see a better more reliable one to use.
    $(".message-actions .icon-equalizer").click(function() {
        createSettingsPage();
    });

    //$("chat-options").on("click", "input[data-bex]", function() {
    //    // TEMPORARY FOR TESTING PURPOSES
    //    console.log("Toggle State of: " + $(this).data("bex"));
    //});

    $("chat-options").on("click", "li[data-apage]", function() {
        var num = $(this).data("apage");

        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active");

        var section = $(this).parent().parent().parent();

        // If our page doesn't exist, then re-add it.
        // We do this because the Beam system resets the syntax when their pages change.
        if ($(".chat-dialog-menu-page.bexobj").length == 0) {
            var ourPage = '<div class="chat-dialog-menu-page ng-scope bexobj" data-bpage="Bex">' +
                '<table class="table">' +
                '<tbody>' +
                    '<tr>' +
                        '<td class="col-xs-6"><label>Twitch Emotes</label></td>' +
                        '<td><label class="checkbox-fancy"><input type="checkbox" data-bex="twitchemotes" class="ng-pristine ng-untouched ng-valid"></label></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="col-xs-6"><label>Username Colors</label></td>' +
                        '<td><label class="checkbox-fancy"><input type="checkbox" data-bex="usercolors" class="ng-pristine ng-untouched ng-valid"></label></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="col-xs-6"><label>Use BEx Badges</label></td>' +
                        '<td><label class="checkbox-fancy"><input type="checkbox" data-bex="bexbadges" class="ng-pristine ng-untouched ng-valid"></label></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="col-xs-6"><label>Use Twitch Badges</label></td>' +
                        '<td><label class="checkbox-fancy"><input type="checkbox" data-bex="twitchbadges" class="ng-pristine ng-untouched ng-valid"></label></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="col-xs-6"><label>Chat Images</label></td>' +
                        '<td><label class="checkbox-fancy"><input type="checkbox" data-bex="linkimages" class="ng-pristine ng-untouched ng-valid"></label></td>' +
                    '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>';
            section.find(".chat-dialog-menu-page").after(ourPage);

            for (opt in bexoptions) {
                $('.chat-dialog-menu-page.bexobj input[data-bex="' + opt + '"]').prop("checked", bexoptions[opt]);
            }
        }

        if (num == "Bex") {
            section.find(".chat-dialog-menu-page").hide();
            section.find('.chat-dialog-menu-page.bexobj').show();
        } else {
            section.find(".chat-dialog-menu-page").show();
            section.find('.chat-dialog-menu-page.bexobj').hide();
        }
    });

    function onChatReceived(event) {
        var $this = $(event.target);
        var messageAuthor = $this.find('.message-author').text().toLowerCase();
        var messageRole = $this.attr('data-role');

        if (messageAuthor == null || messageRole == null) {
            return;
        }

        var i;

        // Check for special roles
        for (i in roles) {
            if (!roles.hasOwnProperty(i)) continue;
            if (roles[i].indexOf(messageAuthor) > -1) {
                messageRole += ' ' + i;
            }
        }
        $this.attr('data-role', messageRole);

        // User Colors
        if (bexoptions.usercolors == true) {
            if (colors[messageAuthor] != null) {
                $this.find('.message-author').css('color', colors[messageAuthor]);
            } else if (secondColors[messageAuthor] != null) {
                if (bexoptions.globalcolors == true) {
                    $this.find('.message-author').css('color', secondColors[messageAuthor]);
                }
            } else {
                if (bexoptions.globalcolors == true) {
                    var randomPicker = Math.floor(Math.random() * 16);
                    secondColors[messageAuthor] = colorWheel[randomPicker];
                    $this.find('.message-author').css('color', secondColors[messageAuthor]);
                    // Here is more of the cookie loader, which is still not working.
                    // document.cookie['BeXColors'] = JSON.stringify(secondColors);
                }
            }
        }

        overrideMessageBody($this.find('.message-body'));

        if (messageAuthor == username) {
            $this.on('DOMSubtreeModified', onMessageOverridden);
        }
    }

    function onMessageOverridden(event) {
        var $this = $(event.target);
        if ($this.hasClass('message-body')) {
            setTimeout(function() {
                $this.off('DOMSubtreeModified');
            }, 500);
            overrideMessageBody($this);
        }
    }

    var $messages = $('.messages').find('.nano-content');

    $messages.on('DOMNodeInserted', onChatReceived);

    console.log('Loaded BeamExtended v' + VERSION);

    function checkForAlerts() {
        $.getJSON('https://exudev.ca/BeX/alert.json', function(systemAlert) {
            for (var i in systemAlert) {
                if (!systemAlert.hasOwnProperty(i)) continue;
                if (triggeredAlerts.indexOf(systemAlert[i]) > -1) continue;
                $messages.append(
                    $('<div>')
                        .addClass('message')
                        .attr('data-role', 'ExuMessage').append(
                        $('<div>')
                            .addClass('message-body')
                            .html('<b>Beam Extended Alert</b><br>' + systemAlert[i])
                    ));
                triggeredAlerts.push(systemAlert[i]);
            }
        });
        timeoutAlertChecker = setTimeout(function() {
            checkForAlerts();
        }, 6e4);
    }

    checkForAlerts();

    this.close = function() {
        $messages.off('DOMNodeInserted', onChatReceived);
        $cssLink.remove();
        clearTimeout(timeoutAlertChecker);
        clearTimeout(timeoutColorGetter);
        BeamExtendedInstance = undefined;
    };

    return this;
};


(function() {
    function checker() {
        if (typeof jQuery !== 'undefined' && $('.messages').length > 0) {
            load();
        } else {
            setTimeout(function() {
                checker();
            }, 100);
        }
    }

    function load() {
        BeamExtendedInstance = new BeamExtended();
    }

    checker();
})();