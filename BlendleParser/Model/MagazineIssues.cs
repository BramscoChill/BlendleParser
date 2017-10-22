using System;
using System.Collections.Generic;
using System.IO;
using BlendleParser.Helpers;

namespace BlendleParser.Model
{
    public class Year
    {
        public string href { get; set; }
    }

    public class MagazineArticles_Next
    {
        public string href { get; set; }
    }

    public class Links
    {
        public Self self { get; set; }
        public Year year { get; set; }
        public MagazineArticles_Next next { get; set; }
    }

    public class Self2
    {
        public string href { get; set; }
    }

    public class ItemsMetadata
    {
        public string href { get; set; }
    }

    public class PermanentMetadata
    {
        public string href { get; set; }
    }

    public class ProviderMetadata
    {
        public string href { get; set; }
    }

    public class Cover
    {
        public string href { get; set; }
    }

    public class MagazineArticles_Month
    {
        public string href { get; set; }
    }

    public class MagazineArticles_Year2
    {
        public string href { get; set; }
    }

    public class MagazineArticles_Years
    {
        public string href { get; set; }
    }

    public class MagazineArticles_Pages
    {
        public string href { get; set; }
    }

    public class PagePreview
    {
        public string href { get; set; }
        public int width { get; set; }
        public int height { get; set; }
    }

    public class Links2
    {
        public Self2 self { get; set; }
        public ItemsMetadata items_metadata { get; set; }
        public PermanentMetadata permanent_metadata { get; set; }
        public ProviderMetadata provider_metadata { get; set; }
        public Cover cover { get; set; }
        public MagazineArticles_Month month { get; set; }
        public MagazineArticles_Year2 year { get; set; }
        public MagazineArticles_Years years { get; set; }
        public MagazineArticles_Pages pages { get; set; }
        public PagePreview page_preview { get; set; }
    }

    public class Provider
    {
        public string id { get; set; }
    }

    public class Self3
    {
        public string href { get; set; }
    }

    public class Links3
    {
        public Self3 self { get; set; }
    }

    public class PermanentMetadata2
    {
        public Links3 _links { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }

    public class MagazineArticles_Embedded2
    {
        public PermanentMetadata2 permanent_metadata { get; set; }
    }

    public class Issue
    {
        public int format_version { get; set; }
        public List<string> representations { get; set; }
        public Links2 _links { get; set; }
        public string id { get; set; }
        public Provider provider { get; set; }
        public DateTime initial_publication_time { get; set; }
        public DateTime date { get; set; }
        public List<string> items { get; set; }
        public MagazineArticles_Embedded2 _embedded { get; set; }

        //not in api, added manually
        private List<BlendleItem> _fullItems;
        public List<BlendleItem> FullItems
        {
            get
            {
                if(_fullItems == null)
                    _fullItems = new List<BlendleItem>();
                return _fullItems;
            }
            set => _fullItems = value;
        }

        public bool HasValidCoverUrl()
        {
            return this._links != null && this._links.page_preview != null &&
                   this._links.page_preview.href.IsNullOrEmpty() == false &&
                   (new Uri(this._links.page_preview.href, UriKind.RelativeOrAbsolute).IsWellFormedOriginalString());
        }
        public string GetCoverFullPath(string magazine, int year, int month)
        {
            return Path.Combine(MagazineIssues.GetPath(magazine, year, month), Path.GetFileName(new Uri(this._links.page_preview.href, UriKind.RelativeOrAbsolute).LocalPath));
        }
    }

    public class MagazineArticles_Embedded
    {
        public List<Issue> issues { get; set; }
    }

    public class MagazineIssues
    {
        public Links _links { get; set; }
        public MagazineArticles_Embedded _embedded { get; set; }
        public int year { get; set; }
        public int month { get; set; }
        public List<int> days { get; set; }

        public bool IsValid()
        {
            return _links != null && _embedded != null && _embedded.issues != null && _embedded.issues.Count > 0 && _embedded.issues[0].items != null && _embedded.issues[0].items.Count > 0;
        }

        public static string GetPath(string magazine, int year, int month)
        {
            string dir = System.IO.Path.Combine(Constants.DEFAULT_DATA_FULLPATH, magazine, year.ToString(), month.ToString());
            if (Directory.Exists(dir) == false)
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }
        public static string GetFullPath(string magazine, int year, int month, string extension = "json")
        {
            return System.IO.Path.Combine(GetPath(magazine, year, month), GetFileName(magazine,year,month, extension)); ;
        }
        public static string GetFileName(string magazine, int year, int month, string extension = "json")
        {
            if (extension.IsNullOrEmpty())
            {
                return $"articles_{magazine}_{year}{month}";
            }
            return $"articles_{magazine}_{year}{month}.{extension}";
        }
    }
    /*
     {
	"_links": {
		"self": {
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/09/index.json"
		},
		"year": {
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/index.json"
		},
		"next": {
			"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/08/index.json"
		}
	},
	"_embedded": {
		"issues": [{
			"format_version": 4,
			"representations": ["pages"],
			"_links": {
				"self": {
					"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/manifest.json"
				},
				"items_metadata": {
					"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/items.json"
				},
				"permanent_metadata": {
					"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/permanent/index.json"
				},
				"provider_metadata": {
					"href": "s3://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/private/metadata.json"
				},
				"cover": {
					"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/item/67914e2fb5a/version/1/manifest.json"
				},
				"month": {
					"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/09/index.json"
				},
				"year": {
					"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/index.json"
				},
				"years": {
					"href": "https://static.blendle.nl/meta/publication/psychologie/calendar/index.json"
				},
				"pages": {
					"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/pages/version/1/index.json"
				},
				"page_preview": {
					"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/pages/version/1/image/medium/ce4d2a641de2bab707c5fb8ed12d8cd7a23f77db.jpg",
					"width": 413,
					"height": 550
				}
			},
			"id": "bnl-psychologie-20170914",
			"provider": {
				"id": "psychologie"
			},
			"initial_publication_time": "2017-09-14T00:00:00+00:00",
			"date": "2017-09-14T00:00:00+00:00",
			"items": ["bnl-psychologie-20170914-c69e9244568",
			"bnl-psychologie-20170914-ce8802c2e52",
			"bnl-psychologie-20170914-fc897031850",
			"bnl-psychologie-20170914-f019e0a72ad",
			"bnl-psychologie-20170914-14643c0f5a7",
			"bnl-psychologie-20170914-76af0d41b54",
			"bnl-psychologie-20170914-9eaffd84725",
			"bnl-psychologie-20170914-5975b0c28e7",
			"bnl-psychologie-20170914-817a0db1f88",
			"bnl-psychologie-20170914-cab182b99ab",
			"bnl-psychologie-20170914-b7aa75ba0d7",
			"bnl-psychologie-20170914-5789676a875",
			"bnl-psychologie-20170914-09043b6a400",
			"bnl-psychologie-20170914-bfcc40dd24e",
			"bnl-psychologie-20170914-e1ffe0c1b4b",
			"bnl-psychologie-20170914-1b71bf6c104",
			"bnl-psychologie-20170914-de4983bdcc7",
			"bnl-psychologie-20170914-aba978c35d2",
			"bnl-psychologie-20170914-f652fc0fd67",
			"bnl-psychologie-20170914-bc5ef4741a9",
			"bnl-psychologie-20170914-8ba307c4f12",
			"bnl-psychologie-20170914-3d04a30b358",
			"bnl-psychologie-20170914-2bea538b643",
			"bnl-psychologie-20170914-c9650badee6",
			"bnl-psychologie-20170914-e6b1fc81338",
			"bnl-psychologie-20170914-01bc30029f6",
			"bnl-psychologie-20170914-2bf7f008a7d",
			"bnl-psychologie-20170914-f412c810671",
			"bnl-psychologie-20170914-cf52a3fcd4c",
			"bnl-psychologie-20170914-6257775f7ee",
			"bnl-psychologie-20170914-7da43f9643f",
			"bnl-psychologie-20170914-67914e2fb5a"],
			"_embedded": {
				"permanent_metadata": {
					"_links": {
						"self": {
							"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/permanent/index.json"
						}
					},
					"created_at": "2017-09-14T02:00:44+00:00",
					"updated_at": "2017-09-14T02:00:44+00:00"
				}
			}
		}]
	},
	"year": 2017,
	"month": 9,
	"days": [14]
}
     */
}