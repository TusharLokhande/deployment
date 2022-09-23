var PhoneVerfication = {};
$(document).ready(function () {
    PhoneVerfication.SetTimeout();
    
});

PhoneVerfication.SetTimeout = function()
{
    var counter = 180;
    var interval = setInterval(function () {
        counter--;
        if (counter <= 0) {
            clearInterval(interval);
            return;
        } else {
            $('#sectime').text(counter);
        }
    }, 1000);
}

PhoneVerfication.IsReportPhoneNumber = false;

PhoneVerfication.ValidateOTP = function () {

    if ($('#phoneverftnform').valid()) {
        try {
        debugger;
        var postdata = {
            UniqueId: $("#unqid").val(),
            OTP: $("#txtotp").val()
        };
           
                $.ajax({
                    type: "POST",
                    url: "/Login/ValidatePhone",
                    data: JSON.stringify(postdata),
                    contentType: "application/json",
                    dataType:"json",
                    cache: false,
                    success: function (res) {
                        debugger;
                        if (res.value.data == true) {
                            console.log(res);
                            $("#phone_verification").hide();
                            $("#set_password").show();
                            objCommon.CallPartial('/Login/SetPassword?UniqueId=' + $("#unqid").val(), '#set_password');
                        }
                        console.log(res);
                    },
                    error: function (res) {
                        debugger;
                        var abc = res;
                    }
                });

            } catch (ex) {
                console.log(ex);
            }
        }
        else {
        $('#phone_verification').trigger("reset");
        }
}

PhoneVerfication.EditPhoneNumber = function () {

    debugger;
    PhoneVerfication.IsReportPhoneNumber = false;

    $("#report-correct-number").find(".modal-title").html("<p>Correct Number</p>");
    $("#report-correct-number").find(".rcn-info-text").hide();

    var $options = $("#drpCountryCode > option").clone();
    $('#rcn-drpCountryCode').append($options);

    debugger;
    var slctedCountryCode = $('#drpCountryCode :selected').text();
    $("#rcn-drpCountryCode").val(slctedCountryCode).change();

    $("#rcn-txtMobileNo").val("");

    $("#report-correct-number").modal('toggle');
}

PhoneVerfication.ReportPhoneNumber = function () {

    debugger;
    PhoneVerfication.IsReportPhoneNumber = true;
    $("#report-correct-number").find(".modal-title").html("<p>Report Correct Number</p>");
    $("#report-correct-number").find(".rcn-info-text").show();

    var $options = $("#drpCountryCode > option").clone();
    $('#rcn-drpCountryCode').append($options);

    var slctedCountryCode = $('#drpCountryCode :selected').text();
    $("#rcn-drpCountryCode").val(slctedCountryCode).change();

    $("#rcn-txtMobileNo").val("");

    $("#report-correct-number").modal('toggle');
}

PhoneVerfication.UpdatePhoneNumber = function () {

    if ($('#rcn-form').valid()) {
        try {
            debugger;
            var postdata = {
                UniqueId: $("#unqid").val(),
                CountryCode: $("#rcn-drpCountryCode").val(),
                PhoneNumber: $("#rcn-txtMobileNo").val()
            };

            var RPath = "/Login/CorrectPhoneNumber";
            if (PhoneVerfication.IsReportPhoneNumber) {
                RPath = "/Login/ReportCorrectPhoneNumber"
            }

            $.ajax({
                type: "POST",
                url: RPath,
                data: JSON.stringify(postdata),
                contentType: "application/json",
                dataType: "json",
                cache: false,
                success: function (res) {
                    debugger;
                    if (res.value.data.status == true) {

                        if (PhoneVerfication.IsReportPhoneNumber == false) {
                            $("#drpCountryCode").val($("#rcn-drpCountryCode").val()).change();
                            $("#txtMobileNo").val(res.value.data.phoneNumber);
                            PhoneVerfication.SetTimeout();
                        }

                        $("#report-correct-number").modal("toggle");

                        if (PhoneVerfication.IsReportPhoneNumber) {
                            $("#myModalLabel").html("<p>Thank you for reporting the discrepancy. The concerned persons will initiate a fresh invitation shortly </p>");
                            $("#login-modal-popup").modal("toggle");
                        }
                    }
                    else {
                        // [Exception-PendingCode]
                        $("#report-correct-number").modal("toggle");
                        if (PhoneVerfication.IsReportPhoneNumber) {
                            $("#myModalLabel").html("<p>Thank you for reporting the discrepancy. The concerned persons will initiate a fresh invitation shortly </p>");
                            $("#login-modal-popup").modal("toggle");
                        }
                    }
                    
                },
                error: function (res) {
                    debugger;
                     // [Exception-PendingCode]
                    $("#report-correct-number").modal("toggle");
                    if (PhoneVerfication.IsReportPhoneNumber) {
                        $("#myModalLabel").html("<p>Thank you for reporting the discrepancy. The concerned persons will initiate a fresh invitation shortly </p>");
                        $("#login-modal-popup").modal("toggle");
                    }
                }
            });

        } catch (ex) {
            console.log(ex);
        }
    }
    else {
    }

}