export type GrowthForm = 'Bunch' | 'Colonizing' | 'Multiple Stem' | 'Rhizomatous' | 'Single Crown' | 'Single Stem' | 'Stoloniferous' | 'Thicket Forming';
export type Color = 'Black' | 'Blue' | 'Brown' | 'Green' | 'Orange' | 'Purple' | 'Red' | 'White' | 'Yellow' | 'Dark Green' | 'Gray-Green' | 'White-Gray' | 'Yellow-Green';
export type Rate = 'Moderate' | 'None' | 'Rapid' | 'Slow';
export type Category = 'Dicot' | 'Fern' | 'Green alga' | 'Gymnosperm' | 'Hornwort' | 'Horsetail' | 'Lichen' | 'Liverwort' | 'Lycopod' | 'Monocot' | 'Moss' | 'Quillwort' | 'RA' | 'Whisk-fern';
export type Level = 'High' | 'Medium' | 'Low' | 'None';
export type NativityStatus = 'N' | 'I';
export type Duration = 'Perennial' | 'Biennial' | 'Annual' | 'AN';
export type Season = 'Winter' | 'Spring' | 'Summer' | 'Fall' | 'Year Round';
export type Porosity = 'Dense' | 'Moderate' | 'Porous';
export type ShadeTolerance = 'Intermediate' | 'Intolerant' | 'Tolerant';
export type ShapeAndOrientation = 'Climbing' | 'Columnar' | 'Conical' | 'Decumbent' | 'Erect' | 'Irregular' | 'Oval' | 'Prostrate' | 'Rounded' | 'Semi-Erect' | 'Vase';
export type Lifespan = 'Long' | 'Moderate' | 'Short';
export type Toxicity = 'Severe' | 'Moderate' | 'None' | 'Slight';
export type Texture = 'Coarse' | 'Fine' | 'Medium';
export type CommercialAvailability = 'Contracting Only' | 'Field Collections Only' | 'No Known Source' | 'Routinely Available';
export type NativeStatusCode = 'N' | 'I' | 'N?' | 'I?' | 'NI' | 'NI?' | 'GP' | 'GP?' | 'W' | 'W?' | 'A' | 'H';
export type NativeLocationCode = 'L48' | 'AK' | 'HI' | 'PR' | 'VI' | 'CAN' | 'CA' | 'SPM' | 'NA';
// Map-like structure where you can access status by jurisdiction

export type NativeStatus = {
    [K in NativeStatusCode]?: LocationCode[];
}

// US States and Canadian Provinces/Territories for PLANTS Database
export type USState =
    | 'AL' // Alabama
    | 'AK' // Alaska
    | 'AZ' // Arizona
    | 'AR' // Arkansas
    | 'CA' // California
    | 'CO' // Colorado
    | 'CT' // Connecticut
    | 'DC' // Washington DC
    | 'DE' // Delaware
    | 'FL' // Florida
    | 'GA' // Georgia
    | 'HI' // Hawaii
    | 'ID' // Idaho
    | 'IL' // Illinois
    | 'IN' // Indiana
    | 'IA' // Iowa
    | 'KS' // Kansas
    | 'KY' // Kentucky
    | 'LA' // Louisiana
    | 'ME' // Maine
    | 'MD' // Maryland
    | 'MA' // Massachusetts
    | 'MI' // Michigan
    | 'MN' // Minnesota
    | 'MS' // Mississippi
    | 'MO' // Missouri
    | 'MT' // Montana
    | 'NE' // Nebraska
    | 'NV' // Nevada
    | 'NH' // New Hampshire
    | 'NJ' // New Jersey
    | 'NM' // New Mexico
    | 'NY' // New York
    | 'NC' // North Carolina
    | 'ND' // North Dakota
    | 'OH' // Ohio
    | 'OK' // Oklahoma
    | 'OR' // Oregon
    | 'PA' // Pennsylvania
    | 'RI' // Rhode Island
    | 'SC' // South Carolina
    | 'SD' // South Dakota
    | 'TN' // Tennessee
    | 'TX' // Texas
    | 'UT' // Utah
    | 'VT' // Vermont
    | 'VA' // Virginia
    | 'WA' // Washington
    | 'WV' // West Virginia
    | 'WI' // Wisconsin
    | 'WY'; // Wyoming

export type CanadianProvince =
    | 'AB' // Alberta
    | 'BC' // British Columbia
    | 'MB' // Manitoba
    | 'NB' // New Brunswick
    | 'NL' // Newfoundland and Labrador
    | 'NT' // Northwest Territories
    | 'NS' // Nova Scotia
    | 'NU' // Nunavut
    | 'ON' // Ontario
    | 'PE' // Prince Edward Island
    | 'QC' // Quebec
    | 'SK' // Saskatchewan
    | 'YT' // Yukon Territory
    | 'NF' // NewFoundland
    | 'LB'; // Labrador

export type USTerritory =
    | 'PR' // Puerto Rico
    | 'VI' // US Virgin Islands
    | 'GU' // Guam
    | 'AS' // American Samoa
    | 'MP'// Northern Mariana Islands  
    | 'PW' // Pacific West/Wake Island region
    | 'UM' // US Minor Outlying Islands
    | 'NAV'; // Navajo Nation
// Combined type for all location codes used in PLANTS database
export type LocationCode = USState | CanadianProvince | USTerritory;
// TODO change NativeLocationCode[] to State/Province variation because thats the accurate native range

// Generate valid codes from the union type
export const validLocationCodes: Set<LocationCode> = new Set([
    // US States
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID',
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
    'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
    'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
    'WI', 'WY',
    // Canadian Provinces/Territories
    'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT', 'NF', 'LB',
    // US Territories
    'PR', 'VI', 'GU', 'AS', 'MP', 'PW', 'UM', 'NAV'
] as const);

// Mapping from individual location codes to native status regions
export const LocationToNativeRegion: Record<LocationCode, NativeLocationCode> = {
    // US States (Lower 48)
    'AL': 'L48', 'AR': 'L48', 'AZ': 'L48', 'CA': 'L48', 'CO': 'L48',
    'CT': 'L48', 'DC': 'L48', 'DE': 'L48', 'FL': 'L48', 'GA': 'L48', 'ID': 'L48',
    'IL': 'L48', 'IN': 'L48', 'IA': 'L48', 'KS': 'L48', 'KY': 'L48',
    'LA': 'L48', 'ME': 'L48', 'MD': 'L48', 'MA': 'L48', 'MI': 'L48',
    'MN': 'L48', 'MS': 'L48', 'MO': 'L48', 'MT': 'L48', 'NE': 'L48',
    'NV': 'L48', 'NH': 'L48', 'NJ': 'L48', 'NM': 'L48', 'NY': 'L48',
    'NC': 'L48', 'ND': 'L48', 'OH': 'L48', 'OK': 'L48', 'OR': 'L48',
    'PA': 'L48', 'RI': 'L48', 'SC': 'L48', 'SD': 'L48', 'TN': 'L48',
    'TX': 'L48', 'UT': 'L48', 'VT': 'L48', 'VA': 'L48', 'WA': 'L48',
    'WV': 'L48', 'WI': 'L48', 'WY': 'L48',

    // Alaska and Hawaii (separate regions)
    'AK': 'AK',
    'HI': 'HI',

    // US Territories
    'PR': 'PR',
    'VI': 'VI',
    'GU': 'PR', // Guam often grouped with PR region
    'AS': 'PR', // American Samoa often grouped with PR region  
    'MP': 'PR', // Northern Mariana Islands often grouped with PR region
    'PW': 'L48',
    'UM': 'L48',
    'NAV': 'L48',


    // Canadian Provinces/Territories (all map to CAN)
    'AB': 'CAN', 'BC': 'CAN', 'MB': 'CAN', 'NB': 'CAN', 'NL': 'CAN',
    'NT': 'CAN', 'NS': 'CAN', 'NU': 'CAN', 'ON': 'CAN', 'PE': 'CAN',
    'QC': 'CAN', 'SK': 'CAN', 'YT': 'CAN', 'NF': 'CAN', 'LB': 'CAN',
};

// Helper function to get native region for a location code
export function getNativeRegion(locationCode: LocationCode): NativeLocationCode | undefined {
    return LocationToNativeRegion[locationCode];
}

/**
 * L48 - Lower 48 states
AK - Alaska
HI - Hawaii
PR - Puerto Rico
VI - U.S. Virgin Islands
CAN (or CA) - Canada
GL - Greenland (Denmark)
SPM - St. Pierre and Miquelon (France)
NA - North America
 */
// (N) - Native
// (I) - Introduced
// (N?) - Probably Native
// (I?) - Probably Introduced
// (NI) - Native and Introduced
// (NI?) - Probably Native and Introduced
// (GP) - Garden Plant
// (GP?) - Probably Garden Plant
// (W) - Waif
// (W?) - Probably Waif
// (A) - Absent
// H - Historic (no longer present, but was documented historically)


// State and Province column is {COUNTRY_CODE}([ST,ST,ST,...]) OR USA+([PR, VI]) for puerto rico or virgin island or both
// idgaf about the state and province i only care about the damn native status u dolt

// Native statis seems to be like Two letter region (StatusCodeEnum)
// where the enum is either I for invasive or N for Native
//e.g. NA(N), CAN(I)NA(I), L48(I)CAN(I)

//PLANTS Floristic area is a little different as its not status, just occurrences
// TODO use gov ACCEPTED_SYMBOL column / type to query the website
// https://plants.usda.gov/plant-profile/LAENN is the plant profile for
// LAENN aka horseweed
// https://plants.usda.gov/plant-profile/maam/sources gives some plant occurrences / distributions

// Define the interface based on the exact CSV header row
export interface PlantDataRaw {
    "Accepted Symbol": string;
    "Synonym Symbol": string;
    "Symbol": string;
    "Scientific Name": string;
    "PLANTS Floristic Area": string;
    "State and Province": string;
    "Category": Category;
    "Family": string;
    "Duration": Duration[] | Duration;
    "Growth Habit": string;
    "Native Status": string;
    "Characteristics Data": boolean;
    "Active Growth Period": Season[] | Season;
    "After Harvest Regrowth Rate": Rate;
    "Bloat": Level;
    "C:N Ratio": Level;
    "Coppice Potential": boolean;
    "Fall Conspicuous": boolean;
    "Fire Resistance": boolean;
    "Flower Color": Color;
    "Flower Conspicuous": boolean;
    "Foliage Color": Color;
    "Foliage Porosity Summer": Porosity;
    "Foliage Porosity Winter": Porosity;
    "Foliage Texture": Texture;
    "Fruit Color": Color;
    "Fruit Conspicuous": boolean;
    "Growth Form": GrowthForm;
    "Growth Rate": Rate;
    "Height at Base Age, Maximum (feet)": number;
    "Height, Mature (feet)": number;
    "Known Allelopath": boolean;
    "Leaf Retention": boolean;
    "Lifespan": Lifespan;
    "Low Growing Grass": boolean;
    "Nitrogen Fixation": Level;
    "Resprout Ability": boolean;
    "Shape and Orientation": ShapeAndOrientation;
    "Toxicity": Toxicity;
    "Adapted to Coarse Textured Soils": boolean;
    "Adapted to Medium Textured Soils": boolean;
    "Adapted to Fine Textured Soils": boolean;
    "Anaerobic Tolerance": Level;
    "CaCO<SUB>3</SUB> Tolerance": Level;
    "Cold Stratification Required": boolean;
    "Drought Tolerance": Level;
    "Fertility Requirement": Level;
    "Fire Tolerance": Level;
    "Frost Free Days, Minimum": number;
    "Hedge Tolerance": Level;
    "Moisture Use": Level;
    "pH (Minimum)": number;
    "pH (Maximum)": number;
    "Planting Density per Acre, Minimum": number;
    "Planting Density per Acre, Maximum": number;
    "Precipitation (Minimum)": number;
    "Precipitation (Maximum)": number;
    "Root Depth, Minimum (inches)": number;
    "Salinity Tolerance": Level;
    "Shade Tolerance": ShadeTolerance;
    "Temperature, Minimum (°F)": number;
    "Bloom Period": string;
    "Commercial Availability": CommercialAvailability;
    "Fruit/Seed Abundance": Level;
    "Fruit/Seed Period Begin": Season;
    "Fruit/Seed Period End": Season;
    "Fruit/Seed Persistence": boolean;
    "Propogated by Bare Root": boolean;
    "Propogated by Bulbs": boolean;
    "Propogated by Container": boolean;
    "Propogated by Corms": boolean;
    "Propogated by Cuttings": boolean;
    "Propogated by Seed": boolean;
    "Propogated by Sod": boolean;
    "Propogated by Sprigs": boolean;
    "Propogated by Tubers": boolean;
    "Seeds per Pound": number;
    "Seed Spread Rate": Rate;
    "Seedling Vigor": Level;
    "Small Grain": boolean;
    "Vegetative Spread Rate": Rate;
    "Berry/Nut/Seed Product": boolean;
    "Christmas Tree Product": boolean;
    "Fodder Product": boolean;
    "Fuelwood Product": Level;
    "Lumber Product": boolean;
    "Naval Store Product": boolean;
    "Nursery Stock Product": boolean;
    "Palatable Browse Animal": Level;
    "Palatable Graze Animal": Level;
    "Palatable Human": boolean;
    "Post Product": boolean;
    "Protein Potential": Level;
    "Pulpwood Product": boolean;
    "Veneer Product": boolean;
}

// Define the camelCase interface for working with the data
// Using Readonly to ensure immutability
export type PlantData = Readonly<{
    acceptedSymbol: string;
    synonymSymbol: string;
    symbol: string;
    scientificName: string;
    plantsFloristicArea: string;
    stateAndProvince: string;
    category: Category;
    family: string;
    duration: ReadonlyArray<Duration> | Duration;
    growthHabit: string;
    nativeStatus: NativeStatus[];
    characteristicsData: boolean;
    activeGrowthPeriod: ReadonlyArray<Season> | Season;
    afterHarvestRegrowthRate: Rate;
    bloat: Level;
    cnRatio: Level;
    coppicePotential: boolean;
    fallConspicuous: boolean;
    fireResistance: boolean;
    flowerColor: Color;
    flowerConspicuous: boolean;
    foliageColor: Color;
    foliagePorosityWinter: Porosity;
    foliagePorositySummer: Porosity;
    foliageTexture: Texture;
    fruitColor: Color;
    fruitConspicuous: boolean;
    growthForm: GrowthForm;
    growthRate: Rate;
    heightAtBaseAgeMaximumFeet: number;
    heightMatureFeet: number;
    knownAllelopath: boolean;
    leafRetention: boolean;
    lifespan: Lifespan;
    lowGrowingGrass: boolean;
    nitrogenFixation: Level;
    resproutAbility: boolean;
    shapeAndOrientation: ShapeAndOrientation;
    toxicity: Toxicity;
    adaptedToCoarseTexturedSoils: boolean;
    adaptedToMediumTexturedSoils: boolean;
    adaptedToFineTexturedSoils: boolean;
    anaerobicTolerance: Level;
    caco3Tolerance: Level;
    coldStratificationRequired: boolean;
    droughtTolerance: Level;
    fertilityRequirement: Level;
    fireTolerance: Level;
    frostFreeDaysMinimum: number;
    hedgeTolerance: Level;
    moistureUse: Level;
    phMinimum: number;
    phMaximum: number;
    plantingDensityPerAcreMinimum: number;
    plantingDensityPerAcreMaximum: number;
    precipitationMinimum: number;
    precipitationMaximum: number;
    rootDepthMinimumInches: number;
    salinityTolerance: Level;
    shadeTolerance: ShadeTolerance;
    temperatureMinimumF: number;
    bloomPeriod: string;
    commercialAvailability: CommercialAvailability;
    fruitSeedAbundance: Level;
    fruitSeedPeriodBegin: Season;
    fruitSeedPeriodEnd: Season;
    fruitSeedPersistence: boolean;
    propogatedByBareRoot: boolean;
    propogatedByBulbs: boolean;
    propogatedByContainer: boolean;
    propogatedByCorms: boolean;
    propogatedByCuttings: boolean;
    propogatedBySeed: boolean;
    propogatedBySod: boolean;
    propogatedBySprigs: boolean;
    propogatedByTubers: boolean;
    seedsPerPound: number;
    seedSpreadRate: Rate;
    seedlingVigor: Level;
    smallGrain: boolean;
    vegetativeSpreadRate: Rate;
    berryNutSeedProduct: boolean;
    christmasTreeProduct: boolean;
    fodderProduct: boolean;
    fuelwoodProduct: Level;
    lumberProduct: boolean;
    navalStoreProduct: boolean;
    nurseryStockProduct: boolean;
    palatableBrowseAnimal: Level;
    palatableGrazeAnimal: Level;
    palatableHuman: boolean;
    postProduct: boolean;
    proteinPotential: Level;
    pulpwoodProduct: boolean;
    veneerProduct: boolean;
}>;

