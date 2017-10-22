using System;
using BlendleParser.Model;

namespace BlendleParser.Core
{
    public class Configuration : AppSettings<Configuration>
    {
        #region members
        private static Configuration _configInstance = null;
        private UserBaseProfile _userBaseProfile;
        #endregion members

        #region constructors
        public static Configuration Instance
        {
            get
            {
                if (_configInstance == null)
                {
                    _configInstance = Configuration.Load();
                }

                return _configInstance;
            }
        }
        #endregion constructors

        #region properties
        public UserBaseProfile UserBaseProfile
        {
            get
            {
                if(_userBaseProfile == null)
                    _userBaseProfile = new UserBaseProfile();
                return _userBaseProfile;
            }
            set => _userBaseProfile = value;
        }
        public DateTime? LastTransactionsOnlineFetch { get; set; }
        #endregion properties

        #region public functions

        #endregion public functions
    }
}