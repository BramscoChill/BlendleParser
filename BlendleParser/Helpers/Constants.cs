using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace BlendleParser.Helpers
{
    public static class Constants
    {
        public const string AUTH_BLENDLE_API_URL = @"https://ws-no-zoom.blendle.com/";
        public const string CONTENT_BLENDLE_API_URL = @"https://ws.blendle.com/";
        public const string PUBLIC_BLENDLE_API_URL = @"https://static.blendle.nl/";

        /*
         "self": {
             "href": "https://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/manifest.json"
         },
         "items_metadata": {
             "href": "https://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/items.json"
         },
         "permanent_metadata": {
             "href": "https://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/permanent/index.json"
         },
         "provider_metadata": {
             "href": "s3://static.blendle.nl/publication/psychologie/2017/09/14/issue/version/1/private/metadata.json"
         },
         "cover": {
             "href": "https://static.blendle.nl/publication/psychologie/2017/09/14/item/67914e2fb5a/version/1/manifest.json"
         },
         "month": {
             "href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/month/09/index.json"
         },
         "year": {
             "href": "https://static.blendle.nl/meta/publication/psychologie/calendar/year/2017/index.json"
         },
         "years": {
             "href": "https://static.blendle.nl/meta/publication/psychologie/calendar/index.json"
         },
         "pages": {
             "href": "https://static.blendle.nl/publication/psychologie/2017/09/14/pages/version/1/index.json"
         },
         */
        public static readonly string DEFAULT_SETTINGS_FULLPATH = Path.Combine(ASSEMBLY_DIRECTORY, ASSEMBLY_TITLE + ".json");
        public static readonly string DEFAULT_DATA_FULLPATH = Path.Combine(ASSEMBLY_DIRECTORY, "Data");
        public static readonly string DEFAULT_DATA_LOOSE_ISSUES = Path.Combine(DEFAULT_DATA_FULLPATH, "LooseArticles");
        public static string APPLICATION_FULL_PATH = (new System.Uri(Assembly.GetExecutingAssembly().CodeBase)).LocalPath;
        public static string ASSEMBLY_DIRECTORY
        {
            get
            {
                string codeBase = Assembly.GetExecutingAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
        }

        private static string _title;
        public static string ASSEMBLY_TITLE
        {
            get
            {
                if (_title == null)
                {
                    AssemblyTitleAttribute attributes = (AssemblyTitleAttribute)Attribute.GetCustomAttribute(Assembly.GetExecutingAssembly(), typeof(AssemblyTitleAttribute), false);
                    _title = attributes?.Title;
                }
                return _title;
            }
        }
        public static string PROGRAMFILESX86
        {
            get
            {
                if (8 == IntPtr.Size ||
                    (!String.IsNullOrEmpty(Environment.GetEnvironmentVariable("PROCESSOR_ARCHITEW6432"))))
                {
                    return Environment.GetEnvironmentVariable("ProgramFiles(x86)");
                }

                return Environment.GetEnvironmentVariable("ProgramFiles");
            }
        }

        #region fonts
        public const string FONT_PROXIMA_NOVA200 = "BlendleParser.Resources.Fonts.proxima-nova-condensed-w01-bold-200.woff";
        public const string FONT_PROXIMA_NOVA500 = "BlendleParser.Resources.Fonts.proxima-nova-condensed-w01-bold-500.woff";
        public const string FONT_ABADI200 = "BlendleParser.Resources.Fonts.abadi-w01-regular-200.woff";
        public const string FONT_SWIFT700 = "BlendleParser.Resources.Fonts.swift-w01-regular-700.woff";
        public const string FONT_CENTURY300 = "BlendleParser.Resources.Fonts.itc-century-w01-regular-300.woff";
        public const string FONT_SWIFT400 = "BlendleParser.Resources.Fonts.swift-w01-normal-400.woff";

        #endregion fonts

        #region enums
        //'purchase', 'refund', 'auto-refund', 'adyen-deposit'
        public enum TransactionType
        {
            UNKOWN = -1,
            Purchase,
            Refund,
            AutoRefund,
            AdyenDeposit,
        }

        public enum LooseItemFilter
        {
            All,
            LastYear,
            LastMonth
        }
        #endregion enums
    }
}