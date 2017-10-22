using BlendleParser.Helpers;

namespace BlendleParser.Model
{
    public class FullMagazine
    {
        //blendle used unique name
        public string Name { get; set; }
        public AllYearsMagazine AllYearsMagazine { get; set; }

        public bool IsValid()
        {
            return Name.IsNullOrEmpty() == false && AllYearsMagazine != null && AllYearsMagazine.IsValid() &&
                   AllYearsMagazine._links.years.TrueForAll(
                       y => y.AllMagazinesInYear.IsValid() &&
                            y.AllMagazinesInYear._links.months.TrueForAll(m => m.MagazineIssues.IsValid()));
        }
    }
}