using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using BlendleParser.Helpers;
using BlendleParser.Model;
using Newtonsoft.Json;
using RestSharp;

namespace BlendleParser.Core
{
    public delegate void LogEvent(string textLine);

    public class BlendleParser
    {
        private BlendleClient client;
        
        public LogEvent LogEventHandler;

        private bool saveLog;

        public bool SaveLog
        {
            get => saveLog;
            set => saveLog = value;
        }
        private readonly object CancelLocker = new object();
        private volatile bool _cancel;
        public bool Cancel
        {
            get
            {
                lock (CancelLocker)
                {
                    return _cancel;
                }
            }
            set
            {
                lock (CancelLocker)
                {
                    _cancel = value;
                }
            }
        }

        public BlendleParser()
        {
            client = new BlendleClient();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="downloadAllItems">Only at BlendleItem level, download all those items with their images, takes a while</param>
        /// <param name="forceReDownload">redownload all items if they exist on disk</param>
        /// <returns></returns>
        public Result<List<FullMagazine>> GetAllMagazines(bool downloadAllItems, bool forceReDownload)
        {
            //we assume it is gonne be allright
            Result<List<FullMagazine>> result = new Result<List<FullMagazine>> () { Succeeded = true, Data = new List<FullMagazine>()};

            if (Configuration.Instance.UserBaseProfile.IsValid())
            {
                WriteToLog("MAIN - UserBaseProfile is valid", ref result);
                string[] allMagazines = Configuration.Instance.UserBaseProfile._embedded.user.active_subscriptions.ToArray();
                if (allMagazines.Length > 0)
                {
                    WriteToLog("MAIN - there are magazines to fetch", ref result);
                    GeneralUtils.CheckDataDir();
                    foreach (string magazine in allMagazines)
                    {
                        if (this.Cancel)
                        {
                            result.Message = "Canceled task";
                            return result;
                        }

                        Result<FullMagazine> getMagazineResult = GetMagazine(magazine, downloadAllItems, forceReDownload);
                        result.MergeResult(getMagazineResult);

                        if (getMagazineResult.Succeeded && getMagazineResult.Data.IsValid() == false)
                        {
                            getMagazineResult.Succeeded = false;
                            WriteToLog($"ERROR - MAGAZINE - :'{magazine}' - getMagazineResult.Data.IsValid() is invalid", ref result);
                            return result;
                        }
                        else
                        {
                            result.Data.Add(getMagazineResult.Data);
                        }
                    }
                }
                else
                {
                    result.Message = "ERROR - MAIN - No magazines to fetch - allMagazines";
                    WriteToLog(result.Message, ref result);
                    result.Succeeded = false;
                }
            }
            else
            {
                result.Message = "ERROR - MAIN - Failled to get the user base profile and tokens";
                WriteToLog(result.Message, ref result);
                result.Succeeded = false;
            }

            //write log
            if (result.Logs.Any() && saveLog)
            {
                GeneralUtils.CheckDataDir();
                var @now = DateTime.Now;
                string logFullPath = Path.Combine(Constants.DEFAULT_DATA_FULLPATH, "log_" + now.ToString("ddMMyyyHHmmss") + now.Millisecond.ToString() + ".txt");
                File.WriteAllLines(logFullPath, result.Logs);
            }
            
            return result;
        }

        public Result Login(string username, string password)
        {
            Result result = new Result() {Succeeded = true};

            if (Configuration.Instance.UserBaseProfile.IsValid() == false)
            {
                WriteToLog("UserBaseProfile is not valid", ref result);
                if (username.IsNullOrEmpty() == false && password.IsNullOrEmpty() == false)
                {
                    var baseProfileResult = client.GetBaseProfile(username, password);
                    if (baseProfileResult.Succeeded == false)
                    {
                        result.Message = "UserBaseProfile fetching failled (invalid username pwd?): " + baseProfileResult.Message;
                        WriteToLog(result.Message, ref result);

                        Configuration.Instance.UserBaseProfile = new UserBaseProfile();
                        Configuration.Instance.Save();
                    }
                }
                else
                {
                    result.Message = "Please provide an username and password!";
                    result.Succeeded = false;
                    WriteToLog(result.Message, ref result);
                }
            }
            else
            {
                var refreshTokenResult = client.RefreshToken();
                if (refreshTokenResult.Succeeded == false)
                {
                    result.Message = "UserBaseProfile is invalid, refresh token failled, please relogin!";
                    result.Succeeded = false;
                    WriteToLog(result.Message, ref result);
                    Configuration.Instance.UserBaseProfile = new UserBaseProfile();
                    Configuration.Instance.Save();
                }
            }

            return result;
        }

        #region magazine data fetching
        public Result<FullMagazine> GetMagazine(string magazine, bool downloadAllItems, bool forceReDownload)
        {
            Result<FullMagazine> result = new Result<FullMagazine>() {Data = new FullMagazine()};
            result.Data.Name = magazine;

            Result<AllYearsMagazine> magazineResult = FetchYearsMagazine(magazine, downloadAllItems, forceReDownload);
            if (magazineResult.Succeeded)
            {
                WriteToLog(string.Format("MAIN - Fetching magazine: '{0}' has succeeded, procceeding!", magazine), ref result);
                if (magazineResult.Logs.Any())
                {
                    result.Logs.AddRange(magazineResult.Logs);
                }
                result.Data.AllYearsMagazine = magazineResult.Data;
                result.Succeeded = true;
            }
            else
            {
                WriteToLog(string.Format("ERROR - MAIN - Fetching magazine: '{0}' has FAILLED, aboorting!", magazine), ref result);
                result.MergeResult(magazineResult);
            }

            return result;
        }
        public Result<AllYearsMagazine> FetchYearsMagazine(string magazine, bool downloadAllItems, bool forceReDownload)
        {
            //we assume it is gonne be allright
            Result<AllYearsMagazine> result = new Result<AllYearsMagazine>() { Succeeded = true };
            string fullPath = AllYearsMagazine.GetFullPath(magazine);

            AllYearsMagazine allYearsMagazine = null;
            if (forceReDownload || File.Exists(fullPath) == false)
            {
                //get the years file if not exists
                Result<AllYearsMagazine> allYearsMagazineResult = client.GetAllYearsMagazine(magazine);
                if (allYearsMagazineResult.Succeeded && allYearsMagazineResult.Data != null)
                {
                    allYearsMagazine = allYearsMagazineResult.Data;
                    GeneralUtils.Save<AllYearsMagazine>(allYearsMagazine, fullPath);
                }
            }
            else
            {
                allYearsMagazine = GeneralUtils.Load<AllYearsMagazine>(fullPath);
            }

            //validates al lthe years
            if (allYearsMagazine != null && allYearsMagazine.IsValid())
            {
                //get latest year first
                allYearsMagazine._links.years = allYearsMagazine._links.years.OrderByDescending(y => y.title).ToList();

                for (var i = 0; i < allYearsMagazine._links.years.Count; i++)
                {
                    AllYearsMagazine_Year magazineYear = allYearsMagazine._links.years[i];

                    if (this.Cancel)
                    {
                        result.Message = "Canceled task";
                        return result;
                    }

                    int year = Convert.ToInt32(magazineYear.title);
                    Result<AllMagazinesInYear> magazineResult = FetchMonthsMagazine(magazine, year, downloadAllItems, forceReDownload);
                    if (magazineResult.Succeeded)
                    {
                        WriteToLog(string.Format("YEAR - Fetching magazine: '{0}', year {1} has succeeded, procceeding!", magazine, year), ref result);
                        if (magazineResult.Logs.Any())
                        {
                            result.Logs.AddRange(magazineResult.Logs);
                        }
                        allYearsMagazine._links.years[i].AllMagazinesInYear = magazineResult.Data;
                    }
                    else
                    {
                        result.MergeResult(magazineResult);
                        WriteToLog(string.Format("ERROR - YEAR - Fetching magazine: '{0}', year {1} has FAILLED, aboorting!", magazine, year), ref result);
                        return result;
                    }
                }
            }
            else
            {
                result.Message = "ERROR - YEAR - Failled to get the AllYearsMagazine";
                WriteToLog(result.Message, ref result);
                result.Succeeded = false;
            }
            result.Data = allYearsMagazine;
            return result;
        }
        public Result<AllMagazinesInYear> FetchMonthsMagazine(string magazine, int year, bool downloadAllItems, bool forceReDownload)
        {
            //we assume it is gonne be allright
            Result<AllMagazinesInYear> result = new Result<AllMagazinesInYear>() { Succeeded = true };
            string fullPath = AllMagazinesInYear.GetFullPath(magazine, year);

            AllMagazinesInYear allMagazinesInYear = null;
            if (forceReDownload || File.Exists(fullPath) == false)
            {
                Result<AllMagazinesInYear> allMagazinesInYearResult = client.GetAllMagazinesInYear(magazine, year);
                if (allMagazinesInYearResult.Succeeded && allMagazinesInYearResult.Data != null)
                {
                    allMagazinesInYear = allMagazinesInYearResult.Data;
                    GeneralUtils.Save<AllMagazinesInYear>(allMagazinesInYear, fullPath);
                    Console.WriteLine($"downloaded months file magazine:'{magazine}' - year:'{year}'");
                }
            }
            else
            {
                allMagazinesInYear = GeneralUtils.Load<AllMagazinesInYear>(fullPath);
            }

            if (allMagazinesInYear != null && allMagazinesInYear.IsValid())
            {
                //order by latest month first
                allMagazinesInYear._links.months = allMagazinesInYear._links.months.OrderByDescending(y => y.title).ToList();

                for (var i = 0; i < allMagazinesInYear._links.months.Count; i++)
                {
                    Month magazineMonth = allMagazinesInYear._links.months[i];

                    if (this.Cancel)
                    {
                        result.Message = "Canceled task";
                        return result;
                    }

                    int month = Convert.ToInt32(magazineMonth.title);
                    
                    Result<MagazineIssues> magazineResult = FetchIssuesMagazine(magazine, year, month, downloadAllItems, forceReDownload);
                    if (magazineResult.Succeeded)
                    {
                        string message = $"MONTH - Fetching magazine: '{magazine}', year {year}, month {month} has succeeded, procceeding!";
                        WriteToLog(message, ref result);
                        Console.WriteLine(message);
                        if (magazineResult.Logs.Any())
                        {
                            result.Logs.AddRange(magazineResult.Logs);
                        }
                        allMagazinesInYear._links.months[i].MagazineIssues = magazineResult.Data;
                    }
                    else
                    {
                        WriteToLog(string.Format("ERROR - MONTH - Fetching magazine: '{0}', year {1}, month {2} has FAILLED, aboorting!", magazine, year, month), ref result);
                        result.MergeResult(magazineResult);
                        return result;
                    }

                    //for each mont we want to ask if we abort
                    if (magazineResult.HasDownloadedItems)
                    {
//                        string continueResult;
//                        Console.WriteLine("");
//                        Console.Write("Want to abort (y/n): ");
//                        bool success = Reader.TryReadLine(out continueResult, 3000);
//                        if (success && (continueResult.Equals("y", StringComparison.OrdinalIgnoreCase) || continueResult.Equals("yes", StringComparison.OrdinalIgnoreCase)))
//                        {
//                            this.abortParser = true;
//                            Console.WriteLine("");
//                            Console.WriteLine("Aborted!");
//                        }
                    }
                }
            }
            else
            {
                result.Message = "ERROR - MONTH - Failled to get the AllYearsMagazine";
                WriteToLog(result.Message, ref result);
                result.Succeeded = false;
            }

            result.Data = allMagazinesInYear;
            return result;
        }
        public Result<MagazineIssues> FetchIssuesMagazine(string magazine, int year, int month, bool downloadAllItems, bool forceReDownload)
        {
            //we assume it is gonne be allright
            Result<MagazineIssues> result = new Result<MagazineIssues>() {Succeeded = true};
            string fullPath = MagazineIssues.GetFullPath(magazine, year, month, "json");

            MagazineIssues issuesMagazine = null;
            if (forceReDownload || File.Exists(fullPath) == false)
            {
                Result<MagazineIssues> allMagazinesInYearResult = client.GetAllIssuesInMagazine(magazine, year, month);
                if (allMagazinesInYearResult.Succeeded && allMagazinesInYearResult.Data != null)
                {
                    issuesMagazine = allMagazinesInYearResult.Data;
                    GeneralUtils.Save<MagazineIssues>(issuesMagazine, fullPath);
                }
            }
            else
            {
                issuesMagazine = GeneralUtils.Load<MagazineIssues>(fullPath);
            }

            if (issuesMagazine != null && issuesMagazine.IsValid())
            {
                //download the cover
                Result downloadCoverResult = DownloadCover(issuesMagazine, magazine, year, month, forceReDownload);
                if (downloadCoverResult.Succeeded)
                {
                    string message = $"MAGAZINE - Fetched cover of magazine: '{magazine}', year {year}, month {month}, has succeeded, procceeding!";
                    WriteToLog(message, ref result);
                }
                else
                {
                    string message = $"ERROR - MAGAZINE - Fetched cover of magazine: '{magazine}', year {year}, month {month}, has FAILLED, bud still procceeding!";
                    WriteToLog(message, ref result);
                }

                //if we only want to get the items json month files and not the items with the images
                if (downloadAllItems)
                {
                    for (var i = 0; i < issuesMagazine._embedded.issues.Count; i++)
                    {
                        if (this.Cancel)
                        {
                            result.Message = "Canceled task";
                            return result;
                        }

                        Issue magazineIssue = issuesMagazine._embedded.issues[i];
                        for (var j = 0; j < magazineIssue.items.Count; j++)
                        {
                            string articleId = magazineIssue.items[j];
                            Result<BlendleItem> articleResult = FetchItem(magazine, year, month, articleId, forceReDownload);
                            if (articleResult.Succeeded)
                            {
                                string message = $"MAGAZINE - Fetched article: '{magazine}', year {year}, month {month}, article id: {articleId} has succeeded, procceeding!";
                                WriteToLog(message, ref result);
                                //if atleast one of the items has been downloaded
                                if (articleResult.HasDownloadedItems)
                                {
                                    result.HasDownloadedItems = true;
                                }

                                Console.WriteLine(message);
                                if (articleResult.Logs.Any())
                                {
                                    result.Logs.AddRange(articleResult.Logs);
                                }
                                issuesMagazine._embedded.issues[i].FullItems.Add(articleResult.Data);
                            }
                            else
                            {
                                WriteToLog(string.Format("ERROR - MAGAZINE - Fetching article: '{0}', year {1}, month {2}, article id: {3} has FAILLED, aboorting!", magazine, year, month, articleId), ref result);
                                WriteToLog(string.Format("ERROR - MAGAZINE - EX: ex.ErrorType: '{0}',  has FAILLED, aboorting!", GeneralUtils.JsonObject(articleResult)), ref result);
                                result.MergeResult(articleResult);
                                return result;
                            }
                        }
                    }
                }
                else
                {
                    result.Message = "MAGAZINE - fetched, not downloading the item itself";
                    WriteToLog(result.Message, ref result);
                    result.Succeeded = true;
                }
            }
            else
            {
                result.Message = "ERROR - MAGAZINE - Failled to get the AllYearsMagazine";
                WriteToLog(result.Message, ref result);
                result.Succeeded = false;
            }
            result.Data = issuesMagazine;
            return result;
        }
        public Result<BlendleItem> FetchItem(string magazine, int year, int month, string articleId, bool forceReDownload)
        {
            string path = BlendleItem.GetMagazinePath(magazine, year, month);
            return FetchItem(path, articleId, forceReDownload);
        }
        public Result<BlendleItem> FetchItem(string folderLocationPath, string articleId, bool forceReDownload)
        {
            Result<BlendleItem> result = new Result<BlendleItem>() { Succeeded = false };
            string fullPath = Path.Combine(folderLocationPath, BlendleItem.GetFileName(articleId));

            if (forceReDownload || File.Exists(fullPath) == false)
            {
                Result<BlendleItem> articleResult = client.GetItem(articleId);
                //article fetched successfull
                if (articleResult.Succeeded && articleResult.Data != null)
                {
                    result.Data = articleResult.Data;
                    //saving it to disk
                    GeneralUtils.Save<BlendleItem>(result.Data, fullPath);
                    result.Succeeded = true;
                    result.HasDownloadedItems = true;
                }
                else
                {
                    if (articleResult.Succeeded == false && articleResult.Exception is BlendleBaseException)
                    {
                        //if the article can not be found, it can be fetched in another way
                        BlendleBaseException blendleException = articleResult.Exception as BlendleBaseException;
                        if (blendleException.StatusCode == HttpStatusCode.NotFound || blendleException.ErrorType == BlendleErrorType.NotFound)
                        {
                            //propably an extra link to an external resource
                            //the article is not saved on blendle, bud fetched via an separated API when loading the page
                            //we cannot get it

                            //WriteToLog($"could not get article: {articleId}. Article not present at blendle. has PayItem: {transaction.Embedded.PayItem != null}, will continue.", ref result);
                            WriteToLog($"could not get article: {articleId}. Article not present at blendle.", ref result);
                        }
                    }
                }
                result.MergeResult(articleResult);
            }
            else
            {
                result.Data = GeneralUtils.Load<BlendleItem>(fullPath);
                result.Succeeded = true;
                result.HasDownloadedItems = false;
                WriteToLog($"Article already downloaded, no redownload: {articleId}.", ref result);
            }

            //if the fetchin succeeded
            if (result.Succeeded)
            {
                result.Data.BaseLocationPath = folderLocationPath;
                //try fetch all article images
                Result imagesFetchResult = DownloadItemImages(result.Data, folderLocationPath, articleId, forceReDownload);
                if (imagesFetchResult.Succeeded)
                {
                    result.Succeeded = true;
                }
                else
                {
                    result.Succeeded = false;
                    WriteToLog($"ERROR - MAGAZINE IMAGES - Fetching article images - folderLocationPathL {folderLocationPath} , article id: {articleId} has FAILLED, aboorting!", ref result);
                }
                result.MergeResult(imagesFetchResult);
            }

            return result;
        }
        #endregion magazine data fetching

        #region magazine image fetching
        //we have images in the mediasets and in the items
        //in the mediasets they are displayed after the body index item
        //the items are displayed after the h1 title
        public Result DownloadItemImages(BlendleItem blendleItem, string folderLocationPath, string articleId, bool forceReDownload)
        {
            Result result = new Result();
            if (blendleItem.HasItems())
            {
                //the items are the subarticles whitin the article, they also have separated image links
                //items images
                foreach (var subItem in blendleItem._embedded.content._embedded.items)
                {
                    if (subItem.images != null && subItem.images.Count > 0)
                    {
                        foreach (var baImage in subItem.images)
                        {
                            BA_Links9Image bestImage = baImage._links.GetBestImage();
                            //get the path for this mont and add the image filename
                            string fullPath = bestImage.GetFullPath(folderLocationPath);

                            if (forceReDownload || File.Exists(fullPath) == false)
                            {
                                //try download the image from the url
                                bool downloadSucceeded = GeneralUtils.DownloadImage(bestImage.href, fullPath);
                                if (downloadSucceeded)
                                {
                                    WriteToLog($"MAGAZINE ITEM IMAGES - download succeeded: '{fullPath}'", ref result);
                                }
                                else
                                {
                                    WriteToLog($"ERROR - MAGAZINE ITEM IMAGES - download FAILLED: '{fullPath}'", ref result);
                                    result.Succeeded = false;
                                    return result;
                                }
                            }
                        }
                    }
                }
            }
            bool hasImages = false;

            //the main images of the article
            //mediaset images, mostly with position
            if (blendleItem.HasMediaSetImages())
            {
                //mediasets images
                foreach (var baImage in blendleItem._embedded.content._embedded.mediasets)
                {
                    if (baImage.IsValid())
                    {
                        hasImages = true;
                        //select the best image from small medium hight origional
                        BA_Original3 bestImage = baImage._embedded.GetBestImage();
                        //get the path for this mont and add the image filename
                        string fullPath = bestImage.GetFullPath(folderLocationPath);

                        if (forceReDownload || File.Exists(fullPath) == false)
                        {
                            //try download the image from the url
                            bool downloadSucceeded = GeneralUtils.DownloadImage(bestImage._links.file.href, fullPath);
                            if (downloadSucceeded)
                            {
                                WriteToLog($"MAGAZINE MEDIASETS IMAGES - download succeeded: '{fullPath}'", ref result);
                            }
                            else
                            {
                                WriteToLog($"ERROR - MAGAZINE MEDIASETS IMAGES - download FAILLED: '{fullPath}'", ref result);
                                result.Succeeded = false;
                                return result;
                            }
                        }
                    }
                    else
                    {
                        WriteToLog($"ERROR - MAGAZINE IMAGES - :'{articleId}' has an invalid image!", ref result);
                    }
                }
                result.Succeeded = true;
            }

            //weird shit, more images that dont have an palacement position, the logic where to place this is complex, it will be randomly placed in that article, good enough
            //it is somewhere in here: webpack:///./src/js/app/helpers/itemContent.js
            //not mediaset images, mostly without position
            if (blendleItem.HasNonMediaSetImages())
            {
                //mediasets images
                foreach (var image in blendleItem._embedded.content.images)
                {
                    if (image.IsValid())
                    {
                        hasImages = true;
                        //select the best image from small medium hight origional
                        var bestImage = image.GetBestImage();
                        //get the path for this mont and add the image filename
                        string fullPath = bestImage.GetFullPath(folderLocationPath);

                        if (forceReDownload || File.Exists(fullPath) == false)
                        {
                            //try download the image from the url
                            bool downloadSucceeded = GeneralUtils.DownloadImage(bestImage.href, fullPath);
                            if (downloadSucceeded)
                            {
                                WriteToLog($"MAGAZINE image IMAGES - download succeeded: '{fullPath}'", ref result);
                            }
                            else
                            {
                                WriteToLog($"ERROR - image MEDIASETS IMAGES - download FAILLED: '{fullPath}'", ref result);
                                result.Succeeded = false;
                                return result;
                            }
                        }
                    }
                    else
                    {
                        WriteToLog($"ERROR - image IMAGES - :'{articleId}' has an invalid image!", ref result);
                    }
                }
                result.Succeeded = true;
            }
            if(hasImages == false)
            {
                WriteToLog($"MAGAZINE IMAGES - No images in article", ref result);
                result.Succeeded = true;
            }
            
            return result;
        }
        public Result DownloadCover(MagazineIssues blendlIssues, string magazine, int year, int month, bool forceReDownload)
        {
            Result result = new Result();
            if (blendlIssues.IsValid())
            {
                foreach (Issue issue in blendlIssues._embedded.issues)
                {
                    var coverUri = new Uri(issue._links.page_preview.href, UriKind.RelativeOrAbsolute);
                    if (issue.HasValidCoverUrl())
                    {
                        string fullPath = issue.GetCoverFullPath(magazine, year, month);

                        if (forceReDownload || File.Exists(fullPath) == false)
                        {
                            //try download the image from the url
                            bool downloadSucceeded = GeneralUtils.DownloadImage(coverUri.AbsoluteUri, fullPath);
                            if (downloadSucceeded)
                            {
                                WriteToLog($"MAGAZINE COVER - '{magazine}', year {year}, month {month}, URI:'{coverUri.AbsoluteUri}' , download succeeded!", ref result);
                            }
                            else
                            {
                                WriteToLog($"MAGAZINE COVER - '{magazine}', year {year}, month {month}, URI:'{coverUri.AbsoluteUri}' , download succeeded!", ref result);
                                result.Succeeded = false;
                                return result;
                            }
                        }
                    }
                    else
                    {
                        WriteToLog($"ERROR - MAGAZINE COVER - '{magazine}', year {year}, month {month}, URI:'{coverUri.AbsoluteUri}', URI mailformed!", ref result);
                    }
                }
                result.Succeeded = true;
            }
            else
            {
                WriteToLog($"ERROR - MAGAZINE COVER - '{magazine}', year {year}, month {month}, invalid issue!", ref result);
                result.Succeeded = true;
            }

            return result;
        }
        #endregion magazine image fetching

        #region separate article fetching
        public Result<List<Transaction>> FetchAllTransactions(bool forceReDownload = false)
        {
            Result<List<Transaction>> result = new Result<List<Transaction>>();

            DateTime? highestTransactionDateFromDisk = Transaction.GetLaterstTransactionDateFromDisk();
            
            bool shouldDownload = true;
            if (highestTransactionDateFromDisk != null)
            {
                Result<TransactionCollection> transactionsResult = client.GetTransactions(Configuration.Instance.UserBaseProfile._embedded.user.id, 1, 1);
                if (transactionsResult.Succeeded && transactionsResult.Data.ContainsTransactions())
                {
                    var firstTransaction = transactionsResult.Data.Embedded.Transactions.FirstOrDefault();
                    shouldDownload = firstTransaction.CreatedAtLocal > highestTransactionDateFromDisk.Value;
                    WriteToLog($"No need to fetch new transactions - firstTransaction.CreatedAtLocal: {firstTransaction.CreatedAtLocal:F}, highestTransactionDateFromDisk.Value: {highestTransactionDateFromDisk.Value:F}", ref result);
                }
            }

            if (shouldDownload)
            {
                var downloadResult = DownloadAllTransactions(forceReDownload);
                result.MergeResult(downloadResult);
            }

            result.Data = Transaction.GetAllTransactions();
            result.Succeeded = true;

            WriteToLog($"Fetches all transactions, count: {result.Data.Count}", ref result);

            return result;
        }
        public Result DownloadAllTransactions(bool forceReDownload = false)
        {
            Result result = new Result() {Succeeded = true};
            bool allFetched = false;
            int pageCounter = 1;
            while (allFetched == false)
            {
                Result<TransactionCollection> transactionsResult = client.GetTransactions(Configuration.Instance.UserBaseProfile._embedded.user.id, 20, pageCounter);
                if (transactionsResult.Succeeded)
                {
                    allFetched = transactionsResult.Data.ContainsTransactions() == false;
                    if (allFetched == false)
                    {
                        foreach (Transaction transaction in transactionsResult.Data.Embedded.Transactions.Where(t => t.TransactionType == Constants.TransactionType.Purchase))
                        {
                            //only save the transactions after the specified date
                            if (Configuration.Instance.LastTransactionsOnlineFetch != null && transaction.CreatedAt < Configuration.Instance.LastTransactionsOnlineFetch.Value)
                            {
                                allFetched = true;
                                WriteToLog($"DownloadAllTransactions - all fetched, contiuing!", ref result);
                                break;
                            }
                            else
                            {
                                string fullPath = transaction.GetFullPath();

                                if (forceReDownload || File.Exists(fullPath) == false)
                                {
                                    WriteToLog($"DownloadAllTransactions - downloaded: {transaction.GetItemId()}", ref result);
                                    GeneralUtils.Save<Transaction>(transaction, fullPath);
                                }
                            }
                        }
                    }
                }
                else
                {
                    WriteToLog($"DownloadAllTransactions - Failled to get transactions from the web, aborting!", ref result);
                    result.MergeResult(transactionsResult);
                    break;
                }
                pageCounter++;
            }

            if (result.Succeeded)
            {
                Configuration.Instance.LastTransactionsOnlineFetch = DateTime.Now;
                Configuration.Instance.Save();
            }
            return result;
        }
        public Result DownloadAllTransactionsContent(bool forceReDownload = false)
        {
            Result result = new Result() { Succeeded = true };

            //try download all transactions or get them from the disk
            var allTransactionsResult = FetchAllTransactions(forceReDownload);
            if (allTransactionsResult.Succeeded && allTransactionsResult.Data.Any())
            {
                foreach (Transaction transaction in allTransactionsResult.Data)
                {
                    string itemPath = BlendleItem.GetLoosePath(transaction.CreatedAtLocal.Year, transaction.CreatedAtLocal.Month);
                    //can fail if the article has to be loaded externally when the page loads
                    Result<BlendleItem> fetchItemResult = FetchItem(itemPath, transaction.GetItemId(), forceReDownload);
                    result.MergeResult(fetchItemResult);
                }
            }

            return result;
        }
        public Result<List<BlendleItem>> DownloadTransactionsContent(List<Transaction> transactions, bool forceReDownload = false)
        {
            Result<List<BlendleItem>> result = new Result<List<BlendleItem>>() { Succeeded = true, Data = new List<BlendleItem>()};

            if (transactions.Any())
            {
                foreach (Transaction transaction in transactions)
                {
                    string itemPath = BlendleItem.GetLoosePath(transaction.CreatedAtLocal.Year, transaction.CreatedAtLocal.Month);
                    //can fail if the article has to be loaded externally when the page loads
                    Result<BlendleItem> fetchItemResult = FetchItem(itemPath, transaction.GetItemId(), forceReDownload);
                    if (fetchItemResult.Succeeded)
                    {
                        result.Data.Add(fetchItemResult.Data);
                    }
                    result.MergeResult(fetchItemResult);
                }
            }

            return result;
        }
        #endregion separate article fetching

        private void WriteToLog(string logLine, ref Result result)
        {
            WriteToLogEventHandler(logLine);
            if (result != null)
            {
                result.Logs.Add(logLine);
            }
        }
        private void WriteToLog<T>(string logLine, ref Result<T> result)
        {
            WriteToLogEventHandler(logLine);
            if (result != null)
            {
                result.Logs.Add(logLine);
            }
        }
        private void WriteToLogEventHandler(string logLine)
        {
            if (LogEventHandler != null)
            {
                LogEventHandler.Invoke(logLine);
            }
        }
    }
}