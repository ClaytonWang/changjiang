/**
 * Get initial lat/lng for map setup
 * @param {String} name lat/lng
 * @param {Number} defaultValue
 * @return {Number} initial lat/lng for map setup
 */
function getParameterByName(name, defaultValue) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(document.location.href);
    return (match && decodeURIComponent(match[1].replace(/\+/g, ' '))) || defaultValue;
}

/**
 * Show the specified error (as returned by the xServer) as a modal dialog.
 */
function showError(error) {

    var title, content;
    
    if (error.faultInfo) {
        title = error.message;
        content = error.faultInfo.hint ? error.faultInfo.hint : "Please check your xServer configuration." ;
    } else {
        title = (error.faultType.substr(error.faultType.lastIndexOf('.') + 1));
        content = error.message;
    }

    // if modal dialog exists, edit it and set it visible
    if($("#modalDialog").length > 0) {
        $("#modalDialog .modal-title").text(title);
        $("#modalDialog .modal-body").html(content);  
        $("#modalDialog").modal('show');
    } else { // else, create modal dialog
        createModalDialog(title, content);
    }   
}

/**
 * Adds a modal dialog to the body and fills it with the specified title and content.
 */
function createModalDialog(title, content) {
    
    var modalDialog = $('<div/>', {
        'id': 'modalDialog',
        'class': 'modal fade',
        'tabindex': '-1',
        'role': 'dialog',
        'aria-labelledby': 'modalLabel'        
    }).appendTo("body");
    
    var modalDocument = $('<div/>', { 'class': 'modal-dialog', 'role': 'document' }).appendTo(modalDialog);    
    var modalContent = $('<div/>', { 'class': 'modal-content' }).appendTo(modalDocument);
    
    // header elements
    var modalHeader =  $('<div/>', { 'class': 'modal-header' }).appendTo(modalContent);        
    $('<button/>', { 'type': "button", 
        'class': "close",
        'data-dismiss': "modal",
        'aria-label': "Close",
        'html': '<span aria-hidden="true">&#215;</span>'
    }).appendTo(modalHeader);         
    $('<h4/>', { 'id': 'modalLabel', 'class': 'modal-title', 'html': title }).appendTo(modalHeader);
    
    // body elements
    $('<div/>', { 'class': 'modal-body', 'html': content }).appendTo(modalContent);
    
    // footer elements
    var modalFooter =  $('<div/>', { 'class': 'modal-footer' }).appendTo(modalContent);        
    $('<button/>', { 'type': "button",
        'class': "btn btn-default",
        'data-dismiss': "modal",
        'html': 'Close'
    }).appendTo(modalFooter);

    // set dialog visible
    $("#modalDialog").modal('show');
}


/**
 * Correction of UTC date
 */
function correctUTCDate(date) {
    var now = new Date();
    // '-' and '.' are allowed as separators for date items.
    // Partial date values, beginning from year, are allowed, see (?: )? groups
    var dateArray = /(\d*)(?:[-.](\d*)(?:[-.](\d*))?)?/.exec(date) || [];
    dateArray[1] = ('0000' + parseInt(dateArray[1] || now.getFullYear())).slice(-4); // Year
    dateArray[2] = ('0' + parseInt(dateArray[2] || now.getMonth() + 1).keepBetween(1, 12)).slice(-2); // Month
    dateArray[3] = ('0' + parseInt(dateArray[3] || now.getDate()).keepBetween(1, daysInMonth(dateArray[1], dateArray[2]))).slice(-2); // Day
    return dateArray.slice(1, 4).join('-');
};

/**
 * Correction of UTC time
 */
function correctUTCTime(time) {
    var now = new Date();
    // ':' and '.' are allowed as separators for date items.
    // Partial date values, beginning from hour, are allowed, see (?: )? groups
    var timeArray = /(\d*)(?:[:.](\d*)(?:[:.](\d*))?)?/.exec(time) || [];
    timeArray[1] = ('0' + parseInt(timeArray[1] || now.getHours()).keepBetween(0, 23)).slice(-2); // Hours
    timeArray[2] = ('0' + parseInt(timeArray[2] || now.getMinutes()).keepBetween(0, 59)).slice(-2); // Minutes
    timeArray[3] = ('0' + parseInt(timeArray[3] || now.getSeconds()).keepBetween(0, 59)).slice(-2); // Seconds
    return timeArray.slice(1, 4).join(':');
};

/**
 * Keep number in the range defined by min and max
 */
Number.prototype.keepBetween = function (min, max) {
    return Math.max(Math.min(this, max), min);
};

/**
 * Return number of days for month and year.
 * Month is 1 based
 */
function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
};

/**
 * Returns the url to the webapps folder of the running server. For example http://xserver-2:50000.
 * Behind a proxy, this url may be different from window.location.host + window.location.port.
 */
function getWebappsBaseUrl() {
    var absoluteUrl = window.location.href;
    var dashboardIndex = absoluteUrl.indexOf("/dashboard/");
    var baseUrl = "";
    if (dashboardIndex != -1) {
      baseUrl = absoluteUrl.substring(0, dashboardIndex);
    }
    return baseUrl;
};

/**
 * Add PTV default bottom right controls to map; Attribution, Scale and Zoom
 */
function addBottomRightControls(map) {
    // Creating the scale control in the bottom right corner.
    L.control.scale({ position: 'bottomright' }).addTo(map);
    // Creating the zoom control in the bottom right corner (on top of layer selection).
    var zoom = new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
}

/**
 * Write the last relevant request(s) into local storage
 */
localStorage["lastShowcaseRequests"] = "";

function saveRequestToLocalStorage(service, operation, request) {
    var date = new Date();
    var storageRequest = JSON.stringify({
        id: 'bookmark' + date.getTime(),
        description: "",
        service : service,
        operation : operation,
        json : JSON.stringify(request),
        soap: "",
        header : "",
        date: date.toString(), 
        type : "JSON"
    });
    if(localStorage["lastShowcaseRequests"] == "") {
        localStorage["lastShowcaseRequests"] += storageRequest;
    } else {
        localStorage["lastShowcaseRequests"] += "###" + storageRequest;
    }  
}

function resetLocalStorage() {
    localStorage["lastShowcaseRequests"] = "";
}