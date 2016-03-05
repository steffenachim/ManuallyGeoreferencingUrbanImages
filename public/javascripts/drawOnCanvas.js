// Draw new reference point
function DrawNewPoint(absposx, absposy, color) {
    if (typeof color === 'undefined') { color = '#FFFFFF'; }

    var img = document.getElementById("imgFullView");
    var cnvs = document.getElementById("imgFullViewCan");
    if($("#imgFullViewCan").attr("width")!=img.width) $("#imgFullViewCan").attr("width", img.width);
    if($("#imgFullViewCan").attr("height")!=img.height) $("#imgFullViewCan").attr("height", img.height);

    // To relative
    var relativeX = Math.floor(absposx / (img.naturalWidth / img.width));
    var relativeY = Math.floor(absposy / (img.naturalHeight / img.height));


    cnvs.style.position = "absolute";
    cnvs.style.left = img.offsetLeft + "px";
    cnvs.style.top = img.offsetTop + "px";

    var ctx = cnvs.getContext("2d");
    ctx.beginPath();
    ctx.arc(relativeX, relativeY, 5, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

// Clear and redraw points
function RedrawPoints(excludeIndex) {
    var img = document.getElementById("imgFullView");
    $("#imgFullViewCan").attr("width", img.width);
    $("#imgFullViewCan").attr("height", img.height);

    for(i=0; i<activeObject.refPoints.length; i++) {
        if(i!=excludeIndex) {
            DrawNewPoint(activeObject.refPoints[i].img_Coordinates.split(" ")[0],
                activeObject.refPoints[i].img_Coordinates.split(" ")[1], TranslateNumToColor(i));
        }
    }
}

// Show/Hide the canvas
function SetClickAbleImage(status) {
    if(status) {
        var img = document.getElementById("imgFullView");
        $("#imgFullViewCan").attr("width", img.width);
        $("#imgFullViewCan").attr("height", img.height);

        var cnvs = document.getElementById("imgFullViewCan");
        cnvs.style.position = "absolute";
        cnvs.style.left = img.offsetLeft + "px";
        cnvs.style.top = img.offsetTop + "px";

    } else {
        $("#imgFullViewCan").attr("width", 0);
        $("#imgFullViewCan").attr("height", 0);
    }
}