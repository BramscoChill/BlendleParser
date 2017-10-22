using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Script.Serialization;
using BlendleParser.Helpers;

namespace BlendleParser.Model
{
    public class Years
    {
        public string href { get; set; }
    }

    public class Month
    {

        public string title { get; set; }
        public string href { get; set; }

        [ScriptIgnore]
        public int MonthInt => Convert.ToInt32(title);

        [ScriptIgnore]
        public MagazineIssues MagazineIssues { get; set; }
    }

    public class Next
    {
        public string href { get; set; }
    }

    public class AllMagazinesInYear_Links
    {
        public Self self { get; set; }
        public Years years { get; set; }
        public List<Month> months { get; set; }
        public Next next { get; set; }
    }

    public class AllMagazinesInYear
    {
        public AllMagazinesInYear_Links _links { get; set; }
        public int year { get; set; }

        public bool IsValid()
        {
            return _links != null && _links.years != null && _links.months != null && _links.months.Count > 0;
        }
        public static string GetPath(string magazine, int year)
        {
            string dir = System.IO.Path.Combine(Constants.DEFAULT_DATA_FULLPATH, magazine, year.ToString());
            if (Directory.Exists(dir) == false)
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }
        public static string GetFullPath(string magazine, int year)
        {
            return System.IO.Path.Combine(GetPath(magazine, year), GetFileName(magazine, year)); ;
        }
        public static string GetFileName(string magazine, int year)
        {
            return $"months_{magazine}_{year}.json";
        }
    }

    /*
     {
	"_links": {
		"self": {
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/index.json"
		},
		"years": {
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/index.json"
		},
		"months": [{
			"title": "1",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/01/index.json"
		},
		{
			"title": "2",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/02/index.json"
		},
		{
			"title": "3",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/03/index.json"
		},
		{
			"title": "4",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/04/index.json"
		},
		{
			"title": "5",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/05/index.json"
		},
		{
			"title": "6",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/06/index.json"
		},
		{
			"title": "8",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/08/index.json"
		},
		{
			"title": "9",
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/09/index.json"
		}],
		"next": {
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2016/index.json"
		}
	},
	"year": 2017
}
     */
}