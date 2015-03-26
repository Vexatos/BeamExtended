$(document).ready(function() {
        console.log('I did a thing')
        $('[bex-tooltip!=""]').qtip({ // Grab all elements with a non-blank data-tooltip attr.
            content: {
                attr: 'bex-tooltip' // Tell qTip2 to look inside this attr for its content
            }
        })
});
