/**
 * Helper class that does all the calculations and converting. All UI element
 * interactions are handled in 'preparer.js'
 */
const ITEM_ID = 'id=';
const ITEM = 'item/';
const SHOP_ID = 'shop_id=';
const TAOBAO_URL = 'https://item.taobao.com/item.htm?id=';
const TMALL_URL = 'https://detail.tmall.com/item.htm?id=';
const SHOP_URL = 'https://shop{}.taobao.com';
const M_INTL = 'm.intl.taobao.com';
const H5 = 'h5.m.taobao.com';
const WORLD = 'world.taobao.com';
const SHOP_M = 'shop.m.taobao.com';
const SEARCH_QUERY = '/search.htm?search=y';

/**
 * Given an array of URLs, separate them into valid and invalid ones, convert them and return
 */
function convertURLs(urls) {
    // Initialise our empty arrays
    var validLinks = [];
    var invalidLinks = [];

    // Go through each element of the parameter array and convert as required
    urls.forEach(function (url) {
        if (isTaobaoURL(url))
            validLinks.push(convertURL(url));
        else
            invalidLinks.push(url);
    });

    // Return object containing our valid links and invalid links array
    return {
        valid: validLinks,
        invalid: invalidLinks
    };
}


/**
 * Given a valid, Taobao url we convert it into Chinese mainland form
 */
function convertURL(str) {
    // Handle tmall world link
    if (contains(str, 'tmall.com'))
        return TMALL_URL + getID(str, ITEM_ID);

    // Handle Taobao links
    if (contains(str, M_INTL) || contains(str, H5)) {
        // Normal international or H5 app link
        return buildTaobaoURL(str, ITEM_ID, false)
    } else if (contains(str, WORLD)) {
        // world.taobao.com link
        if (contains(str, 'item')) {
            // World item
            return buildTaobaoURL(str, ITEM, false);
        } else {
            // World store
            var intermediate = str.replace('world.taobao.com', 'taobao.com');
            return cleanTaobaoStore(intermediate);
        }
    } else if (contains(str, SHOP_M)) {
        // Mobile shop with shop ID
        return buildTaobaoURL(str, SHOP_ID, true);
    } else if (!contains(str, 'item')) {
        // Clean the store link, remove any redundant information, and conevrt from mobile if relevant
        // str.replace('m.taobao.com', 'taobao.com'); // MOBILE STORE
        return cleanTaobaoStore(str);
    } else {
        // Already valid Taobao URL, canonacalise it
        return buildTaobaoURL(str, 'id=', false);
    }
}


/**
 * Given a string URL and a query we want to match, get the ID which is numeric only
 */
function getID(str, match) {
    var start = str.indexOf(match) + match.length;
    var end = str.length;
    for (var i = start; i < str.length; i++) {
        if (!isDigit(str.charAt(i))) {
            end = i;
            break;
        }
    }
    return str.substring(start, end);
}


/**
 * Given a string, and query we want to match, we find, replace and return
 */
function buildTaobaoURL(str, match, isShop) {
    if (isShop) {
        var shopID = getID(str, match);
        return SHOP_URL.replace('{}', shopID);
    } else {
        var itemID = getID(str, match);
        return TAOBAO_URL + itemID;
    }
}

/**
 * Clean a Taobao store search
 */
function cleanTaobaoStore(str) {
    // Check if there are additional useless information variables
    var end = str.indexOf('taobao.com/');
    if (end == -1) {
        return str;
    } else {
        end += 10;
        if (contains(str, 'search.htm'))
            return str.substring(0, end) + SEARCH_QUERY;
        else
            return str.substring(0, end);
    }
}


/**
 * Given a string, we check and return if it is a valid Taobao URL or not
 */
function isTaobaoURL(str) {
    // Define our Regex pattern and test the string
    var urlPattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return urlPattern.test(str) && (str.indexOf('taobao.com') != -1 || str.indexOf('tmall.com') != -1);
}


/**
 * Given a string and a query parameter, we check if the string contains that query
 */
function contains(str, query) {
    return str.indexOf(query) != -1;
}


/**
 * Given a character, check whether it is a digit or not by converting to ASCII code
 */
function isDigit(char) {
    char = char.charCodeAt(0);
    return char >= 48 && char <= 57;
}
