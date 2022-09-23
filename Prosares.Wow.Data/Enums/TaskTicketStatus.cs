using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Enums
{
    public enum TaskTicketStatus  // dont use this enum refer table
    {
        NotStarted = 0,
        InProgress = 1,
        ResolutionInProgress = 2,
        TestingInProgress = 3,
        Completed = 4,
        Responded = 5,
        Resolved = 6,
        OnHold = 7
    }
}
