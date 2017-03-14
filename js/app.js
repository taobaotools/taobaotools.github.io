/**
 * The JavaScript for everything :)
 */
function convert() {
    // Create variables to store data
    var links = document.getElementById('content').value.split('\n');
    var validLinks = [];
    var invalidLinks = [];

    // Go through given links, convert and add to relevant array
    for (var i = 0; i < links.length; i++) {
        var current = links[i];
        if (isTaobaoURL(current)) {
            // Convert URL based on type and clean it up
            validLinks.push(cleanURL(convertURL(current)));
        } else {
            invalidLinks.push(links[i]);
        }
    }

    // Change status message
    var invalidLength;
    if (invalidLinks.length == 1 && invalidLinks[0] == '') {
        invalidLength = 0;
    } else {
        invalidLength = invalidLinks.length;
    }
    setHTML('message', getStatus(links.length, validLinks.length, invalidLength));

    // Build valid links
    if (validLinks.length > 0)  {
        setComponents(true, validLinks);
    }

    // Build invalid links
    if (invalidLinks.length > 0 && invalidLinks[0] != '') {
        setComponents(false, invalidLinks)
    }
}

/* Prepare components to show valid and invalid links */
function setComponents(isValid, array) {
    // Set display visibility and change text within buttons
    var id = isValid ? 'valid' : 'invalid';
    setDisplay('content', false);
    setDisplay(id, true);
    setDisplay(id + '-copy', true);
    setHTML(id + '-copy', 'Copy to clipboard');

    // Build HTML
    var html = '<h3>' + (isValid ? 'Valid' : 'Invalid') + '</h3>';
    for (var i = 0; i < array.length; i++) {
        html += '<a class=\'link\' href=\'' + array[i] + '\' target=\'_blank\'>' + array[i] + '</a>'
    }

    // Set components
    setHTML(id, html);
    setHTML(id + '-hidden', array.join('<br>')); // this is bad
    document.getElementById('actions').style.paddingTop = '15px';
}


/* Checks if string is valid URL and that it contains 'taobao.com' */
function isTaobaoURL(str) {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
    return urlPattern.test(str) && str.indexOf('taobao.com') != -1;
}


/* Converts the Taobao URL */
function convertURL(str) {
    if (str.indexOf('m.intl.taobao.com') != -1) {
        // General mobile item
        return str.replace('m.intl', 'item').replace('detail/detail', 'item').replace('detail/desc', 'item');
    } else if (str.indexOf('h5.m.taobao.com') != -1) {
        // Mobile app item, substring to get item ID and build new URL
        var start = str.indexOf('?id=') + 4;
         // Default end just length of url, loop to find alternatives
        var end = str.length;
        for (var i = start; i < str.length; i++) {
            if (!isDigit(str.charAt(i))) {
                end = i;
                break;
            }
        }
        var item_id = str.substring(start, end);
        return "https://item.taobao.com/item.htm?id=" + item_id;
    } else if (str.indexOf('m.taobao.com') != -1) {
        if (str.indexOf('shop.m.taobao.com') != -1) {
            // Weird mobile stores - e.g. shop.m.taobao.com/shop/....shop_id
            var start = str.indexOf('shop_id=') + 8;
            // Default end is length of URL
            var end = str.length;
            // Go through rest of URL, stop when we find non-digit
            for (var i = start; i < str.length; i++) {
                if (!isDigit(str.charAt(i))) {
                    end = i;
                    break;
                }
            }
            var shopID = str.substring(start, end);
            return 'https://shop' + shopID + '.taobao.com';
        } else if (str.indexOf('item') == -1) {
            // Most mobile stores
            return str.replace('m.taobao', 'taobao');
        } else {
            // Already valid Taobao URL
            var start = str.indexOf('id=') + 3;
            // Default end is length of URL
            var end = str.length;
            // Go through rest of URL, stop when we find non-digit
            for (var i = start; i < str.length; i++) {
                if (!isDigit(str.charAt(i))) {
                    end = i;
                    break;
                }
            }
            var id = str.substring(start, end);
            return 'https://item.taobao.com/item.htm?id=' + id;
        }
    } else if (str.indexOf('world.taobao.com') != -1) {
        if (str.indexOf('item') != -1) {
            // World item, we substring to get the item ID and then build the new URL
            var start = str.indexOf('item/') + 5;
            var end = str.indexOf('.htm');
            var itemID = str.substring(start, end);
            return 'https://item.taobao.com/item.htm?id=' + itemID;
        } else {
            // General world store
            return str.replace('world.taobao', 'taobao');
        }
    } else {
        // Already valid Taobao URL
        var start = str.indexOf('id=') + 3;
        // Default end is length of URL
        var end = str.length;
        // Go through rest of URL, stop when we find non-digit
        for (var i = start; i < str.length; i++) {
            if (!isDigit(str.charAt(i))) {
                end = i;
                break;
            }
        }
        var id = str.substring(start, end);
        return 'https://item.taobao.com/item.htm?id=' + id;
    }
}


/* Cleans up a URL - FIXME THIS IS REALLY BAD! */
function cleanURL(str) {
    var builder = '';
    var encounteredQuestion = false;
    for (var j = 0; j < str.length; j++) {
        if (str.charAt(j) == '?' && encounteredQuestion) {
            builder += '&';
        } else if (str.charAt(j) == '?') {
            builder += '?';
            encounteredQuestion = true;
        } else {
            builder += str.charAt(j);
        }
    }
    return builder;
}


/* Change inner html of a DOM element */
function setHTML(elementName, html) {
    document.getElementById(elementName).innerHTML = html;
}


/* Set display of html of a DOM element */
function setDisplay(elementName, visible) {
    document.getElementById(elementName).style.display = (visible ? 'unset' : 'none');
}


/* Builds the status message based on the counts */
function getStatus(total, valid, invalid) {
    if (invalid == total) {
        return 'All the links are invalid.';
    } else {
        return 'Converted ' + valid + linkOrLinks(valid) + ' Found ' + invalid + ' invalid' + linkOrLinks(invalid);
    }
}


/* English Grammar */
function linkOrLinks(count) {
    return count == 1 ? ' link.' : ' links.';
}


/* Reset HTML elements */
function reset() {
    document.getElementById('content').value = '';
    setDisplay('content', true);
    setHTML('message', '');
    setDisplay('valid', false);
    setDisplay('valid-copy', false);
    setDisplay('invalid-copy', false);
    setDisplay('invalid', false);
}

/* Check if char is digit */
function isDigit(char) {
    return char == '0' || char == '1' || char == '2' || char == '3' || char == '4' ||
            char == '5' || char == '6' || char == '7' || char == '8' || char == '9';
}
