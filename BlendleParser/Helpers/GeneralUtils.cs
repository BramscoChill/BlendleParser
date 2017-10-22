using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace BlendleParser.Helpers
{
    public class GeneralUtils
    {
        public static void Save<T>(T pSettings, string fileName)
        {
            File.WriteAllText(fileName, (new JavaScriptSerializer()).Serialize(pSettings));
        }

        public static T Load<T>(string fileName)
        {
            T t = default(T);
            if (File.Exists(fileName))
            {
                t = (new JavaScriptSerializer()).Deserialize<T>(File.ReadAllText(fileName));
            }
            return t;
        }

        public static string JsonObject(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
        public static void CheckDataDir()
        {
            if (Directory.Exists(Constants.DEFAULT_DATA_FULLPATH) == false)
                Directory.CreateDirectory(Constants.DEFAULT_DATA_FULLPATH);
        }
        public static string CheckTransactionsDir()
        {
            string dir = Constants.DEFAULT_DATA_LOOSE_ISSUES;
            if (Directory.Exists(dir) == false)
                Directory.CreateDirectory(dir);
            return dir;
        }

        public static bool DownloadImage(string url, string fullPath)
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    client.DownloadFile(new Uri(url), fullPath);
                    //client.DownloadFileAsync(new Uri(url), @"c:\temp\image35.png");
                }
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
        public static string StripHTML(string input)
        {
            return Regex.Replace(input, "<.*?>", String.Empty);
        }
        public static string HtmlDecode(string input)
        {
            return WebUtility.HtmlDecode(input);
        }

        //if we dont know the image format
        //        public void SaveImage(string filename, ImageFormat format)
        //        {
        //
        //            WebClient client = new WebClient();
        //            Stream stream = client.OpenRead(imageUrl);
        //            Bitmap bitmap; bitmap = new Bitmap(stream);
        //
        //            if (bitmap != null)
        //                bitmap.Save(filename, format);
        //
        //            stream.Flush();
        //            stream.Close();
        //            client.Dispose();
        //        }

        public static byte[] GetFontBytes(string fontPath)
        {
            using (Stream imageStream = Assembly.GetExecutingAssembly().GetManifestResourceStream(fontPath))
            {
                if (imageStream != null)
                {
                    byte[] imageVBytes = new byte[imageStream.Length];
                    imageStream.Read(imageVBytes, 0, imageVBytes.Length);
                    return imageVBytes;
                }

            }
            return null;
        }
        public static int Highest(params int[] inputs)
        {
            return inputs.Max();
        }
        public static int Lowest(params int[] inputs)
        {
            return inputs.Min();
        }
    }
}