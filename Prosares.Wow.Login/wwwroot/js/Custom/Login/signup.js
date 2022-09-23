var ObjSignUp = {};

ObjSignUp.SetRestCategories = function () {
    debugger;
    var selectedEntity = $('#drpEntityList').val();

    //clear country and category dropdowns
    $('#drpCountry').find('option').not(':first').remove();
    $('#drpCategoryList').find('option').not(':first').remove();

    if (selectedEntity !== "") {
        $.ajax({
            url: '/Login/GetCategoriesByEntity',
            type: "POST",
            dataType: 'json',
            data: {
                EntityId: selectedEntity
            },
            success: function (respns) {
                if (respns != null) {
                    debugger;
                    for (var i = 0; i < respns.length; i++) {
                        $('#drpCategoryList').append(new Option(respns[i].name, respns[i].id));
                    }
                }
            },
            error: function (res) {
                debugger;
                console.log(res);
            }
        });
    }
}

ObjSignUp.GetAccessPolicy = function () {
    debugger;
    var selectedEntity = $('#drpEntityList').val();
    var selectedCategory = $('#drpCategoryList').val();


    if (selectedEntity !== "" && selectedCategory !== "") {
        var ECAMapping_str = selectedEntity + "|" + selectedCategory;
        $.ajax({
            url: '/Login/GetPoliciesByECAMapping',
            type: "POST",
            dataType: 'json',
            data: {
                ECAMapping: ECAMapping_str
            },
            success: function (respns) {
                if (respns != null) {

                    if (respns.status == 0) {
                        debugger;
                        $('#drpCountry').find('option').not(':first').remove();

                        if (respns.data.pwc.length > 0) {

                            $('#lblCountry').show();
                            $('#drpCountry').show();
                            $('#drpCountry').val("");

                            for (var i = 0; i < respns.data.pwc.length; i++) {
                                $('#drpCountry').append(new Option(respns.data.pwc[i].name, respns.data.pwc[i].id));
                            }
                        }
                        else {
                            $('#lblCountry').hide();
                            $('#drpCountry').hide();
                            $('#drpCountry').val("0");
                        }
                    }
                }
            },
            error: function (res) {
                debugger;
                console.log(res);
            }

        });
    }
}

ObjSignUp.AjaxPostSignUpRequest = function (form) {

    event.preventDefault();
    if ($('#signupform').valid()) {
        ObjSignUp.checkCustomValidation().then(
            function (value) {

                debugger;
                if (ObjSignUp.cache) {
                    try {
                        $.ajax({
                            type: "POST",
                            url: form.action,
                            data: new FormData(form),
                            contentType: false,
                            processData: false,
                            success: function (res) {
                                $("#setPass-ModalLabel").html('Kindly check your email for a verification link.');
                                $("#login-modal-popup").modal("show");
                                $('#signupform').trigger("reset");
                            },
                            error: function (res) {
                                var abc = res;
                            }
                        });

                    } catch (ex) {
                        console.log(ex);
                    }
                }
                else {
                    $('#signupform').trigger("reset");
                }


                // to prevent default form submit event
                return false;
            });

    }
}
ObjSignUp.cache = false;
ObjSignUp.checkCustomValidation = function () {
    debugger;
    var req_mailid = $('#txtEmail').val();
        return $.ajax({
            type: 'POST',
            url: '/Login/CustomValidationForSignUpInvitation',
            dataType: 'json',
            data: {
                EmailId: req_mailid
            },
            success: function (respns) {
                debugger;
                if (respns != null) {
                    if (respns.status == 0) {
                        debugger;

                        if (respns.data.f && !respns.data.mrs) {
                            $("#setPass-ModalLabel").html('You have already created <a href="/Login/Index.cshtml">login credentials</a>.');
                            $("#login-modal-popup").modal("show");

                            ObjSignUp.cache = false;
                        }
                        if (respns.data.f && respns.data.mrs) {
                            $("#setPass-ModalLabel").html('An invitation link was sent to your email ID. It is being resent. Kindly use that link to proceed further.');
                            $("#login-modal-popup").modal("show");

                            ObjSignUp.cache = false;
                        }
                        if (!respns.data.f && !respns.data.mrs) {
                            ObjSignUp.cache = true;
                        }
                    }
                }
                else {
                    $("#setPass-ModalLabel").html('Internal server error (500)');
                    $("#login-modal-popup").modal("show");
                    ObjSignUp.cache = false;
                }
            },
            error: function (res) {
                debugger;
                console.log(res);

                $("#setPass-ModalLabel").html('Internal server error (500)');
                $("#login-modal-popup").modal("show");
                ObjSignUp.cache = false;
            }
        });
}

ObjSignUp.CheckCountryCode = function () {
    debugger;
    var sltedCountryCode = $('#drpCountryCode').val();
    var sltedCountry = $('#drpCountry').val();
    if (sltedCountry !== "") {
        var sltedCountryvalue = $("#drpCountry option:selected");
        var sltedCountrytext = sltedCountryvalue.text();
        if (_signupTnTCountries.filter(k => k.name == sltedCountrytext).length) {
            var sltedCountry_Code = _signupTnTCountries.filter(k => k.name == sltedCountrytext)[0].code;
            if (sltedCountry_Code !== sltedCountryCode) {
                $("#setPass-ModalLabel").html('Warning : Selected ISD Code is diffrent than country of your organisations residence');
                $("#login-modal-popup").modal("show");
            }
        }
    }
}

$('#signupform').on('reset', function (e) {
    setTimeout(function () {

        $('#drpCountry').find('option').not(':first').remove();
        $('#drpCategoryList').find('option').not(':first').remove();
        $('#lblCountry').show();
        $('#drpCountry').show();
        $('#drpCountry').val("");
    });
});