using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mime;
using System.Runtime.CompilerServices;
using System.Web.Script.Serialization;
using BlendleParser.Helpers;
using Newtonsoft.Json;
using RestSharp.Serializers;

namespace BlendleParser.Model
{
    public class BA_Self
    {
        public string href { get; set; }
    }

    public class BA_Posts
    {
        public string href { get; set; }
    }

    public class BA_UserPosts
    {
        public string href { get; set; }
    }

    public class BA_Links
    {
        public BA_Self self { get; set; }
        public BA_Posts posts { get; set; }
        public BA_UserPosts user_posts { get; set; }
    }

    public class BA_Provider
    {
        public string id { get; set; }
    }

    public class BA_Self2
    {
        public string href { get; set; }
    }

    public class BA_BMediaSet
    {
        public string href { get; set; }
    }

    public class BA_Links2
    {
        public BA_Self2 self { get; set; }
        [JsonProperty("b:media-sets")]
        public List<BA_BMediaSet> mediasets { get; set; }
    }

    public class BA_Image7
    {
        //images from the normal images that are not mediaset

        public int width { get; set; }
        public int height { get; set; }
        public string href { get; set; }

        public bool IsValid()
        {
            return href != null && href.IsNullOrEmpty() == false && Uri.IsWellFormedUriString(href, UriKind.Absolute) && height > 0 && width > 0;
        }
        public string GetFileName()
        {
            return System.IO.Path.GetFileName(new Uri(href).LocalPath);
        }
        public string GetFullPath(string folderLocationPath)
        {
            return System.IO.Path.Combine(folderLocationPath, GetFileName()); ;
        }
    }

    public class BA_Links3
    {
        public BA_Image7 original { get; set; }
        public BA_Image7 large { get; set; }
        public BA_Image7 small { get; set; }
        public BA_Image7 medium { get; set; }

        public BA_Image7 GetBestImage()
        {
            if (large != null && large.IsValid())
            {
                return large;
            }
            else if (original != null && original.IsValid())
            {
                return original;
            }
            else if (medium != null && medium.IsValid())
            {
                return medium;
            }
            else if (small != null && small.IsValid())
            {
                return small;
            }
            return null;
        }
        public BA_Image7[] GetAllImages()
        {
            return new[] { original, large, medium, small };
        }
    }

    public class BA_Image
    {
        public BA_Links3 _links { get; set; }
        public bool featured { get; set; }

        public bool IsValid()
        {
            return _links != null && _links.GetBestImage() != null;
        }

        public BA_Image7 GetBestImage()
        {
            return _links.GetBestImage();
        }
        public BA_Image7[] GetAllImages()
        {
            return new []{ _links.original, _links.large, _links.medium, _links.small};
        }
    }

    public class BA_Issue
    {
        public string id { get; set; }
    }

    public class BA_Streamer
    {
        public string type { get; set; }
        public string content { get; set; }
        public int? position { get; set; }
    }

    public class BA_Original2
    {
        public string href { get; set; }
    }

    public class BA_Large2
    {
        public string href { get; set; }
    }

    public class BA_Self3
    {
        public string href { get; set; }
    }

    public class BA_Medium2
    {
        public string href { get; set; }
    }

    public class BA_Small2
    {
        public string href { get; set; }
    }

    public class BA_Links4
    {
        public BA_Original2 original { get; set; }
        public BA_Large2 large { get; set; }
        public BA_Self3 self { get; set; }
        public BA_Medium2 medium { get; set; }
        public BA_Small2 small { get; set; }
    }

    public class BA_Self4
    {
        public string href { get; set; }
    }

    public class BA_File
    {
        public string href { get; set; }
    }

    public class BA_Links5
    {
        public BA_Self4 self { get; set; }
        public BA_File file { get; set; }
    }

    public class BA_Self5
    {
        public string href { get; set; }
    }

    public class BA_File2
    {
        public string href { get; set; }
    }

    public class BA_Links6
    {
        public BA_Self5 self { get; set; }
        public BA_File2 file { get; set; }
    }

    public class BA_Large3
    {
        public BA_Links6 _links { get; set; }
        public int height { get; set; }
        public int width { get; set; }
    }

    public class BA_Self6
    {
        public string href { get; set; }
    }

    public class BA_File3
    {
        public string href { get; set; }
    }

    public class BA_Links7
    {
        public BA_Self6 self { get; set; }
        public BA_File3 file { get; set; }
    }

    public class BA_Small3
    {
        public BA_Links7 _links { get; set; }
        public int height { get; set; }
        public int width { get; set; }
    }

    public class BA_Self7
    {
        public string href { get; set; }
    }

    public class BA_File4
    {
        public string href { get; set; }
    }

    public class BA_Links8
    {
        public BA_Self7 self { get; set; }
        public BA_File4 file { get; set; }
    }

    public class BA_Medium3
    {
        public BA_Links8 _links { get; set; }
        public int height { get; set; }
        public int width { get; set; }
    }

    public class BA_Original3
    {
        public BA_Links5 _links { get; set; }
        public int height { get; set; }
        public int width { get; set; }

        public bool IsValid()
        {
            return _links != null && _links.file != null && _links.file.href.IsNullOrEmpty() == false && Uri.IsWellFormedUriString(_links.file.href, UriKind.Absolute) && height > 0 && width > 0;
        }
        public string GetFileName()
        {
            return System.IO.Path.GetFileName(new Uri(_links.file.href).LocalPath);
        }

        public string GetFullPath(string folderLocationPath)
        {
            return System.IO.Path.Combine(folderLocationPath, GetFileName()); ;
        }
    }

    public class BA_Embedded3
    {
        public BA_Original3 original { get; set; }
        public BA_Original3 large { get; set; }
        public BA_Original3 small { get; set; }
        public BA_Original3 medium { get; set; }


        public BA_Original3 GetBestImage()
        {
            if (large != null && large.IsValid())
            {
                return large;
            }
            else if (original != null && original.IsValid())
            {
                return original;
            }
            else if (medium != null && medium.IsValid())
            {
                return medium;
            }
            else if (small != null && small.IsValid())
            {
                return small;
            }
            return null;
        }
        public BA_Original3[] GetAllImages()
        {
            return new[] { original, large, medium, small };
        }
    }

    public class BA_BMediaSet2
    {
        public string type { get; set; }
        public BA_Links4 _links { get; set; }
        public int? position { get; set; }
        public BA_Embedded3 _embedded { get; set; }

        public bool IsValid()
        {
            return type.IsNullOrEmpty() == false && _embedded != null && _embedded.GetBestImage() != null;
        }
    }

    public class BA_Links9Image
    {
        public int height { get; set; }
        public string href { get; set; }
        public int width { get; set; }

        public bool IsValid()
        {
            return href.IsNullOrEmpty() == false && Uri.IsWellFormedUriString(href, UriKind.Absolute) && height > 0 && width > 0;
        }
        public string GetFileName()
        {
            return System.IO.Path.GetFileName(new Uri(href).LocalPath);
        }

//        public static string GetPath(string magazine, int year, int month)
//        {
//            string dir = System.IO.Path.Combine(Constants.DEFAULT_DATA_FULLPATH, magazine, year.ToString(), month.ToString());
//            if (Directory.Exists(dir) == false)
//            {
//                Directory.CreateDirectory(dir);
//            }
//            return dir;
//        }
        public string GetFullPath(string folderLocationPath)
        {
            return System.IO.Path.Combine(folderLocationPath, GetFileName()); ;
        }
    }

    public class BA_Links9
    {
        public BA_Links9Image original { get; set; }
        public BA_Links9Image large { get; set; }
        public BA_Links9Image small { get; set; }
        public BA_Links9Image medium { get; set; }
        public BA_Links9Image GetBestImage()
        {
            if (large != null && large.IsValid())
            {
                return large;
            }
            else if (original != null && original.IsValid())
            {
                return original;
            }
            else if (medium != null && medium.IsValid())
            {
                return medium;
            }
            else if (small != null && small.IsValid())
            {
                return small;
            }
            return null;
        }

        public BA_Links9Image[] GetAllImages()
        {
            return new[] { original, large, medium, small };
        }
    }

    public class BA_Image2
    {
        public BA_Links9 _links { get; set; }
        public string credit { get; set; }
        public bool featured { get; set; }
    }

    public class BA_Original5
    {
        public string href { get; set; }
    }

    public class BA_Large5
    {
        public string href { get; set; }
    }

    public class BA_Self8
    {
        public string href { get; set; }
    }

    public class BA_Medium5
    {
        public string href { get; set; }
    }

    public class BA_Small5
    {
        public string href { get; set; }
    }

    public class BA_Links10
    {
        public BA_Original5 original { get; set; }
        public BA_Large5 large { get; set; }
        public BA_Self8 self { get; set; }
        public BA_Medium5 medium { get; set; }
        public BA_Small5 small { get; set; }
    }

    public class BA_Self9
    {
        public string href { get; set; }
    }

    public class BA_File5
    {
        public string href { get; set; }
    }

    public class BA_Links11
    {
        public BA_Self9 self { get; set; }
        public BA_File5 file { get; set; }
    }

    public class BA_Original6
    {
        public BA_Links11 _links { get; set; }
        public int height { get; set; }
        public int width { get; set; }
    }

    public class BA_Self10
    {
        public string href { get; set; }
    }

    public class BA_File6
    {
        public string href { get; set; }
    }

    public class BA_Links12
    {
        public BA_Self10 self { get; set; }
        public BA_File6 file { get; set; }
    }

    public class BA_Large6
    {
        public BA_Links12 _links { get; set; }
        public int height { get; set; }
        public int width { get; set; }
    }

    public class BA_Self11
    {
        public string href { get; set; }
    }

    public class BA_File7
    {
        public string href { get; set; }
    }

    public class BA_Links13
    {
        public BA_Self11 self { get; set; }
        public BA_File7 file { get; set; }
    }

    public class BA_Small6
    {
        public BA_Links13 _links { get; set; }
        public int height { get; set; }
        public int width { get; set; }
    }

    public class BA_Self12
    {
        public string href { get; set; }
    }

    public class BA_File8
    {
        public string href { get; set; }
    }

    public class BA_Links14
    {
        public BA_Self12 self { get; set; }
        public BA_File8 file { get; set; }
    }

    public class BA_Medium6
    {
        public BA_Links14 _links { get; set; }
        public int height { get; set; }
        public int width { get; set; }
    }

    public class BA_Embedded5
    {
        public BA_Original6 original { get; set; }
        public BA_Large6 large { get; set; }
        public BA_Small6 small { get; set; }
        public BA_Medium6 medium { get; set; }
    }

    public class BA_BMediaSet3
    {
        public BA_Links10 _links { get; set; }
        public string type { get; set; }
        public int position { get; set; }
        public string credit { get; set; }
        public BA_Embedded5 _embedded { get; set; }
    }

    public class BA_Embedded4
    {
        [JsonProperty("b:media-sets")]
        public List<BA_BMediaSet3> mediasets { get; set; }
    }

    public class BA_Item
    {
        public List<BA_Image2> images { get; set; }
        public List<BA_Body> body { get; set; }
        public BA_Embedded4 _embedded { get; set; }
    }

    public class BA_Embedded2
    {
        [JsonProperty("b:media-sets")]
        public List<BA_BMediaSet2> mediasets { get; set; }
        public List<BA_Item> items { get; set; }
    }

    public class BA_Body
    {
        [ScriptIgnore]
        public BodyContentType BodyContentType
        {
            get
            {
                BodyContentType bodyContentType = BodyContentType.Unkown;
                if (bodyContentType != null && Enum.TryParse(this.type, true, out bodyContentType) == false)
                {
                    bodyContentType = BodyContentType.Unkown;
                }
                return bodyContentType;
            }
        }
        [JsonProperty("type")]
        public string type { get; set; }

        [JsonProperty("content")]
        public string content { get; set; }

        [JsonConverter(typeof(BlendleCustomConverter))]
        public List<string> metadata { get; set; }
    }

    public class BA_Content
    {
        public BA_Provider provider { get; set; }
        public BA_Links2 _links { get; set; }
        public List<BA_Image> images { get; set; }
        public int item_index { get; set; }
        public string id { get; set; }
        public DateTime date { get; set; }
        public BA_Issue issue { get; set; }
        public List<BA_Streamer> streamers { get; set; }
        public BA_Embedded2 _embedded { get; set; }
        public List<BA_Body> body { get; set; }
        public int format_version { get; set; }
    }

    public class BA_Embedded
    {
        public BA_Content content { get; set; }
    }

    public class BlendleItem
    {
        public BA_Links _links { get; set; }
        public BA_Embedded _embedded { get; set; }

        //need to be set when fetched from the disk
        [ScriptIgnore]
        public string BaseLocationPath { get; set; }

        public bool IsValid()
        {
            //body or items can contain the article parts
            return _embedded != null && _embedded.content != null && ((_embedded.content.body != null && _embedded.content.body.Count > 0) || 
                (_embedded.content._embedded.items != null && _embedded.content._embedded.items.Count > 0))
                && _embedded.content.issue != null && _embedded.content.id.IsNullOrEmpty() == false && BaseLocationPath.IsNullOrEmpty() == false;
        }
        public bool HasMediaSetImages()
        {
            return IsValid() && _embedded.content._embedded != null && _embedded.content._embedded.mediasets != null 
                && _embedded.content._embedded.mediasets.Count > 0;
        }

        public bool HasNonMediaSetImages()
        {
            return IsValid() && _embedded.content.images != null && _embedded.content.images.Count > 0;
        }

        //sub articles whitin the article
        public bool HasItems()
        {
            return IsValid() && _embedded.content._embedded != null && _embedded.content._embedded.items != null
                   && _embedded.content._embedded.items.Count > 0;
        }
        public static string GetMagazinePath(string magazine, int year, int month)
        {
            string dir = System.IO.Path.Combine(Constants.DEFAULT_DATA_FULLPATH, magazine, year.ToString(), month.ToString());
            if (Directory.Exists(dir) == false)
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }
        public static string GetMagazineFullPath(string magazine, int year, int month, string articleId)
        {
            return System.IO.Path.Combine(GetMagazinePath(magazine, year, month), GetFileName(articleId)); ;
        }
        public static string GetLoosePath(int year, int month)
        {
            string dir = System.IO.Path.Combine(Constants.DEFAULT_DATA_LOOSE_ISSUES, year.ToString(), month.ToString());
            if (Directory.Exists(dir) == false)
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }
        public static string GetLooseFullPath(int year, int month, string articleId)
        {
            return System.IO.Path.Combine(GetLoosePath(year, month), GetFileName(articleId)); ;
        }
        public static string GetFileName(string articleId)
        {
            return $"article-{articleId}.json";
        }
    }
}

public enum BodyContentType
{
    Unkown = 0,
    Kicker, //kicker className="item-kicker"
    Head, //head  className="item-title"
    Hl1, //hl1  className="item-title"
    Hl2, //hl2  className="item-subtitle"
    Lead, //lead className="item-lead"
    Byline, //byline className="item-byline"
    Dateline, //dateline className="item-dateline"
    Intro, //intro className="item-intro"
    Ph, //ph  className="item-header"
    P, //p className="item-paragraph"
    Streamer, //streamer eamerVisitor
    ImageMeta, //image-meta v className="item-image-meta"
    Default, //default className="item-default"
    Image, //image geVisitor
    ImageGrid, //image-grid geGridVisitor
    YoutubeVideo, // tubeVideoVisitor
}



#region example
//direct url: https://blendle.com/item/bnl-filosofiemagazine-20161202-101572
/*
{
	"_links": {
		"self": {
			"href": "https://ws-no-zoom.blendle.com/item/bnl-filosofiemagazine-20161202-101572/content"
		},
		"posts": {
			"href": "https://ws-no-zoom.blendle.com/item/bnl-filosofiemagazine-20161202-101572/posts"
		},
		"user_posts": {
			"href": "https://ws-no-zoom.blendle.com/user/bklein333/posts"
		},
		"s:about": [{
			"href": "https://entity.blendle.com/entity/Q84.json",
			"title": "Londen"
		},
		{
			"href": "https://entity.blendle.com/entity/Q90.json",
			"title": "Parijs"
		},
		{
			"href": "https://entity.blendle.com/entity/Q21.json",
			"title": "Engeland"
		},
		{
			"href": "https://entity.blendle.com/entity/Q9554.json",
			"title": "Maarten Luther"
		}]
	},
	"_embedded": {
		"content": {
			"id": "bnl-filosofiemagazine-20161202-101572",
			"_embedded": {
				"b:media-sets": [{
					"_embedded": {
						"large": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/large/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/variant/large/private/index.json"
								}
							},
							"height": 900,
							"width": 762
						},
						"medium": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/medium/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/variant/medium/private/index.json"
								}
							},
							"height": 600,
							"width": 508
						},
						"original": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/original/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/variant/original/private/index.json"
								}
							},
							"height": 1222,
							"width": 1035
						},
						"small": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/small/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/variant/small/private/index.json"
								}
							},
							"height": 300,
							"width": 254
						}
					},
					"_links": {
						"large": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/variant/large/private/index.json"
						},
						"medium": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/variant/medium/private/index.json"
						},
						"original": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/variant/original/private/index.json"
						},
						"self": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/private/index.json"
						},
						"small": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/variant/small/private/index.json"
						}
					},
					"position": 4,
					"type": "image"
				},
				{
					"_embedded": {
						"large": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/large/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/variant/large/private/index.json"
								}
							},
							"height": 643,
							"width": 900
						},
						"medium": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/medium/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/variant/medium/private/index.json"
								}
							},
							"height": 428,
							"width": 600
						},
						"original": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/original/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/variant/original/private/index.json"
								}
							},
							"height": 722,
							"width": 1011
						},
						"small": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/small/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/variant/small/private/index.json"
								}
							},
							"height": 214,
							"width": 300
						}
					},
					"_links": {
						"large": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/variant/large/private/index.json"
						},
						"medium": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/variant/medium/private/index.json"
						},
						"original": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/variant/original/private/index.json"
						},
						"self": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/private/index.json"
						},
						"small": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/variant/small/private/index.json"
						}
					},
					"position": 13,
					"type": "image"
				},
				{
					"_embedded": {
						"large": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/large/cbec557dab8d97d3c39e4f91c695c948fc466678.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/variant/large/private/index.json"
								}
							},
							"height": 610,
							"width": 706
						},
						"medium": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/medium/cbec557dab8d97d3c39e4f91c695c948fc466678.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/variant/medium/private/index.json"
								}
							},
							"height": 518,
							"width": 600
						},
						"original": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/original/cbec557dab8d97d3c39e4f91c695c948fc466678.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/variant/original/private/index.json"
								}
							},
							"height": 610,
							"width": 706
						},
						"small": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/small/cbec557dab8d97d3c39e4f91c695c948fc466678.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/variant/small/private/index.json"
								}
							},
							"height": 259,
							"width": 300
						}
					},
					"_links": {
						"large": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/variant/large/private/index.json"
						},
						"medium": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/variant/medium/private/index.json"
						},
						"original": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/variant/original/private/index.json"
						},
						"self": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/private/index.json"
						},
						"small": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/variant/small/private/index.json"
						}
					},
					"position": 18,
					"type": "image"
				},
				{
					"_embedded": {
						"large": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/large/99027e216a803857733b46f21fc90eedf6070a11.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/variant/large/private/index.json"
								}
							},
							"height": 756,
							"width": 646
						},
						"medium": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/medium/99027e216a803857733b46f21fc90eedf6070a11.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/variant/medium/private/index.json"
								}
							},
							"height": 600,
							"width": 513
						},
						"original": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/original/99027e216a803857733b46f21fc90eedf6070a11.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/variant/original/private/index.json"
								}
							},
							"height": 756,
							"width": 646
						},
						"small": {
							"_links": {
								"file": {
									"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/small/99027e216a803857733b46f21fc90eedf6070a11.jpg"
								},
								"self": {
									"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/variant/small/private/index.json"
								}
							},
							"height": 300,
							"width": 256
						}
					},
					"_links": {
						"large": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/variant/large/private/index.json"
						},
						"medium": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/variant/medium/private/index.json"
						},
						"original": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/variant/original/private/index.json"
						},
						"self": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/private/index.json"
						},
						"small": {
							"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/variant/small/private/index.json"
						}
					},
					"position": 23,
					"type": "image"
				}]
			},
			"_links": {
				"b:media-sets": [{
					"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9/private/index.json"
				},
				{
					"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127/private/index.json"
				},
				{
					"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/cbec557dab8d97d3c39e4f91c695c948fc466678/private/index.json"
				},
				{
					"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/media-set/99027e216a803857733b46f21fc90eedf6070a11/private/index.json"
				}],
				"self": {
					"href": "s3://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/private/content.json"
				}
			},
			"body": [{
				"content": "<b>HISTORISCH PROFIEL</b>",
				"type": "kicker"
			},
			{
				"content": "De utopie van Thomas More",
				"type": "hl1"
			},
			{
				"content": "Was de utopie van <b>THOMAS MORE</b> wel zo utopisch? Of eerder een voorloper van de totalitaire samenleving waarin de grote Engelse denker zelf ook niet wilde leven?",
				"type": "intro"
			},
			{
				"content": "Auteur<b> Jan Dirk Snel<br></b> Illustraties<b> Maartje de Sonnaville<br></b>",
				"type": "byline"
			},
			{
				"content": "Daar stond hij, hij kon niet anders. Het was maandag 13 april 1534, de dag na Beloken Pasen. Sir Thomas More, 56 jaar oud, staatsman in ruste, stond in Lambeth Palace tegenover zijn ondervragers: Thomas Cromwell, de rechterhand van de koning; Thomas Cranmer, sinds anderhalf jaar aartsbisschop van Canterbury, de bewoner dus; Thomas Audeley, zijn eigen opvolger als kanselier; alsmede William Benson, de abt van Westminster. Vierenveertig jaar eerder, in 1490, als jongetje van twaalf dat net de Latijnse school voltooid had, had hij de treden van de aartsbisschoppelijke residentie voor het eerst beklommen. Twee jaar had hij John Morton, als Lord Chancellor ook al een ambtsvoorganger van hem, als page gediend, voor hij op zijn veertiende in Oxford de klassieke letteren (het <em>trivium </em>van taalkunde, logica, retorica) ging bestuderen.",
				"type": "p"
			},
			{
				"content": "De vorige dag had hij de oproep gekregen, nadat hij in St. Paul’s Cathedral de mis had bijgewoond. Die ochtend had hij persoonlijk voor de laatste keer de poort van zijn grote villa in Chelsea achter zich dichtgetrokken en zich door zijn bedienden over de Theems naar de zuidoever laten roeien.",
				"type": "p"
			},
			{
				"content": "De vraag was simpel: of hij even de eed op de troonopvolging wilde afleggen. Dan kon hij als vrij man linea recta naar huis terugkeren en van een vredige oude dag als geleerde genieten, het ene boek na het andere schrijvend. Maar zijn geweten verbood het hem. Hij vroeg om de tekst van de wet en vergeleek die nauwgezet met de bewoordingen van de eed. Zijn conclusie was helder: hij kon niet anders dan nee zeggen.",
				"type": "p"
			},
			{
				"content": "<strong>Verdoemenis</strong>",
				"type": "ph"
			},
			{
				"content": "De wet bepaalde dat de troonopvolger zou voortkomen uit het huwelijk dat koning Hendrik VIII een jaar eerder had gesloten met Anna Boleyn. Ze impliceerde dus dat diens eerste huwelijk met Catharina van Aragon nietig was en dat de paus daarvoor destijds ten onrechte dispensatie had verleend (ze was de weduwe van zijn overleden broer). Het ging verder; wet en eed gingen ervan uit dat de paus geen zeggenschap meer had in Engeland en dat de Engelse kerk zelfstandig was geworden onder opperheerschappij van de koning. De wet was aangenomen in het parlement; alle leden hadden erop gezworen en alle bisschoppen zouden dat doen, op de bisschop van Rochester na, John Fisher, een goede vriend van More en Erasmus. Ook die morgen viel het Thomas More op dat hij de enige leek was die tussen vele geestelijken was opgeroepen.",
				"type": "p"
			},
			{
				"content": "Anderen wilde hij niet veroordelen, verklaarde More, maar wat hemzelf betreft dwong zijn geweten hem de eed te weigeren, omdat hij anders zijn ziel zou blootstellen aan ‘het gevaar van de eeuwige verdoemenis’. Net als bij Maarten Luther, zijn grote tegenstander, tegen wie hij al in 1523 zijn honderden bladzijden tellende <em>Responsio ad Lutherum</em>, vol felle uithalen, had geschreven, was het geweten in Mores ogen geen strikt individueel gegeven, maar een objectieve maatstaf. Lag die bij Luther naar nieuwe opvatting in het Schriftwoord, voor More lag die in de traditie en het gezag van de kerk van Rome, die het gehele christelijke Europa omvatte. De kerk kon nooit nationaal beperkt worden.",
				"type": "p"
			},
			{
				"content": "<strong>Hoogverraad</strong>",
				"type": "ph"
			},
			{
				"content": "Na het verhoor werd hij overgedragen aan de abt van Westminster. Vier dagen verbleef hij daar onder toezicht. Toen hij nog steeds weigerde, werd hij, opnieuw over de Theems, naar de Tower gebracht, nog immer de gouden ambtsketen dragend, die van zijn dienstbaarheid aan de koning getuigde. Daar zou hij nog ruim een jaar gevangenzitten, terwijl hij onderwijl de ene vrome tekst na de andere schreef, de befaamde ‘Tower Works’ als <em>A Dialogue of Comfort against Tribulation</em> en <em>De Tristia Christi</em>.",
				"type": "p"
			},
			{
				"content": "Eind juni 1535 verscheen Thomas More in Westminster Hall voor twaalf rechters. De wet bepaalde inmiddels dat de koning niet als opperste hoofd van de kerk erkennen hoogverraad was. Daarvoor werd More veroordeeld. Het vonnis bepaalde dat hij op een baar door de stad zou worden gesleept, dat hij zou worden opgehangen tot hij halfdood was, dat vervolgens zijn ingewanden zouden worden uitgesneden en voor zijn ogen verbrand, dat zijn geslachtsdelen zouden worden afgesneden en dat ten slotte zijn hoofd zou worden afgehakt. Maar Hendrik VIII was zijn oude dienaar en dierbare vriend genadig. Er was een tijd geweest dat de koning bij More aan huis kwam en met de arm om hem heen geslagen door de tuin wandelde. Zes dagen kreeg hij om te vasten en te bidden. Op 6 juli 1535 betrad Thomas More in zijn mooiste kleren de heuvel bij de Tower. Hij vroeg de beul zijn onschuldige baard te sparen. Met één klap sloeg die zijn hoofd eraf, dat gekookt op London Bridge werd gespietst. Aldus werd Thomas More een martelaar voor de katholieke kerk en het gezag van de paus. Vier eeuwen na zijn dood werd hij heiligverklaard.",
				"type": "p"
			},
			{
				"content": "<strong>Ketterij</strong>",
				"type": "ph"
			},
			{
				"content": "Wie de vijftien delen, in 21 dikke banden, van <em>The Yale Edition of the Complete Works of St. Thomas More </em>(1963-1997) doorneemt, moet erkennen dat te midden van alle omvangrijke verhandelingen die het gezag van de roomse kerk verdedigen tegen de oprukkende Reformatie, de tekst van dat ene kleine boekje, waarom iedereen More nu nog kent, <em>Utopia</em>, bijna wegvalt. Honderdzesentwintig bladzijden beslaat de Latijnse tekst, inclusief het tiental aanbevelingen van allerhande humanistische geleerden, die hoewel ze voor een goed verstaan van de context onmisbaar zijn in moderne vertalingen helaas vaak worden weggelaten. In zijn eigen land was More uiteraard veel bekender om zijn dikke Engelstalige tirades tegen de ketterij dan vanwege dit speelse werkje in het Latijn, dat op de internationale geleerde republiek van humanistische fijnproevers mikte.",
				"type": "p"
			},
			{
				"content": "<em>Utopia </em>was een Brabants werkje. Het verscheen eind 1516, precies 500 jaar geleden, in Leuven bij Dirk Martens, waar Mores boezemvriend Desiderius Erasmus toezicht hield op het drukproces. Het eigenlijke verhaal over het eiland Utopia, dat het tweede deel beslaat, had More het voorgaande jaar in Antwerpen geschreven. More was namens het gilde van de Merchant Adventurers voor onderhandelingen naar het naburige Vlaanderen, Brugge, gereisd en toen die stokten, had hij zijn geleerde vriend Pieter Gillis, secretaris van de grote koopmansstad, opgezocht. Het wat rommelige eerste deel, dat het fantastische verhaal over de Utopiërs voorzichtig inkadert, schreef More pas toen hij terug was in Londen en weer erg druk was. Maar <em>Utopia</em> is natuurlijk vooral een Europees boek. De tweede druk verscheen in Parijs, de derde gezaghebbende druk in Basel bij Johann Froben, waar Erasmus in 1518 verbleef. Hij zorgde ervoor dat die eindelijk perfect was.",
				"type": "p"
			},
			{
				"content": "<strong>Zotheid</strong>",
				"type": "ph"
			},
			{
				"content": "<em>Utopia</em> is in feite een pendant van Erasmus’ <em>Moriae encomium sive Stultitae laus</em> (<em>Lof der zotheid</em>) dat deze tijdens een lange reis in de zomer van 1509 te paard van Italië naar Engeland uitgedacht had en direct na aankomst in Mores Londense woning in zeven dagen in een roes opschreef (zie de naamspeling in de titel). More en de twaalf jaar oudere Erasmus waren dikke vrienden sinds de laatste Engeland in 1499 voor het eerst aandeed. Samen waren ze toen nog bij de negenjarige jongen langsgewandeld, die later als Hendrik VIII More het hoofd liet afhakken. Erasmus schreef een gedicht voor hem.",
				"type": "p"
			},
			{
				"content": "Er waren ook verschillen. Terwijl Erasmus aan zijn kloostergelofte probeerde te ontsnappen, kende More sterke monastieke neigingen. De jaren voor zijn huwelijk in 1505 nam hij deel aan het leven van een kartuizergemeenschap. Terwijl Erasmus zich als armlastige freelancer helemaal aan de letteren wijdde, verkoos More een lucratieve juridische loopbaan als advocaat, aanklager (in 1510 werd hij onderschout van Londen) en rechter. Maar ze deelden hun humanistische liefde voor de Griekse bronnen, zowel de heidense als de christelijke. Samen vertaalden ze een aantal dialogen van de tweede-eeuwse satiricus Lucianus van Samosata vanuit het Grieks in het Latijn en publiceerden die in 1506 in Parijs.",
				"type": "p"
			},
			{
				"content": "Beide werkjes staan dan ook in deze luchtige, satirische traditie. Erasmus bekeek de wereld vanuit één dwaas gezichtspunt en kon zo op onschuldige wijze heel wat misstanden hekelen. More liet een Portugese geleerde, Raphaël Hythlodaeus, die eruitzag als een ruwe zeebonk, maar die net als hij en Erasmus doorkneed was in de Griekse letteren en wijsbegeerte, vertellen over zijn reizen in de Nieuwe Wereld. Columbus maakte zijn eerste reis toen More veertien was. Hythlodaeus – ‘praatjesmaker’ betekent die in elkaar geflanste naam – had Amerigo Vespucci, wiens verslagen algemeen als al te fantastisch werden beschouwd, gevolgd. Vijf jaar had hij op Utopia in de hoofdstad Amaurotum gewoond. Maar als je één stad kende, kende je ze allemaal. Alle 54 steden – net zoveel als in Engeland – waren op dezelfde wijze aangelegd. De huizen waren voortreffelijk en goed onderhouden. Elke tien jaar verhuisden de bewoners trouwens.",
				"type": "p"
			},
			{
				"content": "Deuren konden niet op slot, maar dat hoefde ook niet, want er was geen geld en geen privébezit. Dertig families aten dagelijks in een hal onder leiding van een districtsopziener en diens echtgenote. Alle mensen droegen dezelfde eenvoudige, doch comfortabele kleren. Alleen mannen en vrouwen, gehuwden en ongehuwden kon je herkennen. Op de markt kon men halen wat men nodig had. Maar aan luxe deden de Utopiërs niet. Daarom volstond zes uur werken in enkele elementaire ambachten – textielbereiding, bouwvak, smidswerk. Voor de rest van de tijd deden ze vooral aan geestelijke vorming. Gedobbeld of gedronken werd er niet.",
				"type": "p"
			},
			{
				"content": "Terwijl Plato’s staat drie standen kende – denkers, strijders, werkers – combineerden de Utopiërs die drie bezigheden in hun dagelijks bestaan. Twee jaar moest ieder op het land werken, maar wie ervan hield, mocht langer blijven. Wie op reis wilde, moest dat in groepsverband doen en ook onderweg ter plekke meewerken.",
				"type": "p"
			},
			{
				"content": "Het is niet zo gek dat mensen bij Utopia denken aan kibboetsim, maar soms ook aan het communistische Rusland van Stalin of het uniforme China van Mao. De Utopiërs leidden een verschrikkelijk deugdzaam leven, maar wie dat vertikte, werd algauw tot slavernij veroordeeld. En soms ter dood. Slaven droegen trouwens dikke gouden ketenen, want goud vonden de Utopiërs waardeloos, stukken minder nuttig dan ijzer. Echtbreuk? Slavernij! Seks voor het huwelijk? Dan mocht je nooit meer trouwen. En oorlog voerden de Utopiërs met alle mogelijke listen. Ook koloniale oorlogen vonden ze nuttig: als zij van braakliggend land iets konden maken en de inboorlingen niet, waarom dan niet?",
				"type": "p"
			},
			{
				"content": "Niet in alle opzichten lijkt Utopia zo geweldig. Sommigen ontwaren trekken van een totalitaire samenleving, gebaseerd op immense sociale controle en afwezigheid van privacy, en op slavernij, met immer geweld loerend op de achtergrond. Toch waren allerlei elementen in Mores wereld maar al te vertrouwd. Gemeenschappelijk gebruik van grond (meente, marke, bos, heide) was nog praktijk. Utopia had verrassend veel weg van een kloostergemeenschap: ook daar geen privacy, geen individuele wil, geen eigen bezit. En het leven dat de Utopiërs leidden, met altijd nuttige bezigheden en zonder uitspattingen, leek treffend op dat van de lezende, beschaafd converserende en musicerende familie More. Utopische huishoudens kenden tien tot zestien volwassenen, en dat zal bij More ook ongeveer het geval geweest zijn. Niet alleen had hij allerlei bedienden en secretarissen, hij hield er ook een nar op na.",
				"type": "p"
			},
			{
				"content": "<strong>Sieraad</strong>",
				"type": "ph"
			},
			{
				"content": "Maar nu de vraag: beschouwde More dit als de ideale samenleving? Kortom, was Utopia in zijn ogen een utopie? Een ideale maatschappij dus, zij het dan eentje die niet te verwezenlijken valt? Het antwoord lijkt me duidelijk: geenszins. More schrijft dat ook met zoveel woorden: ‘Nadat Raphaël zijn verhaal beëindigd had, schoten mij allerlei dingen te binnen die mij in de gebruiken en wetten van dat volk volstrekt verkeerd geregeld leken te zijn. Dat betrof niet alleen hun methode van oorlog voeren, hun rituelen en hun godsdienst en nog andere instellingen, maar bovenal dat wat de meest kenmerkende eigenschap van hun hele maatschappelijke inrichting vormt: hun gemeenschappelijke bezit en huishouding zonder enig geldverkeer. Alleen daardoor al is het voorgoed gedaan met alle adel, pracht, schittering en majesteit, die althans volgens de gangbare mening de ware glans en het ware sieraad van de staat vormen.’",
				"type": "p"
			},
			{
				"content": "Terwijl Hendrik VIII al te veel waarde aan Mores woord hechtte, weigeren veel hedendaagse lezers diens eigen woorden serieus te nemen. Dat kan hij niet menen, denken ze dan; die More in de tekst is maar een literaire figuur. Doch wat Hythlodaeus zegt, dat is wat More echt denkt. Het is een ongerijmde gedachte. Alsof alles wat de Zotheid volgens Erasmus zegt voor diens eigen rekening komt. De zwetser Hythlodaeus prees Utopia als de ‘beste gemeenschap’, More zelf niet. Het was een heidense samenleving op grondslag van de rede, geen christelijke die de openbaring kende. Maar heidenen konden christenen best een spiegel voorhouden. Utopia was hooguit suboptimaal. Vertaler Paul Silverentand maakt van iets neutraals als ‘Plato’s Republiek’ soms zomaar ‘Plato’s ideale staat’. Idealen moet je in onze dagen najagen. Maar More presenteert nergens een program, slechts een vermakelijk en leerzaam verhaal.",
				"type": "p"
			},
			{
				"content": "More schreef precies wat hij zelf vond. Als Hythlodaeus in deel 1 de vraag voorgelegd krijgt of hij met al zijn ervaring en kennis niet een vorst zou moeten gaan adviseren, antwoordt hij dat dat toch niet werkt. Alleen als vorsten filosofen zijn, zegt hij Plato na, zullen ze naar filosofen luisteren. Maar als ze alleen willen weten welke oorlog ze het best kunnen beginnen, luisteren ze toch niet als je betoogt dat vrede beter is. More is het daar niet mee eens. Tuurlijk, echte filosofie, daar hebben ze geen oren naar. Maar je kunt dingen ook tactvol langs omwegen naar voren brengen, en als je iets niet ten goede kunt keren, dan kun je het kwaad altijd nog zo veel mogelijk proberen te voorkomen.",
				"type": "p"
			},
			{
				"content": "In dezelfde herfst van 1516 trad More in dienst bij koning Hendrik VIII. Het bezorgde hem een glansrijke carrière, die in 1529 uitliep op de hoogste ambtelijke en politieke positie in Engeland, die van <em>Lord Chancellor</em>, een functie die hij in 1532 neerlegde op de dag nadat de geestelijkheid voor Hendrik gezwicht was. Zou hij zich ooit afgevraagd hebben of de praatjesmaker die hij voor zijn beroemde boekje verzon op dit punt toch niet gelijk had gehad?",
				"type": "p"
			},
			{
				"content": "<strong>1. SPEECH OVER DE VREEMDELING</strong>",
				"type": "ph"
			},
			{
				"content": "[Dramaturg <strong>Van Tongeren</strong> en actrice <strong>Boeschoten</strong> spreken tijdens De verhalenvertellers over het toneelstuk Sir Thomas More] Wanneer er in Londen een opstand dreigt tegen de komst van vreemdelingen, spreekt Thomas More de menigte toe. <strong>Van </strong><strong>Tongeren</strong>: ‘Stel nou dat jullie straks worden opgepakt en het land uit worden gezet, vraagt hij, dan zijn jullie zelf opeens vluchteling. Hoe zou jij dan behandeld willen worden? Ga de vluchtelingen niet te lijf, wees juist barmhartig! Dat maakt deze speech zo belangrijk: de oproep om jezelf te verplaatsen in de ander.’ Boeschoten: ‘In het huidige debat is dat heel relevant. De vluchtelingenstromen zijn behoorlijk abstract voor ons. Het is lastig om te voelen hoe het is voor de mensen die nu uit Aleppo weg moeten.’",
				"type": "p"
			},
			{
				"content": "<strong>2. DE GEVOLGEN VAN CENSUUR</strong>",
				"type": "ph"
			},
			{
				"content": "Toen Sir Thomas More werd geschreven, werd het toneelstuk vanwege gevoelige kwesties streng gecensureerd. <strong>Van </strong><strong>Tongeren</strong>: ‘Wij zijn nogal snel geneigd om te denken dat er meteen sprake is van een inperking van het denken als iets niet benoemd mag worden. Sir Thomas More is duidelijk beschadigd omdat er bepaalde dingen niet in gezegd mochten worden. Tegelijkertijd heeft Shakespeare de speech van More herschreven omdat de oorspronkelijke versie niet werd goedgekeurd. Shakespeares tekst is in zekere zin een product van de censuur. Censuur heeft dus ook een heel andere kant: zij kan een prikkel zijn om gedachten beter te verwoorden, een prikkel om verfijnder, subtieler, indirecter te zijn, en daardoor misschien nog veel invloedrijker.’",
				"type": "p"
			},
			{
				"content": "<strong>3. MORE’S ZELFCENSUUR</strong>",
				"type": "ph"
			},
			{
				"content": "Thomas More moest zelf ook creatief omgaan met de heersende censuur van zijn eigen tijd. <strong>Van Tongeren:</strong> <strong>‘</strong>More’s Utopia heeft een zekere versleutelde vorm: hij roept in het werk een man op om een fictief reisverhaal te vertellen. Dankzij de constructie van fictie kan More zijn maatschappijkritiek op een acceptabele wijze uiten. Als More een directe kritiek had geschreven en precies had gezegd wat hij wilde zeggen over het Engeland van zijn tijd, dan zou zijn werk waarschijnlijk niet dezelfde bekendheid genieten. Dus hier zie je dat een bepaalde inperking van de meningsuiting een prikkel is geweest om een nog veel scherpere en invloedrijkere tekst te schrijven. Dat is een interessante vraag: is censuur meer dan louter een beperking van het denken?’",
				"type": "p"
			},
			{
				"content": "<strong>4. DE KRACHT VAN VERHALEN</strong>",
				"type": "ph"
			},
			{
				"content": "<strong>Van Tongeren:</strong> ‘In de oproep om jezelf te verplaatsen in anderen, leer je om te gaan met het feit dat er altijd meerdere perspectieven zijn. Je leert om te relativeren en de waarheid niet als een gegeven te zien. Dat gebeurt er als we luisteren naar verhalen en we onszelf daardoor laten bekoren.’ <strong>Boeschoten</strong>: ‘De enige manier om mensen te veranderen is om verhalen te vertellen. Dankzij verhalen – fantasierijk, biografisch, feitelijk – komen mensen tot nieuwe inzichten. Verhalen vertellen is iets magisch wat bij mensen reflectie aanwakkert op zichzelf en de wereld. Ik luisterde vroeger heel geboeid naar de verhalen van mijn opa en oma over de Tweede Wereldoorlog. Doordat je de persoonlijke verhalen hoort, zie je het effect van de geschiedenis op het leven zelf.’",
				"metadata": "[\"padding-next-paragraph\"]",
				"type": "p"
			},
			{
				"content": "<em>Utopia</em>",
				"metadata": "[\"padding-previous-paragraph\"]",
				"type": "p"
			},
			{
				"content": "<strong>THOMAS MORE</strong>",
				"type": "p"
			},
			{
				"content": "(Athenaeum-Polak &amp; Van Gennep) <strong>128 blz. / € 18,50</strong>",
				"metadata": "[\"padding-next-paragraph\"]",
				"type": "p"
			},
			{
				"content": "<em>Thomas More</em>",
				"metadata": "[\"padding-previous-paragraph\"]",
				"type": "p"
			},
			{
				"content": "<strong>PETER ACKROYD</strong>",
				"type": "p"
			},
			{
				"content": "(Uitgeverij Polis) <strong>512 blz. / € 34,50</strong>",
				"type": "p"
			}],
			"date": "2016-12-02T00:00:00+00:00",
			"format_version": 5,
			"images": [{
				"_links": {
					"large": {
						"height": 900,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/large/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9.jpg",
						"width": 762
					},
					"medium": {
						"height": 600,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/medium/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9.jpg",
						"width": 508
					},
					"original": {
						"height": 1222,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/original/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9.jpg",
						"width": 1035
					},
					"small": {
						"height": 300,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/small/801da3a5acaff6aeab330b7dfde4f3c3b2a787b9.jpg",
						"width": 254
					}
				},
				"featured": true
			},
			{
				"_links": {
					"large": {
						"height": 643,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/large/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127.jpg",
						"width": 900
					},
					"medium": {
						"height": 428,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/medium/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127.jpg",
						"width": 600
					},
					"original": {
						"height": 722,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/original/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127.jpg",
						"width": 1011
					},
					"small": {
						"height": 214,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/small/0c43aef4fc3a87f7e1bb20a32cdb29e3358e8127.jpg",
						"width": 300
					}
				}
			},
			{
				"_links": {
					"large": {
						"height": 610,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/large/cbec557dab8d97d3c39e4f91c695c948fc466678.jpg",
						"width": 706
					},
					"medium": {
						"height": 518,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/medium/cbec557dab8d97d3c39e4f91c695c948fc466678.jpg",
						"width": 600
					},
					"original": {
						"height": 610,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/original/cbec557dab8d97d3c39e4f91c695c948fc466678.jpg",
						"width": 706
					},
					"small": {
						"height": 259,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/small/cbec557dab8d97d3c39e4f91c695c948fc466678.jpg",
						"width": 300
					}
				}
			},
			{
				"_links": {
					"large": {
						"height": 756,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/large/99027e216a803857733b46f21fc90eedf6070a11.jpg",
						"width": 646
					},
					"medium": {
						"height": 600,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/medium/99027e216a803857733b46f21fc90eedf6070a11.jpg",
						"width": 513
					},
					"original": {
						"height": 756,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/original/99027e216a803857733b46f21fc90eedf6070a11.jpg",
						"width": 646
					},
					"small": {
						"height": 300,
						"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/12/02/item/101572/version/1/image/small/99027e216a803857733b46f21fc90eedf6070a11.jpg",
						"width": 256
					}
				}
			}],
			"issue": {
				"id": "bnl-filosofiemagazine-20161202"
			},
			"item_index": 6,
			"provider": {
				"id": "filosofiemagazine"
			},
			"streamers": [{
				"content": "<strong>Het vonnis bepaalde dat Thomas More zou worden opgehangen tot hij halfdood was</strong>",
				"position": 10,
				"type": "streamer"
			},
			{
				"content": "<strong>Thomas More, – een martelaar voor de katholieke kerk en het gezag van de paus</strong>",
				"position": 13,
				"type": "streamer"
			},
			{
				"content": "<strong>Utopia was een Brabants werkje</strong>",
				"position": 18,
				"type": "streamer"
			},
			{
				"content": "<strong>More vroeg de beul zijn onschuldige baard te sparen</strong>",
				"position": 20,
				"type": "streamer"
			},
			{
				"content": "<strong>Gedobbeld of gedronken werd er niet in Utopia</strong>",
				"position": 23,
				"type": "streamer"
			}]
		}
	}
}
*/



































/*
 //WITH items
{
	"_links": {
		"self": {
			"href": "https://ws.blendle.com/item/bnl-psychologie-20170914-09043b6a400/content"
		},
		"posts": {
			"href": "https://ws.blendle.com/item/bnl-psychologie-20170914-09043b6a400/posts"
		},
		"user_posts": {
			"href": "https://ws.blendle.com/user/bklein333/posts"
		}
	},
	"_embedded": {
		"content": {
			"provider": {
				"id": "psychologie"
			},
			"_links": {
				"self": {
					"href": "s3://static.blendle.nl/publication/psychologie/2017/09/14/item/09043b6a400/version/1/private/content.json"
				},
				"mediasets": null
			},
			"images": [],
			"item_index": 12,
			"id": "bnl-psychologie-20170914-09043b6a400",
			"date": "\/Date(1505347200000)\/",
			"issue": {
				"id": "bnl-psychologie-20170914"
			},
			"streamers": null,
			"_embedded": {
				"mediasets": null,
				"items": [{
					"images": [{
						"_links": {
							"original": {
								"height": 1326,
								"href": "https://publication-approval.blendleimg.com/publication/psychologie/2017/09/14/item/09043b6a400/version/1/image/original/c2548cb96024366990ef50a84be385c564faa857.jpg",
								"width": 1521
							},
							"large": {
								"height": 785,
								"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/item/09043b6a400/version/1/image/large/c2548cb96024366990ef50a84be385c564faa857.jpg",
								"width": 900
							},
							"small": {
								"height": 262,
								"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/item/09043b6a400/version/1/image/small/c2548cb96024366990ef50a84be385c564faa857.jpg",
								"width": 300
							},
							"medium": {
								"height": 523,
								"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/item/09043b6a400/version/1/image/medium/c2548cb96024366990ef50a84be385c564faa857.jpg",
								"width": 600
							}
						},
						"credit": null,
						"featured": true
					}],
					"body": [{
						"type": "hl1",
						"content": "Koffie halen voor de werksfeer"
					},
					{
						"type": "p",
						"content": "\u003cstrong\u003eOm de werksfeer positiever te maken hoef je niet eens zoveel te doen,\u003c/strong\u003e wordt duidelijk uit onderzoek door de universiteit van California. Een groep werknemers kreeg een geheime opdracht: gedurende vier weken gingen ze ten minste vijf aardige dingen per week doen voor een andere groep collega’s die van niets wisten. Bijvoorbeeld iets te drinken halen of een bedankmailtje sturen."
					},
					{
						"type": "p",
						"content": "Dat had allerlei positieve effecten, zowel op de weldoeners als op de ontvangers. Beide groepen gingen zich autonomer en competenter voelen, en twee maanden na het onderzoek waren ze nog steeds tevredener met hun leven."
					},
					{
						"type": "p",
						"content": "Het geven bleek bovendien besmettelijk te zijn. De ontvangers gingen op hun beurt 278 procent meer aardige dingen doen voor hun collega’s."
					},
					{
						"type": "p",
						"content": "\u003cem\u003eEveryday prosociality in the workplace: the reinforcing benefits of giving, getting, and glimpsing, Emotion,\u003c/em\u003e nog te verschijnen"
					},
					{
						"type": "p",
						"content": "\u003cstrong\u003eVoor meer tips om je werkplezier te ­vergroten: kijk op pagina 42\u003c/strong\u003e"
					}],
					"_embedded": {
						"mediasets": [{
							"_links": {
								"original": {
									"href": "s3://static.blendle.nl/media-set/c2548cb96024366990ef50a84be385c564faa857/variant/original/private/index.json"
								},
								"large": {
									"href": "s3://static.blendle.nl/media-set/c2548cb96024366990ef50a84be385c564faa857/variant/large/private/index.json"
								},
								"self": {
									"href": "s3://static.blendle.nl//media-set/c2548cb96024366990ef50a84be385c564faa857/private/index.json"
								},
								"medium": {
									"href": "s3://static.blendle.nl/media-set/c2548cb96024366990ef50a84be385c564faa857/variant/medium/private/index.json"
								},
								"small": {
									"href": "s3://static.blendle.nl/media-set/c2548cb96024366990ef50a84be385c564faa857/variant/small/private/index.json"
								}
							},
							"type": "image",
							"position": 1,
							"credit": null,
							"_embedded": {
								"original": {
									"_links": {
										"self": {
											"href": "s3://static.blendle.nl/media-set/c2548cb96024366990ef50a84be385c564faa857/variant/original/private/index.json"
										},
										"file": {
											"href": "https://publication-approval.blendleimg.com/publication/psychologie/2017/09/14/item/09043b6a400/version/1/image/original/c2548cb96024366990ef50a84be385c564faa857.jpg"
										}
									},
									"height": 1326,
									"width": 1521
								},
								"large": {
									"_links": {
										"self": {
											"href": "s3://static.blendle.nl/media-set/c2548cb96024366990ef50a84be385c564faa857/variant/large/private/index.json"
										},
										"file": {
											"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/item/09043b6a400/version/1/image/large/c2548cb96024366990ef50a84be385c564faa857.jpg"
										}
									},
									"height": 785,
									"width": 900
								},
								"small": {
									"_links": {
										"self": {
											"href": "s3://static.blendle.nl/media-set/c2548cb96024366990ef50a84be385c564faa857/variant/small/private/index.json"
										},
										"file": {
											"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/item/09043b6a400/version/1/image/small/c2548cb96024366990ef50a84be385c564faa857.jpg"
										}
									},
									"height": 262,
									"width": 300
								},
								"medium": {
									"_links": {
										"self": {
											"href": "s3://static.blendle.nl/media-set/c2548cb96024366990ef50a84be385c564faa857/variant/medium/private/index.json"
										},
										"file": {
											"href": "https://static.blendle.nl/publication/psychologie/2017/09/14/item/09043b6a400/version/1/image/medium/c2548cb96024366990ef50a84be385c564faa857.jpg"
										}
									},
									"height": 523,
									"width": 600
								}
							}
						}]
					}
				},
				{
					"images": [],
					"body": [{
						"type": "hl1",
						"content": "Welk Facebook-type ben je?"
					},
					{
						"type": "p",
						"content": "\u003cstrong\u003eAmerikaanse onderzoekers vroegen Facebook­gebruikers waarom ze dit medium zo leuk vinden, en kwamen tot vier profielen:\u003c/strong\u003e"
					},
					{
						"type": "p",
						"content": "\u003cstrong\u003eRelatie-bouwers\u003c/strong\u003e gebruiken Facebook om hun banden met familie en vrienden te versterken, en elkaar op de hoogte te houden. Hun sociale leven op Facebook lijkt op hun offline sociale leven: het zijn dezelfde vrienden."
					},
					{
						"type": "p",
						"content": "\u003cstrong\u003eStadsomroepers \u003c/strong\u003e(degenen die vroeger de mededelingen in de stad omriepen) willen informatie, nieuwsberichten en meningen delen met de wereld. Er zit weinig overlap tussen hun dagelijkse vrienden en hun Facebook­vrienden. Persoonlijke informatie delen ze liever offline."
					},
					{
						"type": "p",
						"content": "\u003cstrong\u003eSelfies \u003c/strong\u003egebruiken Facebook als zelfpromotie. Ze posten foto’s en persoonlijke informatie: niet zozeer om contact te houden, maar vooral om zo veel mogelijk \u003cem\u003elikes\u003c/em\u003e te krijgen. Die geven zelfvertrouwen en zelfbevestiging."
					},
					{
						"type": "p",
						"content": "\u003cstrong\u003eWindowshoppers \u003c/strong\u003edelen zelf nauwelijks iets, maar gaan regelmatig naar Facebook om informatie over anderen te bekijken."
					},
					{
						"type": "p",
						"content": "I love FB: a Q-methodology analysis of why people ‘like’ Facebook, International Journal of Virtual Communities and Social Networking, 2017, vol. 9, nr. 2"
					}],
					"_embedded": null
				}]
			},
			"body": [{
				"BodyContentType": 3,
				"type": "hl1",
				"content": "Sollicitatie? Wees jezelf!",
				"metadata": null
			},
			{
				"BodyContentType": 4,
				"type": "hl2",
				"content": "Werk",
				"metadata": null
			},
			{
				"BodyContentType": 6,
				"type": "byline",
				"content": "Door Janneke Gieles",
				"metadata": null
			},
			{
				"BodyContentType": 10,
				"type": "p",
				"content": "\u003cstrong\u003eTijdens een sollicitatie moet je je perfect voordoen, en je slechte \u003c/strong\u003e\u003cstrong\u003ekanten verdoezelen. Toch?\u003c/strong\u003e Nee, zegt een internationaal team van onderzoekers. Juist sollicitanten die zichzelf zo authentiek en waarheidsgetrouw mogelijk presenteren, bleken in hun onderzoek de grootste kans op een baan te hebben. Tenminste, als ze aan een bepaald ­niveau van geschiktheid voldeden.",
				"metadata": null
			},
			{
				"BodyContentType": 10,
				"type": "p",
				"content": "De onderzoekers volgden een grote groep solliciterende leraren en juristen. Leraren die op papier tot de 10 procent beste kandidaten behoorden, zagen hun kansen op aanname stijgen van 51 naar 73 procent wanneer ze zichzelf zo authentiek mogelijk presenteerden tijdens het sollicitatiegesprek. Bij geschikte juristen stegen de baankansen van 3 naar 17 procent: ruim het vijfvoudige. Bij de 10 procent minst gekwalificeerde kandidaten werkte het juist averechts om zichzelf eerlijk te presenteren.",
				"metadata": null
			},
			{
				"BodyContentType": 10,
				"type": "p",
				"content": "\u003cem\u003eThe advantage of being oneself [...],\u003c/em\u003e Journal of Applied Psychology, nog te verschijnen",
				"metadata": null
			}],
			"format_version": 5
		}
	}
} 
*/
#endregion example