
var ObjSetPassword = {};

$(document).ready(function () {


    // edit icon for user id event
    $("#SetPassEditIcon").on("click", function () {
        debugger;
        $("#SetPassUserId").val("");
        $("#SetPassUserId").prop('readonly', false);
    });

    $("#SetPassUserId").on("focusout", function () {
        var UserID = $("#SetPassUserId").val();
        $('#hdnSetPassUserID').val(UserID);
    });


});


//submit method
ObjSetPassword.AjaxPostSetPassword = function (form) {
    debugger;


    event.preventDefault();
    if ($('#setpassform').valid()) {
        $("#btnset_pass").text('Wait');
        $("#btnset_pass").prop('disabled', true);
        $("#btnset_reset").prop('disabled', true);
        ObjSetPassword.checkCustomValidation().then(
            function (value) {

                debugger;

                try {

                    if (ObjSetPassword.flag) {
                        $.ajax({
                            type: "POST",
                            url: form.action,
                            data: new FormData(form),
                            contentType: false,
                            processData: false,
                            success: function (res) {
                                if(res.status == 0){
                                $("#setPass-ModalLabel").html('Your login credentials are successfully created.');
                                $("#setPass-modal-popup").modal("show");
                                $('#setpassform').trigger("reset");
                                }
                                else
                                {
                                    $("#btnset_pass").text('Submit');
                                    $("#btnset_pass").prop('disabled', false);
                                    $("#btnset_reset").prop('disabled', false);

                                }

                            },
                            error: function (res) {
                                var abc = res;
                            }
                        });
                    }
                    else {
                        $("#btnset_pass").text('Submit');
                        $("#btnset_pass").prop('disabled', false);
                        $("#btnset_reset").prop('disabled', false);
                    }




                } catch (ex) {
                    console.log(ex);
                }


                // $("#errMsgValidation").show();
                // to prevent default form submit event
                return false;
            });

    }
}




ObjSetPassword.flag = false;
ObjSetPassword.checkCustomValidation = function () {
    debugger;



    $("#errMsgValidation").hide();

    //PasswordPolicy Check
    var req_mailid = $('#hdnSetPassUserID').val();

    var PasswordVal = $("#Password").val();

    var PasswordRegex = $("#PasswordRegex").val();

    var regex = new RegExp(PasswordRegex);

    if (!regex.test(PasswordVal)) {
        $("#errMsgPassPolicy").show();
        ObjSetPassword.flag = false;
    }
    else {
        $("#errMsgPassPolicy").hide();
        ObjSetPassword.flag = true;
    }

    //check login name
    return $.ajax({
        type: 'POST',
        url: '/Login/CheckUserIDExists',
        dataType: 'json',
        data: {
            EmailId: req_mailid
        },
        success: function (respns) {
            debugger;
            if (respns != null) {
                if (respns.status == 0) {
                    debugger;

                    if (respns.data.f) {
                        //show non available html
                        $(".not_available").show();
                        $(".user_available").hide();
                        //$("#btnset_pass").prop('disabled', true);
                        ObjSetPassword.flag = false;

                    }
                    else {
                        //show  available html
                        $(".user_available").show();
                        $(".not_available").hide();
                        //$("#btnset_pass").prop('disabled', false);


                    }

                }
            }
            else {
                $("#errMsgValidation").show();
                //$("#setPass-modal-popup").modal("show");
                ObjSetPassword.flag = false;

            }
        },
        error: function (res) {
            debugger;
            console.log(res);

            $("#errMsgValidation").show();
            // $("#setPass-modal-popup").modal("show");
            ObjSetPassword.flag = false;

        }
    });

}


//submit method
ObjSetPassword.AjaxPostResetPassword = function (form) {
    debugger;

    ObjSetPassword.resetflag = false;
    event.preventDefault();
    if ($('#resetpassform').valid()) {
        $("#btnreset_pass").text('Wait');
        $("#btnreset_pass").prop('disabled', true);
        $("#btnreset_reset").prop('disabled', true);



        $("#errMsgValidation").hide();

        //PasswordPolicy Check


        var PasswordVal = $("#Password").val();

        var PasswordRegex = $("#PasswordRegex").val();

        var regex = new RegExp(PasswordRegex);

        if (!regex.test(PasswordVal)) {
            $("#errMsgPassPolicy").show();
            ObjSetPassword.resetflag = false;
        }
        else {
            $("#errMsgPassPolicy").hide();
            ObjSetPassword.resetflag = true;
        }



            try {

                if (ObjSetPassword.resetflag) {
                    $.ajax({
                        type: "POST",
                        url: form.action,
                        data: new FormData(form),
                        contentType: false,
                        processData: false,
                        success: function (res) {
                            if(res.status == 0){
                            $("#errMsgValidation").hide();
                            $("#resetPass-ModalLabel").html('Your password is successfully reset.');
                            $("#resetPass-modal-popup").modal("show");
                            $('#resetpassform').trigger("reset");
                        }
                        else
                        {
                            $("#errMsgValidation").text(res.message);
                            $("#errMsgValidation").show();
                            $("#btnreset_pass").text('Submit');
                            $("#btnreset_pass").prop('disabled', false);
                            $("#btnreset_reset").prop('disabled', false);

                        }

                        },
                        error: function (res) {
                            var abc = res;
                            $("#errMsgValidation").show();
                            $("#btnreset_pass").text('Submit');
                            
                            $("#btnreset_pass").prop('disabled', false);
                            $("#btnreset_reset").prop('disabled', false);
                        }
                    });
                }
                else {
                    $("#btnreset_pass").text('Submit');
                    $("#btnreset_pass").prop('disabled', false);
                    $("#btnreset_reset").prop('disabled', false);
                }




            } catch (ex) {
                console.log(ex);
            }

        
    }
}


