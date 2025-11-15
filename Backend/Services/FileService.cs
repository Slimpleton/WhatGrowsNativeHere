
using Backend.JsonConverters;
using Backend.Models;
using Microsoft.VisualBasic.FileIO;
using System.Text.Json;

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
                string?[] fields = parser.ReadFields()!;
                // TODO swap to fields, just manually create the object with every row
                PlantDataRow row = new()
                {

                };
                data.Add(row);
            }

            return data;
        }

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
