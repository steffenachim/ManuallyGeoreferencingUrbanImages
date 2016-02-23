/**
 * Created by Steve on 22.02.2016.
 */

//- Simple Show/Hide function
function HideAll() {
    $("#general").hide();
    $("#uploadDialog").hide();
}

function ShowDefaultView() {
    HideAll();
    $("#general").show();
}

function ShowUploadDialog() {
    HideAll();
    $("#uploadDialog").show();

}
