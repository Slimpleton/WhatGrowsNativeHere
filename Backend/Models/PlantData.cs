using System.ComponentModel;
using System.Drawing;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Backend.Models
{

    // TODO just load all the plant data into some static object shared on the whole app idgaf its legit tiny
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
        public string[] CombinedCountyFIPs { get; init; }
        public bool CharacteristicsData { get; init; }
        public Season[] ActiveGrowthPeriod { get; init; }
        public Rate AfterHarvestRegrowthRate { get; init; }
        public Level Bloat { get; init; }
        public Level CNRatio { get; init; }
        public bool CoppicePotential { get; init; }
        public bool FallConspicuous { get; init; }
        public bool FireResistance { get; init; }
        public Color FlowerColor { get; init; }
        public bool FlowerConspicuous { get; init; }
        public Color FoliageColor { get; init; }
        public Porosity FoliagePorosityWinter { get; init; }
        public Porosity FoliagePorositySummer { get; init; }
        public Texture FoliageTexture { get; init; }
        public Color FruitColor { get; init; }
        public bool FruitConspicuous { get; init; }
        public GrowthForm GrowthForm { get; init; }
        public Rate GrowthRate { get; init; }
        public double HeightAtBaseAgeMaximumFeet { get; init; }
        public double HeightMatureFeet { get; init; }
        public bool KnownAllelopath { get; init; }
        public bool LeafRetention { get; init; }
        public Lifespan LifeSpan { get; init; }
        public bool LowGrowingGrass { get; init; }
        public Level NitrogenFixation { get; init; }
        public bool Resproutability { get; init; }
        public ShapeAndOrientation ShapeAndOrientation { get; init; }
        public Toxicity Toxicity { get; init; }
        public bool AdaptedToCoarseTexturedSoils { get; init; }
        public bool AdaptedToMediumTexturedSoils { get; init; }
        public bool AdaptedToFineTexturedSoils { get; init; }
        public Level AnaerobicTolerance { get; init; }
        public Level Caco3Tolerance { get; init; }
        public bool ColdStratificationRequired { get; init; }
        public Level DroughtTolerance { get; init; }
        public Level FertilityRequirement { get; init; }
        public Level FireTolerance { get; init; }
        public double FrostFreeDaysMinimum { get; init; }
        public Level HedgeTolerance { get; init; }
        public Level MoistureUse {  get; init;}
        public double PhMinimum { get; init; }
        public double PhMaximum { get; init; }
        public double PlantingDensityPerAcreMinimum { get; init; }
        public double PlantingDensityPerAcreMaximum { get; init; }
        public double PrecipitationMinimum { get; init; }
        public double PrecipitationMaximum { get; init; }
        public double RootDepthMinimumInches {  get; init; }
        public Level SalinityTolerance { get; init; }
        public ShadeTolerance ShadeTolerance { get; init; }
        public double TemperatureMinimumF {  get; init; }
        public string BloomPeriod { get; init; }
        public CommercialAvailability CommercialAvailability { get; init; }
        public Level FruitSeedAbundance { get; init; }
        public Season FruitSeedPeriodBegin { get; init; }
        public Season FruitSeedPeriodEnd { get; init; }
        public bool FruitSeedPersistence {  get; init; }
        public bool PropogatedByBareRoot {get;init;}
        public bool PropogatedByBulbs {get;init;}
        public bool PropogatedByContainer {get;init;}
        public bool PropogatedByCorms {get;init;}
        public bool PropogatedByCuttings {get;init;}
        public bool PropogatedBySeed {get;init;}
        public bool PropogatedBySod { get; init; }
        public bool PropogatedBySprigs { get; init; }
        public bool PropogatedByTubers { get; init; }
        public double SeedsPerPound { get; init; }
        public Rate SeedSpreadRate { get; init; }
        public Level SeedlingVigor {  get; init; }
        public bool SmallGrain { get; init; }
        public Rate VegetativeSpreadRate { get; init; }
        public bool BerryNutSeedProduct { get; init; }
        public bool ChristmasTreeProduct { get; init; }
        public bool FodderProduct { get; init; }
        public Level FuelwoodProduct { get; init; }
        public bool LumberProduct { get; init; }
        public bool NavalStoreProduct { get; init; }
        public bool NurseryStockProduct { get; init; }
        public Level PalatableBrowseAnimal { get; init; }
        public Level PalatableGrazeAnimal { get; init; }
        public bool PalatableHuman { get; init; }
        public bool PostProduct { get; init; }
        public Level ProteinPotential { get; init; }
        public bool PulpwoodProduct { get; init; }
        public bool VeneerProduct { get; init; }
        public string CommonName { get; init; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ShadeTolerance
    {
        Intermediate,Tolerant,Intolerant
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Lifespan
    {
        Long,Moderate,Short
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Season
    {
        Winter,Spring,Summer,Fall,
        [EnumMember(Value = "Year Round")]
        YearRound
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
    public enum ShapeAndOrientation
    {
        Climbing, Columnar, Conical, Decumbent, Erect, Irregular, Oval, Porstrate, Rounded,
        [EnumMember(Value = "Semi-Erect")]
        SemiErect,
        Vase
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
    public enum NativeLocationCode
    {
        L48,AK,HI,PR,VI,CAN,CA,SPM,NA
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum NativeStatusCode
    {
        N,I,
        [EnumMember(Value = "N?")]
        MaybeN,
        [EnumMember(Value = "I?")]
        MaybeI,
        NI,
        [EnumMember(Value = "NI?")]
        MaybeNI,
        GP,
        [EnumMember(Value = "GP?")]
        MaybeGP,
        W,
        [EnumMember(Value = "W?")]
        MaybeW,
        A,H
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
