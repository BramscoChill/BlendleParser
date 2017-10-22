using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Web.Script.Serialization;
using BlendleParser.Helpers;
using BlendleParser.Model;
using RestSharp;
using RestSharp.Deserializers;

namespace BlendleParser.Core
{
    public static class ExtensionMethods
    {
        public static BlendleBaseException.BlendeBaseErrors ParseBlendeBaseErrors(this IRestResponse source)
        {
            try
            {
                RestSharp.Deserializers.JsonDeserializer deserialCount = new JsonDeserializer();
                return deserialCount.Deserialize<BlendleBaseException.BlendeBaseErrors>(source);
            }
            catch
            {
            }
            return null;
        }

        public static RestRequest Clone(this RestRequest source)
        {
            RestRequest restRequest = new RestRequest();
            restRequest.Method = source.Method;
            if (restRequest.Resource != null)
                restRequest.Resource = string.Copy(source.Resource);
            if(restRequest.RootElement != null)
                restRequest.RootElement = string.Copy(source.RootElement);
            if (source.Parameters != null)
            {
                foreach (Parameter parameter in source.Parameters)
                {
                    restRequest.AddParameter(parameter.Clone());
                }
            }
            return restRequest;
        }
        public static Parameter Clone(this Parameter source)
        {
            Parameter parameter = new Parameter();
            if (parameter.Name != null)
                parameter.Name = string.Copy(source.Name);
            if (parameter.ContentType != null)
                parameter.ContentType = string.Copy(source.ContentType);
            parameter.Type = source.Type;
            if (parameter.Value != null)
                parameter.Value = DeepCopy<object>(source.Value);
            
            return parameter;
        }

        public static T DeepCopy<T>(T other)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                BinaryFormatter formatter = new BinaryFormatter();
                formatter.Serialize(ms, other);
                ms.Position = 0;
                return (T)formatter.Deserialize(ms);
            }
        }

        //based on: webpack:///./src/js/app/helpers/itemContent.js --> getImagePositions()
        //the one before needs to be a paragraph and the current item cannot be an image or streamer
        public static List<int> AvaliableImagePositions(this List<BA_Body> bodyPositions)
        {
            List<int> avaliableImagePositions = new List<int>();
            for (var i = 1; i < bodyPositions.Count; i++)
            {
                BA_Body current = bodyPositions[i];
                BA_Body oneBefore = bodyPositions[i - 1];
                if (oneBefore.BodyContentType == BodyContentType.P &&
                    current.BodyContentType != BodyContentType.Image &&
                    current.BodyContentType != BodyContentType.Streamer)
                {
                    avaliableImagePositions.Add(bodyPositions.IndexOf(current));
                }
            }
            return avaliableImagePositions;
        }

        public static bool AreEqual(this List<BA_Image> imagesSource, List<BA_BMediaSet2> mediasets)
        {
            bool areEqual = imagesSource != null && mediasets != null && imagesSource.Any() && mediasets.Any() && imagesSource.Count == mediasets.Count;
            if (areEqual)
            {
                foreach (var image in imagesSource)
                {
                    bool areEqual1 = false;
                    foreach (var mediaset in mediasets)
                    {
                        foreach (var subImage in image.GetAllImages().Where(i => i != null))
                        {
                            if (subImage.IsValid() && mediaset.IsValid())
                            {
                                foreach (var medisSetSubImage in mediaset._embedded.GetAllImages().Where(i => i != null))
                                {
                                    bool areEqualInternal = subImage.GetFileName().Equals(medisSetSubImage.GetFileName(), StringComparison.OrdinalIgnoreCase);
                                    if (areEqualInternal)
                                    {
                                        areEqual1 = true;
                                        break;
                                    }
                                }
                                if (areEqual1)
                                    break;
                            }
                        }
                        if (areEqual1)
                            break;
                    }
                    if (areEqual1 == false)
                    {
                        return false;
                    }
                }
            }
            return areEqual;
        }
    }
}