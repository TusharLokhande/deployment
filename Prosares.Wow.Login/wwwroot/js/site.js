// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function jQueryAjaxPost(form) {
    debugger;
    var abc = form;
    try {
        $.ajax({
            type: "POST",
            url: form.action,
            data: new FormData(form),
            contentType: false,
            processData: false,
            success: function (res) {
                var abc = res;
            },
            error: function (res) {
                var abc = res;
            }
        });

    } catch (ex) {
        console.log(ex);
    }

    // to prevent default form submit event
    return false;
}