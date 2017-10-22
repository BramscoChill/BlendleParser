using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Script.Serialization;
using BlendleParser.Helpers;

namespace BlendleParser.Model
{

    public class AllYearsMagazine_Self
    {
        public string href { get; set; }
    }

    public class AllYearsMagazine_Year
    {
        public string title { get; set; }
        public string href { get; set; }

        [ScriptIgnore]
        public int YearInt => Convert.ToInt32(title);

        [ScriptIgnore]
        public AllMagazinesInYear AllMagazinesInYear { get; set; }
    }

    public class AllYearsMagazine_Links
    {
        public AllYearsMagazine_Self self { get; set; }
        public List<AllYearsMagazine_Year> years { get; set; }
    }

    public class AllYearsMagazine
    {
        public AllYearsMagazine_Links _links { get; set; }

        public bool IsValid()
        {
            return _links != null && _links.years != null && _links.years.Count > 0;
        }

        public static string GetPath(string magazine)
        {
            string dir = System.IO.Path.Combine(Constants.DEFAULT_DATA_FULLPATH, magazine);
            if (Directory.Exists(dir) == false)
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }
        public static string GetFullPath(string magazine)
        {
            return System.IO.Path.Combine(GetPath(magazine), GetFileName(magazine)); ;
        }
        public static string GetFileName(string magazine)
        {
            return $"years_{magazine}.json";
        }
    }

    /*
     {
	"_links": {
		"self": {
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/index.json"
		},
		"years": [{
			"title": "2014",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2014/index.json"
		},
		{
			"title": "2015",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2015/index.json"
		},
		{
			"title": "2016",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2016/index.json"
		},
		{
			"title": "2017",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/index.json"
		}]
	}
}
     */
}