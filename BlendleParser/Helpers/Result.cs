using System;
using System.Collections.Generic;
using System.Linq;

namespace BlendleParser.Helpers
{
    public class Result
    {
        private string _message;
        private object _data;
        private bool _succeeded;
        private bool _hasDownloadedItems;
        private Exception _exception;
        private List<string> _logs;

        public string Message { get { return _message; } set { _message = value; } }
        public object Data { get { return _data; } set { _data = value; } }
        public bool Succeeded { get { return _succeeded; } set { _succeeded = value; } }
        public Exception Exception { get { return _exception; } set { _exception = value; } }
        public List<string> Logs
        {
            get
            {
                if(_logs == null)
                    _logs = new List<string>();
                return _logs;
            }
            set => _logs = value;
        }

        public bool HasDownloadedItems
        {
            get => _hasDownloadedItems;
            set => _hasDownloadedItems = value;
        }

        public Result()
        {
        }
        public Result(bool succeeded)
        {
            _succeeded = succeeded;
        }

        public void MergeResult(Result input)
        {
            if (this.Logs != null)
            {
                this.Logs = new List<string>();
            }
            if (input.Logs != null && input.Logs.Any())
            {
                this.Logs.AddRange(input.Logs);
            }
            this.Succeeded = input.Succeeded;
            if (input.Succeeded == false)
            {
                if (input.Message.IsNullOrEmpty() == false)
                {
                    this.Logs.Add(input.Message);
                }
                if (input.Exception != null)
                {
                    this.Logs.Add(input.Exception.Message + Environment.NewLine + Environment.NewLine + input.Exception.StackTrace);
                }
            }
        }
        public void MergeResult<T>(Result<T> input)
        {
            if (this.Logs != null)
            {
                this.Logs = new List<string>();
            }
            if (input.Logs != null && input.Logs.Any())
            {
                this.Logs.AddRange(input.Logs);
            }
            this.Succeeded = input.Succeeded;
            if (input.Succeeded == false)
            {
                if (input.Message.IsNullOrEmpty() == false)
                {
                    this.Logs.Add(input.Message);
                }
                if (input.Exception != null)
                {
                    this.Logs.Add(input.Exception.Message + Environment.NewLine + Environment.NewLine + input.Exception.StackTrace);
                }
            }
        }
    }

    public class Result<T>
    {
        private string _message;
        private T _data;
        private bool _succeeded;
        private bool _hasDownloadedItems;
        private Exception _exception;
        private List<string> _logs;

        public string Message { get { return _message; } set { _message = value; } }
        public T Data { get { return _data; } set { _data = value; } }
        public bool Succeeded { get { return _succeeded; } set { _succeeded = value; } }
        public Exception Exception { get { return _exception; } set { _exception = value; } }
        public List<string> Logs
        {
            get
            {
                if (_logs == null)
                    _logs = new List<string>();
                return _logs;
            }
            set => _logs = value;
        }

        public bool HasDownloadedItems
        {
            get => _hasDownloadedItems;
            set => _hasDownloadedItems = value;
        }

        public Result()
        {
        }
        public Result(bool succeeded)
        {
            _succeeded = succeeded;
        }

        public void MergeResult(Result input)
        {
            if (this.Logs == null)
            {
                this.Logs = new List<string>();
            }
            if (input.Logs != null && input.Logs.Any())
            {
                this.Logs.AddRange(input.Logs);
            }
            this.Succeeded = input.Succeeded;
            if (input.Succeeded == false)
            {
                if (input.Message.IsNullOrEmpty() == false)
                {
                    this.Logs.Add(input.Message);
                }
                if (input.Exception != null)
                {
                    this.Logs.Add(input.Exception.Message + Environment.NewLine + Environment.NewLine + input.Exception.StackTrace);
                }
            }
        }
        public void MergeResult<T>(Result<T> input)
        {
            if (this.Logs == null)
            {
                this.Logs = new List<string>();
            }
            if (input.Logs != null && input.Logs.Any())
            {
                this.Logs.AddRange(input.Logs);
            }
            this.Succeeded = input.Succeeded;
            if (input.Succeeded == false)
            {
                if (input.Message.IsNullOrEmpty() == false)
                {
                    this.Logs.Add(input.Message);
                }
                if (input.Exception != null)
                {
                    this.Logs.Add(input.Exception.Message + Environment.NewLine + Environment.NewLine + input.Exception.StackTrace);
                }
            }
        }
    }
}