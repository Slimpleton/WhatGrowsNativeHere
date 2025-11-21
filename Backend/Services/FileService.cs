
using Backend.Models;
using Microsoft.VisualBasic.FileIO;

namespace Backend.Services
{
    public static class FileService
    {
        public static PlantData[] PlantData { get; }
        public static List<StateCSVItem> States { get; }
        public static List<CountyCSVItem> Counties { get; }
        static FileService()
        {
            string dirName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data");

            List<PlantDataRow> rows = ParsePlantDataRow(dirName);
            Dictionary<string, ExtraInfo> extraInfo = ParseExtraInfo(dirName);

            PlantData[] data = new PlantData[rows.Count];
            for (int i = 0; i < rows.Count; i++)
            {
                ExtraInfo correctInfo = extraInfo[rows[i].Symbol];
                data[i] = new PlantData(rows[i], correctInfo.CommonName, correctInfo.CombinedFIPs);
            }
            PlantData = data;

            States = ParseStateCSV(dirName);
            Counties = ParseCountyCSV(dirName);
        }

        private static List<PlantDataRow> ParsePlantDataRow(string dirName)
        {
            string fileName = Path.Combine(dirName,"PLANTS_Characteristics_Plus_Data.csv");
            using TextFieldParser parser = new(fileName)
            {
                Delimiters = [","],
                HasFieldsEnclosedInQuotes = true,
            };

            List<PlantDataRow> data = [];

            parser.ReadLine();
            while (!parser.EndOfData)
            {
                PlantDataRow row = GetPlantDataRow(parser);
                data.Add(row);
            }

            return data;
        }

        private static PlantDataRow GetPlantDataRow(TextFieldParser parser)
        {
            string?[] fields = parser.ReadFields()!;
            // TODO swap to fields, just manually create the object with every row
            PlantDataRow row = new()
            {
                AcceptedSymbol = fields[0],
                SynonymSymbol = fields[1],
                Symbol = fields[2],
                ScientificName = fields[3],
                PlantsFlorisiticArea = fields[4],
                StateAndProvince = fields[5],
                Category = ParseEnum<Category>(fields[6]),
                Family = fields[7],
                Duration = ParseEnumHashSet<Duration>(fields[8]),
                GrowthHabit = ParseEnumHashSet<GrowthHabit>(fields[9]),
                NativeStateAndProvinceCodes = , // handle differently
                CharacteristicsData = bool.Parse(fields[11]!),
                ActiveGrowthPeriod = String.IsNullOrWhiteSpace(fields[12]) ? [] : [..fields[12]!.Trim('"').Split(',', " and ").Trim()],
                AfterHarvestRegrowthRate = ParseEnum<Rate>(fields[13]),
                Bloat = ParseEnum<Level>(fields[14]),
                CNRatio = ParseEnum<Level>(fields[15]),
                CoppicePotential = String.IsNullOrWhiteSpace(fields[16]) ?null : bool.Parse(fields[16]),
                FallConspicuous = String.IsNullOrWhiteSpace (fields[17]) ? null : bool.Parse(fields[17]),
                FireResistance = String.IsNullOrWhiteSpace(fields[18]) ? null : bool.Parse(fields[18]),
                FlowerColor = ParseEnum<Color>(fields[19]),
                FlowerConspicuous = String.IsNullOrWhiteSpace(fields[20]) ? null : bool.Parse(fields[20]),
                FoliageColor = ParseEnum<Color>(fields[21]),
                FoliagePorositySummer = ParseEnum<Porosity>(fields[22]),
                FoliagePorosityWinter = ParseEnum<Porosity>(fields[23]),
                FoliageTexture = ParseEnum<Texture>(fields[24]),
                FruitColor = ParseEnum<Color>(fields[25]),
                FruitConspicuous = String.IsNullOrWhiteSpace(fields[26]) ? null : bool.Parse(fields[26]),
                GrowthForm = ParseEnum<GrowthForm>(fields[27]),
                GrowthRate = ParseEnum<Rate>(fields[28]),
                HeightAtBaseAgeMaximumFeet = String.IsNullOrWhiteSpace(fields[29]) ? null : double.Parse(fields[29]),
                HeightMatureFeet = String.IsNullOrWhiteSpace(fields[30]) ? null : double.Parse(fields[30]),
                KnownAllelopath = String.IsNullOrWhiteSpace(fields[31]) ? null : bool.Parse(fields[31]),
                LeafRetention = String.IsNullOrWhiteSpace(fields[32]) ? null : bool.Parse(fields[32]),
                Lifespan = ParseEnum<Lifespan>(fields[33]),
                LowGrowingGrass = String.IsNullOrWhiteSpace(fields[34]) ? null : bool.Parse(fields[34]),
                NitrogenFixation = ParseEnum<Level>(fields[35]),
                Resproutability = String.IsNullOrWhiteSpace(fields[36]) ? null: bool.Parse(fields[36]),
                ShapeAndOrientation = ParseEnum<ShapeAndOrientation>(fields[37]),
                Toxicity = ParseEnum<Toxicity>(fields[38]),
                AdaptedToCoarseTexturedSoils = String.IsNullOrWhiteSpace(fields[39]) ? null : bool.Parse(fields[39]),
                AdaptedToMediumTexturedSoils = String.IsNullOrWhiteSpace(fields[40]) ? null : bool.Parse(fields[40]),
                AdaptedToFineTexturedSoils = String.IsNullOrWhiteSpace(fields[41]) ? null : bool.Parse(fields[41]),
                AnaerobicTolerance = ParseEnum<Level>(fields[42]),
                Caco3Tolerance = ParseEnum<Level>(fields[43]),
                ColdStratificationRequired = String.IsNullOrWhiteSpace(fields[44]) ? null : bool.Parse(fields[44]),
                DroughtTolerance = ParseEnum<Level>(fields[45]),

            };
            return row;
        }

        private static TEnum? ParseEnum<TEnum>(string? field) where TEnum : struct, IConvertible, IComparable, IFormattable => String.IsNullOrWhiteSpace(field) ? null : Enum.Parse<TEnum>(field);
        private static HashSet<TEnum> ParseEnumHashSet<TEnum>(string? field) where TEnum : struct, IConvertible, IComparable, IFormattable => String.IsNullOrWhiteSpace(field) ? [] : ParseCsvList<TEnum>(field);
        private static HashSet<TEnum> ParseCsvList<TEnum>(string field) where TEnum : struct, IConvertible, IComparable, IFormattable => [.. field.Trim('"').Split(',').Select(x => Enum.Parse<TEnum>(x))];

        private static Dictionary<string,ExtraInfo> ParseExtraInfo(string dirName)
        {
            string fileName = Path.Combine(dirName, "PLANTS_EXTRA_DATA.csv");
            Dictionary<string, ExtraInfo> items = [];

            TextFieldParser parser = new(fileName)
            {
                Delimiters = [","],
                HasFieldsEnclosedInQuotes = true,
            };
            // Skip Header
            parser.ReadLine();
            while (!parser.EndOfData)
            {
                string[] fields = parser.ReadFields()!;
                string symbol = fields[0];
                string commonName = fields[1];
                string counties = fields[2];
                HashSet<string> countySet = [.. counties.Split('|')];
                items.Add(symbol, new ExtraInfo(countySet, commonName));
            }

            return items;
        }

        private static List<StateCSVItem> ParseStateCSV(string dirName)
        {
            string fileName = Path.Combine(dirName, "statesFipsInfo.csv");
            List<StateCSVItem> items = [];
            TextFieldParser parser = new(fileName)
            {
                Delimiters = [","],
                HasFieldsEnclosedInQuotes = true,
            };

            // Skip Header
            parser.ReadLine();
            while (!parser.EndOfData)
            {
                string[] fields = parser.ReadFields()!;

                StateCSVItem item = new()
                {
                    Fip = short.Parse(fields[0]),
                    Abbrev = fields[1],
                    Name = fields[2],
                    GnisID = fields[3],
                };
                items.Add(item);
            }

            return items;

        }

        private static List<CountyCSVItem> ParseCountyCSV(string dirName)
        {
            string fileName = Path.Combine(dirName, "countyInfo.csv");
            List<CountyCSVItem> items = [];

            TextFieldParser parser = new(fileName)
            {
                Delimiters = [","],
                HasFieldsEnclosedInQuotes = true,
            };

            // Skip Header
            parser.ReadLine();
            while (!parser.EndOfData)
            {
                string[] fields = parser.ReadFields()!;

                CountyCSVItem item = new()
                {
                    StateAbbrev = fields[0],
                    StateFip = short.Parse(fields[1]),
                    CountyFip = fields[2],
                    CountyName= fields[4],
                };
                items.Add(item);
            }

            return items;
        }
    }
}
