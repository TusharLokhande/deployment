var Login = {};

//UID
Login.UID = 0;

Login.Authenticate = function () {
  var email = $("#lgn-usrnm").val();
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var eTest = regex.test(email);
  $("#lgn-usvalid").show();
  if ($("#loginform").valid() && eTest) {
    var UserName1 = $("#lgn-usrnm").val();
    var Password1 = $("#lgn-pwd").val();

    $("#lgn-usvalid").hide();
    $("#lgn-valid").hide();

    var postdata = {
      UserName: $("#lgn-usrnm").val(),
      Password: $("#lgn-pwd").val(),
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
        if (res.data.status == true) {
          //set uid
          Login.UID = res.data.uid;

          if (res.data.etf == true) {
            $("#auth-phone-text").text(res.data.pn);
            Login.StartCounter();
            // show auth partial
            $("#tabs_sec, #login, #signup").hide();
            $("#authentication").show();
          } else {
            $("#myModalLabel").html("<p>Login Success</p>");
            //$("#login-modal-popup").modal("toggle");

            //redirect 
              if (res.data.firstLogin == true) {
                  Login.ChangePassword(Login.UID);
              } else {
                  Login.Redirect();
              }
          }
        } else if (res.data.status == false) {
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
        // [Exception-PendingCode]
      },
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

Login.CheckOTP = function () {
  if ($("#auth-txtotp").val() == "1234") {
    $("#twofac-wron-otp").hide();
    $("#myModalLabel").html("<p>Login Success</p>");
    //$("#login-modal-popup").modal("show");

    Login.Redirect();
  } else {
    $("#twofac-wron-otp").show();
  }
};

Login.Redirect = function () {
  //redirect to defualt module
  //https://localhost:44358/TaskAssignment
  window.location.href = "Login/RedirectToModule";

  // window.location.href = "http://192.168.0.61:8081/Dashboard";
};

Login.ChangePassword = (id) => {
    window.location.href = `/ChangePassword?id=${id}`;
}
