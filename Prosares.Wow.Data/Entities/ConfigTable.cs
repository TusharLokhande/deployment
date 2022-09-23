using System;
using System.Collections.Generic;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    public partial class ConfigTable:BaseEntity
    {
        public long Id { get; set; }
        public string ConfigKey { get; set; }
        public string ConfigValue { get; set; }
    }
}
