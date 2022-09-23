using Microsoft.Extensions.Logging;
using Prosares.Wow.Utility.Entities;
using Prosares.Wow.Utility.Repository;
using Prosares.Wow.Utility.Services.Mail;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Utility.Services.UpdateHoursSpent
{
    public class UpdateHoursSpentService:IUpdateHoursSpentService
    {
        private IRepository<TasksTimeSheet> _tasksTimeSheet;

        private IRepository<AdminEmailModel> _adminEmail;

        private readonly IMailService _mailService;

        private readonly ILogger<UpdateHoursSpentService> _logger;
        public UpdateHoursSpentService(IRepository<TasksTimeSheet> tasksTimeSheet,
            ILogger<UpdateHoursSpentService> logger,
            IMailService mailService,
            IRepository<AdminEmailModel> adminEmail)
        {
           _tasksTimeSheet = tasksTimeSheet;

            _logger = logger;

            _mailService = mailService;

            _adminEmail = adminEmail;
        }

        public void Process()
        {
            try
            {
                //Task and Ticket
                var StartTime = DateTime.UtcNow;
                _logger.LogInformation("Starting Hours Spent Updation ", "Started", DateTime.UtcNow);
                SqlCommand command = new SqlCommand("stpUpdateHoursSpentOnTaskAndTicket");
                command.CommandType = CommandType.StoredProcedure;

                var tasks = _tasksTimeSheet.ExecuteProcedure(command);
             
                var Endtime = DateTime.UtcNow;

                _logger.LogInformation("Ending Hours Spent Updation ", "Started", DateTime.UtcNow);

                //Mail start
                SendMailModel MailDetails = new SendMailModel();
                EmailTemplate template = new EmailTemplate();


                string TempBody = "<p>Dear Sir/ Madam,</p> \r\n <p> Utility was run successfully started at "+ StartTime + " and Ended at "+ Endtime+ "</p><p>Thanks &amp; Regards,</p>";
                string TempSub = "Wow Utility run successfully";
                template.Body = TempBody;
                template.Subject = TempSub;

                string TemplateBody = template.Body;
                string TemplateSubject = template.Subject;
                StringBuilder sbTemplateBody = new StringBuilder(TemplateBody);
                StringBuilder sbTemplateSubject = new StringBuilder(TemplateSubject);


                SqlCommand command1 = new SqlCommand("spGetAdminEmails");
                command1.CommandType = CommandType.StoredProcedure;
                var emailList = _adminEmail.ExecuteStoredProc(command1);
               
                MailDetails.Body = sbTemplateBody.ToString();
                MailDetails.Subject = sbTemplateSubject.ToString();
                foreach (var item in emailList)
                {
                    
                    MailDetails.To = item.LoginId;
                    var returnValue = _mailService.SendMail(MailDetails);
                }
               
                //Mail end

            }
            catch (Exception ex)
            {

                //Mail start
                SendMailModel MailDetails = new SendMailModel();
                EmailTemplate template = new EmailTemplate();


                string TempBody = "<p>Dear Sir/ Madam,</p> \r\n <p> There was a problem running the utility: " + ex.Message + "</p><p>Thanks &amp; Regards,</p><p>Wow Team</p>";
                string TempSub = "Wow Utility Run Failed";
                template.Body = TempBody;
                template.Subject = TempSub;

                string TemplateBody = template.Body;
                string TemplateSubject = template.Subject;
                StringBuilder sbTemplateBody = new StringBuilder(TemplateBody);
                StringBuilder sbTemplateSubject = new StringBuilder(TemplateSubject);
                            

                MailDetails.Body = sbTemplateBody.ToString();
                MailDetails.Subject = sbTemplateSubject.ToString();

                SqlCommand command1 = new SqlCommand("spGetAdminEmails");
                command1.CommandType = CommandType.StoredProcedure;
                var emailList = _adminEmail.ExecuteStoredProc(command1);

                foreach (var item in emailList)
                {
                    MailDetails.To = item.LoginId;
                    var returnValue = _mailService.SendMail(MailDetails);
                }


                //Mail end

                _logger.LogError(ex.Message, "Exception", DateTime.UtcNow);
                throw;
            }
           
        }
    }
}
