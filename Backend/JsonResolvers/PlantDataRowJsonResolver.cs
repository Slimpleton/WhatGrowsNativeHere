using Backend.Models;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;

namespace Backend.JsonConverters
{
    public class PlantDataRowJsonResolver : DefaultJsonTypeInfoResolver
    {
        public override JsonTypeInfo GetTypeInfo(Type type, JsonSerializerOptions options)
        {
            JsonTypeInfo info = base.GetTypeInfo(type, options);

            if (type != typeof(PlantDataRow))
                return info;

            foreach (JsonPropertyInfo? prop in info.Properties)
            {
                // Read name from attribute
                JsonPropertyNameAttribute? reflectedProp = type.GetProperty(prop.Name)?.GetCustomAttribute<JsonPropertyNameAttribute>();
                prop.Name = reflectedProp?.Name ?? prop.Name;
            }

            return info;
        }
    }
}
