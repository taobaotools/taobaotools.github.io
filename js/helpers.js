/**
 * Get the error message by the request error status (code). With help from https://stackoverflow.com/a/14563181
 */
function getErrorMessage(jqXHR, exception) {
    var message = '';
    if (jqXHR.status === 0) {
        message = 'Could not connect.';
    } else if (jqXHR.status == 404) {
        message = 'Content not found (404).';
    } else if (jqXHR.status == 500) {
        message = 'Internal Server Error (500).';
    } else if (exception === 'parsererror') {
        message = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        message = 'Time out error.';
    } else if (exception === 'abort') {
        message = 'Ajax request aborted.';
    } else {
        message = 'Uncaught Error. ' + jqXHR.responseText;
    }
    return message;
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
 * Set checked status of a checkbox
 */
function setChecked(elementName, checked) {
    document.getElementById(elementName).checked = checked;
}

/**
 * Set error
 */
function setError(message) {
    console.log('Error! ' + message);
    setDisplay('loading-msg', false);
    setHTML('message', 'Error! ' + message);
}

/* Build link given values */
function buildLink(text, href) {
    return '<a href=\'' + href + '\' target=\'_blank\'>' + text + '</a><br>'
}