using System.ComponentModel;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public record PlantDataRow
    {
        [JsonPropertyName("Accepted Symbol")]
        public string AcceptedSymbol { get; init; }
        [JsonPropertyName("Synonym Symbol")]
        public string? SynonymSymbol { get; init; }
        public string Symbol { get; init; }
        [JsonPropertyName("Scientific Name")]
        public string ScientificName { get; init; }
        [JsonPropertyName("PLANTS Floristic Area")]
        public string? PlantsFlorisiticArea { get; init; }
        [JsonPropertyName("State and Province")]
        // TODO make this a set? array? idk man
        public HashSet<LocationCode> StateAndProvince { get; init; }
        public Category? Category { get; init; }
        public string? Family { get; init; }
        public HashSet<Duration> Duration { get; init; }
        [JsonPropertyName("Growth Habit")]
        public HashSet<GrowthHabit> GrowthHabit { get; init; }
        [JsonPropertyName("Native Status")]
        public HashSet<LocationCode> NativeStateAndProvinceCodes { get; init; }
        [JsonPropertyName("Characteristics Data")]
        public bool CharacteristicsData { get; init; }
        [JsonPropertyName("Active Growth Period")]
        public HashSet<Season> ActiveGrowthPeriod { get; init; }
        [JsonPropertyName("After Harvest Regrowth Rate")]
        public Rate? AfterHarvestRegrowthRate { get; init; }
        public Level? Bloat { get; init; }
        [JsonPropertyName("C:N Ratio")]
        public Level? CNRatio { get; init; }
        [JsonPropertyName("Coppice Potential")]
        public bool? CoppicePotential { get; init; }
        [JsonPropertyName("Fall Conspicuous")]
        public bool? FallConspicuous { get; init; }
        [JsonPropertyName("Fire Resistance")]
        public bool? FireResistance { get; init; }
        [JsonPropertyName("Flower Color")]
        public Color? FlowerColor { get; init; }
        [JsonPropertyName("Flower Conspicuous")]
        public bool? FlowerConspicuous { get; init; }
        [JsonPropertyName("Foliage Color")]
        public Color? FoliageColor { get; init; }
        [JsonPropertyName("Foliage Porosity Winter")]
        public Porosity? FoliagePorosityWinter { get; init; }
        [JsonPropertyName("Foliage Porosity Summer")]
        public Porosity? FoliagePorositySummer { get; init; }
        [JsonPropertyName("Foliage Texture")]
        public Texture? FoliageTexture { get; init; }
        [JsonPropertyName("Fruit Color")]
        public Color? FruitColor { get; init; }
        [JsonPropertyName("Fruit Conspicuous")]
        public bool? FruitConspicuous { get; init; }
        [JsonPropertyName("Growth Form")]
        public GrowthForm? GrowthForm { get; init; }
        [JsonPropertyName("Growth Rate")]
        public Rate? GrowthRate { get; init; }
        [JsonPropertyName("Height at Base Age, Maximum (feet)")]
        public double? HeightAtBaseAgeMaximumFeet { get; init; }
        [JsonPropertyName("Height, Mature (feet)")]
        public double? HeightMatureFeet { get; init; }
        [JsonPropertyName("Known Allelopath")]
        public bool? KnownAllelopath { get; init; }
        [JsonPropertyName("Leaf Retention")]
        public bool? LeafRetention { get; init; }
        public Lifespan? Lifespan { get; init; }
        [JsonPropertyName("Low Growing Grass")]
        public bool? LowGrowingGrass { get; init; }
        [JsonPropertyName("Nitrogen Fixation")]
        public Level? NitrogenFixation { get; init; }
        [JsonPropertyName("Resprout Ability")]
        public bool? Resproutability { get; init; }
        [JsonPropertyName("Shape and Orientation")]
        public ShapeAndOrientation? ShapeAndOrientation { get; init; }
        public Toxicity? Toxicity { get; init; }
        [JsonPropertyName("Adapted to Coarse Textured Soils")]
        public bool? AdaptedToCoarseTexturedSoils { get; init; }
        [JsonPropertyName("Adapted to Medium Textured Soils")]
        public bool? AdaptedToMediumTexturedSoils { get; init; }
        [JsonPropertyName("Adapted to Fine Textured Soils")]
        public bool? AdaptedToFineTexturedSoils { get; init; }
        [JsonPropertyName("Anaerobic Tolerance")]
        public Level? AnaerobicTolerance { get; init; }
        [JsonPropertyName("CaCO<SUB>3</SUB> Tolerance")]
        public Level? Caco3Tolerance { get; init; }
        [JsonPropertyName("Cold Stratification Required")]
        public bool? ColdStratificationRequired { get; init; }
        [JsonPropertyName("Drought Tolerance")]
        public Level? DroughtTolerance { get; init; }
        [JsonPropertyName("Fertility Requirement")]
        public Level? FertilityRequirement { get; init; }
        [JsonPropertyName("Fire Tolerance")]
        public Level? FireTolerance { get; init; }
        [JsonPropertyName("Frost Free Days, Minimum")]
        public double? FrostFreeDaysMinimum { get; init; }
        [JsonPropertyName("Hedge Tolerance")]
        public Level? HedgeTolerance { get; init; }
        [JsonPropertyName("Moisture Use")]
        public Level? MoistureUse {  get; init;}
        [JsonPropertyName("pH (Minimum)")]
        public double? PhMinimum { get; init; }
        [JsonPropertyName("pH (Maximum)")]
        public double? PhMaximum { get; init; }
        [JsonPropertyName("Planting Density per Acre, Minimum")]
        public double? PlantingDensityPerAcreMinimum { get; init; }
        [JsonPropertyName("Planting Density per Acre, Maximum")]
        public double? PlantingDensityPerAcreMaximum { get; init; }
        [JsonPropertyName("Precipitation (Minimum)")]
        public double? PrecipitationMinimum { get; init; }
        [JsonPropertyName("Precipitation (Maximum)")]
        public double ?PrecipitationMaximum { get; init; }
        [JsonPropertyName("Root Depth, Minimum (inches)")]
        public double ?RootDepthMinimumInches {  get; init; }
        [JsonPropertyName("Salinity Tolerance")]
        public Level? SalinityTolerance { get; init; }
        [JsonPropertyName("Shade Tolerance")]
        public ShadeTolerance? ShadeTolerance { get; init; }
        [JsonPropertyName("Temperature, Minimum (°F)")]
        public double? TemperatureMinimumF {  get; init; }
        [JsonPropertyName("Bloom Period")]
        public string? BloomPeriod { get; init; }
        [JsonPropertyName("Commercial Availability")]
        public CommercialAvailability? CommercialAvailability { get; init; }
        [JsonPropertyName("Fruit/Seed Abundance")]
        public Level? FruitSeedAbundance { get; init; }
        [JsonPropertyName("Fruit/Seed Period Begin")]
        public Season? FruitSeedPeriodBegin { get; init; }
        [JsonPropertyName("Fruit/Seed Period End")]
        public Season? FruitSeedPeriodEnd { get; init; }
        [JsonPropertyName("Fruit/Seed Persistence")]
        public bool? FruitSeedPersistence {  get; init; }
        [JsonPropertyName("Propogated by Bare Root")]
        public bool? PropogatedByBareRoot {get;init;}
        [JsonPropertyName("Propogated by Bulbs")]
        public bool? PropogatedByBulbs {get;init;}
        [JsonPropertyName("Propogated by Container")]
        public bool? PropogatedByContainer {get;init;}
        [JsonPropertyName("Propogated by Corms")]
        public bool? PropogatedByCorms {get;init;}
        [JsonPropertyName("Propogated by Cuttings")]
        public bool? PropogatedByCuttings {get;init;}
        [JsonPropertyName("Propogated by Seed")]
        public bool? PropogatedBySeed {get;init;}
        [JsonPropertyName("Propogated by Sod")]
        public bool? PropogatedBySod { get; init; }
        [JsonPropertyName("Propogated by Sprigs")]
        public bool? PropogatedBySprigs { get; init; }
        [JsonPropertyName("Propogated by Tubers")]
        public bool? PropogatedByTubers { get; init; }
        [JsonPropertyName("Seeds per Pound")]
        public double? SeedsPerPound { get; init; }
        [JsonPropertyName("Seed Spread Rate")]
        public Rate? SeedSpreadRate { get; init; }
        [JsonPropertyName("Seedling Vigor")]
        public Level? SeedlingVigor {  get; init; }
        [JsonPropertyName("Small Grain")]
        public bool? SmallGrain { get; init; }
        [JsonPropertyName("Vegetative Spread Rate")]
        public Rate? VegetativeSpreadRate { get; init; }
        [JsonPropertyName("Berry/Nut/Seed Product")]
        public bool? BerryNutSeedProduct { get; init; }
        [JsonPropertyName("Christmas Tree Product")]
        public bool? ChristmasTreeProduct { get; init; }
        [JsonPropertyName("Fodder Product")]
        public bool? FodderProduct { get; init; }
        [JsonPropertyName("Fuelwood Product")]
        public Level? FuelwoodProduct { get; init; }
        [JsonPropertyName("Lumber Product")]
        public bool? LumberProduct { get; init; }
        [JsonPropertyName("Naval Store Product")]
        public bool? NavalStoreProduct { get; init; }
        [JsonPropertyName("Nursery Stock Product")]
        public bool? NurseryStockProduct { get; init; }
        [JsonPropertyName("Palatable Browse Animal")]
        public Level ?PalatableBrowseAnimal { get; init; }
        [JsonPropertyName("Palatable Graze Animal")]
        public Level? PalatableGrazeAnimal { get; init; }
        [JsonPropertyName("Palatable Human")]
        public bool? PalatableHuman { get; init; }
        [JsonPropertyName("Post Product")]
        public bool? PostProduct { get; init; }
        [JsonPropertyName("Protein Potential")]
        public Level? ProteinPotential { get; init; }
        [JsonPropertyName("Pulpwood Product")]
        public bool? PulpwoodProduct { get; init; }
        [JsonPropertyName("Veneer Product")]
        public bool? VeneerProduct { get; init; }
    }

    public record PlantData: PlantDataRow
    {
        public string CommonName { get; init; }
        public HashSet<string> CombinedCountyFIPs { get; init; }

        // Full copy constructor from PlantDataRow
        public PlantData(PlantDataRow row, string commonName, HashSet<string> countyFIPs)
        {
            AcceptedSymbol = row.AcceptedSymbol;
            SynonymSymbol = row.SynonymSymbol;
            Symbol = row.Symbol;
            ScientificName = row.ScientificName;
            PlantsFlorisiticArea = row.PlantsFlorisiticArea;
            StateAndProvince = row.StateAndProvince;
            Category = row.Category;
            Family = row.Family;
            Duration = row.Duration;
            GrowthHabit = row.GrowthHabit;
            NativeStateAndProvinceCodes = row.NativeStateAndProvinceCodes;
            CharacteristicsData = row.CharacteristicsData;
            ActiveGrowthPeriod = row.ActiveGrowthPeriod;
            AfterHarvestRegrowthRate = row.AfterHarvestRegrowthRate;
            Bloat = row.Bloat;
            CNRatio = row.CNRatio;
            CoppicePotential = row.CoppicePotential;
            FallConspicuous = row.FallConspicuous;
            FireResistance = row.FireResistance;
            FlowerColor = row.FlowerColor;
            FlowerConspicuous = row.FlowerConspicuous;
            FoliageColor = row.FoliageColor;
            FoliagePorosityWinter = row.FoliagePorosityWinter;
            FoliagePorositySummer = row.FoliagePorositySummer;
            FoliageTexture = row.FoliageTexture;
            FruitColor = row.FruitColor;
            FruitConspicuous = row.FruitConspicuous;
            GrowthForm = row.GrowthForm;
            GrowthRate = row.GrowthRate;
            HeightAtBaseAgeMaximumFeet = row.HeightAtBaseAgeMaximumFeet;
            HeightMatureFeet = row.HeightMatureFeet;
            KnownAllelopath = row.KnownAllelopath;
            LeafRetention = row.LeafRetention;
            Lifespan = row.Lifespan;
            LowGrowingGrass = row.LowGrowingGrass;
            NitrogenFixation = row.NitrogenFixation;
            Resproutability = row.Resproutability;
            ShapeAndOrientation = row.ShapeAndOrientation;
            Toxicity = row.Toxicity;
            AdaptedToCoarseTexturedSoils = row.AdaptedToCoarseTexturedSoils;
            AdaptedToMediumTexturedSoils = row.AdaptedToMediumTexturedSoils;
            AdaptedToFineTexturedSoils = row.AdaptedToFineTexturedSoils;
            AnaerobicTolerance = row.AnaerobicTolerance;
            Caco3Tolerance = row.Caco3Tolerance;
            ColdStratificationRequired = row.ColdStratificationRequired;
            DroughtTolerance = row.DroughtTolerance;
            FertilityRequirement = row.FertilityRequirement;
            FireTolerance = row.FireTolerance;
            FrostFreeDaysMinimum = row.FrostFreeDaysMinimum;
            HedgeTolerance = row.HedgeTolerance;
            MoistureUse = row.MoistureUse;
            PhMinimum = row.PhMinimum;
            PhMaximum = row.PhMaximum;
            PlantingDensityPerAcreMinimum = row.PlantingDensityPerAcreMinimum;
            PlantingDensityPerAcreMaximum = row.PlantingDensityPerAcreMaximum;
            PrecipitationMinimum = row.PrecipitationMinimum;
            PrecipitationMaximum = row.PrecipitationMaximum;
            RootDepthMinimumInches = row.RootDepthMinimumInches;
            SalinityTolerance = row.SalinityTolerance;
            ShadeTolerance = row.ShadeTolerance;
            TemperatureMinimumF = row.TemperatureMinimumF;
            BloomPeriod = row.BloomPeriod;
            CommercialAvailability = row.CommercialAvailability;
            FruitSeedAbundance = row.FruitSeedAbundance;
            FruitSeedPeriodBegin = row.FruitSeedPeriodBegin;
            FruitSeedPeriodEnd = row.FruitSeedPeriodEnd;
            FruitSeedPersistence = row.FruitSeedPersistence;
            PropogatedByBareRoot = row.PropogatedByBareRoot;
            PropogatedByBulbs = row.PropogatedByBulbs;
            PropogatedByContainer = row.PropogatedByContainer;
            PropogatedByCorms = row.PropogatedByCorms;
            PropogatedByCuttings = row.PropogatedByCuttings;
            PropogatedBySeed = row.PropogatedBySeed;
            PropogatedBySod = row.PropogatedBySod;
            PropogatedBySprigs = row.PropogatedBySprigs;
            PropogatedByTubers = row.PropogatedByTubers;
            SeedsPerPound = row.SeedsPerPound;
            SeedSpreadRate = row.SeedSpreadRate;
            SeedlingVigor = row.SeedlingVigor;
            SmallGrain = row.SmallGrain;
            VegetativeSpreadRate = row.VegetativeSpreadRate;
            BerryNutSeedProduct = row.BerryNutSeedProduct;
            ChristmasTreeProduct = row.ChristmasTreeProduct;
            FodderProduct = row.FodderProduct;
            FuelwoodProduct = row.FuelwoodProduct;
            LumberProduct = row.LumberProduct;
            NavalStoreProduct = row.NavalStoreProduct;
            NurseryStockProduct = row.NurseryStockProduct;
            PalatableBrowseAnimal = row.PalatableBrowseAnimal;
            PalatableGrazeAnimal = row.PalatableGrazeAnimal;
            PalatableHuman = row.PalatableHuman;
            PostProduct = row.PostProduct;
            ProteinPotential = row.ProteinPotential;
            PulpwoodProduct = row.PulpwoodProduct;
            VeneerProduct = row.VeneerProduct;
            CommonName = commonName;
            CombinedCountyFIPs = countyFIPs;
        }
    }

    public record ExtraInfo(HashSet<string> CombinedFIPs, string CommonName);

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
    public enum Color
    {
        Black, Blue, Brown, Green, Orange, Purple, Red, White, Yellow,
        [EnumMember(Value ="Dark Green")]
        DarkGreen,
        [EnumMember(Value ="Gray-Green")]
        GrayGreen,
        [EnumMember(Value ="White-Gray")]
        WhiteGray,
        [EnumMember(Value ="Yellow-Green")]
        YellowGreen
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
        Climbing, Columnar, Conical, Decumbent, Erect, Irregular, Oval, Prostrate, Rounded,
        [EnumMember(Value = "Semi-Erect")]
        SemiErect,
        Vase
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum GrowthHabit
    {
        [EnumMember(Value = "Forb/herb")]
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
