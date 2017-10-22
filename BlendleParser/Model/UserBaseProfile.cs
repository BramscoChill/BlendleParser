using System;
using System.Collections.Generic;
using BlendleParser.Helpers;
using Newtonsoft.Json;
using RestSharp.Serializers;

namespace BlendleParser.Model
{
    public class Self
    {
        public string href { get; set; }
    }

    public class Avatar
    {
        public string href { get; set; }
    }

    public class Posts
    {
        public string href { get; set; }
    }

    public class Reads
    {
        public string href { get; set; }
    }

    public class Followers
    {
        public string href { get; set; }
    }

    public class Follows
    {
        public string href { get; set; }
    }

    public class Private
    {
        public string href { get; set; }
    }

    public class PremiumSubscription
    {
        public string href { get; set; }
    }

    public class PaperSubscription
    {
        public string href { get; set; }
    }

    public class LargeAvatar
    {
        public string href { get; set; }
    }

    public class User_Links
    {
        public Self self { get; set; }
        public Avatar avatar { get; set; }
        public Posts posts { get; set; }
        public Reads reads { get; set; }
        public Followers followers { get; set; }
        public Follows follows { get; set; }
        public Private @private { get; set; }
        [JsonProperty("premium-subscription")]
        public PremiumSubscription premiumsubscription{ get; set; }
        [JsonProperty("paper-subscription ")]
        public PaperSubscription papersubscription { get; set; }
        public LargeAvatar large_avatar { get; set; }
    }

    public class Preferences
    {
        public string last_bank { get; set; }
        public string did_onboarding { get; set; }
        public string last_payment_method { get; set; }
        public string did_premium_onboarding { get; set; }
        public string hide_acquire_issue_tooltip { get; set; }
        public string did_dismiss_premium_launch_dialog { get; set; }
        public string did_dismiss_non_premium_timeline_dialog { get; set; }
    }

    public class User
    {
        public string id { get; set; }
        public string username { get; set; }
        public string first_name { get; set; }
        public object middle_name { get; set; }
        public object last_name { get; set; }
        public string full_name { get; set; }
        public string short_name { get; set; }
        public User_Links _links { get; set; }
        public int posts { get; set; }
        public int followers { get; set; }
        public int follows { get; set; }
        public DateTime trending_viewed_at { get; set; }
        public object facebook_id { get; set; }
        public object twitter_id { get; set; }
        public object twitter_username { get; set; }
        public string country { get; set; }
        public List<string> languages { get; set; }
        public string primary_language { get; set; }
        public string time_zone { get; set; }
        public string text { get; set; }
        public bool digest_opt_out { get; set; }
        public bool alerts_opt_out { get; set; }
        public bool followers_opt_out { get; set; }
        public bool new_edition_opt_out { get; set; }
        public bool read_later_opt_out { get; set; }
        public bool tips_opt_out { get; set; }
        public bool friend_signup_opt_out { get; set; }
        public bool weekly_digest_opt_out { get; set; }
        public bool magazine_digest_opt_out { get; set; }
        public bool marketing_opt_out { get; set; }
        public bool announcements_opt_out { get; set; }
        public bool survey_opt_out { get; set; }
        public bool trial_upsell_opt_out { get; set; }
        public bool ad_retargeting_opt_out { get; set; }
        public bool publisher_hashed_email_share_opt_out { get; set; }
        public bool mixpanel_opt_out { get; set; }
        public bool master_opt_out { get; set; }
        public Preferences preferences { get; set; }
        public string email { get; set; }
        public int reads { get; set; }
        public bool has_password { get; set; }
        public int pins { get; set; }
        public int orders { get; set; }
        public bool freeloader { get; set; }
        public bool verified { get; set; }
        public bool email_confirmed { get; set; }
        public string currency { get; set; }
        public string balance { get; set; }
        public bool automatic_topup_on_low_balance { get; set; }
        public bool providers_opt_in { get; set; }
        public string tracking_uid { get; set; }
        public string uuid { get; set; }
        public List<string> active_subscriptions { get; set; }
    }

    public class Embedded
    {
        public User user { get; set; }
    }

    public class UserBaseProfile
    {
        public Embedded _embedded { get; set; }
        public string refresh_token { get; set; }
        public string jwt { get; set; }

        public bool IsValid()
        {
            return _embedded != null && _embedded.user != null && _embedded.user.email.IsNullOrEmpty() == false &&
                   _embedded.user.active_subscriptions != null && _embedded.user.active_subscriptions.Count > 0 
                && _embedded.user.id.IsNullOrEmpty() == false && _embedded.user.username.IsNullOrEmpty() == false
                && jwt.IsNullOrEmpty() == false;
        }
    }

    /*
     {
	"_embedded": {
		"user": {
			"id": "barrybutser432",
			"username": "safdfsad",
			"first_name": "gggfg",
			"middle_name": null,
			"last_name": null,
			"full_name": "jjff",
			"short_name": "htgtyf",
			"_links": {
				"self": {
					"href": "https://ws-no-zoom.blendle.com/user/barrybutser432"
				},
				"avatar": {
					"href": "https://static.blendle.nl/avatar/barrybutser432/thumbnail_image.jpg?t=1506689729"
				},
				"posts": {
					"href": "https://ws-no-zoom.blendle.com/user/barrybutser432/posts"
				},
				"reads": {
					"href": "https://ws-no-zoom.blendle.com/user/barrybutser432/items"
				},
				"followers": {
					"href": "https://ws-no-zoom.blendle.com/user/barrybutser432/followers"
				},
				"follows": {
					"href": "https://ws-no-zoom.blendle.com/user/barrybutser432/follows"
				},
				"private": {
					"href": "https://ws-no-zoom.blendle.com/user/barrybutser432/private"
				},
				"premium-subscription": {
					"href": "https://subscription.blendle.com/user/barrybutser432/provider_subscription/blendlepremium/latest"
				},
				"paper-subscription": {
					"href": "https://subscription.blendle.com/user/barrybutser432/provider_subscription/paper/latest"
				},
				"large_avatar": {
					"href": "https://static.blendle.nl/avatar/barrybutser432/image.jpg?t=1506689729"
				}
			},
			"posts": 10,
			"followers": 0,
			"follows": 9,
			"trending_viewed_at": "2017-08-25T14:07:17+00:00",
			"facebook_id": null,
			"twitter_id": null,
			"twitter_username": null,
			"country": "NL",
			"languages": ["nl_NL",
			"nl_BE",
			"en_US",
			"en_GB"],
			"primary_language": "nl_NL",
			"time_zone": "Europe/Amsterdam",
			"text": "",
			"digest_opt_out": false,
			"alerts_opt_out": false,
			"followers_opt_out": false,
			"new_edition_opt_out": true,
			"read_later_opt_out": false,
			"tips_opt_out": false,
			"friend_signup_opt_out": false,
			"weekly_digest_opt_out": false,
			"magazine_digest_opt_out": false,
			"marketing_opt_out": false,
			"announcements_opt_out": false,
			"survey_opt_out": false,
			"trial_upsell_opt_out": false,
			"ad_retargeting_opt_out": false,
			"publisher_hashed_email_share_opt_out": false,
			"mixpanel_opt_out": false,
			"master_opt_out": false,
			"preferences": {
				"last_bank": "0721",
				"did_onboarding": "true",
				"last_payment_method": "ideal",
				"did_premium_onboarding": "true",
				"hide_acquire_issue_tooltip": "1",
				"did_dismiss_premium_launch_dialog": "true",
				"did_dismiss_non_premium_timeline_dialog": "true"
			},
			"email": "afsdfsdaafsd@gmail.com",
			"reads": 2241,
			"has_password": true,
			"pins": 1,
			"orders": 2,
			"freeloader": false,
			"verified": false,
			"email_confirmed": true,
			"currency": "EUR",
			"balance": "7.18",
			"automatic_topup_on_low_balance": true,
			"providers_opt_in": false,
			"tracking_uid": "fe726113-b2de-41cd-8c94-c30ef0e7ac90",
			"uuid": "fe726113-b2de-41cd-8c94-c30ef0e7ac90",
			"active_subscriptions": ["filosofiemagazine",
			"psychologie"]
		}
	},
	"refresh_token": "nkPhFSDAAFSAFDSGtHRHhnhdiusiuhiusddsrSZaem",
	"jwt": "eyJ0eXAiOiJKV1QiLCJhbGSFDAFASDASFD1NiJ9.eyJleHAiOjE1MDY4NzAxMzcsInN1YiI6ImxvZ2luIiwidXNlcl91dWlkIjoiNjcxSFDFASDAFSDAFSDCI6ImJrbGVpbjMzMyJ9.aFNybUQucyOOEbIkkPukcQuDlUXoYNuc92ERH-QhFSDAFASDFSDqtQ8r3ra2PIrT8dGVL67fA"
}
     */
}