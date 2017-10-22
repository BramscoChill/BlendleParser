using System;
using System.Net;
using BlendleParser.Helpers;
using BlendleParser.Model;
using RestSharp;
using RestSharp.Deserializers;

namespace BlendleParser.Core
{
    public class RequestHandler
    {
        private Result<T> FirePostRequest<T>(string url, string resourceUrl, string jsonBody, Method method)
        {
            Result<T> result = new Result<T>();

            var client = new RestClient(url);

            var request = new RestRequest(resourceUrl);

            request.Method = method;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");

            if (jsonBody.IsNullOrEmpty() == false)
            {
                request.Parameters.Clear();
                request.AddParameter("application/json", jsonBody, ParameterType.RequestBody);
            }

            try
            {

                IRestResponse response = client.Execute(request);
                
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    RestSharp.Deserializers.JsonDeserializer deserialCount = new JsonDeserializer();
                    result.Data = deserialCount.Deserialize<T>(response);
                    result.Succeeded = true;
                }
                else
                {
                    result.Succeeded = false;
                }
                
            }
            catch (Exception ex)
            {
                result.Exception = ex;
                result.Succeeded = false;
            }
            return result;
        }
        public Result<T> FirePostRequest<T>(string url, string resourceUrl, string jsonBody)
        {
            Result<T> result = new Result<T>();

            var client = new RestClient(url);

            var request = new RestRequest(resourceUrl);

            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");

            if (jsonBody.IsNullOrEmpty() == false)
            {
                request.Parameters.Clear();
                request.AddParameter("application/json", jsonBody, ParameterType.RequestBody);
            }

            try
            {

                IRestResponse response = client.Execute(request);
                
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    RestSharp.Deserializers.JsonDeserializer deserialCount = new JsonDeserializer();
                    result.Data = deserialCount.Deserialize<T>(response);
                    result.Succeeded = true;
                }
                else
                {
                    result.Succeeded = false;
                }
                
            }
            catch (Exception ex)
            {
                result.Exception = ex;
                result.Succeeded = false;
            }
            return result;
        }
        public Result<T> FireGetRequest<T>(string url, string resourceUrl, string jsonBody)
        {
            Result<T> result = new Result<T>();

            var client = new RestClient(url);

            var request = new RestRequest(resourceUrl);

            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json;charset=UTF-8;");

            if (jsonBody.IsNullOrEmpty() == false)
            {
                request.Parameters.Clear();
                request.AddParameter("application/json", jsonBody, ParameterType.RequestBody);
            }

            try
            {

                IRestResponse response = client.Execute(request);
                
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    RestSharp.Deserializers.JsonDeserializer deserialCount = new JsonDeserializer();
                    result.Data = deserialCount.Deserialize<T>(response);
                    result.Succeeded = true;
                }
                else
                {
                    result.Succeeded = false;
                }
                
            }
            catch (Exception ex)
            {
                result.Exception = ex;
                result.Succeeded = false;
            }
            return result;
        }
    }
}