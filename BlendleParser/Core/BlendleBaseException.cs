using System;
using System.Collections.Generic;
using System.Net;
using RestSharp;

namespace BlendleParser.Core
{
    public class BlendleBaseException : Exception
    {
        public class Blendle_Error
        {
            public string id { get; set; }
            public string message { get; set; }
        }

        public class BlendeBaseErrors
        {
            public List<Blendle_Error> _errors { get; set; }
        }

        public HttpStatusCode StatusCode { get; set; }

        /// <summary>
        /// The response of the error call (for Debugging use)
        /// </summary>
        public IRestResponse Response { get; private set; }

        public BlendeBaseErrors Error { get; set; }
        public BlendleErrorType ErrorType { get; set; }

        public BlendleBaseException()
        {
            
        }

        public BlendleBaseException(string message) : base(message)
        {
            
        }

        public BlendleBaseException(IRestResponse r)
        {
            Response = r;
            StatusCode = r.StatusCode;
            Error = r.ParseBlendeBaseErrors();
            TrySetErrorType();
        }

        private void TrySetErrorType()
        {
            if (Error != null && Error._errors != null && Error._errors.Count > 0)
            {
                foreach (var blendleError in Error._errors)
                {
                    if (blendleError.id.Equals("ExpiredToken", StringComparison.OrdinalIgnoreCase))
                    {
                        ErrorType = BlendleErrorType.TokenExpired;
                        break;
                    } else if (blendleError.id.Equals("InvalidToken", StringComparison.OrdinalIgnoreCase))
                    {
                        ErrorType = BlendleErrorType.InvalidToken;
                        break;
                    } else if (blendleError.id.Equals("PaymentRequired", StringComparison.OrdinalIgnoreCase))
                    {
                        ErrorType = BlendleErrorType.PaymentRequired;
                        break;
                    } else if (blendleError.id.Equals("NotFound", StringComparison.OrdinalIgnoreCase))
                    {
                        ErrorType = BlendleErrorType.NotFound;
                        break;
                    } else if (blendleError.id.Equals("ArticleNotFound", StringComparison.OrdinalIgnoreCase))
                    {
                        ErrorType = BlendleErrorType.NotFound;
                        break;
                    }
                }
            }
        }


    }

    public enum BlendleErrorType
    {
        Unkown = 0,
        TokenExpired = 1,
        InvalidToken,
        PaymentRequired,
        NotFound,
    }
}