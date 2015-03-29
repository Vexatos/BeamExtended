// Created by ExuDev with love, feel free to share, edit, and even commit to our gitHub :) 
// also, open new issues for feature requests!

var BeamExtendedInstance;
if (typeof BeamExtendedInstance != 'undefined') {
    BeamExtendedInstance.close();
}

BeamExtended = function() {
    var VERSION = '0.8.0';

    var twitchEmoteTemplate = '';
    var twitchEmotes = [];
    var twitchTurboEmotes = [];

    var customEmoteTemplate = '';
    var customEmotes = [];
    var customChannelEmotes = [];

    var roles = {};
    var colors = {};

    var triggeredAlerts = [];

    var timeoutAlertChecker;
    var timeoutColorGetter;

    var styleChannel = 'style'

    var pathname = window.location.pathname;
    var channel = pathname.toLowerCase().replace("/", "");

    if (channel == 'ifstudios') {
        var styleChannel = 'IFstyle'
    }

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
    //region Roles
    $.getJSON('https://raw.githubusercontent.com/IFDevelopment/BeamExtended/master/config.json', function(data) {
        roles = data;
    });
    //endregion

    //region Chat Colors
    function getColors() {
        $.getJSON('https://raw.githubusercontent.com/IFDevelopment/BeamExtended/master/UsernameColors.json', function(data) {
            colors = data;
        });
        timeoutColorGetter = setTimeout(function() {
            getColors();
        }, 6e4);
    }
    getColors();
    //endregion

    //region Emotes
    $.getJSON('https://raw.githubusercontent.com/IFDevelopment/BeamExtended/master/emotes/_index.json',
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
            twitchTurboEmotes = [];

            for (var i in data.emotes) {
                if (!data.emotes.hasOwnProperty(i)) continue;
                twitchEmotes.push({
                    emote: i,
                    image_id: data.emotes[i].image_id
                });
            }

            $.getJSON('https://api.plugcubed.net/twitchturboemotes',
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
                    for (i in data.emotes) {
                        if (!data.emotes.hasOwnProperty(i)) continue;
                        twitchTurboEmotes.push({
                            emote: data.emotes[i].code,
                            image_id: data.emotes[i].image_id
                        });
                    }
                    console.log('[BeamExtended]', twitchEmotes.length + twitchTurboEmotes.length, 'Twitch.TV emoticons loaded!');
                });
        });
    //endregion

    //region Channel Emotes
    function onCustomChannelEmotesLoaded(emotes) {
        if (emotes != null) {
            customChannelEmotes = emotes;

            if (channel == 'exuviax') {
                $messages.append(
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
                    .html('<a href="https://github.com/ExuDev/BeamExtended" target="_blank">Beam Extended loaded</a> v' + VERSION + '<br> <a href="http://goo.gl/Ewd2XN" target="_blank">NOW ON GOOGLE CHROME!</a> <br><strong>This channel is using custom emotes!</strong><br> The emotes are: ');

                for (var i in emotes) {
                    if (!emotes.hasOwnProperty(i)) continue;
                    var emote = emotes[i];
                    $message.append($('<img title="' + emote.emote + '">').addClass('exu-emote').attr('src', customEmoteTemplate.split('{image_id}').join(emote.image_id).split('{image_ext}').join(emote.image_ext || 'png')).data('emote', $('<span>').html(emote.emote).text()));
                }

                $messages.append(
                    $('<div>')
                    .addClass('message')
                    .attr('data-role', 'ExuMessage').append(
                        $message
                    )
                );

            }
        } else {
            $messages.append(
                $('<div>')
                .addClass('message')
                .attr('data-role', 'ExuMessage').append(
                    $('<div>')
                    .addClass('message-body')
                    .html('<a href="https://github.com/ExuDev/BeamExtended" target="_blank">Beam Extended loaded</a> v' + VERSION + '<br> <a href="http://goo.gl/Ewd2XN" target="_blank">NOW ON GOOGLE CHROME!</a><br>If you want a colored username, please tweet <a href="http://ctt.ec/85332" target="_blank">@Exuviax</a><br> Request custom emotes for your channel <a href=\"http://beamalerts.com/bex/\" target=\"_blank\"> here</a>')
                )
            );
        }
    }

    $.getJSON('https://raw.githubusercontent.com/IFDevelopment/BeamExtended/master/emotes/' + channel + '/_index.json')
        .done(function(emotes) {
            onCustomChannelEmotesLoaded(emotes);
        })
        .fail(function() {
            onCustomChannelEmotesLoaded(null);
        });
    //endregion
    //endregion
    var $cssLink = $('<link rel="stylesheet" type="text/css" href="https://raw.githubusercontent.com/IFDevelopment/BeamExtended/master/StyleSheets/' + styleChannel + '.css">');
    $('head').append($cssLink);

    function overrideMessageBody($messageBody) {
        var messageRole = $messageBody.parent().attr('data-role');

        // Replace image links with images
        $messageBody.find('a').each(function() {
            if (Utils.endsWithIgnoreCase(Utils.getBaseURL(this.href), ['.gif', '.jpg', '.jpeg', '.png', '.rif', '.tiff', '.bmp'])) {
                var original = $('<div>').append($(this).clone()).html();

                var $imgContainer = $('<div>').addClass('imgContainer').mouseover(function() {
                    $(this).find('.delete').show();
                }).mouseout(function() {
                    $(this).find('.delete').hide();
                });

                $imgContainer.append($('<img>').attr('src', this.href));

                $imgContainer.append($('<div>').addClass('delete').text('Remove').click(function() {
                    $imgContainer.replaceWith(original);
                }));

                $(this).replaceWith($imgContainer);
            }
        });

        var messageBody = ' ' + $messageBody.html() + ' ';
        var oldMessageBody = messageBody;
        var emote, temp;

        // Replace Twitch Emotes (Global)
        for (var i in twitchEmotes) {
            if (!twitchEmotes.hasOwnProperty(i)) continue;
            emote = twitchEmotes[i];
            if (messageBody.indexOf(' ' + emote.emote + ' ') > -1 || messageBody.indexOf(':' + emote.emote + ':') > -1) {
                temp = $('<div>').append($('<img title="' + emote.emote + '">').addClass('exu-emote').attr('src', twitchEmoteTemplate.split('{image_id}').join(emote.image_id)).data('emote', $('<span>').html(emote.emote).text()));
                messageBody = messageBody.split(' ' + emote.emote + ' ').join(' ' + temp.html() + ' ');
                messageBody = messageBody.split(':' + emote.emote + ':').join(temp.html());
            }
        }

        // Replace Twitch Emotes (Turbo)
        if (messageRole.indexOf('Exu') > -1) {
            for (i in twitchTurboEmotes) {
                if (!twitchTurboEmotes.hasOwnProperty(i)) continue;
                emote = twitchTurboEmotes[i];
                if (messageBody.indexOf(' ' + emote.emote + ' ') > -1 || messageBody.indexOf(':' + emote.emote + ':') > -1) {
                    temp = $('<div>').append($('<img title="' + emote.emote + '" >').addClass('exu-emote').attr('src', twitchEmoteTemplate.split('{image_id}').join(emote.image_id)).data('emote', $('<span>').html(emote.emote).text()));
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
                temp = $('<div>').append($('<img title="' + emote.emote + '">').addClass('exu-emote').attr('src', customEmoteTemplate.split('{image_id}').join(emote.image_id).split('{image_ext}').join(emote.image_ext || 'png')).data('emote', $('<span>').html(emote.emote).text()));
                messageBody = messageBody.split(' ' + emote.emote + ' ').join(' ' + temp.html() + ' ');
                messageBody = messageBody.split(':' + emote.emote + ':').join(temp.html());
            }
        }

        // Replace Custom Emotes (Channel)
        for (i in customChannelEmotes) {
            if (!customChannelEmotes.hasOwnProperty(i)) continue;
            emote = customChannelEmotes[i];
            if (messageBody.indexOf(' ' + emote.emote + ' ') > -1 || messageBody.indexOf(':' + emote.emote + ':') > -1) {
                temp = $('<div>').append($('<img title="' + emote.emote + '">').addClass('exu-emote').attr('src', customEmoteTemplate.split('{image_id}').join(emote.image_id).split('{image_ext}').join(emote.image_ext || 'png')).data('emote', $('<span>').html(emote.emote).text()));
                messageBody = messageBody.split(' ' + emote.emote + ' ').join(' ' + temp.html() + ' ');
                messageBody = messageBody.split(':' + emote.emote + ':').join(temp.html());
            }
        }

        if (oldMessageBody != messageBody) {
            $messageBody.html(messageBody.substr(1, messageBody.length - 1));
        }
    }

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

        // Check for color
        if (colors[messageAuthor] != null) {
            $this.find('.message-author').css('color', colors[messageAuthor]);
        }

        overrideMessageBody($this.find('.message-body'));

        if (messageAuthor == $('.username').text().toLowerCase()) {
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
        $.getJSON('https://raw.githubusercontent.com/IFDevelopment/BeamExtended/master/alert.json', function(systemAlert) {
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
