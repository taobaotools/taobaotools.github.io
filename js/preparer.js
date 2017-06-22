const CONFIRM = 'WARNING! Are you sure you want to open these links? Since there are {} links, you ' +
    'may temporarily experience some lag in your web browser';

// Global variables for storing the links, not a very good idea...
var validLinks;
var invalidLinks;

/**
 * Main convert function that is triggered when we click 'Convert'
 */
function convert() {
    // Convert the links in the text area and place in arrays
    var links = convertURLs(document.getElementById('content').value.split('\n'));
    validLinks = links.valid;
    invalidLinks = cleanArray(links.invalid);

    // Set Message for user
    setHTML('message', getStatus(validLinks.length, invalidLinks.length));

    // Build valid and invalid links
    setComponents(true, validLinks);
    setComponents(false, invalidLinks);

    // Create event handlers for the 'Open Links' buttons
    document.getElementById('valid-open').addEventListener('click', openLinks);
    document.getElementById('invalid-open').addEventListener('click', openLinks);
}

/**
 * Open a list of links based on the event ID, prompting the user to confirm if there is more than 10
 */
function openLinks(e) {
    if (e.target.id == 'invalid-open') {
        if (invalidLinks.length <= 10 || invalidLinks.length > 10 && confirm(CONFIRM.replace('{}', invalidLinks.length))) {
            invalidLinks.forEach(function (link) {
                window.open(link);
            });
        }   
    } else {
        if (validLinks.length <= 10 || validLinks.length > 10 && confirm(CONFIRM.replace('{}', validLinks.length))) {
            validLinks.forEach(function (link) {
                window.open(link);
            });
        }
    }
}

/**
 * Change inner html of a DOM element
 */
function setHTML(elementName, html) {
    document.getElementById(elementName).innerHTML = html;
}


/**
 * Set display of html of a DOM element
 */
function setDisplay(elementName, visible) {
    document.getElementById(elementName).style.display = (visible ? 'unset' : 'none');
}


/**
 * Builds the status message at our given states based on the length of the arrays
 */
function getStatus(validLength, invalidLength) {
    if (validLength + invalidLength == 0) {
        return 'All the links are invalid.';
    } else {
        return 'Converted ' + validLength + linkOrLinks(validLength)
            + ' Found ' + invalidLength + ' invalid' + linkOrLinks(invalidLength);
    }
}


/**
 *  English Grammar to find whether we have a link or links
 */
function linkOrLinks(count) {
    return count == 1 ? ' link.' : ' links.';
}


/**
 * Clean up an array by removing all the empty string
 */
function cleanArray(array) {
    var newArray = [];
    array.forEach(function (elem) {
        if (elem != '')
            newArray.push(elem);
    });
    return newArray;
}


/* Prepare components to show valid and invalid links */
function setComponents(isValid, array) {
    // Do not process empty array of lists
    if (array.length == 0)
        return;

    // Set display of text area to false and show the built links
    var id = isValid ? 'valid' : 'invalid';
    setDisplay('content', false);
    setDisplay(id, true);

    // Build HTML
    var html = '';
    array.forEach(function (link) {
        html += '<a href=\'' + link + '\' target=\'_blank\'>' + link + '</a><br>'
    });

    // Set components
    setHTML(id + '-content', html);
    setHTML(id + '-hidden', html);
}


/**
 * Reset HTML elements on the web page
 */
function reset() {
    document.getElementById('content').value = '';
    setDisplay('content', true);
    setHTML('message', '');
    setDisplay('valid', false);
    setDisplay('invalid', false);
    setHTML('valid-copy', 'Copy to clipboard');
    setHTML('invalid-copy', 'Copy to clipboard');
    // Remove event listeners for the 'open' buttons
    document.getElementById('valid-open').removeEventListener('click', openLinks);
    document.getElementById('invalid-open').removeEventListener('click', openLinks);
}