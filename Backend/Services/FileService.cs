
using Backend.JsonConverters;
using Backend.Models;
using Microsoft.VisualBasic.FileIO;
using System.Text.Json;

namespace Backend.Services
{
    public class FileService
    {
        public static PlantData[] PlantData { get; }
        static FileService()
        {
            string dirName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data");
            List<PlantDataRow> rows = ParsePlantDataRow(dirName);
            Dictionary<string,ExtraInfo> extraInfo = ParseExtraInfo(dirName);

            PlantData[] data = new PlantData[rows.Count];
            for(int i = 0; i < rows.Count; i++)
            {
                ExtraInfo correctInfo = extraInfo[rows[i].Symbol];
                data[i] = new PlantData(rows[i], correctInfo.CommonName, correctInfo.CombinedFIPs);
            }
            PlantData = data;
        }

        public static List<PlantDataRow> ParsePlantDataRow(string dirName)
        {
            string fileName = Path.Combine(dirName,"PLANTS_Characteristics_Plus_Data.csv");
            if (!File.Exists(fileName)) return [];

            using FileStream fs = File.OpenRead(fileName);
            using StreamReader reader = new(fs);

            // Skip Header
            reader.ReadLineAsync();
            TextFieldParser parser = new(reader)
            {
                Delimiters = [","],
                HasFieldsEnclosedInQuotes = true,
            };

            var options = new JsonSerializerOptions()
            {
                TypeInfoResolver = new PlantDataRowJsonResolver()
            };
            List<PlantDataRow> data = [];

            while (!parser.EndOfData)
            {
                PlantDataRow row = JsonSerializer.Deserialize<PlantDataRow>(parser.ReadLine()!, options)!;
                data.Add(row);
            }

            return data;
        }

        public static Dictionary<string,ExtraInfo> ParseExtraInfo(string dirName)
        {
            string fileName = Path.Combine(dirName, "PLANTS_EXTRA_DATA.csv");
            if (!File.Exists(fileName)) return [];

            using FileStream fs = File.OpenRead(fileName);
            using StreamReader reader = new(fs);

            // Skip Header
            reader.ReadLineAsync();
            TextFieldParser parser = new(reader)
            {
                Delimiters = [","],
                HasFieldsEnclosedInQuotes = true,
            };

            Dictionary<string, ExtraInfo> extraInfoMap = [];

            while (!parser.EndOfData)
            {
                string[] fields = parser.ReadFields()!;
                string symbol = fields[0];
                string commonName = fields[1];
                string counties = fields[2];
                HashSet<string> countySet = [.. counties.Split('|')];
                extraInfoMap.Add(symbol, new ExtraInfo(countySet, commonName));
            }

            return extraInfoMap;
        }

    }
}
