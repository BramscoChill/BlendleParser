using System;
using System.Collections.Generic;

namespace BlendleParser.Model
{
    public class ItemPaymentInfo_Self
    {
        public string href { get; set; }
    }

    public class ItemPaymentInfo_ItemContent
    {
        public string href { get; set; }
    }

    public class ItemPaymentInfo_Tier
    {
        public string href { get; set; }
    }

    public class ItemPaymentInfo_Mlt
    {
        public string href { get; set; }
    }

    public class ItemPaymentInfo_UserItems
    {
        public string href { get; set; }
    }

    public class ItemPaymentInfo_Links
    {
        public Self self { get; set; }
        public ItemPaymentInfo_ItemContent item_content { get; set; }
        public ItemPaymentInfo_Tier tier { get; set; }
        public ItemPaymentInfo_Mlt mlt { get; set; }
        public ItemPaymentInfo_UserItems user_items { get; set; }
    }

    public class ItemPaymentInfo_Provider
    {
        public string id { get; set; }
    }

    public class ItemPaymentInfo_Body
    {
        public string type { get; set; }
        public string content { get; set; }
    }

    public class ItemPaymentInfo_Length
    {
        public int words { get; set; }
    }

    public class ItemPaymentInfo_Issue
    {
        public string id { get; set; }
    }

    public class ItemPaymentInfo_Self2
    {
        public string href { get; set; }
    }

    public class ItemPaymentInfo_Links2
    {
        public ItemPaymentInfo_Self2 self { get; set; }
    }

    public class ItemPaymentInfo_Manifest
    {
        public int format_version { get; set; }
        public string id { get; set; }
        public DateTime date { get; set; }
        public ItemPaymentInfo_Provider provider { get; set; }
        public List<ItemPaymentInfo_Body> body { get; set; }
        public List<object> images { get; set; }
        public ItemPaymentInfo_Length length { get; set; }
        public int item_index { get; set; }
        public ItemPaymentInfo_Issue issue { get; set; }
        public ItemPaymentInfo_Links2 _links { get; set; }
    }

    public class ItemPaymentInfo_Embedded
    {
        public ItemPaymentInfo_Manifest manifest { get; set; }
    }

    public class ItemPaymentInfo
    {
        public ItemPaymentInfo_Links _links { get; set; }
        public ItemPaymentInfo_Embedded _embedded { get; set; }
        public string id { get; set; }
        public int posts { get; set; }
        public bool acquired { get; set; }
        public bool acquirable { get; set; }
        public bool pinned { get; set; }
        public bool subscription { get; set; }
        public bool refundable { get; set; }
        public string currency { get; set; }
        public string price { get; set; }
    }


    /*
     {
	"_links": {
		"self": {
			"href": "https://ws.blendle.com/item/bnl-filosofiemagazine-20160108-117256_filosofie_nacht"
		},
		"item_content": {
			"href": "https://ws.blendle.com/item/bnl-filosofiemagazine-20160108-117256_filosofie_nacht/content"
		},
		"tier": {
			"href": "https://ws.blendle.com/tier/tier06"
		},
		"mlt": {
			"href": "https://ws.blendle.com/item/bnl-filosofiemagazine-20160108-117256_filosofie_nacht/mlt"
		},
		"user_items": {
			"href": "https://ws.blendle.com/user/bklein333/items"
		}
	},
	"_embedded": {
		"manifest": {
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
	"id": "bnl-filosofiemagazine-20160108-117256_filosofie_nacht",
	"posts": 0,
	"acquired": false,
	"acquirable": true,
	"pinned": false,
	"subscription": true,
	"refundable": false,
	"currency": "EUR",
	"price": "0.25"
}
     */
}