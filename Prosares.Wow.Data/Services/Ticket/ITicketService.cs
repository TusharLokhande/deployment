using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Ticket
{
    public interface ITicketService
    {
        public long InsertUpdateTicketDetails(TicketsMaster value);

        dynamic AutoPopulateMandaysFields(AutoPopulateRequestModel value);
    }
}
