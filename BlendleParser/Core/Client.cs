using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using BlendleParser.Helpers;
using BlendleParser.Model;
using RestSharp;
using RestSharp.Deserializers;

namespace BlendleParser.Core
{
    public abstract class Client
    {
        
        protected RestClient _publicBlendleRestClient;
        protected RestClient _authBlendleRestClient;
        protected RestClient _contentBlendleRestClient;
        protected RequestHelper _requestHelper;

        public Client()
        {
            LoadClient();
        }
        

        protected void LoadClient()
        {
            _publicBlendleRestClient = new RestClient(Constants.PUBLIC_BLENDLE_API_URL);
            _publicBlendleRestClient.ClearHandlers();
            //_publicBlendleRestClient.AddHandler("*", new JsonDeserializer());
            _publicBlendleRestClient.AddHandler("application/json", NewtonsoftJsonSerializer.Default);
            _publicBlendleRestClient.AddHandler("text/json", NewtonsoftJsonSerializer.Default);
            _publicBlendleRestClient.AddHandler("text/x-json", NewtonsoftJsonSerializer.Default);
            _publicBlendleRestClient.AddHandler("text/javascript", NewtonsoftJsonSerializer.Default);
            _publicBlendleRestClient.AddHandler("*+json", NewtonsoftJsonSerializer.Default);

            _authBlendleRestClient = new RestClient(Constants.AUTH_BLENDLE_API_URL);
            _authBlendleRestClient.ClearHandlers();
            //_authBlendleRestClient.AddHandler("*", new JsonDeserializer());
            _authBlendleRestClient.AddHandler("application/json", NewtonsoftJsonSerializer.Default);
            _authBlendleRestClient.AddHandler("text/json", NewtonsoftJsonSerializer.Default);
            _authBlendleRestClient.AddHandler("text/x-json", NewtonsoftJsonSerializer.Default);
            _authBlendleRestClient.AddHandler("text/javascript", NewtonsoftJsonSerializer.Default);
            _authBlendleRestClient.AddHandler("*+json", NewtonsoftJsonSerializer.Default);

            _contentBlendleRestClient = new RestClient(Constants.CONTENT_BLENDLE_API_URL);
            _contentBlendleRestClient.ClearHandlers();
            _contentBlendleRestClient.AddHandler("application/json", NewtonsoftJsonSerializer.Default);
            _contentBlendleRestClient.AddHandler("text/json", NewtonsoftJsonSerializer.Default);
            _contentBlendleRestClient.AddHandler("text/x-json", NewtonsoftJsonSerializer.Default);
            _contentBlendleRestClient.AddHandler("text/javascript", NewtonsoftJsonSerializer.Default);
            _contentBlendleRestClient.AddHandler("*+json", NewtonsoftJsonSerializer.Default);

            _requestHelper = new RequestHelper();
        }



        protected T ExecuteRereshToken<T>(ApiType apiType, IRestRequest request, List<HttpStatusCode> validStatusCodes) where T : new()
        {
            IRestResponse<T> response;
            if (apiType == ApiType.Public)
            {
                response = _publicBlendleRestClient.Execute<T>(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }
            else if (apiType == ApiType.Auth)
            {
                response = _authBlendleRestClient.Execute<T>(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }
            else
            {
                response = _contentBlendleRestClient.Execute<T>(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }

            return response.Data;
        }

        protected T Execute<T>(ApiType apiType, IRestRequest request, List<HttpStatusCode> validStatusCodes) where T : new()
        {
            IRestResponse<T> response;
            if (apiType == ApiType.Public)
            {
                response = _publicBlendleRestClient.Execute<T>(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }
            else if (apiType == ApiType.Auth)
            {
                response = _authBlendleRestClient.Execute<T>(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }
            else
            {
                response = _contentBlendleRestClient.Execute<T>(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }

            return response.Data;
        }

        protected IRestResponse Execute(ApiType apiType, IRestRequest request, List<HttpStatusCode> validStatusCodes)
        {
            IRestResponse response;
            if (apiType == ApiType.Public)
            {
                response = _publicBlendleRestClient.Execute(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }
            else if (apiType == ApiType.Auth)
            {
                response = _authBlendleRestClient.Execute(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }
            else
            {
                response = _contentBlendleRestClient.Execute(request);
                request.RequestFormat = DataFormat.Json;
                request.JsonSerializer = NewtonsoftJsonSerializer.Default;

                if (!validStatusCodes.Contains(response.StatusCode))
                {
                    throw new BlendleBaseException(response);
                }
            }

            return response;
        }


//        protected void ExecuteAsync(ApiType apiType, IRestRequest request, Action<IRestResponse> success, Action<BlendleBaseException> failure)
//        {
//            if (apiType == ApiType.Public)
//            {
//                _publicBlendleRestClient.ExecuteAsync(request, (response, asynchandle) =>
//                {
//                    if (!validStatusCodes.Contains(response.StatusCode))
//                    {
//                        failure(new BlendleBaseException(response));
//                    }
//                    else
//                    {
//                        success(response);
//                    }
//                });
//            }
//            else
//            {
//                _authBlendleRestClient.ExecuteAsync(request, (response, asynchandle) =>
//                {
//                    if (response.StatusCode != HttpStatusCode.OK && response.StatusCode != HttpStatusCode.PartialContent)
//                    {
//                        failure(new BlendleBaseException(response));
//                    }
//                    else
//                    {
//                        success(response);
//                    }
//                });
//            }
//        }

        public enum ApiType
        {
            Public,
            Auth,
            Content
        }
    }
}