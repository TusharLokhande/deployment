
var objeReqPassword = {};
$(document).ready(function () {

    $('#btnBackToLogin').click(function (event) {
          window.location.href="/Login/Index";
    });


    $('#btnReqPass').click(function (event) {
        event.preventDefault();
        $("#btnBackToLogin").prop('disabled', true);
        $("#btnReqPass").prop('disabled', true);
        $("#btnReqPass").text('Wait');
        objeReqPassword.SubmitPasswordRequest();
    });
});

objeReqPassword.SubmitPasswordRequest = function () {

debugger;

//Validate Form
var validForm = objeReqPassword.ValidateForm();

if(validForm){

  
//get captcha token
    grecaptcha.execute('6LfPs7gcAAAAAJi-IP-zSliwlcZ7WBReW6nX2GRU', { action: 'submit' }).then(function (token) {
        var data = {
            UserName: $('#req_pass_user').val(),            
            Token: token
        }

        $.ajax({
            type: 'POST',
            url: '/Login/PostRequestPassword',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: "json",
            cache: false,
            complete: function (data) {
                switch(data.status) {
                    case 200:
                        if(data.responseJSON.message == "OK"){
                        $('#req_pass_user').val('');
                        $("#myModalLabel").text('A link for resetting your password is sent on your registered email '+data.responseJSON.userName);

                        $("#reqPass-modal-popup").modal("show");
                        $("#req_pass_user_error").text("");
                        objCommon.ErrorAlertBox("#req_pass_user", false);


                        $("#btnReqPass").text('Submit');
                        $("#btnBackToLogin").prop('disabled', false);
                        $("#btnReqPass").prop('disabled', false);
                    }
                    else if(data.responseJSON.message == "403"){
                        $("#req_pass_user_error").text("Are you a robot?");
                       // $("#myModalLabel").text('Are you a robot?');

                       // $("#reqPass-modal-popup").modal("show");

                       $("#btnReqPass").text('Submit');
                       $("#btnBackToLogin").prop('disabled', false);
                       $("#btnReqPass").prop('disabled', false);
                      }
                      else if(data.responseJSON.message == "InvalidUser"){
                      /* Commented since as per VAPT - cant show invalid user as message
                        $("#req_pass_user_error").text("Please enter a valid Login ID");
                        */
                         
                        $('#req_pass_user').val('');
                        $("#myModalLabel").text('A link for resetting your password is sent on your registered email');

                        $("#reqPass-modal-popup").modal("show");
                        $("#req_pass_user_error").text("");
                        objCommon.ErrorAlertBox("#req_pass_user", false);


                        $("#btnReqPass").text('Submit');
                        $("#btnBackToLogin").prop('disabled', false);
                        $("#btnReqPass").prop('disabled', false);

                       }
                       else{
                        $("#req_pass_user_error").text("Something went wrong. Please try later.");
                        //objCommon.ErrorAlertBox("#req_pass_user", true);
                        
                        // $("#myModalLabel").text('Something went wrong. Please try later.');

                        // $("#reqPass-modal-popup").modal("show");


                        $("#btnReqPass").text('Submit');
                        $("#btnBackToLogin").prop('disabled', false);
                        $("#btnReqPass").prop('disabled', false);
                         
                       }
                       break;
                    default:
                       // $("#myModalLabel").text('Something went wrong. Please try later.');
                        $("#req_pass_user_error").text("Something went wrong. Please try later.");
                       // $("#reqPass-modal-popup").modal("show");
                       $("#btnReqPass").text('Submit');
                       $("#btnBackToLogin").prop('disabled', false);
                       $("#btnReqPass").prop('disabled', false);
                        break;
                }
            }
        });
    });
}

}


objeReqPassword.ValidateForm = function () {
    var validFlag = true;

    var User =  $('#req_pass_user').val();

    if (User != "" && User != "undefined" && User != " ") {
        validFlag = true;
    }
    else {
        $("#req_pass_user_error").text("Please enter username");
        objCommon.ErrorAlertBox("#req_pass_user", true);
        validFlag = false;
        $("#btnReqPass").text('Submit');
        $("#btnBackToLogin").prop('disabled', false);
        $("#btnReqPass").prop('disabled', false);
        
    }

    return validFlag;
}