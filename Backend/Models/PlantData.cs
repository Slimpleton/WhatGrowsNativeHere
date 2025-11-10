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
        public GrowthHabit[] GrowthHabit { get; init; }
        public HashSet<LocationCode> NativeStateAndProvinceCodes { get; init; }


    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Duration
    {
        Perennial, Biennial, Annual, AN
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Rate
    {
        Moderate, None, Rapid, Slow
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Level
    {
        High, Medium, Low, None
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
        Dense, Moderate, Porous
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Texture
    {
        Coarse, Fine, Medium
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

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum GrowthHabit
    {
        [EnumMember(Value = "Forb/Herb")]
        ForbHerb,
        Shrub,
        Subshrub,
        Graminoid,
        Lichenous,
        Tree,
        Nonvascular,
        Vine,
        Any
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Toxicity
    {
        Severe, Moderate, None, Slight
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CommercialAvailability
    {
        [EnumMember(Value = "Contracting Only")]
        ContractingOnly,
        [EnumMember(Value = "Field Collections Only")]
        FieldCollectionsOnly,
        [EnumMember(Value = "No Known Source")]
        NoKnownSource,
        [EnumMember(Value = "Routinely Available")]
        RoutinelyAvailable
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum LocationCode
    {
        AL, // Alabama
        AK, // Alaska
        AZ, // Arizona
        AR, // Arkansas
        CA, // California
        CO, // Colorado
        CT, // Connecticut
        DC, // Washington DC
        DE, // Delaware
        FL, // Florida
        GA, // Georgia
        HI, // Hawaii
        ID, // Idaho
        IL, // Illinois
        IN, // Indiana
        IA, // Iowa
        KS, // Kansas
        KY, // Kentucky
        LA, // Louisiana
        ME, // Maine
        MD, // Maryland
        MA, // Massachusetts
        MI, // Michigan
        MN, // Minnesota
        MS, // Mississippi
        MO, // Missouri
        MT, // Montana
        NE, // Nebraska
        NV, // Nevada
        NH, // New Hampshire
        NJ, // New Jersey
        NM, // New Mexico
        NY, // New York
        NC, // North Carolina
        ND, // North Dakota
        OH, // Ohio
        OK, // Oklahoma
        OR, // Oregon
        PA, // Pennsylvania
        RI, // Rhode Island
        SC, // South Carolina
        SD, // South Dakota
        TN, // Tennessee
        TX, // Texas
        UT, // Utah
        VT, // Vermont
        VA, // Virginia
        WA, // Washington
        WV, // West Virginia
        WI, // Wisconsin
        WY, // Wyoming
        AB, // Alberta
        BC, // British Columbia
        MB, // Manitoba
        NB, // New Brunswick
        NL, // Newfoundland and Labrador
        NT, // Northwest Territories
        NS, // Nova Scotia
        NU, // Nunavut
        ON, // Ontario
        PE, // Prince Edward Island
        QC, // Quebec
        SK, // Saskatchewan
        YT, // Yukon Territory
        NF, // NewFoundland
        LB, // Labrador
        PR, // Puerto Rico
        VI, // US Virgin Islands
        GU, // Guam
        AS, // American Samoa
        MP,// Northern Mariana Islands  
        PW, // Pacific West/Wake Island region
        UM, // US Minor Outlying Islands
        NAV, // Navajo Nation
        FM,
        MH, //Marshal islands
    }

}
