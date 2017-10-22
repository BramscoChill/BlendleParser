using System;
using System.IO;
using RestSharp;

namespace BlendleParser.Core
{
    public class RequestHelper
    {
        public RequestHelper()
        {
        }

        public RestRequest CreateAllYearsMagazineRequest(string magazine)
        {
            var request = new RestRequest(Method.GET);
            request.Resource = string.Format("meta/publication/{0}/calendar/index.json", magazine);
            return request;
        }
        public RestRequest CreateMagazineYearsRequest(string magazine, int year)
        {
            var request = new RestRequest(Method.GET);
            request.Resource = string.Format("meta/publication/{0}/calendar/year/{1}/index.json", magazine, year);
            return request;
        }
        public RestRequest CreateAllIssuesInMagazineRequest(string magazine, int year, int month)
        {
            var request = new RestRequest(Method.GET);
            string strMonth = month < 10 ? ("0" + month.ToString()) : month.ToString();
            request.Resource = string.Format("meta/publication/{0}/calendar/year/{1}/month/{2}/index.json", magazine, year, strMonth);
            return request;
        }
        public RestRequest CreateGetItemContentRequest(string articleId)
        {
            var request = new RestRequest(Method.GET);
            request.Resource = string.Format("item/{0}/content", articleId);
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");

            return request;
        }
        public RestRequest CreateGetItemPaymentInfoRequest(string articleId)
        {
            var request = new RestRequest(Method.GET);
            request.Resource = string.Format("item/{0}", articleId);
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");

            return request;
        }
        public RestRequest CreateItemTileInfoRequest(string userId, string articleId)
        {
            var request = new RestRequest(Method.GET);
            request.Resource = string.Format("/user/{0}/tile/item/{1}", userId, articleId);
//            request.AddHeader("Accept", "application/json");
//            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");

            return request;
        }
        public void AddBearerFromConfig(ref RestRequest request)
        {
            request.AddHeader("Authorization", "Bearer " + Configuration.Instance.UserBaseProfile.jwt);
        }
        public RestRequest CreateBuyItemAcquisitionRequest(string userId, string articleId)
        {
            var request = new RestRequest(Method.POST);
            request.Resource = string.Format("/user/{0}/items", userId);
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");
            request.Parameters.Clear();
            request.AddParameter("application/json", "{\"id\":\"" + articleId + "\"}", ParameterType.RequestBody);

            return request;
        }
        public RestRequest CreateTransactionRequest(string userId, int pageSize, int pageIndex)
        {
            var request = new RestRequest(Method.GET);
            request.Resource = string.Format("/user/{0}/transactions?amount={1}&page={2}", userId, pageSize, pageIndex); //https://ws.blendle.com/user/bklein333/transactions
            request.Method = Method.GET;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");

            return request;
        }
        public RestRequest CreateRefreshTokenRequest(string refresh_token)
        {
            var request = new RestRequest(Method.POST);
            request.Resource = "/tokens";
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");
            request.Parameters.Clear();
            request.AddParameter("application/json", "{\"refresh_token\":\"" + refresh_token + "\"}", ParameterType.RequestBody);

            return request;
        }
        public RestRequest CreateAuthorizeRequest(string username, string password)
        {
            var request = new RestRequest(Method.POST);
            request.Resource = "/credentials";
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");
            request.Parameters.Clear();
            request.AddParameter("application/json", "{\"login\": \"" + username + "\",\"password\": \"" + password + "\"}", ParameterType.RequestBody);

            return request;
        }
    }

    internal static class StreamUtils
    {
        private const int STREAM_BUFFER_SIZE = 128 * 1024; // 128KB

        public static void CopyStream(Stream source, Stream target)
        { CopyStream(source, target, new byte[STREAM_BUFFER_SIZE]); }

        public static void CopyStream(Stream source, Stream target, byte[] buffer)
        {
            if (source == null) throw new ArgumentNullException("source");
            if (target == null) throw new ArgumentNullException("target");

            if (buffer == null) buffer = new byte[STREAM_BUFFER_SIZE];
            int bufferLength = buffer.Length;
            int bytesRead;
            while ((bytesRead = source.Read(buffer, 0, bufferLength)) > 0)
                target.Write(buffer, 0, bytesRead);
        }
    }
}