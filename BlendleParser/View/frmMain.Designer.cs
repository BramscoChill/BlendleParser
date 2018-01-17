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
            this.btnLogin.Location = new System.Drawing.Point(24, 143);
            this.btnLogin.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnLogin.Name = "btnLogin";
            this.btnLogin.Size = new System.Drawing.Size(600, 65);
            this.btnLogin.TabIndex = 3;
            this.btnLogin.Text = "Login";
            this.btnLogin.UseVisualStyleBackColor = true;
            this.btnLogin.Click += new System.EventHandler(this.btnLogin_Click);
            // 
            // txtPassword
            // 
            this.txtPassword.Font = new System.Drawing.Font("Arial", 15.75F);
            this.txtPassword.Location = new System.Drawing.Point(210, 68);
            this.txtPassword.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.txtPassword.Name = "txtPassword";
            this.txtPassword.PasswordChar = '*';
            this.txtPassword.Size = new System.Drawing.Size(412, 32);
            this.txtPassword.TabIndex = 2;
            // 
            // txtUsername
            // 
            this.txtUsername.Font = new System.Drawing.Font("Arial", 15.75F);
            this.txtUsername.Location = new System.Drawing.Point(210, 9);
            this.txtUsername.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.txtUsername.Name = "txtUsername";
            this.txtUsername.Size = new System.Drawing.Size(412, 32);
            this.txtUsername.TabIndex = 1;
            // 
            // lblUsername
            // 
            this.lblUsername.AutoSize = true;
            this.lblUsername.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblUsername.Location = new System.Drawing.Point(18, 14);
            this.lblUsername.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblUsername.Name = "lblUsername";
            this.lblUsername.Size = new System.Drawing.Size(112, 24);
            this.lblUsername.TabIndex = 4;
            this.lblUsername.Text = "Username";
            // 
            // lblPassword
            // 
            this.lblPassword.AutoSize = true;
            this.lblPassword.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblPassword.Location = new System.Drawing.Point(18, 72);
            this.lblPassword.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
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
            this.cbMagazine.Location = new System.Drawing.Point(198, 23);
            this.cbMagazine.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.cbMagazine.Name = "cbMagazine";
            this.cbMagazine.Size = new System.Drawing.Size(244, 32);
            this.cbMagazine.TabIndex = 4;
            // 
            // cbYear
            // 
            this.cbYear.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbYear.Font = new System.Drawing.Font("Arial", 15.75F);
            this.cbYear.FormattingEnabled = true;
            this.cbYear.Location = new System.Drawing.Point(198, 82);
            this.cbYear.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.cbYear.Name = "cbYear";
            this.cbYear.Size = new System.Drawing.Size(244, 32);
            this.cbYear.TabIndex = 5;
            // 
            // lblMagazine
            // 
            this.lblMagazine.AutoSize = true;
            this.lblMagazine.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblMagazine.Location = new System.Drawing.Point(6, 23);
            this.lblMagazine.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblMagazine.Name = "lblMagazine";
            this.lblMagazine.Size = new System.Drawing.Size(105, 24);
            this.lblMagazine.TabIndex = 8;
            this.lblMagazine.Text = "Magazine";
            // 
            // lblYear
            // 
            this.lblYear.AutoSize = true;
            this.lblYear.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblYear.Location = new System.Drawing.Point(6, 86);
            this.lblYear.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblYear.Name = "lblYear";
            this.lblYear.Size = new System.Drawing.Size(54, 24);
            this.lblYear.TabIndex = 9;
            this.lblYear.Text = "Year";
            // 
            // btnDownloadAll
            // 
            this.btnDownloadAll.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnDownloadAll.Location = new System.Drawing.Point(12, 285);
            this.btnDownloadAll.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnDownloadAll.Name = "btnDownloadAll";
            this.btnDownloadAll.Size = new System.Drawing.Size(600, 65);
            this.btnDownloadAll.TabIndex = 7;
            this.btnDownloadAll.Text = "Download All";
            this.btnDownloadAll.UseVisualStyleBackColor = true;
            this.btnDownloadAll.Click += new System.EventHandler(this.btnDownloadAll_Click);
            // 
            // btnAllToPDF
            // 
            this.btnAllToPDF.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnAllToPDF.Location = new System.Drawing.Point(12, 358);
            this.btnAllToPDF.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnAllToPDF.Name = "btnAllToPDF";
            this.btnAllToPDF.Size = new System.Drawing.Size(600, 65);
            this.btnAllToPDF.TabIndex = 8;
            this.btnAllToPDF.Text = "All to PDF";
            this.btnAllToPDF.UseVisualStyleBackColor = true;
            this.btnAllToPDF.Click += new System.EventHandler(this.btnAllToPDF_Click);
            // 
            // lblMonth
            // 
            this.lblMonth.AutoSize = true;
            this.lblMonth.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblMonth.Location = new System.Drawing.Point(6, 145);
            this.lblMonth.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
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
            this.cbMonth.Location = new System.Drawing.Point(198, 140);
            this.cbMonth.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.cbMonth.Name = "cbMonth";
            this.cbMonth.Size = new System.Drawing.Size(244, 32);
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
            this.pnlAfterLogin.Location = new System.Drawing.Point(12, 288);
            this.pnlAfterLogin.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.pnlAfterLogin.Name = "pnlAfterLogin";
            this.pnlAfterLogin.Size = new System.Drawing.Size(628, 726);
            this.pnlAfterLogin.TabIndex = 20;
            // 
            // cbEnableLog
            // 
            this.cbEnableLog.AutoSize = true;
            this.cbEnableLog.Checked = true;
            this.cbEnableLog.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cbEnableLog.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold);
            this.cbEnableLog.Location = new System.Drawing.Point(162, 235);
            this.cbEnableLog.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
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
            this.cbSaveLog.Location = new System.Drawing.Point(12, 235);
            this.cbSaveLog.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
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
            this.nddFontSize.Location = new System.Drawing.Point(537, 195);
            this.nddFontSize.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
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
            this.nddFontSize.Size = new System.Drawing.Size(75, 26);
            this.nddFontSize.TabIndex = 25;
            this.nddFontSize.Value = new decimal(new int[] {
            13,
            0,
            0,
            0});
            // 
            // lblFontSize
            // 
            this.lblFontSize.AutoSize = true;
            this.lblFontSize.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold);
            this.lblFontSize.Location = new System.Drawing.Point(412, 200);
            this.lblFontSize.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblFontSize.Name = "lblFontSize";
            this.lblFontSize.Size = new System.Drawing.Size(85, 19);
            this.lblFontSize.TabIndex = 22;
            this.lblFontSize.Text = "Font size:";
            // 
            // chbForceRedownload
            // 
            this.chbForceRedownload.AutoSize = true;
            this.chbForceRedownload.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold);
            this.chbForceRedownload.Location = new System.Drawing.Point(12, 197);
            this.chbForceRedownload.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.chbForceRedownload.Name = "chbForceRedownload";
            this.chbForceRedownload.Size = new System.Drawing.Size(167, 23);
            this.chbForceRedownload.TabIndex = 21;
            this.chbForceRedownload.Text = "Force redownload";
            this.chbForceRedownload.UseVisualStyleBackColor = true;
            // 
            // txtLog
            // 
            this.txtLog.Font = new System.Drawing.Font("Arial", 14F);
            this.txtLog.Location = new System.Drawing.Point(12, 432);
            this.txtLog.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.txtLog.Multiline = true;
            this.txtLog.Name = "txtLog";
            this.txtLog.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtLog.Size = new System.Drawing.Size(598, 269);
            this.txtLog.TabIndex = 20;
            // 
            // btnMagazineDownload
            // 
            this.btnMagazineDownload.BackgroundImage = global::BlendleParser.Properties.Resources.download;
            this.btnMagazineDownload.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.btnMagazineDownload.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnMagazineDownload.Location = new System.Drawing.Point(480, 22);
            this.btnMagazineDownload.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnMagazineDownload.Name = "btnMagazineDownload";
            this.btnMagazineDownload.Size = new System.Drawing.Size(62, 49);
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
            this.btnMonthPdf.Location = new System.Drawing.Point(550, 140);
            this.btnMonthPdf.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnMonthPdf.Name = "btnMonthPdf";
            this.btnMonthPdf.Size = new System.Drawing.Size(62, 49);
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
            this.btnMagazineToPdf.Location = new System.Drawing.Point(550, 22);
            this.btnMagazineToPdf.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnMagazineToPdf.Name = "btnMagazineToPdf";
            this.btnMagazineToPdf.Size = new System.Drawing.Size(62, 49);
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
            this.btnYearDownload.Location = new System.Drawing.Point(480, 82);
            this.btnYearDownload.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnYearDownload.Name = "btnYearDownload";
            this.btnYearDownload.Size = new System.Drawing.Size(62, 49);
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
            this.btnYearToPdf.Location = new System.Drawing.Point(550, 82);
            this.btnYearToPdf.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnYearToPdf.Name = "btnYearToPdf";
            this.btnYearToPdf.Size = new System.Drawing.Size(62, 49);
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
            this.btnMonthDownload.Location = new System.Drawing.Point(480, 140);
            this.btnMonthDownload.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnMonthDownload.Name = "btnMonthDownload";
            this.btnMonthDownload.Size = new System.Drawing.Size(62, 49);
            this.btnMonthDownload.TabIndex = 15;
            this.btnMonthDownload.TabStop = false;
            this.btnMonthDownload.UseVisualStyleBackColor = true;
            this.btnMonthDownload.Click += new System.EventHandler(this.btnMonthDownload_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnCancel.Location = new System.Drawing.Point(24, 1026);
            this.btnCancel.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(1772, 65);
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
            this.lbAllBoughtItems.Location = new System.Drawing.Point(4, 66);
            this.lbAllBoughtItems.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.lbAllBoughtItems.Name = "lbAllBoughtItems";
            this.lbAllBoughtItems.ScrollAlwaysVisible = true;
            this.lbAllBoughtItems.SelectionMode = System.Windows.Forms.SelectionMode.MultiSimple;
            this.lbAllBoughtItems.Size = new System.Drawing.Size(498, 724);
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
            this.pnlTransactions.Location = new System.Drawing.Point(670, -8);
            this.pnlTransactions.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.pnlTransactions.Name = "pnlTransactions";
            this.pnlTransactions.Size = new System.Drawing.Size(1154, 1022);
            this.pnlTransactions.TabIndex = 23;
            // 
            // dtpAllBoughtItemsFilterTo
            // 
            this.dtpAllBoughtItemsFilterTo.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dtpAllBoughtItemsFilterTo.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dtpAllBoughtItemsFilterTo.Location = new System.Drawing.Point(118, 903);
            this.dtpAllBoughtItemsFilterTo.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.dtpAllBoughtItemsFilterTo.Name = "dtpAllBoughtItemsFilterTo";
            this.dtpAllBoughtItemsFilterTo.Size = new System.Drawing.Size(212, 26);
            this.dtpAllBoughtItemsFilterTo.TabIndex = 32;
            // 
            // dtpAllBoughtItemsFilterFrom
            // 
            this.dtpAllBoughtItemsFilterFrom.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dtpAllBoughtItemsFilterFrom.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dtpAllBoughtItemsFilterFrom.Location = new System.Drawing.Point(118, 854);
            this.dtpAllBoughtItemsFilterFrom.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.dtpAllBoughtItemsFilterFrom.Name = "dtpAllBoughtItemsFilterFrom";
            this.dtpAllBoughtItemsFilterFrom.Size = new System.Drawing.Size(212, 26);
            this.dtpAllBoughtItemsFilterFrom.TabIndex = 32;
            // 
            // bnMergePdfMoveDown
            // 
            this.bnMergePdfMoveDown.BackgroundImage = global::BlendleParser.Properties.Resources.arrow_down;
            this.bnMergePdfMoveDown.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.bnMergePdfMoveDown.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.bnMergePdfMoveDown.Location = new System.Drawing.Point(1083, 129);
            this.bnMergePdfMoveDown.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.bnMergePdfMoveDown.Name = "bnMergePdfMoveDown";
            this.bnMergePdfMoveDown.Size = new System.Drawing.Size(52, 54);
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
            this.bnMergePdfMoveUp.Location = new System.Drawing.Point(1083, 66);
            this.bnMergePdfMoveUp.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.bnMergePdfMoveUp.Name = "bnMergePdfMoveUp";
            this.bnMergePdfMoveUp.Size = new System.Drawing.Size(52, 54);
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
            this.bnBoughtItemsMoveLeft.Location = new System.Drawing.Point(513, 440);
            this.bnBoughtItemsMoveLeft.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.bnBoughtItemsMoveLeft.Name = "bnBoughtItemsMoveLeft";
            this.bnBoughtItemsMoveLeft.Size = new System.Drawing.Size(52, 54);
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
            this.bnBoughtItemsMoveRight.Location = new System.Drawing.Point(513, 372);
            this.bnBoughtItemsMoveRight.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.bnBoughtItemsMoveRight.Name = "bnBoughtItemsMoveRight";
            this.bnBoughtItemsMoveRight.Size = new System.Drawing.Size(52, 54);
            this.bnBoughtItemsMoveRight.TabIndex = 31;
            this.bnBoughtItemsMoveRight.TabStop = false;
            this.bnBoughtItemsMoveRight.UseVisualStyleBackColor = true;
            this.bnBoughtItemsMoveRight.Click += new System.EventHandler(this.bnBoughtItemsMoveRight_Click);
            // 
            // label1
            // 
            this.label1.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.label1.Location = new System.Drawing.Point(592, 17);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(500, 37);
            this.label1.TabIndex = 30;
            this.label1.Text = "Create pdf";
            this.label1.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // lbMergedPdf
            // 
            this.lbMergedPdf.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lbMergedPdf.FormattingEnabled = true;
            this.lbMergedPdf.ItemHeight = 24;
            this.lbMergedPdf.Location = new System.Drawing.Point(574, 66);
            this.lbMergedPdf.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.lbMergedPdf.Name = "lbMergedPdf";
            this.lbMergedPdf.ScrollAlwaysVisible = true;
            this.lbMergedPdf.SelectionMode = System.Windows.Forms.SelectionMode.MultiSimple;
            this.lbMergedPdf.Size = new System.Drawing.Size(498, 724);
            this.lbMergedPdf.TabIndex = 29;
            // 
            // btnTest
            // 
            this.btnTest.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.btnTest.Location = new System.Drawing.Point(232, 962);
            this.btnTest.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnTest.Name = "btnTest";
            this.btnTest.Size = new System.Drawing.Size(254, 48);
            this.btnTest.TabIndex = 24;
            this.btnTest.Text = "TEST";
            this.btnTest.UseVisualStyleBackColor = true;
            this.btnTest.Click += new System.EventHandler(this.btnTest_Click);
            // 
            // lblAllBoughtItemsFilterTo
            // 
            this.lblAllBoughtItemsFilterTo.AutoSize = true;
            this.lblAllBoughtItemsFilterTo.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblAllBoughtItemsFilterTo.Location = new System.Drawing.Point(4, 906);
            this.lblAllBoughtItemsFilterTo.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblAllBoughtItemsFilterTo.Name = "lblAllBoughtItemsFilterTo";
            this.lblAllBoughtItemsFilterTo.Size = new System.Drawing.Size(41, 24);
            this.lblAllBoughtItemsFilterTo.TabIndex = 24;
            this.lblAllBoughtItemsFilterTo.Text = "To:";
            // 
            // lblInfoAllBoughtItems
            // 
            this.lblInfoAllBoughtItems.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblInfoAllBoughtItems.Location = new System.Drawing.Point(4, 17);
            this.lblInfoAllBoughtItems.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblInfoAllBoughtItems.Name = "lblInfoAllBoughtItems";
            this.lblInfoAllBoughtItems.Size = new System.Drawing.Size(500, 37);
            this.lblInfoAllBoughtItems.TabIndex = 25;
            this.lblInfoAllBoughtItems.Text = "All Bought Items";
            this.lblInfoAllBoughtItems.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // lblAllBoughtItemsFilterFrom
            // 
            this.lblAllBoughtItemsFilterFrom.AutoSize = true;
            this.lblAllBoughtItemsFilterFrom.Font = new System.Drawing.Font("Arial", 15.75F, System.Drawing.FontStyle.Bold);
            this.lblAllBoughtItemsFilterFrom.Location = new System.Drawing.Point(4, 857);
            this.lblAllBoughtItemsFilterFrom.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
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
            this.btnAllBoughtItemsPDF.Location = new System.Drawing.Point(818, 857);
            this.btnAllBoughtItemsPDF.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnAllBoughtItemsPDF.Name = "btnAllBoughtItemsPDF";
            this.btnAllBoughtItemsPDF.Size = new System.Drawing.Size(90, 92);
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
            this.btnAllBoughtItemsDownload.Location = new System.Drawing.Point(513, 798);
            this.btnAllBoughtItemsDownload.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.btnAllBoughtItemsDownload.Name = "btnAllBoughtItemsDownload";
            this.btnAllBoughtItemsDownload.Size = new System.Drawing.Size(62, 49);
            this.btnAllBoughtItemsDownload.TabIndex = 15;
            this.btnAllBoughtItemsDownload.TabStop = false;
            this.btnAllBoughtItemsDownload.UseVisualStyleBackColor = true;
            this.btnAllBoughtItemsDownload.Click += new System.EventHandler(this.btnAllBoughtItemsDownload_Click);
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1842, 1053);
            this.Controls.Add(this.pnlTransactions);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.pnlAfterLogin);
            this.Controls.Add(this.lblPassword);
            this.Controls.Add(this.lblUsername);
            this.Controls.Add(this.txtUsername);
            this.Controls.Add(this.txtPassword);
            this.Controls.Add(this.btnLogin);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
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

