using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Utility.Entities
{
    public class SendMailModel : BaseEntity
    {
        public long QueueID { get; set; }

        public Int64 UserID { get; set; }

        public string EmailType { get; set; }

        public string Name { get; set; }

        public string LoginID { get; set; }

        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the From property
        /// </summary>
        public string From { get; set; }

        /// <summary>
        /// Gets or sets the FromName property
        /// </summary>
        public string FromName { get; set; }

        /// <summary>
        /// Gets or sets the To property
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// Gets or sets the ToName property
        /// </summary>
        public string ToName { get; set; }

        /// <summary>
        /// Gets or sets the ReplyTo property
        /// </summary>
        public string ReplyTo { get; set; }

        /// <summary>
        /// Gets or sets the ReplyToName property
        /// </summary>
        public string ReplyToName { get; set; }

        /// <summary>
        /// Gets or sets the CC
        /// </summary>
        public string CC { get; set; }

        /// <summary>
        /// Gets or sets the Bcc
        /// </summary>
        public string Bcc { get; set; }

        /// <summary>
        /// Gets or sets the subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Gets or sets the body
        /// </summary>
        public string Body { get; set; }

        /// <summary>
        /// Gets or sets the attachment file name. If specified, then this file name will be sent to a recipient. Otherwise, "AttachmentFilePath" name will be used.
        /// </summary>
        public string AttachmentFileName { get; set; }

        /// <summary>
        /// Gets or sets the download identifier of attached file
        /// </summary>
        public byte[] AttachmentBinaryFile { get; set; }

        /// <summary>
        /// Gets or sets Is Delivery Receipt Required
        /// </summary>
        public bool IsDeliveryReceiptRequired { get; set; }

        /// <summary>
        /// Gets or sets Is Read Receipt Required
        /// </summary>
        public bool IsReadReceiptRequired { get; set; }

        /// <summary>
        /// Gets or sets the send tries
        /// </summary>
        public int SentTries { get; set; }

        /// <summary>
        /// Gets or sets the sent date and time
        /// </summary>
        public DateTime SentOnUtc { get; set; }

        /// <summary>
        /// Gets or sets the used email account identifier
        /// </summary>
        public Int64 EmailAccountId { get; set; }

        public string ClientName { get; set; }

        public string ManagerName { get; set; }

        public DateTime InvitationDate { get; set; }

        public string Value { get; set; }
    }
}
