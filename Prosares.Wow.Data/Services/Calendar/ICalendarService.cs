using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Calendar
{
    public interface ICalendarService
    {
        dynamic getCalendarData(CalendarService.calendarRequestMode value);
    }
}
