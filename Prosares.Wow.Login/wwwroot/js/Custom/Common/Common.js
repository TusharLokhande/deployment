var objCommon = {};

//get partial view and set it to div
objCommon.CallPartial = function (viewurl,divname) {

    var divID = divname;
        $(divID).html("");
        var url;
    url = viewurl;
        var jqxhr = $.get(url)
            .done(function (data) {
                $(divID).html(data);
                //$(divID).modal('show');
            });

}



//Assign CSS For Error
objCommon.ErrorAlertBox = function (element, flag) {
       var id = element;
       if (flag == true) {
    
           $(id).css({
               "border": "1px solid red",
           });
    
    
       }
       else if (flag == false) {
           $(id).css({
               "border": "",
               "background": ""
           });
    
       }
    }