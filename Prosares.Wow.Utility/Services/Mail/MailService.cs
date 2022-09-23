using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Prosares.Wow.Utility.Entities;
using Prosares.Wow.Utility.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Utility.Services.Mail
{
    public class MailService:IMailService
    {
        private readonly IConfiguration _config;

        private IRepository<ConfigTable> _configTable;


        public MailService(IConfiguration config, IRepository<ConfigTable> configTable)
        {
            _config = config;
            _configTable = configTable;
        }

        public bool SendMail(SendMailModel MailDetails)
        {
            SMTPModel emailAccountEntity = new SMTPModel();

            bool returnValue;
            MailMessage message = new MailMessage();

            SqlCommand command = new SqlCommand("spGetSmtpDetails");
            command.CommandType = CommandType.StoredProcedure;

            var SmtpConfig = _configTable.ExecuteProcedure(command);


            if (SmtpConfig != null)
            {
                SMTPModel smtpDetails = JsonConvert.DeserializeObject<SMTPModel>((string)SmtpConfig);

                emailAccountEntity.Host = smtpDetails.Host;
                emailAccountEntity.EnableSsl = smtpDetails.EnableSsl;
                emailAccountEntity.Password = smtpDetails.Password;
                emailAccountEntity.Port = smtpDetails.Port;
                emailAccountEntity.UseDefaultCredentials = smtpDetails.UseDefaultCredentials;
                emailAccountEntity.Username = smtpDetails.Username;
                emailAccountEntity.Email = smtpDetails.Email;
                emailAccountEntity.DisplayName = smtpDetails.DisplayName;
            }
            try
            {
                #region Subject

                message.Subject = MailDetails.Subject;

                #endregion

                #region Body

                message.Body = MailDetails.Body;

                #endregion

                #region From

                string FromName = emailAccountEntity.DisplayName;
                string FromAddress = emailAccountEntity.Email;               
                message.From = new MailAddress(FromAddress, FromName);
                #endregion

                #region To

                if (MailDetails.To != null && MailDetails.To != "")
                {
                    string[] ToAddresses = MailDetails.To.Split(',');

                    foreach (string value in ToAddresses)
                    {
                        //if (value.ToLower() != "assigned@code.com")
                        message.To.Add(new MailAddress(value));
                    }
                }

                #endregion
                #region CC

                if (MailDetails.CC != null && MailDetails.CC != "")
                {
                    string[] CCAddresses = MailDetails.CC.Split(',');

                    foreach (string value in CCAddresses)
                    {
                        // if (value.ToLower() != "assigned@code.com")
                        message.CC.Add(new MailAddress(value));
                    }
                }

                #endregion

                #region Bcc

                if (MailDetails.Bcc != null && MailDetails.Bcc != "")
                {
                    string[] BccAddresses = MailDetails.Bcc.Split(',');

                    foreach (string value in BccAddresses)
                    {
                        //if (value.ToLower() != "assigned@code.com")
                        message.Bcc.Add(new MailAddress(value));
                    }
                }

                #endregion

                #region Other

                message.IsBodyHtml = true;

                #endregion

                #region Send Mail Code

                using (var smtpClient = new SmtpClient())
                {
                    smtpClient.UseDefaultCredentials = emailAccountEntity.UseDefaultCredentials;
                    smtpClient.Host = Convert.ToString(emailAccountEntity.Host);
                    smtpClient.Port = Convert.ToInt32(emailAccountEntity.Port);
                    smtpClient.EnableSsl = emailAccountEntity.EnableSsl;

                    if (smtpClient.UseDefaultCredentials == true)
                        smtpClient.Credentials = CredentialCache.DefaultNetworkCredentials;
                    else
                        smtpClient.Credentials = new NetworkCredential(Convert.ToString(emailAccountEntity.Username), Convert.ToString(emailAccountEntity.Password));


                    smtpClient.Send(message);
                }

                #endregion

                returnValue = true;

            }
            catch (Exception ex)
            {

                returnValue = false;

                throw;
            }

            return returnValue;

        }
    }
}
