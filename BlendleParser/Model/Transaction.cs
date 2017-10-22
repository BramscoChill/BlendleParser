using System;
using System.Net;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using BlendleParser.Helpers;
using Newtonsoft.Json;
namespace BlendleParser.Model
{

    public partial class TransactionCollection
    {
        [JsonProperty("_embedded")]
        public TransactionList Embedded { get; set; }

        [JsonProperty("_links")]
        public TA_OtherOtherOtherOtherOtherOtherOtherLinks Links { get; set; }

        public bool ContainsTransactions()
        {
            return Embedded != null && Embedded.Transactions != null && Embedded.Transactions.Any();
        }
    }

    public partial class TransactionList
    {
        [JsonProperty("transactions")]
        public List<Transaction> Transactions { get; set; }
    }

    public partial class Transaction
    {
        [JsonProperty("amount")]
        public string Amount { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("_embedded")]
        public TA_OtherEmbedded Embedded { get; set; }

        [JsonProperty("created_at")]
        public DateTime CreatedAt { get; set; }

        [ScriptIgnore]
        public DateTime CreatedAtLocal { get { return CreatedAt.ToLocalTime(); }}

        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [ScriptIgnore]
        public Constants.TransactionType TransactionType
        {
            get
            {
                if (Type.Equals("purchase", StringComparison.OrdinalIgnoreCase))
                {
                    return Constants.TransactionType.Purchase;
                } else if (Type.Equals("refund", StringComparison.OrdinalIgnoreCase))
                {
                    return Constants.TransactionType.Refund;
                } else if (Type.Equals("auto-refund", StringComparison.OrdinalIgnoreCase))
                {
                    return Constants.TransactionType.AutoRefund;
                } else if (Type.Equals("adyen-deposit", StringComparison.OrdinalIgnoreCase))
                {
                    return Constants.TransactionType.AdyenDeposit;
                }
                else
                {
                    return Constants.TransactionType.UNKOWN;
                }
            }
        }

        public bool IsValid()
        {
            return Embedded != null && Id > 0 && Amount.IsNullOrEmpty() == false && CreatedAt > DateTime.MinValue
                && (Embedded.Item != null || Embedded.PayItem != null);
        }

        public static DateTime? GetLaterstTransactionDateFromDisk()
        {
            DateTime? highestDateTime = null;

            string looseIssuesDir = GeneralUtils.CheckTransactionsDir();
            //get highest year dir
            string[] yearDirectories = Directory.GetDirectories(looseIssuesDir);
            if (yearDirectories != null && yearDirectories.Any())
            {
                List<int> yearDirectoriesInt = new List<int>();
                foreach (string strYearFullPath in yearDirectories)
                {
                    string strYear = Path.GetFileName(strYearFullPath);
                    int intYear;
                    if (int.TryParse(strYear, out intYear))
                    {
                        yearDirectoriesInt.Add(intYear);
                    }
                }
                if (yearDirectoriesInt.Any())
                {
                    string highestYear = yearDirectoriesInt.Max().ToString();
                    //get highest month dir
                    string[] monthDirectories = Directory.GetDirectories(Path.Combine(looseIssuesDir, highestYear));
                    if (monthDirectories != null && monthDirectories.Any())
                    {
                        List<int> monthDirectoriesInt = new List<int>();
                        foreach (string strMonthFullPath in monthDirectories)
                        {
                            string strMonth = Path.GetFileName(strMonthFullPath);
                            int intMonth;
                            if (int.TryParse(strMonth, out intMonth))
                            {
                                monthDirectoriesInt.Add(intMonth);
                            }
                        }
                        if (monthDirectoriesInt.Any())
                        {
                            string highestMonth = monthDirectoriesInt.Max().ToString();
                            //get all transactions from that dir and get the one with the highest date
                            //filenames must start with transaction
                            string[] allTransactionFiles = Directory.GetFiles(Path.Combine(looseIssuesDir, highestYear, highestMonth), "transaction*.json");
                            try
                            {
                                foreach (string fileFullPath in allTransactionFiles)
                                {
                                    var transaction = GeneralUtils.Load<Transaction>(fileFullPath);
                                    if (transaction != null && transaction.IsValid())
                                    {
                                        if (highestDateTime == null || transaction.CreatedAtLocal > highestDateTime.Value)
                                        {
                                            highestDateTime = transaction.CreatedAtLocal;
                                        }
                                    }
                                    else
                                    {
                                        return null;
                                    }
                                }
                            }
                            catch
                            {
                                return null;
                            }
                        }
                    }
                }
            }
            return highestDateTime;
        }
        public static List<Transaction> GetAllTransactions()
        {
            List<Transaction> result = new List<Transaction>();

            string looseIssuesDir = GeneralUtils.CheckTransactionsDir();
            //get highest year dir
            string[] yearDirectories = Directory.GetDirectories(looseIssuesDir);
            if (yearDirectories != null && yearDirectories.Any())
            {
                foreach (string strYear in yearDirectories)
                {
                    //get highest month dir
                    string[] monthDirectories = Directory.GetDirectories(Path.Combine(looseIssuesDir, strYear));
                    if (monthDirectories != null && monthDirectories.Any())
                    {
                        foreach (string strMonth in monthDirectories)
                        {
                            //get all transactions from that dir and get the one with the highest date
                            string[] allTransactionFiles = Directory.GetFiles(Path.Combine(looseIssuesDir, strMonth), "transaction*.json");
                            try
                            {
                                foreach (string file in allTransactionFiles)
                                {
                                    var transaction = GeneralUtils.Load<Transaction>(file);
                                    if (transaction != null && transaction.IsValid())
                                    {
                                        result.Add(transaction);
                                    }
                                }
                            }
                            catch
                            {
                                return null;
                            }
                        }
                    }
                }
            }
            return result;
        }
        public string GetPath()
        {
            string dir = System.IO.Path.Combine(Constants.DEFAULT_DATA_LOOSE_ISSUES,  CreatedAt.Year.ToString(), CreatedAt.Month.ToString());
            if (Directory.Exists(dir) == false)
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }
        public string GetFullPath()
        {
            return System.IO.Path.Combine(GetPath(), GetFileName());
        }
        public string GetFileName()
        {
            string itemId = GetItemId();
            if (itemId != null)
            {
                return $"transaction-{itemId}.json";
            }

            return null;
        }
        public string GetItemId()
        {
            if (Embedded != null && Embedded.Item != null)
            {
                return Embedded.Item.Id;
            }
            else if (Embedded != null && Embedded.PayItem != null)
            {
                return Embedded.PayItem.Uid;
            }
            else
            {
                return Id.ToString();
            }
            return null;
        }
    }

    public partial class TA_OtherEmbedded
    {
        [JsonProperty("item")]
        public TA_Item Item { get; set; }

        [JsonProperty("pay_item")]
        public TA_PayItem PayItem { get; set; }
    }

    public partial class TA_Item
    {
        [JsonProperty("_links")]
        public TA_OtherOtherOtherOtherLinks Links { get; set; }

        [JsonProperty("_embedded")]
        public TA_OtherOtherEmbedded Embedded { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("posts")]
        public long Posts { get; set; }

        public bool IsValid()
        {
            return Embedded != null && Embedded.TaManifest != null && Embedded.TaManifest.Body != null &&
                   Embedded.TaManifest.Body.Count > 0;
        }
    }

    public partial class TA_OtherOtherOtherOtherLinks
    {
        [JsonProperty("self")]
        public TA_OtherBMediaSet Self { get; set; }

        [JsonProperty("item_content")]
        public TA_OtherBMediaSet ItemContent { get; set; }

        [JsonProperty("tier")]
        public TA_OtherBMediaSet Tier { get; set; }
    }

    public partial class TA_OtherBMediaSet
    {
        [JsonProperty("href")]
        public string Href { get; set; }
    }

    public partial class TA_OtherOtherEmbedded
    {
        [JsonProperty("manifest")]
        public TA_Manifest TaManifest { get; set; }
    }

    public partial class TA_Manifest
    {
        [JsonProperty("date")]
        public string Date { get; set; }

        [JsonProperty("included_media_set_types")]
        public List<string> IncludedMediaSetTypes { get; set; }

        [JsonProperty("_links")]
        public TA_OtherOtherLinks Links { get; set; }

        [JsonProperty("_embedded")]
        public TA_OtherOtherOtherEmbedded Embedded { get; set; }

        [JsonProperty("body")]
        public List<BA_Body> Body { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("format_version")]
        public long FormatVersion { get; set; }

        [JsonProperty("images")]
        public List<TA_Image> Images { get; set; }

        [JsonProperty("item_index")]
        public long ItemIndex { get; set; }

        [JsonProperty("provider")]
        public TA_TransactionIssue Provider { get; set; }

        [JsonProperty("issue")]
        public TA_TransactionIssue Issue { get; set; }

        [JsonProperty("length")]
        public TA_Length TaLength { get; set; }

        [JsonProperty("section")]
        public TA_Section TaSection { get; set; }
    }

    public partial class TA_OtherOtherLinks
    {
        [JsonProperty("b:media-set")]
        public TA_OtherBMediaSet BMediaSet { get; set; }

        [JsonProperty("self")]
        public TA_OtherBMediaSet Self { get; set; }
    }

    public partial class TA_OtherOtherOtherEmbedded
    {
        [JsonProperty("b:media-set")]
        public TA_BMediaSet BMediaSet { get; set; }
    }

    public partial class TA_BMediaSet
    {
        [JsonProperty("_links")]
        public TA_OtherLinks Links { get; set; }

        [JsonProperty("credit")]
        public string Credit { get; set; }

        [JsonProperty("_embedded")]
        public TA_OtherOtherOtherOtherEmbedded Embedded { get; set; }

        [JsonProperty("caption")]
        public string Caption { get; set; }

        [JsonProperty("position")]
        public long? Position { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public partial class TA_OtherLinks
    {
        [JsonProperty("medium")]
        public TA_OtherBMediaSet Medium { get; set; }

        [JsonProperty("self")]
        public TA_OtherBMediaSet Self { get; set; }

        [JsonProperty("large")]
        public TA_OtherBMediaSet Large { get; set; }

        [JsonProperty("original")]
        public TA_OtherBMediaSet Original { get; set; }

        [JsonProperty("small")]
        public TA_OtherBMediaSet Small { get; set; }
    }

    public partial class TA_OtherOtherOtherOtherEmbedded
    {
        [JsonProperty("medium")]
        public TA_Large Medium { get; set; }

        [JsonProperty("large")]
        public TA_Large Large { get; set; }

        [JsonProperty("original")]
        public TA_Large Original { get; set; }

        [JsonProperty("small")]
        public TA_Large Small { get; set; }
    }

    public partial class TA_Large
    {
        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("_links")]
        public TA_Links Links { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }
    }

    public partial class TA_Links
    {
        [JsonProperty("file")]
        public TA_OtherBMediaSet File { get; set; }

        [JsonProperty("self")]
        public TA_OtherBMediaSet Self { get; set; }
    }

    public partial class TA_Image
    {
        [JsonProperty("caption")]
        public string Caption { get; set; }

        [JsonProperty("_links")]
        public TA_OtherOtherOtherLinks Links { get; set; }

        [JsonProperty("credit")]
        public string Credit { get; set; }

        [JsonProperty("featured")]
        public bool Featured { get; set; }
    }

    public partial class TA_OtherOtherOtherLinks
    {
        [JsonProperty("medium")]
        public TA_OtherLarge Medium { get; set; }

        [JsonProperty("large")]
        public TA_OtherLarge Large { get; set; }

        [JsonProperty("original")]
        public TA_OtherLarge Original { get; set; }

        [JsonProperty("small")]
        public TA_OtherLarge Small { get; set; }
    }

    public partial class TA_OtherLarge
    {
        [JsonProperty("href")]
        public string Href { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }
    }

    public partial class TA_TransactionIssue
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }

    public partial class TA_Length
    {
        [JsonProperty("words")]
        public long Words { get; set; }
    }

    public partial class TA_Section
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("pages_index")]
        public long PagesIndex { get; set; }
    }

    public partial class TA_PayItem
    {
        [JsonProperty("_links")]
        public TA_OtherOtherOtherOtherOtherOtherLinks Links { get; set; }

        [JsonProperty("_embedded")]
        public OtherOtherOtherOtherOtherEmbedded Embedded { get; set; }

        [JsonProperty("uid")]
        public string Uid { get; set; }
    }

    public partial class TA_OtherOtherOtherOtherOtherOtherLinks
    {
        [JsonProperty("b:metadata")]
        public TA_OtherBMediaSet BMetadata { get; set; }

        [JsonProperty("self")]
        public TA_OtherBMediaSet Self { get; set; }
    }

    public partial class OtherOtherOtherOtherOtherEmbedded
    {
        [JsonProperty("b:metadata")]
        public TA_BMetadata BMetadata { get; set; }
    }

    public partial class TA_BMetadata
    {
        [JsonProperty("publication_date")]
        public string PublicationDate { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("_links")]
        public TA_OtherOtherOtherOtherOtherLinks Links { get; set; }

        [JsonProperty("foreign_uid")]
        public string ForeignUid { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("words")]
        public long Words { get; set; }
    }

    public partial class TA_OtherOtherOtherOtherOtherLinks
    {
        [JsonProperty("origin")]
        public TA_OtherBMediaSet Origin { get; set; }

        [JsonProperty("item")]
        public TA_OtherBMediaSet Item { get; set; }

        [JsonProperty("self")]
        public TA_OtherBMediaSet Self { get; set; }
    }

    public partial class TA_OtherOtherOtherOtherOtherOtherOtherLinks
    {
        [JsonProperty("prev")]
        public TA_Prev Prev { get; set; }

        [JsonProperty("next")]
        public TA_OtherBMediaSet Next { get; set; }

        [JsonProperty("self")]
        public TA_OtherBMediaSet Self { get; set; }
    }

    public partial class TA_Prev
    {
        [JsonProperty("href")]
        public object Href { get; set; }
    }
}