using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace Prosares.Wow.Data.Helpers
{
    public static class EnumHelper
    {
        public static string GetValueFromName<T>(this string name) where T : Enum // returns Enum display name
        {
            var type = typeof(T);

            foreach (var field in type.GetFields())
            {
                if (Attribute.GetCustomAttribute(field, typeof(DisplayAttribute)) is DisplayAttribute attribute)
                {
               
                    if (field.Name == name)
                    {
                        return attribute.Name;
                    }
                }

            }

            throw new ArgumentOutOfRangeException(nameof(name));
        }
    }
}
