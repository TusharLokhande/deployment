using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using Prosares.Wow.Data.Services.Mail;
using System;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using WowLoginModule.Models;


namespace MailEmail.Controllers
{
    public class ResetPasswordController : Controller
    {
        private readonly ILogger<ResetPasswordController> _logger;
        private readonly IMailService _mailService;
        private readonly IRepository<EmployeeMasterEntity> _employeeMaster;

        public ResetPasswordController(ILogger<ResetPasswordController> logger, IMailService mailService,
            IRepository<EmployeeMasterEntity> employeeMaster)
        {
            _logger = logger;
            _mailService = mailService;
            _employeeMaster = employeeMaster;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public int Index(EmployeeMasterEntity model)
        {
            Prosares.Wow.Data.Models.JsonResponseModel response = new Prosares.Wow.Data.Models.JsonResponseModel();
            try
            {
                var data = (from x in _employeeMaster.Table
                            where x.LoginId == model.Email
                            select x);

                var check = data.ToList().Count > 0;

                string ShortName = "";
                foreach (var item in data)
                {
                    ShortName = item.ShortName;
                }


                if (check)
                {
                    string en = encrypt(model.Email);
                    string email = model.Email;

                    string url = $"{model.Url}/ForgetPassword?email={en}";
                    string body = $"<p> Dear {ShortName},</br> We have received a request for password assistance " +
                       "for your Wow Account  </p> " +
                       $"<p>  please click this link to reset your password: <a href=\"{url}\"> Link</a> </p>" +
                       " <p>Thanks &amp; Regards,</p>" +
                       "<p>(Note: This is a system generated message.)</p>";

                    string subject = "WOW Password Assistance";
                    Mail(body, email, subject);

                   
                    return 0;

                }
                else
                {
                    return 1;
                }
            }
            catch (Exception)
            {
              
                return 2;
            }


           
        }

        public static string encrypt(string password)
        {
            try
            {
                byte[] encData_byte = new byte[password.Length];
                encData_byte = System.Text.Encoding.UTF8.GetBytes(password);
                string encodedData = Convert.ToBase64String(encData_byte);
                return encodedData;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in base64Encode" + ex.Message);
            }
        }

        //this function Convert to Decord your Password
        public string Decrypt(string encodedData)
        {
            System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
            System.Text.Decoder utf8Decode = encoder.GetDecoder();
            byte[] todecode_byte = Convert.FromBase64String(encodedData);
            int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            char[] decoded_char = new char[charCount];
            utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            string result = new String(decoded_char);
            return result;

        }

        public void Mail(string body, string email, string subject)
        {
            SendMailModel MailDetails = new SendMailModel();
            EmailTemplate template = new EmailTemplate();



            string TempBody = body;
            string TempSub = subject;
            template.Body = TempBody;
            template.Subject = TempSub;

            string TemplateBody = template.Body;
            string TemplateSubject = template.Subject;
            StringBuilder sbTemplateBody = new StringBuilder(TemplateBody);
            StringBuilder sbTemplateSubject = new StringBuilder(TemplateSubject);


            MailDetails.To = email;  //mail

            MailDetails.Body = sbTemplateBody.ToString();
            MailDetails.Subject = sbTemplateSubject.ToString();
            var returnValue = _mailService.SendMail(MailDetails);
        }
        [Route("/ForgetPassword")]
        public IActionResult ForgetPassword(string email)
        {
            string LoginEmail = Decrypt(email);
            EmployeeMasterEntity emp = new EmployeeMasterEntity() { LoginId = LoginEmail };
            return View(emp);
        }

        [HttpPost]
        public Boolean ForgetPassword(EmployeeMasterEntity emp)
        {
            var data = (from x in _employeeMaster.Table
                        where x.LoginId == emp.LoginId
                        select x);

            data.ToList().ForEach(x => x.Password = emp.Password);

            string ShortName = "";

            var check = data.Count() == 1;

            if (check)
            {

                //Employee Update
                EmployeeMasterEntity e = new EmployeeMasterEntity();
                foreach (var x in data)
                {

                    e.Eid = x.Eid;
                    e.Name = x.Name;
                    e.ShortName = x.ShortName;
                    e.CostCenterId = x.CostCenterId;
                    e.WorkPolicyId = x.WorkPolicyId;
                    e.TimeSheetPolicy = x.TimeSheetPolicy;
                    e.Efficiency = x.Efficiency;
                    e.IsActive = x.IsActive;
                    e.CreatedDate = x.CreatedDate;
                    e.CreatedBy = x.CreatedBy;
                    e.ModifiedDate = x.ModifiedDate;
                    e.ModifiedBy = x.ModifiedBy;
                    e.LoginId = x.LoginId;
                    e.Password = x.Password;
                    e.AvailableLeaveBalance = x.AvailableLeaveBalance;
                    e.FirstLogin = x.FirstLogin;
                    ShortName = x.ShortName;
                }

                _employeeMaster.SaveChanges();

                //Sending Mail
                string email = emp.LoginId;
                string body = $"<p>Dear {ShortName},</p> \r\n " +
                    "<p> Your password has been successfully reset </p>" +
                    "<p>Thanks &amp; Regards,</p>"+"" +
                    "<p>(Note: This is a system generated message.)</p>"
                    ;

                string subject = "Wow Password reseted successfully!";
                Mail(body, email, subject);
                return true;
            }
            return false;

        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}