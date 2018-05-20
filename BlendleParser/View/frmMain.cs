using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using BlendleParser.Core;
using BlendleParser.Helpers;
using BlendleParser.Model;

namespace BlendleParser
{
    public partial class frmMain : Form
    {
        private Core.BlendleParser blendleParser;
        private BlendlePdfCreator pdfCreator;
        private BackgroundWorker backgroundWorker;
        private volatile bool isExecuting = false;
        private List<FullMagazine> allMagazines;

        public frmMain()
        {
            // Set culture
            Thread.CurrentThread.CurrentCulture = Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture("nl-NL");

            InitializeComponent();
            blendleParser = new Core.BlendleParser();
            pdfCreator = new BlendlePdfCreator();

            cbMagazine.SelectedIndexChanged += cbMagazine_SelectedIndexChanged;
            cbYear.SelectedIndexChanged += cbYear_SelectedIndexChanged;
            cbMonth.SelectedIndexChanged += cbMonth_SelectedIndexChanged;
        }

        private void WriteToLog(string textline)
        {
            if (cbEnableLog.Checked)
            {
                if (InvokeRequired)
                {
                    this.Invoke(new Action<string>(WriteToLog), new object[] { textline });
                    return;
                }

                txtLog.AppendText(textline + Environment.NewLine);
            }
        }
        private void ResetLog()
        {
            if (InvokeRequired)
            {
                this.Invoke(new Action(ResetLog));
                return;
            }
            txtLog.Clear();
        }

        #region private functions
        private void LoadOptions()
        {
            if (Configuration.Instance.UserBaseProfile.IsValid())
            {
                RunActionThread(() =>
                {
                    var fullMagazinesResult = blendleParser.GetAllMagazines(false, chbForceRedownload.Checked);
                    if (fullMagazinesResult.Succeeded)
                    {
                        UpdateMagazinesToGui(fullMagazinesResult.Data);
                    }
                });
            }
        }
        private void UpdateMagazinesToGui(List<FullMagazine> allMagazines)
        {
            if (this.InvokeRequired)
            {
                this.Invoke(new Action<List<FullMagazine>>(UpdateMagazinesToGui), new object[] { allMagazines });
                return;
            }
            this.allMagazines = allMagazines;

            //if there are subscriptions, fill them in the combobox
            cbMagazine.Items.Clear();
            foreach (FullMagazine fullMagazine in this.allMagazines)
            {
                cbMagazine.Items.Add(fullMagazine.Name);
            }

            //select first as default
            if (cbMagazine.Items.Count > 0)
            {
                cbMagazine.SelectedIndex = 0;
            }
        }
        #endregion private functions

        #region event handlers
        private void FrmMain_Load(object sender, EventArgs e)
        {
            //try validate blendle login at startup
            btnLogin_Click(btnLogin, null);

            //get all the transactions
            AllTransactionsToGui(null, null);
        }
        private void btnLogin_Click(object sender, EventArgs e)
        {
            ResetLog();
            var loginResult = blendleParser.Login(txtUsername.Text, txtPassword.Text);
            if (loginResult.Succeeded)
            {
                WriteToLog("Logged in successfully!");
                pnlAfterLogin.Enabled = true;
                pnlTransactions.Enabled = true;
                LoadOptions();
            }
            else
            {
                WriteToLog("Log in failled: " + loginResult.Message);
                pnlAfterLogin.Enabled = false;
                pnlTransactions.Enabled = false;
            }
        }
        private void btnMagazineDownload_Click(object sender, EventArgs e)
        {
            ResetLog();
        }
        private void btnMagazineToPdf_Click(object sender, EventArgs e)
        {
            ResetLog();
        }
        private void btnYearDownload_Click(object sender, EventArgs e)
        {
            ResetLog();
            //if valid items are selected
            if (cbMagazine.SelectedIndex > -1 && cbYear.SelectedIndex > -1 && cbMonth.SelectedIndex > -1)
            {
                string magazine = cbMagazine.Items[cbMagazine.SelectedIndex] as string;
                ComboboxItem yearSelectedItem = cbYear.Items[cbYear.SelectedIndex] as ComboboxItem;
                ComboboxItem monthSelectedItem = cbMonth.Items[cbMonth.SelectedIndex] as ComboboxItem;
                if (magazine.IsNullOrEmpty() == false && yearSelectedItem != null && yearSelectedItem.Value is AllMagazinesInYear
                    && monthSelectedItem != null && monthSelectedItem.Value is MagazineIssues)
                {
                    var year = yearSelectedItem.Value as AllMagazinesInYear;
                    var month = monthSelectedItem.Value as MagazineIssues;
                    RunActionThread(() =>
                    {
                        var magazineResult = blendleParser.FetchMonthsMagazine(magazine, year.year, true, chbForceRedownload.Checked);
                        if (magazineResult.Succeeded)
                        {
                            WriteToLog($"Successfully downloaded full month of: {magazine}, year: {year.year}, month: {month.month}");
                        }
                    });
                }
            }
        }
        private void btnYearToPdf_Click(object sender, EventArgs e)
        {
            ResetLog();
            //if valid items are selected
            if (cbMagazine.SelectedIndex > -1 && cbYear.SelectedIndex > -1 && cbMonth.SelectedIndex > -1)
            {
                string magazine = cbMagazine.Items[cbMagazine.SelectedIndex] as string;
                ComboboxItem yearSelectedItem = cbYear.Items[cbYear.SelectedIndex] as ComboboxItem;
                if (magazine.IsNullOrEmpty() == false && yearSelectedItem != null && yearSelectedItem.Value is AllMagazinesInYear)
                {
                    var year = yearSelectedItem.Value as AllMagazinesInYear;
                    RunActionThread(() =>
                    {
                        Result<AllMagazinesInYear> magazineYearResult = blendleParser.FetchMonthsMagazine(magazine, year.year, true, chbForceRedownload.Checked);
                        if (magazineYearResult.Succeeded)
                        {
                            var pdfResult = pdfCreator.CreatePdfFromYear(magazineYearResult.Data, magazine, year.year, Convert.ToInt32(nddFontSize.Value));
                            if (pdfResult.Succeeded)
                            {
                                WriteToLog($"Successfully created PDF of year for: {magazine}, year: {year.year}");
                            }
                            else
                            {
                                WriteToLog($"FAILLED to created PDF of month for: {magazine}, year: {year.year}");
                            }
                        }
                    });
                }
            }
        }
        private void btnMonthDownload_Click(object sender, EventArgs e)
        {
            ResetLog();
            //if valid items are selected
            if (cbMagazine.SelectedIndex > -1 && cbYear.SelectedIndex > -1 && cbMonth.SelectedIndex > -1)
            {
                string magazine = cbMagazine.Items[cbMagazine.SelectedIndex] as string;
                ComboboxItem yearSelectedItem = cbYear.Items[cbYear.SelectedIndex] as ComboboxItem;
                ComboboxItem monthSelectedItem = cbMonth.Items[cbMonth.SelectedIndex] as ComboboxItem;
                if (magazine.IsNullOrEmpty() == false && yearSelectedItem != null && yearSelectedItem.Value is AllMagazinesInYear
                    && monthSelectedItem != null && monthSelectedItem.Value is MagazineIssues)
                {
                    var year = yearSelectedItem.Value as AllMagazinesInYear;
                    var month = monthSelectedItem.Value as MagazineIssues;
                    RunActionThread(() =>
                    {
                        var magazineResult = blendleParser.FetchIssuesMagazine(magazine, year.year, month.month, true, chbForceRedownload.Checked);
                        if (magazineResult.Succeeded)
                        {
                            WriteToLog($"Successfully downloaded full month of: {magazine}, year: {year.year}, month: {month.month}");
                        }
                    });
                }
            }
        }
        private void btnMonthPdf_Click(object sender, EventArgs e)
        {
            ResetLog();
            //if valid items are selected
            if (cbMagazine.SelectedIndex > -1 && cbYear.SelectedIndex > -1 && cbMonth.SelectedIndex > -1)
            {
                string magazine = cbMagazine.Items[cbMagazine.SelectedIndex] as string;
                ComboboxItem yearSelectedItem = cbYear.Items[cbYear.SelectedIndex] as ComboboxItem;
                ComboboxItem monthSelectedItem = cbMonth.Items[cbMonth.SelectedIndex] as ComboboxItem;
                ComboboxItem daySelectedItem = cbDay.Items[cbDay.SelectedIndex] as ComboboxItem;
                if (magazine.IsNullOrEmpty() == false && yearSelectedItem != null && yearSelectedItem.Value is AllMagazinesInYear
                    && monthSelectedItem != null && monthSelectedItem.Value is MagazineIssues)
                {
                    var year = yearSelectedItem.Value as AllMagazinesInYear;
                    var month = monthSelectedItem.Value as MagazineIssues;
                    int day = 0;
                    if (daySelectedItem != null && daySelectedItem.Value is int)
                    {
                        day = (int)daySelectedItem.Value;
                    }
                    RunActionThread(() =>
                    {
                        Result<MagazineIssues> magazineResult = blendleParser.FetchIssuesMagazine(magazine, year.year, month.month, true, chbForceRedownload.Checked);
                        if (magazineResult.Succeeded)
                        {
                            var pdfResult = pdfCreator.CreatePdfFromMonth(magazineResult.Data, magazine, year.year, month.month, day, Convert.ToInt32(nddFontSize.Value));
                            if (pdfResult.Succeeded)
                            {
                                WriteToLog($"Successfully created PDF of month for: {magazine}, year: {year.year}, month: {month.month}");
                            } else
                            {
                                WriteToLog($"FAILLED to created PDF of month for: {magazine}, year: {year.year}, month: {month.month}");
                            }
                        }
                    });
                }
            }
        }
        private void btnDownloadAll_Click(object sender, EventArgs e)
        {
            ResetLog();
            RunActionThread(() =>
            {
                var fullMagazinesResult = blendleParser.GetAllMagazines(true, chbForceRedownload.Checked);
                if (fullMagazinesResult.Succeeded && fullMagazinesResult.Data != null)
                {
                    this.allMagazines = fullMagazinesResult.Data;
                }
            });
        }
        private void btnAllToPDF_Click(object sender, EventArgs e)
        {

        }
        private MagazineIssues GetSelectedMagazine()
        {
            MagazineIssues result = null;

            if (cbMagazine.SelectedIndex > -1 && cbYear.SelectedIndex > -1 && cbMonth.SelectedIndex > -1)
            {
                
            }
            return result;
        }
        private void cbMagazine_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (allMagazines != null && allMagazines.Any())
            {
                ComboBox cb = sender as ComboBox;
                var magazine = allMagazines.FirstOrDefault(m => m.Name.Equals(cb.Items[cb.SelectedIndex].ToString(), StringComparison.OrdinalIgnoreCase));
                if (magazine != null && magazine.AllYearsMagazine.IsValid())
                {
                    cbYear.Items.Clear();
                    foreach (var year in magazine.AllYearsMagazine._links.years)
                    {
                        cbYear.Items.Add(new ComboboxItem(year.title, year.AllMagazinesInYear));
                    }
                    //select first as default
                    if (cbYear.Items.Count > 0)
                    {
                        cbYear.SelectedIndex = 0;
                    }
                }
            }
        }
        private void cbYear_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (allMagazines != null && allMagazines.Any())
            {
                ComboBox cb = sender as ComboBox;
                ComboboxItem yearSelectedItem = cb.Items[cb.SelectedIndex] as ComboboxItem;
                if (yearSelectedItem != null && yearSelectedItem.Value is AllMagazinesInYear)
                {
                    var allMagazinesInYear = yearSelectedItem.Value as AllMagazinesInYear;
                    if (allMagazinesInYear.IsValid())
                    {
                        cbMonth.Items.Clear();
                        var allMonths = allMagazinesInYear._links.months.OrderByDescending(m => m.MonthInt);
                        foreach (var month in allMonths)
                        {
                            cbMonth.Items.Add(new ComboboxItem(month.title, month.MagazineIssues));
                        }
                        //select first as default
                        if (cbMonth.Items.Count > 0)
                        {
                            cbMonth.SelectedIndex = 0;
                        }
                    }
                }
            }
        }
        private void cbMonth_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (allMagazines != null && allMagazines.Any())
            {
                cbDay.Items.Clear();
                ComboBox cb = sender as ComboBox;
                ComboboxItem monthSelectedItem = cb.Items[cb.SelectedIndex] as ComboboxItem;
                if (monthSelectedItem != null && monthSelectedItem.Value is MagazineIssues)
                {
                    var magazineIssues = monthSelectedItem.Value as MagazineIssues;
                    //its possible there are multiple magazine releases in one month
                    if (magazineIssues.days != null && magazineIssues.days.Any())
                    {
                        foreach (int day in magazineIssues.days)
                        {
                            cbDay.Items.Add(new ComboboxItem(day.ToString(), day));
                        }
                        cbDay.Enabled = magazineIssues.days.Count > 1;
                        cbDay.SelectedIndex = 0;
                    }
                }
            }
        }
        private void btnCancel_Click(object sender, EventArgs e)
        {
            btnCancel.Enabled = false;
            StopActionThread();
        }
        private void cbSaveLog_CheckChanged(object sender, EventArgs e)
        {
            var cb = sender as CheckBox;
            blendleParser.SaveLog = cb.Checked;
        }
        private void cbEnableLog_CheckChanged(object sender, EventArgs e)
        {
            var cb = sender as CheckBox;
            if (blendleParser.LogEventHandler != null)
            {
                foreach (Delegate d in blendleParser.LogEventHandler.GetInvocationList())
                {
                    blendleParser.LogEventHandler -= (LogEvent)d;
                }
            }
            
            if (cb.Checked)
            {
                blendleParser.LogEventHandler += WriteToLog;
            }
        }
        private void btnTest_Click(object sender, EventArgs e)
        {
            //ValidateAllImagesConsitency();
            blendleParser.FetchItem(@"c:\_Data_\BlendleParser\BlendleParser\bin\Debug\Data\LooseArticles\2017\10\", "pwb-vkn-20171008175738371", true);
        }
        private void btnAllBoughtItemsDownload_Click(object sender, EventArgs e)
        {
            RunActionThread(() =>
            {
                Result transactionsContentResult = blendleParser.DownloadAllTransactionsContent(chbForceRedownload.Checked);

                if (transactionsContentResult.Succeeded)
                {
                    AllTransactionsToGui(null, null);
                    WriteToLog($"Successfully downloaded the content of all bought articles!");
                }
                else
                {
                    WriteToLog($"FAILLED to downloaded the content of all bought articles");
                }
                
            });
        }
        private void dtpAllBoughtItemsFilterFrom_ValueChanged(object sender, EventArgs e)
        {
            AllTransactionsToGui(dtpAllBoughtItemsFilterFrom.Value, dtpAllBoughtItemsFilterTo.Value);
        }
        private void dtpAllBoughtItemsFilterTo_ValueChanged(object sender, EventArgs e)
        {
            AllTransactionsToGui(dtpAllBoughtItemsFilterFrom.Value, dtpAllBoughtItemsFilterTo.Value);
        }
        private void bnBoughtItemsMoveRight_Click(object sender, EventArgs e)
        {
            foreach (int selectedIndex in lbAllBoughtItems.SelectedIndices)
            {
                var selectedItem = lbAllBoughtItems.Items[selectedIndex] as ComboboxItem;
                lbMergedPdf.Items.Add(new ComboboxItem(selectedItem.Text, selectedItem.Value));
            }
            btnAllBoughtItemsPDF.Enabled = lbMergedPdf.Items.Count > 0;
        }
        private void bnBoughtItemsMoveLeft_Click(object sender, EventArgs e)
        {
            List<ComboboxItem> itemsToRemove = new List<ComboboxItem>();
            foreach (int selectedIndex in lbMergedPdf.SelectedIndices)
            {
                var selectedItem = lbMergedPdf.Items[selectedIndex] as ComboboxItem;
                itemsToRemove.Add(selectedItem);
            }
            foreach (ComboboxItem comboboxItem in itemsToRemove)
            {
                lbMergedPdf.Items.Remove(comboboxItem);
            }
            btnAllBoughtItemsPDF.Enabled = lbMergedPdf.Items.Count > 0;
        }
        private void bnMergePdfMoveUp_Click(object sender, EventArgs e)
        {
            List<ComboboxItem> itemsToMove = new List<ComboboxItem>();
            foreach (int selectedIndex in lbMergedPdf.SelectedIndices)
            {
                var selectedItem = lbMergedPdf.Items[selectedIndex] as ComboboxItem;
                itemsToMove.Add(selectedItem);
            }
            for (int i = 0; i < itemsToMove.Count; i++)
            {
                var selectedItem = itemsToMove[i];
                
                int oldIndex = lbMergedPdf.Items.IndexOf(selectedItem);
                int newIndex = oldIndex == 0 ? lbMergedPdf.Items.Count - 1 : oldIndex - 1;

                lbMergedPdf.Items.Remove(selectedItem);
                lbMergedPdf.Items.Insert(newIndex, selectedItem);
                lbMergedPdf.SetSelected(newIndex, true);
            }
        }
        private void bnMergePdfMoveDown_Click(object sender, EventArgs e)
        {
            List<ComboboxItem> itemsToMove = new List<ComboboxItem>();
            foreach (int selectedIndex in lbMergedPdf.SelectedIndices)
            {
                var selectedItem = lbMergedPdf.Items[selectedIndex] as ComboboxItem;
                itemsToMove.Add(selectedItem);
            }
            for (int i = itemsToMove.Count - 1; i >= 0; i--)
            {
                var selectedItem = itemsToMove[i];
                int oldIndex = lbMergedPdf.Items.IndexOf(selectedItem);
                int newIndex = oldIndex == lbMergedPdf.Items.Count - 1 ? 0 : oldIndex + 1;

                lbMergedPdf.Items.Remove(selectedItem);
                lbMergedPdf.Items.Insert(newIndex, selectedItem);
                lbMergedPdf.SetSelected(newIndex, true);
            }
        }
        private void btnAllBoughtItemsPDF_Click(object sender, EventArgs e)
        {
            List<Transaction> itemsToGeneratePDF = new List<Transaction>();
            foreach (ComboboxItem selectedItem in lbMergedPdf.Items)
            {
                itemsToGeneratePDF.Add(selectedItem.Value as Transaction);
            }

            RunActionThread(() =>
            {
                Result<List<BlendleItem>> transactionsContentResult = blendleParser.DownloadTransactionsContent(itemsToGeneratePDF, chbForceRedownload.Checked);

                if (transactionsContentResult.Succeeded)
                {
                    WriteToLog($"Successfully downloaded the content of all bought articles!");
                    DateTime dtNow = DateTime.Now;
                    
                    string fullPath = Path.Combine(Constants.DEFAULT_DATA_FULLPATH, $"merged_pdf_{dtNow.Year}{dtNow.Month}{dtNow.Day}_{dtNow.Millisecond}.pdf");
                    var pdfResult = pdfCreator.CreatePdfFromItems(transactionsContentResult.Data, null, fullPath, 25);
                    if (pdfResult.Succeeded)
                    {
                        WriteToLog($"Successfully created the pdf of the articles!");
                    }
                    else
                    {
                        WriteToLog($"FAILLED to created the pdf of the articles!");
                    }
                }
                else
                {
                    WriteToLog($"FAILLED to downloaded the content of all bought articles");
                }

            });
        }
        #endregion event handlers

        #region private functions
        private void RunActionThread(Action action)
        {
            if (isExecuting == false)
            {
                btnCancel.Enabled = true;
                pnlAfterLogin.Enabled = false;
                pnlTransactions.Enabled = false;
                isExecuting = true;
                blendleParser.Cancel = false;
                pdfCreator.Cancel = false;
                backgroundWorker = new BackgroundWorker();
                backgroundWorker.DoWork += new DoWorkEventHandler((sender, args) => action.Invoke()); // This does the job ...
                backgroundWorker.WorkerSupportsCancellation = true; // This allows cancellation.
                backgroundWorker.RunWorkerCompleted += (sender, args) =>
                {
                    if (args.Cancelled && cbSaveLog.Checked)
                    {
                        //if canceled, the log is propably not save, do it manually
                        GeneralUtils.CheckDataDir();
                        var @now = DateTime.Now;
                        string logFullPath = Path.Combine(Constants.DEFAULT_DATA_FULLPATH, "log_" + now.ToString("ddMMyyyHHmmss") + now.Millisecond.ToString() + ".txt");
                        File.WriteAllText(logFullPath, txtLog.Text);
                    }
                    isExecuting = false;
                    pnlAfterLogin.Enabled = true;
                    pnlTransactions.Enabled = true;
                    blendleParser.Cancel = false;
                    btnCancel.Enabled = true;
                    backgroundWorker.Dispose();
                };
                backgroundWorker.RunWorkerAsync();
            }
        }
        private void StopActionThread()
        {
            if (backgroundWorker != null)
            {
                backgroundWorker.CancelAsync();
                blendleParser.Cancel = true;
                pdfCreator.Cancel = true;
            }
        }
        private void AllTransactionsToGui(DateTime? from, DateTime? to)
        {
            lbAllBoughtItems.DisplayMember = "Text";
            if (Configuration.Instance.UserBaseProfile.IsValid())
            {
                Result<List<Transaction>> transactionsResult = blendleParser.FetchAllTransactions();
                if (transactionsResult.Succeeded && transactionsResult.Data != null)
                {
                    bool validInput = false;
                    Func<Transaction, bool> transactionFilter = (t) => true;

                    //if and selection is made
                    if (from != null && to != null && to.Value > from.Value)
                    {
                        transactionFilter = (t) => t.CreatedAtLocal >= from.Value && t.CreatedAtLocal <= to.Value;
                        validInput = true;
                    }

                    List<Transaction> filteredTransactions = transactionsResult.Data.Where(transactionFilter).ToList();

                    lbAllBoughtItems.Items.Clear();
                    foreach (var transaction in filteredTransactions)
                    {
                        if (transaction.Embedded.Item != null)
                        {
                            if (transaction.Embedded.Item.IsValid())
                            {
                                BA_Body headLine = transaction.Embedded.Item.Embedded.TaManifest.Body.FirstOrDefault(b => b.BodyContentType == BodyContentType.Hl1);
                                if (headLine != null)
                                {
                                    lbAllBoughtItems.Items.Add(new ComboboxItem(GeneralUtils.StripHTML(headLine.content), transaction));
                                }
                            }
                        } else if (transaction.Embedded.PayItem != null)
                        {
                            
                        }
                        
                    }

                    if (validInput == false)
                    {
                        AttachFromToHandlers(false);
                        List<DateTime> dateList = filteredTransactions.Select(t => t.CreatedAt).ToList();
                        dtpAllBoughtItemsFilterFrom.Value = dateList.Min(d => d);
                        dtpAllBoughtItemsFilterTo.Value = dateList.Max(d => d);
                        AttachFromToHandlers(true);
                    }
                }
            }
        }
        //Test stuff
        //check if all mediaset images are the same as the normal images
        private void ValidateAllImagesConsitency()
        {
            int counterNotEqual = 0;
            int counterLargerThanZero = 0;
            int counterLargerThanZeroAllSameImages = 0;
            int counterZero = 0;
            int hasMediaSetImagesBudNotImages = 0;
            int hasImagesBudNotMediaSetImages = 0;
            int hasNoImages = 0;

            var fullMagazinesResult = blendleParser.GetAllMagazines(true, false);
            foreach (var fullMagazine in fullMagazinesResult.Data)
            {
                if (fullMagazine.IsValid() == false)
                    continue;
                foreach (var year in fullMagazine.AllYearsMagazine._links.years)
                {
                    if (year.AllMagazinesInYear.IsValid() == false)
                        continue;
                    foreach (var month in year.AllMagazinesInYear._links.months)
                    {
                        if (month.MagazineIssues.IsValid() == false)
                            continue;
                        foreach (var issue in month.MagazineIssues._embedded.issues)
                        {
                            foreach (var blendleItem in issue.FullItems)
                            {
                                if (blendleItem.IsValid() == false)
                                    continue;
                                bool hasMediaSetImages = blendleItem.HasMediaSetImages();
                                bool hasNonMediaSetImages = blendleItem.HasNonMediaSetImages();
                                if (hasMediaSetImages && hasNonMediaSetImages)
                                {
                                    List<BA_Image> images = blendleItem._embedded.content.images;
                                    List<BA_BMediaSet2> mediasets = blendleItem._embedded.content._embedded.mediasets;
                                    if (images.Count != mediasets.Count)
                                    {
                                        counterNotEqual++;
                                    }
                                    if (images.Count > 0 && mediasets.Count > 0)
                                    {
                                        counterLargerThanZero++;
                                        if (images.Count == mediasets.Count)
                                        {
                                            if (images.AreEqual(mediasets))
                                            {
                                                counterLargerThanZeroAllSameImages++;
                                            }
                                        }
                                    }
                                    if (images.Count == 0 && mediasets.Count == 0)
                                    {
                                        counterZero++;
                                    }
                                } else if (hasMediaSetImages && !hasNonMediaSetImages)
                                {
                                    hasMediaSetImagesBudNotImages++;
                                }
                                else if (!hasMediaSetImages && hasNonMediaSetImages)
                                {
                                    hasImagesBudNotMediaSetImages++;
                                }
                                else if (!hasMediaSetImages && !hasNonMediaSetImages)
                                {
                                    hasNoImages++;
                                }
                            }
                        }
                    }
                }
            }
            MessageBox.Show($"Finished: counterNotEqual:{counterNotEqual}, counterLargerThanZero:{counterLargerThanZero}, " +
                            $"counterLargerThanZeroAllSameImages:{counterLargerThanZeroAllSameImages}, counterZero:{counterZero}," +
                            $"hasMediaSetImagesBudNotImages:{hasMediaSetImagesBudNotImages}, hasImagesBudNotMediaSetImages:{hasImagesBudNotMediaSetImages}," +
                            $"hasNoImages:{hasNoImages}");
        }
        private void AttachFromToHandlers(bool attach)
        {
            dtpAllBoughtItemsFilterFrom.ValueChanged -= dtpAllBoughtItemsFilterFrom_ValueChanged;
            dtpAllBoughtItemsFilterTo.ValueChanged -= dtpAllBoughtItemsFilterTo_ValueChanged;
            if (attach)
            {
                dtpAllBoughtItemsFilterFrom.ValueChanged += dtpAllBoughtItemsFilterFrom_ValueChanged;
                dtpAllBoughtItemsFilterTo.ValueChanged += dtpAllBoughtItemsFilterTo_ValueChanged;
            }
        }


        #endregion private functions
    }
}
