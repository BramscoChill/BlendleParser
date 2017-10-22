using System.Collections.Generic;
using Newtonsoft.Json;
using RestSharp.Serializers;

namespace BlendleParser.Model
{
    public class BIssueAcquisition
    {
        public string href { get; set; }
    }

    public class BWallet
    {
        public string href { get; set; }
    }

    public class Cury
    {
        public string name { get; set; }
        public string href { get; set; }
        public bool templated { get; set; }
    }

    public class ItemAcquisitionReceipt_Links
    {
        public Self self { get; set; }
        [JsonProperty("b:issue-acquisition")]
        public BIssueAcquisition issueacquisition { get; set; }
        [JsonProperty("b:wallet")]
        public BWallet wallet { get; set; }
        public List<Cury> curies { get; set; }
    }

    public class ItemAcquisitionReceipt
    {
        public string currency { get; set; }
        public string price { get; set; }
        public bool acquired { get; set; }
        public bool acquirable { get; set; }
        public bool subscription { get; set; }
        public bool refundable { get; set; }
        public bool opened { get; set; }
        public string purchase_origin { get; set; }
        public ItemAcquisitionReceipt_Links _links { get; set; }
    }
}

/*
 {
	"currency": "EUR",
	"price": "0.29",
	"acquired": true,
	"acquirable": true,
	"subscription": true,
	"refundable": false,
	"opened": true,
	"purchase_origin": "subscription",
	"_links": {
		"self": {
			"href": "https://ws.blendle.com/item/bnl-psychologie-20170914-cab182b99ab/acquisition"
		},
		"b:issue-acquisition": {
			"href": "https://ws.blendle.com/issue/bnl-psychologie-20170914/acquisition"
		},
		"b:wallet": {
			"href": "https://ws.blendle.com/user/bklein333/wallet"
		},
		"curies": [{
			"name": "b",
			"href": "https://api.blendle.com/rel/{rel}",
			"templated": true
		}]
	}
}
     */
