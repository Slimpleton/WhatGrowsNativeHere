namespace Backend.Models
{
    public record StateCSVItem
    {
        public short Fip { get; init; }
        public string Abbrev { get; init; }
        public string Name { get; init; }
        public string GnisID { get; init; }
    }

    public record CountyCSVItem
    {
        public short StateFip { get; init;  }
        public string CountyFip { get; init; }
        public string CountyName { get; init; }
        public string StateAbbrev { get; init; }
    }
}
