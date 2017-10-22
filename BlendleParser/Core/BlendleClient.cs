using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using BlendleParser.Helpers;
using BlendleParser.Model;
using RestSharp;

namespace BlendleParser.Core
{
    public class BlendleClient : Client
    {
        public Result<UserBaseProfile> GetBaseProfile(string username, string password)
        {
            Result<UserBaseProfile> result = new Result<UserBaseProfile>();
            try
            {
                var request = _requestHelper.CreateAuthorizeRequest(username, password);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>(){HttpStatusCode.OK};
                UserBaseProfile baseProfileResult = Execute<UserBaseProfile>(ApiType.Auth, request, validStatusCodes);

                if (baseProfileResult.IsValid())
                {
                    baseProfileResult.refresh_token = baseProfileResult.refresh_token ?? Configuration.Instance.UserBaseProfile?.refresh_token;

                    Configuration.Instance.UserBaseProfile = baseProfileResult;
                    Configuration.Instance.Save();

                    result.Data = baseProfileResult;
                    result.Succeeded = true;
                }
            }
            catch (BlendleBaseException ex)
            {
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<UserBaseProfile> RefreshToken()
        {
            Result<UserBaseProfile> result = new Result<UserBaseProfile>();
            try
            {
                var request = _requestHelper.CreateRefreshTokenRequest(Configuration.Instance.UserBaseProfile.refresh_token);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK };

                UserBaseProfile baseProfileResult = Execute<UserBaseProfile>(ApiType.Auth, request, validStatusCodes);

                if (baseProfileResult.IsValid())
                {
                    baseProfileResult.refresh_token = baseProfileResult.refresh_token ?? Configuration.Instance.UserBaseProfile?.refresh_token;

                    Configuration.Instance.UserBaseProfile = baseProfileResult;
                    Configuration.Instance.Save();

                    result.Data = baseProfileResult;
                    result.Succeeded = true;
                }
            }
            catch (BlendleBaseException ex)
            {
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<T> ExecuteBearerRequest<T>(ApiType apiType, Func<RestRequest> requestFunc, List<HttpStatusCode> validStatusCodes, bool firstTimeExecuted = true) where T : new()
        {
            Result<T> result = new Result<T>();

            RestRequest  requestSource = requestFunc.Invoke();
            try
            {
                _requestHelper.AddBearerFromConfig(ref requestSource);

                result.Data = Execute<T>(apiType, requestSource, validStatusCodes);

                if (result.Data != null)
                {
                    result.Succeeded = true;
                }
            }
            catch (BlendleBaseException ex)
            {
                if (firstTimeExecuted && ex.ErrorType == BlendleErrorType.TokenExpired)
                {
                    Result<UserBaseProfile> refreshTokenResult = RefreshToken();
                    if (refreshTokenResult.Succeeded)
                    {
                        result = ExecuteBearerRequest<T>(apiType, requestFunc, validStatusCodes, false);
                    }
                    else
                    {
                        result.Exception = ex;
                        Console.WriteLine("err: " + ex.Response.Content);
                    }
                }
                else
                {
                    result.Exception = ex;
                    Console.WriteLine("err: " + ex.Response.Content);
                }
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<AllYearsMagazine> GetAllYearsMagazine(string magazine)
        {
            Result<AllYearsMagazine> result = new Result<AllYearsMagazine>();
            try
            {
                var request = _requestHelper.CreateAllYearsMagazineRequest(magazine);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK };

                AllYearsMagazine requestResult = Execute<AllYearsMagazine>(ApiType.Public, request, validStatusCodes);

                if (requestResult != null)
                {
                    result.Data = requestResult;
                    result.Succeeded = true;
                }
            }
            catch (BlendleBaseException ex)
            {
                result.Exception = ex;
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<AllMagazinesInYear> GetAllMagazinesInYear(string magazine, int year)
        {
            Result<AllMagazinesInYear> result = new Result<AllMagazinesInYear>();
            try
            {
                var request = _requestHelper.CreateMagazineYearsRequest(magazine, year);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK };

                AllMagazinesInYear requestResult = Execute<AllMagazinesInYear>(ApiType.Public, request, validStatusCodes);

                if (requestResult != null)
                {
                    result.Data = requestResult;
                    result.Succeeded = true;
                }
            }
            catch (BlendleBaseException ex)
            {
                result.Exception = ex;
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<MagazineIssues> GetAllIssuesInMagazine(string magazine, int year, int month)
        {
            Result<MagazineIssues> result = new Result<MagazineIssues>();
            try
            {
                var request = _requestHelper.CreateAllIssuesInMagazineRequest(magazine, year, month);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK };

                MagazineIssues requestResult = Execute<MagazineIssues>(ApiType.Public, request, validStatusCodes);

                if (requestResult != null)
                {
                    result.Data = requestResult;
                    result.Succeeded = true;
                }
            }
            catch (BlendleBaseException ex)
            {
                result.Exception = ex;
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<ItemPaymentInfo> GetItemPaymentInfo(string articleId)
        {
            Result<ItemPaymentInfo> result = new Result<ItemPaymentInfo>();
            try
            {
                Func<RestRequest> requestFunc = () => _requestHelper.CreateGetItemPaymentInfoRequest(articleId);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK };

                result = ExecuteBearerRequest<ItemPaymentInfo>(ApiType.Content, requestFunc, validStatusCodes);

                if (result.Succeeded == false)
                {
                    if (result.Exception is BlendleBaseException)
                    {
                        var ex = result.Exception as BlendleBaseException;
                        if (ex.ErrorType == BlendleErrorType.InvalidToken)
                        {

                        }
                    }
                }
            }
            catch (BlendleBaseException ex)
            {
                result.Exception = ex;
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<ItemTileInfo> GetItemTileInfo(string userId, string articleId)
        {
            Result<ItemTileInfo> result = new Result<ItemTileInfo>();
            try
            {
                Func<RestRequest> requestFunc = () => _requestHelper.CreateItemTileInfoRequest(userId, articleId);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK };

                result = ExecuteBearerRequest<ItemTileInfo>(ApiType.Content, requestFunc, validStatusCodes);

                if (result.Succeeded == false)
                {
                    if (result.Exception is BlendleBaseException)
                    {
                        var ex = result.Exception as BlendleBaseException;
                        if (ex.ErrorType == BlendleErrorType.InvalidToken)
                        {

                        }
                    }
                }
            }
            catch (BlendleBaseException ex)
            {
                result.Exception = ex;
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<ItemAcquisitionReceipt> BuyItem(string userId, string articleId)
        {
            Result<ItemAcquisitionReceipt> result = new Result<ItemAcquisitionReceipt>();
            try
            {
                Func<RestRequest> requestFunc = () => _requestHelper.CreateBuyItemAcquisitionRequest(userId, articleId);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK, HttpStatusCode.Created };

                result = ExecuteBearerRequest<ItemAcquisitionReceipt>(ApiType.Content, requestFunc, validStatusCodes);

                if (result.Succeeded == false)
                {
                    if (result.Exception is BlendleBaseException)
                    {
                        var ex = result.Exception as BlendleBaseException;
                        if (ex.ErrorType == BlendleErrorType.InvalidToken)
                        {

                        }
                    }
                }
            }
            catch (BlendleBaseException ex)
            {
                result.Exception = ex;
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<BlendleItem> GetItem(string articleId)
        {
            Result<BlendleItem> result = new Result<BlendleItem>();
            string userId = Configuration.Instance.UserBaseProfile._embedded.user.id;


            try
            {
                if (userId.IsNullOrEmpty() == false)
                {
                    bool haveSubscription = false;
                    bool haveAlreadyBought = false;
                    bool canContinueFetch = false;

                    //check if we have an subscription for it
                    Result<ItemPaymentInfo> articlePaymentInfoResult = GetItemPaymentInfo(articleId);
                    haveSubscription = (articlePaymentInfoResult.Succeeded && articlePaymentInfoResult.Data.subscription);
                    haveAlreadyBought = (articlePaymentInfoResult.Succeeded && articlePaymentInfoResult.Data.acquired);

                    //sometimes this returns null
                    if (haveAlreadyBought == false)
                    {
                        Result<ItemTileInfo> articleTileInfoResult = GetItemTileInfo(userId, articleId);
                        haveAlreadyBought = (articleTileInfoResult.Succeeded && articleTileInfoResult.Data.item_purchased);
                    }

                    if (haveAlreadyBought == false && haveSubscription)
                    {
                        Result<ItemAcquisitionReceipt> buyItemResult = BuyItem(userId, articleId);
                        canContinueFetch = buyItemResult.Succeeded && buyItemResult.Data.acquired;

                    } else if (haveAlreadyBought)
                    {
                        canContinueFetch = true;
                    }

                    if (canContinueFetch)
                    {
                        List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK };
                        Func<RestRequest> requestFunc = () => _requestHelper.CreateGetItemContentRequest(articleId);
                        result = ExecuteBearerRequest<BlendleItem>(ApiType.Content, requestFunc, validStatusCodes);
                    }
                    else
                    {
                        result.Message = "Cannot contiue to fetch the article, no subscription or no bought!";
                    }
                    

                    if (result.Succeeded == false)
                    {
                        if (result.Exception is BlendleBaseException)
                        {
                            var ex = result.Exception as BlendleBaseException;
                            if (ex.ErrorType == BlendleErrorType.InvalidToken)
                            {

                            }
                        }
                    }
                }
                else
                {
                    result.Message = "userId is null!";
                }
                
            }
            catch (BlendleBaseException ex)
            {
                result.Exception = ex;
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }
        public Result<TransactionCollection> GetTransactions(string userId, int pageSize, int pageIndex)
        {
            Result<TransactionCollection> result = new Result<TransactionCollection>();
            try
            {
                Func<RestRequest> requestFunc = () => _requestHelper.CreateTransactionRequest(userId, pageSize, pageIndex);
                List<HttpStatusCode> validStatusCodes = new List<HttpStatusCode>() { HttpStatusCode.OK };

                result = ExecuteBearerRequest<TransactionCollection>(ApiType.Content, requestFunc, validStatusCodes);

                if (result.Succeeded == false)
                {
                    if (result.Exception is BlendleBaseException)
                    {
                        var ex = result.Exception as BlendleBaseException;
                        if (ex.ErrorType == BlendleErrorType.InvalidToken)
                        {

                        }
                    }
                }
            }
            catch (BlendleBaseException ex)
            {
                result.Exception = ex;
                Console.WriteLine("err: " + ex.Response.Content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
            }
            return result;
        }


    }
}