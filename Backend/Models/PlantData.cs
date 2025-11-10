using System.ComponentModel;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public record PlantData
    {
        public string AcceptedSymbol { get; init; }

        public string SynonymSymbol { get; init; }
        public string Symbol { get; init; }
        public string ScientificName { get; init; }
        public string PlantsFlorisiticArea { get; init; }
        public string StateAndProvince { get; init; }
        public Category Category { get; init; }
        public string Family { get; init; }
        public Duration[] Duration { get; init; }

    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Duration
    {
        Perennial,
        Biennial,
        Annual,
        AN
    }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Rate
    {
        Moderate,None,Rapid,Slow
    }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Level
    {
        High,Medium,Low,None
    }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum GrowthForm
    {
        Bunch,
        Colonizing,
        [EnumMember(Value = "Multiple Stem")]
        MultipleStem,
        Rhizomatous,
        [EnumMember(Value = "Single Crown")]
        SingleCrown,
        [EnumMember(Value = "Single Stem")]
        SingleStem,
        Stoloniferous,
        [EnumMember(Value = "Thicket Forming")]
        ThicketForming
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Porosity
    {
        Dense,Moderate,Porous
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Texture
    {
        Coarse,Fine,Medium
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Category
    {
        Dicot,
        Fern,
        [EnumMember(Value = "Green alga")]
        GreenAlga,
        Gymnosperm, 
        Hornwort,
        Horsetail,
        Lichen, 
        Liverwort,
        Lycopod,
        Monocot,
        Moss,
        Quillwort,
        RA,
        [EnumMember(Value = "Whisk-fern")]
        WhiskFern,
    }
}
