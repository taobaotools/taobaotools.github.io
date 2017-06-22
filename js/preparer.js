const CONFIRM = 'WARNING! Are you sure you want to open these links? Since there are {} links, you ' +
    'may temporarily experience some lag in your web browser';

/**
 * Do everything
 */
function load() {
    // Read the query string
    var url = getParameterByName('url');
    if (url === null) {
        setError('No URL specified.');
        return;
    }

    // Check and calculate the hash value to prevent users from requesting URLs themselves
    var hash = getParameterByName('hash');
    var id = url.split('/')[0];
    var calculatedHash = 0;
    for (var i = 0; i < id.length; i++)
        calculatedHash += parseInt(id.charAt(i), 16);
        
    if (parseInt(hash) !== calculatedHash) {
        setError('Incorrect hash value.');
        return;
    }

    // Add the gist forward URL
    url = 'https://gist.githubusercontent.com/anonymous/' + url;

    // Get the valid links and read into a JSON variable
    $.getJSON(url, function (data) {
        display(data);
    })
}

/**
 * Display everything
 */
function display(validLinks) {
    if (validLinks.length === 0) {
        setError('No links were found.');
        return;
    }

    // Build valid links and create event listener
    setComponents(validLinks);
    document.getElementById('valid-open').addEventListener('click', function () {
        if (validLinks.length <= 10 || validLinks.length > 10 && confirm(CONFIRM.replace('{}', validLinks.length))) {
            validLinks.forEach(function (link) {
                window.open(link);
            });
        }
    });
}


/**
 * Get query string parameters, credit to https://stackoverflow.com/a/901144
 */
function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
 * Set error
 */
function setError(message) {
    setDisplay('loading-msg', false);
    setHTML('message', 'Error! ' + message);
}

/* Prepare components to show valid and invalid links */
function setComponents(array) {
    // Build HTML
    var html = '';
    array.forEach(function (link) {
        html += '<a href=\'' + link + '\' target=\'_blank\'>' + link + '</a><br>'
    });
    // Set components
    setDisplay('loading', false);
    setHTML('valid-content', html);
    setHTML('valid-hidden', html);
    setDisplay('valid', true);
}

// Trigger when window is loaded
window.onload = load();
