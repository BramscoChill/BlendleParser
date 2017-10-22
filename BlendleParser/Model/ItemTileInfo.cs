using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using RestSharp.Serializers;

namespace BlendleParser.Model
{
    public class ItemNonPaymentInfo_Cury
    {
        public string href { get; set; }
        public string name { get; set; }
        public bool templated { get; set; }
    }

    public class ItemNonPaymentInfo_Self
    {
        public string href { get; set; }
    }

    public class ItemNonPaymentInfo_BManifest
    {
        public string href { get; set; }
    }

    public class ItemNonPaymentInfo_Links
    {
        public List<Cury> curies { get; set; }
        public Self self { get; set; }

        [JsonProperty("b:manifest")]
        public ItemNonPaymentInfo_BManifest manifest { get; set; }
    }

    public class ItemNonPaymentInfo_Provider
    {
        public string id { get; set; }
    }

    public class ItemNonPaymentInfo_Body
    {
        public string type { get; set; }
        public string content { get; set; }
    }

    public class ItemNonPaymentInfo_Length
    {
        public int words { get; set; }
    }

    public class ItemNonPaymentInfo_Issue
    {
        public string id { get; set; }
    }

    public class ItemNonPaymentInfo_Self2
    {
        public string href { get; set; }
    }

    public class ItemNonPaymentInfo_Links2
    {
        public ItemNonPaymentInfo_Self2 self { get; set; }
    }

    public class ItemNonPaymentInfo_BManifest2
    {
        public int format_version { get; set; }
        public string id { get; set; }
        public DateTime date { get; set; }
        public ItemNonPaymentInfo_Provider provider { get; set; }
        public List<ItemNonPaymentInfo_Body> body { get; set; }
        public List<object> images { get; set; }
        public ItemNonPaymentInfo_Length length { get; set; }
        public int item_index { get; set; }
        public ItemNonPaymentInfo_Issue issue { get; set; }
        public ItemNonPaymentInfo_Links2 _links { get; set; }
    }

    public class ItemNonPaymentInfo_Embedded
    {
        [JsonProperty("b:manifest")]
        public ItemNonPaymentInfo_BManifest2 manifest { get; set; }
    }

    public class ItemTileInfo
    {
        public ItemNonPaymentInfo_Links _links { get; set; }
        public ItemNonPaymentInfo_Embedded _embedded { get; set; }
        public bool pinned { get; set; }
        public bool opened { get; set; }
        public int post_count { get; set; }
        public bool refundable { get; set; }
        public int price { get; set; }
        public string currency { get; set; }
        public bool item_purchased { get; set; }
        public bool issue_purchased { get; set; }
    }
}

/*
 {
	"_links": {
		"curies": [{
			"href": "https://api.blendle.com/rel/{rel}",
			"name": "b",
			"templated": true
		}],
		"self": {
			"href": "https://ws.blendle.com/user/bklein333/tile/item/bnl-filosofiemagazine-20160108-117256_filosofie_nacht"
		},
		"b:manifest": {
			"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/01/08/item/117256_filosofie_nacht/version/1/manifest.json"
		}
	},
	"_embedded": {
		"b:manifest": {
			"format_version": 5,
			"id": "bnl-filosofiemagazine-20160108-117256_filosofie_nacht",
			"date": "2016-01-08T00:00:00+00:00",
			"provider": {
				"id": "filosofiemagazine"
			},
			"body": [{
				"type": "hl1",
				"content": "Filosofie Nacht"
			},
			{
				"type": "intro",
				"content": "Grenzen worden voortdurend overschreden en tegelijkertijd hebben we ze nodig. De Filosofie Nacht gaat dit jaar over de betekenis van grenzen."
			},
			{
				"type": "byline",
				"content": "AUTEUR LEON HEUTS"
			},
			{
				"type": "p",
				"content": "De wereld lijkt soms grenzeloos. In de virtuele wereld van sociale media en cloudwerken hebben we contact met iedereen en op elk moment, op de mondiale markt flitst kapitaal heen en weer, verre landen als Japan en Chili zijn populaire vakantiebestemmingen, we worden alsmaar ouder en blijven langer jong. Tegelijkertijd worden we juist meer met grenzen geconfronteerd dan ooit. We weten ons geen raad met vluchtelingen die onze grenzen oversteken, de Europese solidariteit staat onder…"
			}],
			"images": [],
			"length": {
				"words": 304
			},
			"item_index": 6,
			"issue": {
				"id": "bnl-filosofiemagazine-20160108"
			},
			"_links": {
				"self": {
					"href": "https://static.blendle.nl/publication/filosofiemagazine/2016/01/08/item/117256_filosofie_nacht/version/1/manifest.json"
				}
			}
		}
	},
	"pinned": false,
	"opened": false,
	"post_count": 0,
	"refundable": false,
	"price": 25,
	"currency": "EUR",
	"item_purchased": false,
	"issue_purchased": false
}
     */
