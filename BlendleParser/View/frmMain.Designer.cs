namespace BlendleParser
{
    partial class frmMain
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmMain));
            this.btnLogin = new System.Windows.Forms.Button();
            this.txtPassword = new System.Windows.Forms.TextBox();
            this.txtUsername = new System.Windows.Forms.TextBox();
            this.lblUsername = new System.Windows.Forms.Label();
            this.lblPassword = new System.Windows.Forms.Label();
            this.cbMagazine = new System.Windows.Forms.ComboBox();
            this.cbYear = new System.Windows.Forms.ComboBox();
            this.lblMagazine = new System.Windows.Forms.Label();
            this.lblYear = new System.Windows.Forms.Label();
            this.btnDownloadAll = new System.Windows.Forms.Button();
            this.btnAllToPDF = new System.Windows.Forms.Button();
            this.lblMonth = new System.Windows.Forms.Label();
            this.cbMonth = new System.Windows.Forms.ComboBox();
            this.pnlAfterLogin = new System.Windows.Forms.Panel();
            this.cbEnableLog = new System.Windows.Forms.CheckBox();
            this.cbSaveLog = new System.Windows.Forms.CheckBox();
            this.nddFontSize = new System.Windows.Forms.NumericUpDown();
            this.lblFontSize = new System.Windows.Forms.Label();
            this.chbForceRedownload = new System.Windows.Forms.CheckBox();
            this.txtLog = new System.Windows.Forms.TextBox();
            this.btnMagazineDownload = new System.Windows.Forms.Button();
            this.btnMonthPdf = new System.Windows.Forms.Button();
            this.btnMagazineToPdf = new System.Windows.Forms.Button();
            this.btnYearDownload = new System.Windows.Forms.Button();
            this.btnYearToPdf = new System.Windows.Forms.Button();
            this.btnMonthDownload = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.lbAllBoughtItems = new System.Windows.Forms.ListBox();
            this.pnlTransactions = new System.Windows.Forms.Panel();
            this.dtpAllBoughtItemsFilterTo = new System.Windows.Forms.DateTimePicker();
            this.dtpAllBoughtItemsFilterFrom = new System.Windows.Forms.DateTimePicker();
            this.bnMergePdfMoveDown = new System.Windows.Forms.Button();
            this.bnMergePdfMoveUp = new System.Windows.Forms.Button();
            this.bnBoughtItemsMoveLeft = new System.Windows.Forms.Button();
            this.bnBoughtItemsMoveRight = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.lbMergedPdf = new System.Windows.Forms.ListBox();
            this.btnTest = new System.Windows.Forms.Button();
            this.lblAllBoughtItemsFilterTo = new System.Windows.Forms.Label();
            this.lblInfoAllBoughtItems = new System.Windows.Forms.Label();
            this.lblAllBoughtItemsFilterFrom = new System.Windows.Forms.Label();
            this.btnAllBoughtItemsPDF = new System.Windows.Forms.Button();
            this.btnAllBoughtItemsDownload = new System.Windows.Forms.Button();
            this.pnlAfterLogin.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nddFontSize)).BeginInit();
            this.pnlTransactions.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnLogin
            // 
            this.btnLogin.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnLogin.Location = new System.Drawing.Point(16, 93);
            this.btnLogin.Name = "btnLogin";
            this.btnLogin.Size = new System.Drawing.Size(400, 42);
            this.btnLogin.TabIndex = 3;
            this.btnLogin.Text = "Login";
            this.btnLogin.UseVisualStyleBackColor = true;
            this.btnLogin.Click += new System.EventHandler(this.btnLogin_Click);
            // 
            // txtPassword
            // 
            this.txtPassword.Font = new System.Drawing.Font("Arial", 15.75F);
            this.txtPassword.Location = new System.Drawing.Point(140, 44);
            this.txtPassword.Name = "txtPassword";
            this.txtPassword.PasswordChar = '*';
            this.txtPassword.Size = new System.Drawing.Size(276, 32);
            this.txtPassword.TabIndex = 2;
            // 
            // txtUsername
            // 
            this.txtUsername.Font = new System.Drawing.Font("Arial", 15.75F);
            this.txtUsername.Location = new System.Drawing.Point(140, 6);
            this.txtUsername.Name = "txtUsername";
            this.txtUsername.Size = new System.Drawing.Size(276, 32);
            this.txtUsername.TabIndex = 1;
            // 
            // lblUsername
            // 
            this.lblUsername.AutoSize = true;
            this.lblUsername.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblUsername.Location = new System.Drawing.Point(12, 9);
            this.lblUsername.Name = "lblUsername";
            this.lblUsername.Size = new System.Drawing.Size(112, 24);
            this.lblUsername.TabIndex = 4;
            this.lblUsername.Text = "Username";
            // 
            // lblPassword
            // 
            this.lblPassword.AutoSize = true;
            this.lblPassword.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblPassword.Location = new System.Drawing.Point(12, 47);
            this.lblPassword.Name = "lblPassword";
            this.lblPassword.Size = new System.Drawing.Size(109, 24);
            this.lblPassword.TabIndex = 5;
            this.lblPassword.Text = "Password";
            // 
            // cbMagazine
            // 
            this.cbMagazine.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbMagazine.Font = new System.Drawing.Font("Arial", 15.75F);
            this.cbMagazine.FormattingEnabled = true;
            this.cbMagazine.Location = new System.Drawing.Point(132, 15);
            this.cbMagazine.Name = "cbMagazine";
            this.cbMagazine.Size = new System.Drawing.Size(164, 32);
            this.cbMagazine.TabIndex = 4;
            // 
            // cbYear
            // 
            this.cbYear.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbYear.Font = new System.Drawing.Font("Arial", 15.75F);
            this.cbYear.FormattingEnabled = true;
            this.cbYear.Location = new System.Drawing.Point(132, 53);
            this.cbYear.Name = "cbYear";
            this.cbYear.Size = new System.Drawing.Size(164, 32);
            this.cbYear.TabIndex = 5;
            // 
            // lblMagazine
            // 
            this.lblMagazine.AutoSize = true;
            this.lblMagazine.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblMagazine.Location = new System.Drawing.Point(4, 15);
            this.lblMagazine.Name = "lblMagazine";
            this.lblMagazine.Size = new System.Drawing.Size(105, 24);
            this.lblMagazine.TabIndex = 8;
            this.lblMagazine.Text = "Magazine";
            // 
            // lblYear
            // 
            this.lblYear.AutoSize = true;
            this.lblYear.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblYear.Location = new System.Drawing.Point(4, 56);
            this.lblYear.Name = "lblYear";
            this.lblYear.Size = new System.Drawing.Size(54, 24);
            this.lblYear.TabIndex = 9;
            this.lblYear.Text = "Year";
            // 
            // btnDownloadAll
            // 
            this.btnDownloadAll.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnDownloadAll.Location = new System.Drawing.Point(8, 185);
            this.btnDownloadAll.Name = "btnDownloadAll";
            this.btnDownloadAll.Size = new System.Drawing.Size(400, 42);
            this.btnDownloadAll.TabIndex = 7;
            this.btnDownloadAll.Text = "Download All";
            this.btnDownloadAll.UseVisualStyleBackColor = true;
            this.btnDownloadAll.Click += new System.EventHandler(this.btnDownloadAll_Click);
            // 
            // btnAllToPDF
            // 
            this.btnAllToPDF.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnAllToPDF.Location = new System.Drawing.Point(8, 233);
            this.btnAllToPDF.Name = "btnAllToPDF";
            this.btnAllToPDF.Size = new System.Drawing.Size(400, 42);
            this.btnAllToPDF.TabIndex = 8;
            this.btnAllToPDF.Text = "All to PDF";
            this.btnAllToPDF.UseVisualStyleBackColor = true;
            this.btnAllToPDF.Click += new System.EventHandler(this.btnAllToPDF_Click);
            // 
            // lblMonth
            // 
            this.lblMonth.AutoSize = true;
            this.lblMonth.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblMonth.Location = new System.Drawing.Point(4, 94);
            this.lblMonth.Name = "lblMonth";
            this.lblMonth.Size = new System.Drawing.Size(73, 24);
            this.lblMonth.TabIndex = 14;
            this.lblMonth.Text = "Month";
            // 
            // cbMonth
            // 
            this.cbMonth.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbMonth.Font = new System.Drawing.Font("Arial", 15.75F);
            this.cbMonth.FormattingEnabled = true;
            this.cbMonth.Location = new System.Drawing.Point(132, 91);
            this.cbMonth.Name = "cbMonth";
            this.cbMonth.Size = new System.Drawing.Size(164, 32);
            this.cbMonth.TabIndex = 6;
            // 
            // pnlAfterLogin
            // 
            this.pnlAfterLogin.Controls.Add(this.cbEnableLog);
            this.pnlAfterLogin.Controls.Add(this.cbSaveLog);
            this.pnlAfterLogin.Controls.Add(this.nddFontSize);
            this.pnlAfterLogin.Controls.Add(this.lblFontSize);
            this.pnlAfterLogin.Controls.Add(this.chbForceRedownload);
            this.pnlAfterLogin.Controls.Add(this.txtLog);
            this.pnlAfterLogin.Controls.Add(this.cbMagazine);
            this.pnlAfterLogin.Controls.Add(this.btnMagazineDownload);
            this.pnlAfterLogin.Controls.Add(this.btnMonthPdf);
            this.pnlAfterLogin.Controls.Add(this.btnMagazineToPdf);
            this.pnlAfterLogin.Controls.Add(this.cbYear);
            this.pnlAfterLogin.Controls.Add(this.btnYearDownload);
            this.pnlAfterLogin.Controls.Add(this.lblMagazine);
            this.pnlAfterLogin.Controls.Add(this.btnYearToPdf);
            this.pnlAfterLogin.Controls.Add(this.lblYear);
            this.pnlAfterLogin.Controls.Add(this.btnMonthDownload);
            this.pnlAfterLogin.Controls.Add(this.btnDownloadAll);
            this.pnlAfterLogin.Controls.Add(this.lblMonth);
            this.pnlAfterLogin.Controls.Add(this.btnAllToPDF);
            this.pnlAfterLogin.Controls.Add(this.cbMonth);
            this.pnlAfterLogin.Location = new System.Drawing.Point(8, 187);
            this.pnlAfterLogin.Name = "pnlAfterLogin";
            this.pnlAfterLogin.Size = new System.Drawing.Size(419, 472);
            this.pnlAfterLogin.TabIndex = 20;
            // 
            // cbEnableLog
            // 
            this.cbEnableLog.AutoSize = true;
            this.cbEnableLog.Checked = true;
            this.cbEnableLog.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cbEnableLog.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold);
            this.cbEnableLog.Location = new System.Drawing.Point(108, 153);
            this.cbEnableLog.Name = "cbEnableLog";
            this.cbEnableLog.Size = new System.Drawing.Size(109, 23);
            this.cbEnableLog.TabIndex = 27;
            this.cbEnableLog.Text = "Enable log";
            this.cbEnableLog.UseVisualStyleBackColor = true;
            this.cbEnableLog.CheckedChanged += new System.EventHandler(this.cbEnableLog_CheckChanged);
            // 
            // cbSaveLog
            // 
            this.cbSaveLog.AutoSize = true;
            this.cbSaveLog.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold);
            this.cbSaveLog.Location = new System.Drawing.Point(8, 153);
            this.cbSaveLog.Name = "cbSaveLog";
            this.cbSaveLog.Size = new System.Drawing.Size(94, 23);
            this.cbSaveLog.TabIndex = 26;
            this.cbSaveLog.Text = "Save log";
            this.cbSaveLog.UseVisualStyleBackColor = true;
            this.cbSaveLog.CheckedChanged += new System.EventHandler(this.cbSaveLog_CheckChanged);
            // 
            // nddFontSize
            // 
            this.nddFontSize.Font = new System.Drawing.Font("Arial", 12F);
            this.nddFontSize.Location = new System.Drawing.Point(358, 127);
            this.nddFontSize.Maximum = new decimal(new int[] {
            999,
            0,
            0,
            0});
            this.nddFontSize.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nddFontSize.Name = "nddFontSize";
            this.nddFontSize.Size = new System.Drawing.Size(50, 26);
            this.nddFontSize.TabIndex = 25;
            this.nddFontSize.Value = new decimal(new int[] {
            25,
            0,
            0,
            0});
            // 
            // lblFontSize
            // 
            this.lblFontSize.AutoSize = true;
            this.lblFontSize.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold);
            this.lblFontSize.Location = new System.Drawing.Point(275, 130);
            this.lblFontSize.Name = "lblFontSize";
            this.lblFontSize.Size = new System.Drawing.Size(85, 19);
            this.lblFontSize.TabIndex = 22;
            this.lblFontSize.Text = "Font size:";
            // 
            // chbForceRedownload
            // 
            this.chbForceRedownload.AutoSize = true;
            this.chbForceRedownload.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold);
            this.chbForceRedownload.Location = new System.Drawing.Point(8, 128);
            this.chbForceRedownload.Name = "chbForceRedownload";
            this.chbForceRedownload.Size = new System.Drawing.Size(167, 23);
            this.chbForceRedownload.TabIndex = 21;
            this.chbForceRedownload.Text = "Force redownload";
            this.chbForceRedownload.UseVisualStyleBackColor = true;
            // 
            // txtLog
            // 
            this.txtLog.Font = new System.Drawing.Font("Arial", 14F);
            this.txtLog.Location = new System.Drawing.Point(8, 281);
            this.txtLog.Multiline = true;
            this.txtLog.Name = "txtLog";
            this.txtLog.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtLog.Size = new System.Drawing.Size(400, 176);
            this.txtLog.TabIndex = 20;
            // 
            // btnMagazineDownload
            // 
            this.btnMagazineDownload.BackgroundImage = global::BlendleParser.Properties.Resources.download;
            this.btnMagazineDownload.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnMagazineDownload.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnMagazineDownload.Location = new System.Drawing.Point(320, 14);
            this.btnMagazineDownload.Name = "btnMagazineDownload";
            this.btnMagazineDownload.Size = new System.Drawing.Size(41, 32);
            this.btnMagazineDownload.TabIndex = 19;
            this.btnMagazineDownload.TabStop = false;
            this.btnMagazineDownload.UseVisualStyleBackColor = true;
            this.btnMagazineDownload.Click += new System.EventHandler(this.btnMagazineDownload_Click);
            // 
            // btnMonthPdf
            // 
            this.btnMonthPdf.BackgroundImage = global::BlendleParser.Properties.Resources.pdf_solid;
            this.btnMonthPdf.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnMonthPdf.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnMonthPdf.Location = new System.Drawing.Point(367, 91);
            this.btnMonthPdf.Name = "btnMonthPdf";
            this.btnMonthPdf.Size = new System.Drawing.Size(41, 32);
            this.btnMonthPdf.TabIndex = 0;
            this.btnMonthPdf.TabStop = false;
            this.btnMonthPdf.UseVisualStyleBackColor = true;
            this.btnMonthPdf.Click += new System.EventHandler(this.btnMonthPdf_Click);
            // 
            // btnMagazineToPdf
            // 
            this.btnMagazineToPdf.BackgroundImage = global::BlendleParser.Properties.Resources.pdf_solid;
            this.btnMagazineToPdf.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnMagazineToPdf.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnMagazineToPdf.Location = new System.Drawing.Point(367, 14);
            this.btnMagazineToPdf.Name = "btnMagazineToPdf";
            this.btnMagazineToPdf.Size = new System.Drawing.Size(41, 32);
            this.btnMagazineToPdf.TabIndex = 18;
            this.btnMagazineToPdf.TabStop = false;
            this.btnMagazineToPdf.UseVisualStyleBackColor = true;
            this.btnMagazineToPdf.Click += new System.EventHandler(this.btnMagazineToPdf_Click);
            // 
            // btnYearDownload
            // 
            this.btnYearDownload.BackgroundImage = global::BlendleParser.Properties.Resources.download;
            this.btnYearDownload.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnYearDownload.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnYearDownload.Location = new System.Drawing.Point(320, 53);
            this.btnYearDownload.Name = "btnYearDownload";
            this.btnYearDownload.Size = new System.Drawing.Size(41, 32);
            this.btnYearDownload.TabIndex = 17;
            this.btnYearDownload.TabStop = false;
            this.btnYearDownload.UseVisualStyleBackColor = true;
            this.btnYearDownload.Click += new System.EventHandler(this.btnYearDownload_Click);
            // 
            // btnYearToPdf
            // 
            this.btnYearToPdf.BackgroundImage = global::BlendleParser.Properties.Resources.pdf_solid;
            this.btnYearToPdf.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnYearToPdf.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnYearToPdf.Location = new System.Drawing.Point(367, 53);
            this.btnYearToPdf.Name = "btnYearToPdf";
            this.btnYearToPdf.Size = new System.Drawing.Size(41, 32);
            this.btnYearToPdf.TabIndex = 16;
            this.btnYearToPdf.TabStop = false;
            this.btnYearToPdf.UseVisualStyleBackColor = true;
            this.btnYearToPdf.Click += new System.EventHandler(this.btnYearToPdf_Click);
            // 
            // btnMonthDownload
            // 
            this.btnMonthDownload.BackgroundImage = global::BlendleParser.Properties.Resources.download;
            this.btnMonthDownload.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnMonthDownload.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnMonthDownload.Location = new System.Drawing.Point(320, 91);
            this.btnMonthDownload.Name = "btnMonthDownload";
            this.btnMonthDownload.Size = new System.Drawing.Size(41, 32);
            this.btnMonthDownload.TabIndex = 15;
            this.btnMonthDownload.TabStop = false;
            this.btnMonthDownload.UseVisualStyleBackColor = true;
            this.btnMonthDownload.Click += new System.EventHandler(this.btnMonthDownload_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnCancel.Location = new System.Drawing.Point(16, 667);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(1181, 42);
            this.btnCancel.TabIndex = 21;
            this.btnCancel.Text = "Cancel Operation";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // lbAllBoughtItems
            // 
            this.lbAllBoughtItems.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lbAllBoughtItems.FormattingEnabled = true;
            this.lbAllBoughtItems.ItemHeight = 24;
            this.lbAllBoughtItems.Location = new System.Drawing.Point(3, 43);
            this.lbAllBoughtItems.Name = "lbAllBoughtItems";
            this.lbAllBoughtItems.ScrollAlwaysVisible = true;
            this.lbAllBoughtItems.SelectionMode = System.Windows.Forms.SelectionMode.MultiSimple;
            this.lbAllBoughtItems.Size = new System.Drawing.Size(333, 484);
            this.lbAllBoughtItems.TabIndex = 22;
            // 
            // pnlTransactions
            // 
            this.pnlTransactions.Controls.Add(this.dtpAllBoughtItemsFilterTo);
            this.pnlTransactions.Controls.Add(this.dtpAllBoughtItemsFilterFrom);
            this.pnlTransactions.Controls.Add(this.bnMergePdfMoveDown);
            this.pnlTransactions.Controls.Add(this.bnMergePdfMoveUp);
            this.pnlTransactions.Controls.Add(this.bnBoughtItemsMoveLeft);
            this.pnlTransactions.Controls.Add(this.bnBoughtItemsMoveRight);
            this.pnlTransactions.Controls.Add(this.label1);
            this.pnlTransactions.Controls.Add(this.lbMergedPdf);
            this.pnlTransactions.Controls.Add(this.btnTest);
            this.pnlTransactions.Controls.Add(this.lblAllBoughtItemsFilterTo);
            this.pnlTransactions.Controls.Add(this.lblInfoAllBoughtItems);
            this.pnlTransactions.Controls.Add(this.lblAllBoughtItemsFilterFrom);
            this.pnlTransactions.Controls.Add(this.lbAllBoughtItems);
            this.pnlTransactions.Controls.Add(this.btnAllBoughtItemsPDF);
            this.pnlTransactions.Controls.Add(this.btnAllBoughtItemsDownload);
            this.pnlTransactions.Location = new System.Drawing.Point(447, -5);
            this.pnlTransactions.Name = "pnlTransactions";
            this.pnlTransactions.Size = new System.Drawing.Size(769, 664);
            this.pnlTransactions.TabIndex = 23;
            // 
            // dtpAllBoughtItemsFilterTo
            // 
            this.dtpAllBoughtItemsFilterTo.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dtpAllBoughtItemsFilterTo.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dtpAllBoughtItemsFilterTo.Location = new System.Drawing.Point(79, 587);
            this.dtpAllBoughtItemsFilterTo.Name = "dtpAllBoughtItemsFilterTo";
            this.dtpAllBoughtItemsFilterTo.Size = new System.Drawing.Size(143, 26);
            this.dtpAllBoughtItemsFilterTo.TabIndex = 32;
            // 
            // dtpAllBoughtItemsFilterFrom
            // 
            this.dtpAllBoughtItemsFilterFrom.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dtpAllBoughtItemsFilterFrom.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dtpAllBoughtItemsFilterFrom.Location = new System.Drawing.Point(79, 555);
            this.dtpAllBoughtItemsFilterFrom.Name = "dtpAllBoughtItemsFilterFrom";
            this.dtpAllBoughtItemsFilterFrom.Size = new System.Drawing.Size(143, 26);
            this.dtpAllBoughtItemsFilterFrom.TabIndex = 32;
            // 
            // bnMergePdfMoveDown
            // 
            this.bnMergePdfMoveDown.BackgroundImage = global::BlendleParser.Properties.Resources.arrow_down;
            this.bnMergePdfMoveDown.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.bnMergePdfMoveDown.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.bnMergePdfMoveDown.Location = new System.Drawing.Point(722, 84);
            this.bnMergePdfMoveDown.Name = "bnMergePdfMoveDown";
            this.bnMergePdfMoveDown.Size = new System.Drawing.Size(35, 35);
            this.bnMergePdfMoveDown.TabIndex = 31;
            this.bnMergePdfMoveDown.TabStop = false;
            this.bnMergePdfMoveDown.UseVisualStyleBackColor = true;
            this.bnMergePdfMoveDown.Click += new System.EventHandler(this.bnMergePdfMoveDown_Click);
            // 
            // bnMergePdfMoveUp
            // 
            this.bnMergePdfMoveUp.BackgroundImage = global::BlendleParser.Properties.Resources.arrow_up;
            this.bnMergePdfMoveUp.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.bnMergePdfMoveUp.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.bnMergePdfMoveUp.Location = new System.Drawing.Point(722, 43);
            this.bnMergePdfMoveUp.Name = "bnMergePdfMoveUp";
            this.bnMergePdfMoveUp.Size = new System.Drawing.Size(35, 35);
            this.bnMergePdfMoveUp.TabIndex = 31;
            this.bnMergePdfMoveUp.TabStop = false;
            this.bnMergePdfMoveUp.UseVisualStyleBackColor = true;
            this.bnMergePdfMoveUp.Click += new System.EventHandler(this.bnMergePdfMoveUp_Click);
            // 
            // bnBoughtItemsMoveLeft
            // 
            this.bnBoughtItemsMoveLeft.BackgroundImage = global::BlendleParser.Properties.Resources.arrow_left;
            this.bnBoughtItemsMoveLeft.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.bnBoughtItemsMoveLeft.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.bnBoughtItemsMoveLeft.Location = new System.Drawing.Point(342, 286);
            this.bnBoughtItemsMoveLeft.Name = "bnBoughtItemsMoveLeft";
            this.bnBoughtItemsMoveLeft.Size = new System.Drawing.Size(35, 35);
            this.bnBoughtItemsMoveLeft.TabIndex = 31;
            this.bnBoughtItemsMoveLeft.TabStop = false;
            this.bnBoughtItemsMoveLeft.UseVisualStyleBackColor = true;
            this.bnBoughtItemsMoveLeft.Click += new System.EventHandler(this.bnBoughtItemsMoveLeft_Click);
            // 
            // bnBoughtItemsMoveRight
            // 
            this.bnBoughtItemsMoveRight.BackgroundImage = global::BlendleParser.Properties.Resources.arrow_right;
            this.bnBoughtItemsMoveRight.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.bnBoughtItemsMoveRight.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.bnBoughtItemsMoveRight.Location = new System.Drawing.Point(342, 242);
            this.bnBoughtItemsMoveRight.Name = "bnBoughtItemsMoveRight";
            this.bnBoughtItemsMoveRight.Size = new System.Drawing.Size(35, 35);
            this.bnBoughtItemsMoveRight.TabIndex = 31;
            this.bnBoughtItemsMoveRight.TabStop = false;
            this.bnBoughtItemsMoveRight.UseVisualStyleBackColor = true;
            this.bnBoughtItemsMoveRight.Click += new System.EventHandler(this.bnBoughtItemsMoveRight_Click);
            // 
            // label1
            // 
            this.label1.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.label1.Location = new System.Drawing.Point(395, 11);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(333, 24);
            this.label1.TabIndex = 30;
            this.label1.Text = "Create pdf";
            this.label1.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // lbMergedPdf
            // 
            this.lbMergedPdf.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lbMergedPdf.FormattingEnabled = true;
            this.lbMergedPdf.ItemHeight = 24;
            this.lbMergedPdf.Location = new System.Drawing.Point(383, 43);
            this.lbMergedPdf.Name = "lbMergedPdf";
            this.lbMergedPdf.ScrollAlwaysVisible = true;
            this.lbMergedPdf.SelectionMode = System.Windows.Forms.SelectionMode.MultiSimple;
            this.lbMergedPdf.Size = new System.Drawing.Size(333, 484);
            this.lbMergedPdf.TabIndex = 29;
            // 
            // btnTest
            // 
            this.btnTest.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnTest.Location = new System.Drawing.Point(155, 625);
            this.btnTest.Name = "btnTest";
            this.btnTest.Size = new System.Drawing.Size(169, 31);
            this.btnTest.TabIndex = 24;
            this.btnTest.Text = "TEST";
            this.btnTest.UseVisualStyleBackColor = true;
            this.btnTest.Click += new System.EventHandler(this.btnTest_Click);
            // 
            // lblAllBoughtItemsFilterTo
            // 
            this.lblAllBoughtItemsFilterTo.AutoSize = true;
            this.lblAllBoughtItemsFilterTo.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblAllBoughtItemsFilterTo.Location = new System.Drawing.Point(3, 589);
            this.lblAllBoughtItemsFilterTo.Name = "lblAllBoughtItemsFilterTo";
            this.lblAllBoughtItemsFilterTo.Size = new System.Drawing.Size(41, 24);
            this.lblAllBoughtItemsFilterTo.TabIndex = 24;
            this.lblAllBoughtItemsFilterTo.Text = "To:";
            // 
            // lblInfoAllBoughtItems
            // 
            this.lblInfoAllBoughtItems.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblInfoAllBoughtItems.Location = new System.Drawing.Point(3, 11);
            this.lblInfoAllBoughtItems.Name = "lblInfoAllBoughtItems";
            this.lblInfoAllBoughtItems.Size = new System.Drawing.Size(333, 24);
            this.lblInfoAllBoughtItems.TabIndex = 25;
            this.lblInfoAllBoughtItems.Text = "All Bought Items";
            this.lblInfoAllBoughtItems.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // lblAllBoughtItemsFilterFrom
            // 
            this.lblAllBoughtItemsFilterFrom.AutoSize = true;
            this.lblAllBoughtItemsFilterFrom.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblAllBoughtItemsFilterFrom.Location = new System.Drawing.Point(3, 557);
            this.lblAllBoughtItemsFilterFrom.Name = "lblAllBoughtItemsFilterFrom";
            this.lblAllBoughtItemsFilterFrom.Size = new System.Drawing.Size(70, 24);
            this.lblAllBoughtItemsFilterFrom.TabIndex = 24;
            this.lblAllBoughtItemsFilterFrom.Text = "From:";
            // 
            // btnAllBoughtItemsPDF
            // 
            this.btnAllBoughtItemsPDF.BackgroundImage = global::BlendleParser.Properties.Resources.pdf_solid;
            this.btnAllBoughtItemsPDF.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnAllBoughtItemsPDF.Enabled = false;
            this.btnAllBoughtItemsPDF.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnAllBoughtItemsPDF.Location = new System.Drawing.Point(545, 557);
            this.btnAllBoughtItemsPDF.Name = "btnAllBoughtItemsPDF";
            this.btnAllBoughtItemsPDF.Size = new System.Drawing.Size(60, 60);
            this.btnAllBoughtItemsPDF.TabIndex = 0;
            this.btnAllBoughtItemsPDF.TabStop = false;
            this.btnAllBoughtItemsPDF.UseVisualStyleBackColor = true;
            this.btnAllBoughtItemsPDF.Click += new System.EventHandler(this.btnAllBoughtItemsPDF_Click);
            // 
            // btnAllBoughtItemsDownload
            // 
            this.btnAllBoughtItemsDownload.BackgroundImage = global::BlendleParser.Properties.Resources.download;
            this.btnAllBoughtItemsDownload.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnAllBoughtItemsDownload.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnAllBoughtItemsDownload.Location = new System.Drawing.Point(342, 519);
            this.btnAllBoughtItemsDownload.Name = "btnAllBoughtItemsDownload";
            this.btnAllBoughtItemsDownload.Size = new System.Drawing.Size(41, 32);
            this.btnAllBoughtItemsDownload.TabIndex = 15;
            this.btnAllBoughtItemsDownload.TabStop = false;
            this.btnAllBoughtItemsDownload.UseVisualStyleBackColor = true;
            this.btnAllBoughtItemsDownload.Click += new System.EventHandler(this.btnAllBoughtItemsDownload_Click);
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1228, 717);
            this.Controls.Add(this.pnlTransactions);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.pnlAfterLogin);
            this.Controls.Add(this.lblPassword);
            this.Controls.Add(this.lblUsername);
            this.Controls.Add(this.txtUsername);
            this.Controls.Add(this.txtPassword);
            this.Controls.Add(this.btnLogin);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "frmMain";
            this.Text = "Ubah-BlendleParser";
            this.Load += new System.EventHandler(this.FrmMain_Load);
            this.pnlAfterLogin.ResumeLayout(false);
            this.pnlAfterLogin.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nddFontSize)).EndInit();
            this.pnlTransactions.ResumeLayout(false);
            this.pnlTransactions.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnMonthPdf;
        private System.Windows.Forms.Button btnLogin;
        private System.Windows.Forms.TextBox txtPassword;
        private System.Windows.Forms.TextBox txtUsername;
        private System.Windows.Forms.Label lblUsername;
        private System.Windows.Forms.Label lblPassword;
        private System.Windows.Forms.ComboBox cbMagazine;
        private System.Windows.Forms.ComboBox cbYear;
        private System.Windows.Forms.Label lblMagazine;
        private System.Windows.Forms.Label lblYear;
        private System.Windows.Forms.Button btnDownloadAll;
        private System.Windows.Forms.Button btnAllToPDF;
        private System.Windows.Forms.Label lblMonth;
        private System.Windows.Forms.ComboBox cbMonth;
        private System.Windows.Forms.Button btnMonthDownload;
        private System.Windows.Forms.Button btnYearDownload;
        private System.Windows.Forms.Button btnYearToPdf;
        private System.Windows.Forms.Button btnMagazineDownload;
        private System.Windows.Forms.Button btnMagazineToPdf;
        private System.Windows.Forms.Panel pnlAfterLogin;
        private System.Windows.Forms.TextBox txtLog;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.CheckBox chbForceRedownload;
        private System.Windows.Forms.ListBox lbAllBoughtItems;
        private System.Windows.Forms.Panel pnlTransactions;
        private System.Windows.Forms.Label lblAllBoughtItemsFilterFrom;
        private System.Windows.Forms.Label lblInfoAllBoughtItems;
        private System.Windows.Forms.Button btnAllBoughtItemsPDF;
        private System.Windows.Forms.Button btnAllBoughtItemsDownload;
        private System.Windows.Forms.NumericUpDown nddFontSize;
        private System.Windows.Forms.Label lblFontSize;
        private System.Windows.Forms.CheckBox cbSaveLog;
        private System.Windows.Forms.Button btnTest;
        private System.Windows.Forms.CheckBox cbEnableLog;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ListBox lbMergedPdf;
        private System.Windows.Forms.Button bnBoughtItemsMoveRight;
        private System.Windows.Forms.Button bnBoughtItemsMoveLeft;
        private System.Windows.Forms.DateTimePicker dtpAllBoughtItemsFilterFrom;
        private System.Windows.Forms.DateTimePicker dtpAllBoughtItemsFilterTo;
        private System.Windows.Forms.Label lblAllBoughtItemsFilterTo;
        private System.Windows.Forms.Button bnMergePdfMoveDown;
        private System.Windows.Forms.Button bnMergePdfMoveUp;
    }
}

