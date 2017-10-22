using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using RestSharp.Deserializers;
using RestSharp.Serializers;

namespace BlendleParser.Helpers
{
    public interface IJsonSerializer : ISerializer, IDeserializer
    {

    }
    /// <summary>
    /// Default JSON serializer for request bodies
    /// Doesn't currently use the SerializeAs attribute, defers to Newtonsoft's attributes
    /// </summary>
    public class NewtonsoftJsonSerializer : IJsonSerializer
    {
        private readonly Newtonsoft.Json.JsonSerializer _serializer;

        /// <summary>
        /// Default serializer
        /// </summary>
        public NewtonsoftJsonSerializer()
        {
            ContentType = "application/json";
            _serializer = new Newtonsoft.Json.JsonSerializer
            {
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Include,
                DefaultValueHandling = DefaultValueHandling.Include,
            };
            //_serializer.Converters.Add(new BlendleCustomConverter());
        }

        /// <summary>
        /// Default serializer with overload for allowing custom Json.NET settings
        /// </summary>
        public NewtonsoftJsonSerializer(Newtonsoft.Json.JsonSerializer serializer)
        {
            ContentType = "application/json";
            _serializer = serializer;
            //_serializer.Converters.Add(new BlendleCustomConverter());
        }

        /// <summary>
        /// Serialize the object as JSON
        /// </summary>
        /// <param name="obj">Object to serialize
        /// <returns>JSON as String</returns>
        public string Serialize(object obj)
        {
            using (var stringWriter = new StringWriter())
            {
                using (var jsonTextWriter = new JsonTextWriter(stringWriter))
                {
                    jsonTextWriter.Formatting = Formatting.Indented;
                    jsonTextWriter.QuoteChar = '"';

                    _serializer.Serialize(jsonTextWriter, obj);

                    var result = stringWriter.ToString();
                    return result;
                }
            }
        }

        public T Deserialize<T>(RestSharp.IRestResponse response)
        {
            var content = response.Content;

            using (var stringReader = new StringReader(content))
            {
                using (var jsonTextReader = new JsonTextReader(stringReader))
                {
                    return _serializer.Deserialize<T>(jsonTextReader);
                }
            }
        }

        /// <summary>
        /// Unused for JSON Serialization
        /// </summary>
        public string DateFormat { get; set; }
        /// <summary>
        /// Unused for JSON Serialization
        /// </summary>
        public string RootElement { get; set; }
        /// <summary>
        /// Unused for JSON Serialization
        /// </summary>
        public string Namespace { get; set; }
        /// <summary>
        /// Content type for serialized content
        /// </summary>
        public string ContentType
        {
            get { return "application/json"; } // Probably used for Serialization?
            set { }
        }

        public static NewtonsoftJsonSerializer Default
        {
            get
            {
                return new NewtonsoftJsonSerializer(new Newtonsoft.Json.JsonSerializer()
                {
                    NullValueHandling = NullValueHandling.Ignore,
                });
            }
        }
    }

    //makes sure string properties are converted to List<string> properties if needed
    public class BlendleCustomConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(string)) || (objectType == typeof(List<string>));
        }

//        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
//        {
//            if (reader.TokenType == JsonToken.StartArray)
//            {
//                var l = new List<string>();
//                if (objectType == typeof(List<string>))
//                {
//                    reader.Read();
//                    while (reader.TokenType != JsonToken.EndArray)
//                    {
//                        l.Add(reader.Value as string);
//
//                        reader.Read();
//                    }
//                    return l;
//                }
//                else
//                {
//                    return string.Join(", ", l);
//                }
//            }
//            else
//            {
//                if (objectType == typeof(List<string>))
//                {
//                    return new List<string> { reader.Value as string };
//                }
//                else
//                {
//                    return reader.Value as string;
//                }
//            }
//        }
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.StartArray)
            {
                var l = new List<string>();
                reader.Read();
                while (reader.TokenType != JsonToken.EndArray)
                {
                    l.Add(reader.Value as string);

                    reader.Read();
                }
                return l;
            }
            else
            {
                return new List<string> { reader.Value as string };
            }
        }

        public override void WriteJson(JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
        {
            //ToDo here we can decide to write the json as 
            //if only has one attribute output as string if it has more output as list
        }
    }
}