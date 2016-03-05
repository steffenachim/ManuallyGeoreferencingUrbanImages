// Set default profile cookie
$(function () {
    if (getCookie("profile") == "") SetCookie("profile","default",100);
    $('#profileName').val(getCookie("profile"));
});

// Set a new profile name and submit clear request to system.
// New profiles get files generated from template_
function SetProfile() {
    SetCookie("profile",$('#profileName').val(),100);
    $('#clearProfile').prop("checked", false);
    $.post("/SetProfile",{clear: $('#clearProfile').is(':checked'), profile: getCookie("profile")}, function( data )
        {
            ShowDefaultView();
        }
    )
}

// Get specific cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
// Set specific cookie
function SetCookie(cookieName,cookieValue,nDays) {
    var today = new Date();
    var expire = new Date();
    if (nDays==null || nDays==0) nDays=1;
    expire.setTime(today.getTime() + 3600000*24*nDays);
    document.cookie = cookieName+"="+escape(cookieValue)
        + ";expires="+expire.toGMTString();
}
