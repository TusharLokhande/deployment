var Login = {};

//UID
Login.UID = 0;

Login.Authenticate = function () {
  if ($("#loginform").valid()) {
    $("#lgn-valid").hide();

    grecaptcha
      .execute("6LfPs7gcAAAAAJi-IP-zSliwlcZ7WBReW6nX2GRU", { action: "submit" })
      .then(function (token) {
        // debugger;
        var postdata = {
          UserName: $("#lgn-usrnm").val(),
          Password: $("#lgn-pwd").val(),
          Token: token,
        };

        var RPath = "/Login/Login";

        $.ajax({
          type: "POST",
          url: RPath,
          data: JSON.stringify(postdata),
          contentType: "application/json",
          dataType: "json",
          cache: false,
          success: function (res) {
            // debugger;
            if (res.data.status == true) {
              if (res.data.etf == true) {
                $("#auth-phone-text").text(res.data.pn);
                Login.StartCounter();
                // show auth partial
                $("#tabs_sec, #login, #signup").hide();
                $("#authentication").show();
              } else {
                // debugger;
                $("#myModalLabel").html("<p>Login Success</p>");
                $("#login-modal-popup").modal("toggle");
                //redirect to react
                //cryptojs
                //window.onload("http:/" +res.data)
              }
            } else if (res.data.status == false) {
              // debugger;
              $("#lgn-valid").show();
            } else if (res.status == 403) {
              //$("#req_pass_user_error").text("Are you a robot?");
              $("#myModalLabel").html("<p>Are you a robot?</p>");
              $("#login-modal-popup").modal("toggle");
            } else {
              //$("#req_pass_user_error").text("Something went wrong. Please try later.");
              $("#myModalLabel").html(
                "<p>Something went wrong. Please try later.</p>"
              );
              $("#login-modal-popup").modal("toggle");
            }
          },
          error: function (res) {
            debugger;

            var postdata = {
                UserName: $("#lgn-usrnm").val(),
                Password: $("#lgn-pwd").val(),
                Token: token
            };

            var RPath = "/Login/Login";

            $.ajax({
                type: "POST",
                url: RPath,
                data: JSON.stringify(postdata),
                contentType: "application/json",
                dataType: "json",
                cache: false,
                success: function (res) {
                    debugger;
                    if (res.data.status == true) {
                        
                            //set uid
                            Login.UID = res.data.uid;

                        if (res.data.etf == true) {

                            $("#auth-phone-text").text(res.data.pn);
                            Login.StartCounter();
                            // show auth partial
                            $("#tabs_sec, #login, #signup").hide();
                            $("#authentication").show();

                        }
                        else {
                            $("#myModalLabel").html('<p>Login Success</p>');
                            $("#login-modal-popup").modal("toggle");

                             //redirect to defualt module
                            Login.Redirect();
                        }
                    }
                    else if (res.data.status == false)
                    {
                        $("#lgn-valid").show();
                    }
                    else if (res.status == 403) {
                        //$("#req_pass_user_error").text("Are you a robot?");
                        $("#myModalLabel").html('<p>Are you a robot?</p>');
                        $("#login-modal-popup").modal("toggle");
                    }
                    else {
                        //$("#req_pass_user_error").text("Something went wrong. Please try later.");
                        $("#myModalLabel").html('<p>Something went wrong. Please try later.</p>');
                        $("#login-modal-popup").modal("toggle");
                    }

                },
                error: function (res) {
                    debugger;
                    // [Exception-PendingCode]
                }
            });
=======
            // [Exception-PendingCode]
          },
>>>>>>> 6ebf9dfc4f55a9b8f8584df8404383e43fc6a45e
        });
      });
  }
};

Login.StartCounter = function () {
  var lgncounter = 180;
  var lgninterval = setInterval(function () {
    lgncounter--;
    if (lgncounter <= 0) {
      clearInterval(lgninterval);
      return;
    } else {
      $("#twofac-sectime").html(lgncounter);
    }
  }, 1000);
};

<<<<<<< HEAD
    Login.CheckOTP = function () {
        if ($("#auth-txtotp").val() == "1234") {

            $("#twofac-wron-otp").hide();
            $("#myModalLabel").html('<p>Login Success</p>');
            $("#login-modal-popup").modal("show");

            Login.Redirect();
        }
        else 
        {
            $("#twofac-wron-otp").show();
        }
    }



    Login.Redirect = function () {  
    //redirect to defualt module
        window.location.href="/Login/RedirectToModule?UserID="+Login.UID;         
         
    }
=======
Login.CheckOTP = function () {
  if ($("#auth-txtotp").val() == "1234") {
    $("#twofac-wron-otp").hide();
    $("#myModalLabel").html("<p>Login Success</p>");
    window.location.replace(`https://localhost:5003/?id=1`);
    $("#login-modal-popup").modal("show");
  } else {
    $("#twofac-wron-otp").show();
  }
};
>>>>>>> 6ebf9dfc4f55a9b8f8584df8404383e43fc6a45e
