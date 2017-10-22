using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using BlendleParser.Helpers;
using BlendleParser.Model;
using BlendleParser.Model.Result;
using iText.Html2pdf;
using iText.IO.Font;
using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Action;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;

namespace BlendleParser.Core
{
    //itextsharp: https://developers.itextpdf.com/examples-itext7
    //API: http://itextsupport.com/apidocs/itext7/latest/
    //https://developers.itextpdf.com/content/itext-7-jump-start-tutorial/examples/chapter-1
    //create TOC: http://gitlab.itextsupport.com/itext7/samples-dotnet/commit/8a7125ba7bde9266334d30f652d5d259e9de6884?view=inline
    
    public class BlendlePdfCreator
    {
        #region members
        private static Random random = new Random(DateTime.Now.Day+DateTime.Now.Millisecond);
        private static PageSize defaultPageSize = PageSize.A4;

        //private int pFontSize = 25;
        private float h1FontSizeRatio = 1.84f;
        private float h2FontSizeRatio = 0.89f;
        private float kickerFontSizeRatio = 1.37f;
        private float bylineFontSizeRatio = 1.05f;
        private float introFontSizeRatio = 1.37f;
        private float streamerFontSizeRatio = 1.60f;
        private bool decodeHTML = false;
        #endregion members

        #region properties
        private readonly object CancelLocker = new object();
        private volatile bool _cancel;
        public bool Cancel
        {
            get
            {
                lock (CancelLocker)
                {
                    return _cancel;
                }
            }
            set
            {
                lock (CancelLocker)
                {
                    _cancel = value;
                }
            }
        }
        #endregion properties

        #region public functions
        public Result CreatePdfFromMonth(MagazineIssues monthIssues, string magazine, int year, int month, int mainFontSize = 25)
        {
            Result result = new Result();
            if (monthIssues.IsValid() == false)
            {
                result.Message = "Invalid month issues!";
                result.Succeeded = false;
                return result;
            }

            int issueCounter = 1;
            foreach (Issue issue in monthIssues._embedded.issues)
            {
                string fullPath = System.IO.Path.Combine(MagazineIssues.GetPath(magazine, year, month), $"MAG_{magazine}_{year}_{month}_" + issueCounter + ".pdf"); ;
                string fullCoverPath = issue.HasValidCoverUrl() ? issue.GetCoverFullPath(magazine, year, month) : null;

                if (issue.FullItems.Any())
                {
                    var pdfResult = CreatePdfFromItems(issue.FullItems, fullCoverPath, fullPath, mainFontSize);
                    result.MergeResult(pdfResult);
                }
            }

            return result;
        }
        public Result CreatePdfFromYear(AllMagazinesInYear allMonthsInYear, string magazine, int year, int mainFontSize = 25)
        {
            Result result = new Result();
            if (allMonthsInYear.IsValid() == false)
            {
                result.Message = "Invalid month issues!";
                result.Succeeded = false;
                return result;
            }

            foreach (Month month in allMonthsInYear._links.months)
            {
                if (this.Cancel)
                {
                    result.Message = "Canceled task";
                    return result;
                }

                Result monthResult = CreatePdfFromMonth(month.MagazineIssues, magazine, year, month.MonthInt, mainFontSize);
                if (monthResult.Succeeded == false)
                {
                    result = monthResult;
                    break;
                }
            }

            return result;
        }
        public Result CreatePdfFromItems(List<BlendleItem> items, string fullCoverImagePath, string fullOutputPath, int mainFontSize = 25)
        {
            Result result = new Result();
            if (items != null && items.Any() == false)
            {
                result.Message = "Invalid month issues!";
                result.Succeeded = false;
                return result;
            }
            
            List<Tuple<string, int>> tocItems = new List<Tuple<string, int>>();
            //Initialize PDF writer
            PdfWriter writer = new PdfWriter(fullOutputPath);
            //Initialize PDF document
            PdfDocument pdf = new PdfDocument(writer);
            // Initialize document
            Document document = new Document(pdf, defaultPageSize);
            document.SetMargins(60, 75, 60, 75); //ration: * 1.25
            int locationToStartTOC = 1;

            //Add cover
            if (fullCoverImagePath.IsNullOrEmpty() == false && File.Exists(fullCoverImagePath))
            {
                locationToStartTOC = 2;
                var documentWidth = defaultPageSize.GetWidth();
                var documentHeight = defaultPageSize.GetHeight();
                var leftMargin = document.GetLeftMargin();
                var righttMargin = document.GetRightMargin();
                var topMargin = document.GetTopMargin();
                var bottomMargin = document.GetBottomMargin();
                iText.Layout.Element.Image coverImage = new Image(ImageDataFactory.Create(fullCoverImagePath));
                //coverImage.ScaleToFit(documentWidth - leftMargin - righttMargin, documentHeight - topMargin - bottomMargin);
                coverImage.ScaleToFit(documentWidth, documentHeight);
                coverImage.SetAutoScale(true);
                Paragraph coverParagraph = new Paragraph().SetMargins(0, 0, 0, 0).Add(coverImage);
                document.Add(coverParagraph);
                document.Add(new AreaBreak());
            }

            //loop through each article
            foreach (BlendleItem item in items)
            {
                if (item.IsValid())
                {
                    int bodyCounter = 0;
                    //the order of the bodies is always right
                    var bodyItemList = item._embedded.content.body ?? new List<BA_Body>();
                    List<int> avaliableImagePositions = bodyItemList.AvaliableImagePositions();
                    List<CustomImageItem> imagesToPlace = new List<CustomImageItem>();

                    //these are the separated sub articles, whitin the main issue
                    //the will be placed after the normal body
                    var itemItemList = item._embedded.content._embedded?.items ?? new List<BA_Item>();

                    var bodyItemsToInsertAfter = new List<Tuple<BA_Body, BA_Body>>();

                    //if there are normal images, then they are the same as the media set images
                    #region non mediaset images (the ones whitout index)
                    if (item.HasNonMediaSetImages())
                    {
                        var images = item._embedded.content.images;
                        foreach (var iImage in images)
                        {
                            if (iImage != null && iImage.IsValid())
                            {
                                var image = iImage.GetBestImage();

                                if (image.IsValid())
                                {
                                    string imageFullPath = image.GetFullPath(item.BaseLocationPath);
                                    if (File.Exists(imageFullPath))
                                    {
                                        imagesToPlace.Add(new CustomImageItem()
                                        {
                                            href = image.href,
                                            path = imageFullPath,
                                            height = image.height,
                                            width = image.width,
                                            featured = iImage.featured,
                                        });
                                    }
                                }
                            }
                        }
                    }
                    #endregion non mediaset images (the ones whitout index)

                    //if both streams exist, they contain the same images
                    #region mediaset images
                    else if (item.HasMediaSetImages())
                    {
                        //reorder so we can insert it from the highest first, so the postitions will be right
                        var mediaSets = item._embedded.content._embedded.mediasets.OrderByDescending(ms => ms.position);
                        var first = mediaSets.First();
                        foreach (var imageContainer in mediaSets)
                        {
                            if (imageContainer != null && imageContainer.IsValid())
                            {
                                var image = imageContainer._embedded.GetBestImage();
                                if (image.IsValid())
                                {
                                    string imageFullPath = image.GetFullPath(item.BaseLocationPath);
                                    if (File.Exists(imageFullPath))
                                    {
                                        //position can be null, to hard to follow the exact placement in the blendle code
                                        //webpack:///./src/js/app/helpers/itemContent.js
                                        if (imageContainer.position == null)
                                        {
                                            //bodyItemList.Insert(random.Next(0, bodyItemList.Count-1), imageBodyItem);
                                            //insert after random item
                                            imagesToPlace.Add(new CustomImageItem()
                                            {
                                                href = image._links.file.href,
                                                path = imageFullPath,
                                                height = image.height,
                                                width = image.width,
                                                //can only be one featured
                                                featured = imagesToPlace.FirstOrDefault(i => i.featured) == null && first == imageContainer,
                                            });

                                        } //if the placement is known, we can place it
                                        else if (imageContainer.position <= bodyItemList.Count)
                                        {
                                            var imageBodyItem = new BA_Body() { content = imageFullPath, type = BodyContentType.Image.ToString(), };
                                            //insert after pre determined item
                                            bodyItemsToInsertAfter.Add(new Tuple<BA_Body, BA_Body>(bodyItemList[imageContainer.position.Value], imageBodyItem));
                                        }
                                    }
                                }
                            }
                        }
                    }
                    #endregion mediaset images

                    #region calculates the position of the images
                    //the issue leading image in the beginning
                    var featuredImage = imagesToPlace.FirstOrDefault(i => i.featured);
                    if (featuredImage != null)
                    {
                        int posToPlace = random.Next(0, bodyItemList.Count - 1);
                        //featured images are the header image
                        //logic how to place: webpack:///./src/js/app/helpers/itemContent.js --> getFeaturedImagePosition()
                        //get first p and ph item, then get the smallest position

                        var firstP = bodyItemList.FirstOrDefault(i => i.BodyContentType == BodyContentType.P);
                        var firstPH = bodyItemList.FirstOrDefault(i => i.BodyContentType == BodyContentType.Ph);
                        int firstPIndex = firstP != null ? bodyItemList.IndexOf(firstP) : bodyItemList.Count - 1;
                        int firstPHIndex = firstPH != null ? bodyItemList.IndexOf(firstPH) : bodyItemList.Count - 1;
                        int lowestNumber = GeneralUtils.Lowest(firstPIndex, firstPHIndex);
                        //if they are both not there, use the random number
                        if (lowestNumber != (bodyItemList.Count - 1))
                        {
                            posToPlace = lowestNumber;
                            //if the featured image takes a place in the avaliable positions, remove that one from that list
                            if (avaliableImagePositions.Contains(posToPlace))
                            {
                                avaliableImagePositions.Remove(posToPlace);
                            }
                        }
                        bodyItemsToInsertAfter.Add(new Tuple<BA_Body, BA_Body>(bodyItemList[posToPlace], new BA_Body() { content = featuredImage.path, type = BodyContentType.Image.ToString(), }));
                    }

                    //not not featured images that are unpositioned
                    List<CustomImageItem> unpositionedImages = imagesToPlace.Where(i => i.featured == false).ToList();
                    //get the loop information for the placement
                    Tuple<int, int> loopInformation = GetLoopInformation(avaliableImagePositions.Count, unpositionedImages.Count());
                    for (var i = 0; i < unpositionedImages.Count; i++)
                    {
                        CustomImageItem customImageItem = unpositionedImages[i];
                        int spot = ((loopInformation.Item1 * i) + loopInformation.Item2);
                        bodyItemsToInsertAfter.Add(new Tuple<BA_Body, BA_Body>(bodyItemList[avaliableImagePositions[spot]], new BA_Body() { content = customImageItem.path, type = BodyContentType.Image.ToString(), }));
                    }
                    #endregion calculates the position of the images

                    #region streamers
                    //insert streamers, the text parts in an article that are fat and add some exta
                    if (item._embedded.content.streamers != null && item._embedded.content.streamers.Any())
                    {
                        foreach (var streamer in item._embedded.content.streamers)
                        {
                            var streamerBodyItem = new BA_Body()
                            {
                                content = streamer.content,
                                type = BodyContentType.Streamer.ToString(),
                            };
                            if (streamer.position == null)
                            {
                                //insert after random item
                                bodyItemsToInsertAfter.Add(new Tuple<BA_Body, BA_Body>(bodyItemList[random.Next(0, bodyItemList.Count - 1)], streamerBodyItem));
                            }
                            else if (streamer.position <= bodyItemList.Count)
                            {
                                //insert after pre determined item
                                bodyItemsToInsertAfter.Add(new Tuple<BA_Body, BA_Body>(bodyItemList[streamer.position.Value], streamerBodyItem));
                            }
                        }
                    }

                    //now we can insert all the items after another from the last to the first, so the exact locations keep preserved
                    foreach (var bodyItemToInsertAfter in bodyItemsToInsertAfter)
                    {
                        //insert them in the list at the valid order
                        bodyItemList.Insert(bodyItemList.IndexOf(bodyItemToInsertAfter.Item1), bodyItemToInsertAfter.Item2);
                    }
                    //insert the body items in the pdf document
                    if (bodyItemList.Any())
                    {
                        ParseBodiesListResult parsedBodyListResult = ParseBodiesList(ref document, bodyItemList, mainFontSize, true);
                        if (parsedBodyListResult.TOCItems != null && parsedBodyListResult.TOCItems.Any())
                        {
                            tocItems.AddRange(parsedBodyListResult.TOCItems);
                        }
                    }
                    #endregion streamers

                    #region items (sub article parts)
                    if (itemItemList.Any())
                    {
                        //resets the body item list
                        bodyItemList.Clear();
                        //after the body, an nested part of the article can be there
                        foreach (var itemItem in itemItemList)
                        {
                            bodyItemList = itemItem.body;
                            //the image needs to be on top of the sub article, after the title, normally 1 image
                            //example: https://blendle.com/item/bnl-psychologie-20170914-09043b6a400

                            foreach (BA_Image2 itemItemImage in itemItem.images)
                            {
                                if (itemItemImage._links != null)
                                {
                                    var image = itemItemImage._links.GetBestImage();
                                    if (image.IsValid())
                                    {
                                        string imageFullPath = image.GetFullPath(item.BaseLocationPath);
                                        if (File.Exists(imageFullPath))
                                        {
                                            var imageBodyItem = new BA_Body()
                                            {
                                                content = imageFullPath,
                                                type = BodyContentType.Image.ToString(),
                                            };

                                            bodyItemList.Insert(1, imageBodyItem);
                                        }
                                    }
                                }
                            }
                            ParseBodiesListResult parsedBodyListResult = ParseBodiesList(ref document, bodyItemList, mainFontSize, false);
                            if (parsedBodyListResult.TOCItems != null && parsedBodyListResult.TOCItems.Any())
                            {
                                tocItems.AddRange(parsedBodyListResult.TOCItems);
                            }
                        }
                    }
                    #endregion items (sub article parts)
                }

                //new page
                document.Add(new AreaBreak());
            }

            //adds the TOC
            AddTOC(ref pdf, tocItems, locationToStartTOC);
                
            //Close document
            document.Close();
            result.Succeeded = true;

            return result;
        }
        #endregion public functions

        #region private functions
        private ParseBodiesListResult ParseBodiesList(ref Document document, List<BA_Body> bodyItemList, int mainFontSize, bool addToTOC)
        {
            ParseBodiesListResult result = new ParseBodiesListResult(){TOCItems = new List<Tuple<string, int>>()};

            //we loop trough the bodies of the item article
            foreach (var body in bodyItemList)
            {
                if (body.BodyContentType == BodyContentType.Image)
                {
                    iText.Layout.Element.Image image = new Image(ImageDataFactory.Create(body.content));
                    var imageWidth = image.GetImageWidth();
                    var imageHeight = image.GetImageHeight();

                    var documentWidth = defaultPageSize.GetWidth();
                    var documentHeight = defaultPageSize.GetHeight();
                    var leftMargin = document.GetLeftMargin();
                    var righttMargin = document.GetRightMargin();
                    var topMargin = document.GetTopMargin();
                    var bottomMargin = document.GetBottomMargin();

                    if (imageHeight > (documentHeight - ((topMargin + bottomMargin) * 1.3)))
                    {
                        float newHeight = (float)(documentHeight - ((topMargin + bottomMargin) * 1.3) - 5f);
                        float newWidth = (newHeight / imageHeight) * imageWidth;
                        image.ScaleToFit(newWidth, newHeight);
                        imageWidth = newWidth;
                        imageHeight = newHeight;
                    }
                    //if the image is to large for the page
                    if (imageWidth > (documentWidth - ((leftMargin + righttMargin) * 1.3)))
                    {
                        float newWidth = (float)((documentWidth - ((leftMargin + righttMargin) * 1.3)) - 5f);
                        float newHeight = (newWidth / imageWidth) * imageHeight;
                        image.ScaleToFit(newWidth, newHeight);
                    }

                    Paragraph paragraph = new Paragraph("").Add(image);
                    //paragraph.SetPaddingBottom(10);
                    document.Add(paragraph);
                }
                else
                {
                    var paragraphs = new List<Paragraph>();
                    string bodyContent = null;
                    if (decodeHTML)
                    {
                        //the body can contain html code, we parse it with itext pdf
                        var properties = new ConverterProperties();
                        IList<IElement> elementList = HtmlConverter.ConvertToElements(body.content, properties);
                        bool convertedSuccessfully = false;
                        //somehow it can reurn multiple items
                        foreach (var element in elementList)
                        {
                            if (element is Paragraph)
                            {
                                paragraphs.Add(element as Paragraph);
                            }
                        }
                        //if there is no paragraph to convert, add the normal text paragraph
                        if (paragraphs.Any() == false)
                        {
                            paragraphs.Add(new Paragraph(body.content));
                        }
                    }
                    else
                    {
                        bodyContent = GeneralUtils.HtmlDecode(GeneralUtils.StripHTML(body.content));
                        paragraphs.Add(new Paragraph(bodyContent));
                    }

                    //loop through the paragraphs
                    foreach (var paragraph in paragraphs)
                    {
                        //Build action: EMbeded Resource - ProjectName.Folder.Folder.filename
                        //default paragraph font
                        var bytes = GeneralUtils.GetFontBytes(Constants.FONT_SWIFT400);
                        PdfFont font = PdfFontFactory.CreateFont(bytes, "UTF-8", true);
                        float fontSizeRatio = 1.0f;
                        if (body.BodyContentType == BodyContentType.Hl1)
                        {
                            bytes = GeneralUtils.GetFontBytes(Constants.FONT_CENTURY300);
                            font = PdfFontFactory.CreateFont(bytes, "ISO-8859-1", true);
                            fontSizeRatio = h1FontSizeRatio;
                            paragraph.SetFixedLeading((mainFontSize * fontSizeRatio) / 1.1f);
                            //add TOC for later on creation
                            //the H!s of the subitems do not need to be created as TOC
                            
                            if (addToTOC)
                            {
                                int currentPage = document.GetPdfDocument().GetNumberOfPages();
                                result.TOCItems.Add(new Tuple<string, int>(bodyContent, currentPage));
                            }
                        }
                        else if (body.BodyContentType == BodyContentType.Hl2)
                        {
                            bytes = GeneralUtils.GetFontBytes(Constants.FONT_SWIFT700);
                            font = PdfFontFactory.CreateFont(bytes, "ISO-8859-1", true);
                            fontSizeRatio = h2FontSizeRatio;
                        }
                        else if (body.BodyContentType == BodyContentType.Kicker)
                        {
                            bytes = GeneralUtils.GetFontBytes(Constants.FONT_PROXIMA_NOVA500);
                            font = PdfFontFactory.CreateFont(bytes, "ISO-8859-1", true);
                            fontSizeRatio = kickerFontSizeRatio;
                        }
                        else if (body.BodyContentType == BodyContentType.Byline)
                        {
                            bytes = GeneralUtils.GetFontBytes(Constants.FONT_PROXIMA_NOVA200);
                            font = PdfFontFactory.CreateFont(bytes, "ISO-8859-1", true);
                            fontSizeRatio = bylineFontSizeRatio;
                        }
                        else if (body.BodyContentType == BodyContentType.Intro)
                        {
                            bytes = GeneralUtils.GetFontBytes(Constants.FONT_ABADI200);
                            font = PdfFontFactory.CreateFont(bytes, "ISO-8859-1", true);
                            fontSizeRatio = introFontSizeRatio;
                        }
                        else if (body.BodyContentType == BodyContentType.Streamer)
                        {
                            bytes = GeneralUtils.GetFontBytes(Constants.FONT_SWIFT700);
                            font = PdfFontFactory.CreateFont(bytes, "ISO-8859-1", true);
                            fontSizeRatio = streamerFontSizeRatio;
                            paragraph.SetPaddingTop(25);
                            paragraph.SetPaddingBottom(25);
                        }

                        int fontSize = (int)Math.Ceiling(mainFontSize * fontSizeRatio);
                        paragraph.SetFont(font);
                        paragraph.SetFontSize(fontSize);
                        //paragraph.SetPaddingBottom(10);
                        document.Add(paragraph);
                    }
                }
            }
            document.Add(new Paragraph(Environment.NewLine));

            return result;
        }
        private void AddTOC(ref PdfDocument pdfDocument, List<Tuple<string, int>> tocItems, int locationToStartTOC)
        {
            if (tocItems != null && tocItems.Any())
            {
                Document document = new Document(pdfDocument.GetLastPage().GetDocument());
                //var lastPageResources2 = pdfDocument.GetLastPage().GetResources().GetResourceNames();

                //new page
                document.Add(new AreaBreak());

                //first we need to know how many pages the TOC will take
                int numberOfPages = AddTOCItem(ref document, tocItems, false, locationToStartTOC, null);

                document = new Document(pdfDocument.GetLastPage().GetDocument());

                //this is needed before adding any new paragraphs
                //else it gives an exception
                document.Add(new AreaBreak());

                //then we really add the pages
                AddTOCItem(ref document, tocItems, true, locationToStartTOC, numberOfPages);

                //this does not work really well, bud somehow it works
                //if last page is empty, remove it
                PdfPage lastPage = pdfDocument.GetLastPage();
                bool isLastPageEmpty = true;
                try
                {
                    isLastPageEmpty = !lastPage.GetContentBytes().Any();
                    //isLastPageEmpty = !lastPage.GetResources().GetResourceNames().Any();
                }
                catch (Exception e)
                {
                    isLastPageEmpty = true;
                }
                if (isLastPageEmpty)
                {
                    pdfDocument.RemovePage(lastPage);
                }
            }
        }
        private int AddTOCItem(ref Document document, List<Tuple<string, int>> tocItems, bool addAfterRemove, int locationToStartTOC, int? amountPages = null)
        {
            var pdf = document.GetPdfDocument();

            int startingTOC = pdf.GetNumberOfPages();
            int amountToIncrement = 0;
            if (amountPages != null)
            {
                amountToIncrement = amountPages.Value;
            }

            foreach (var entry in tocItems)
            {
                string destinationKey = "p" + entry.Item2 + amountToIncrement;
                PdfArray destinationArray = new PdfArray();
                destinationArray.Add(new PdfNumber(entry.Item2 + amountToIncrement - 1));
                destinationArray.Add(PdfName.XYZ);
                pdf.AddNamedDestination(destinationKey, destinationArray);

                Paragraph p = new Paragraph();
                p.AddTabStops(new TabStop(540, TabAlignment.RIGHT, new DottedLine()));
                p.Add(entry.Item1);
                p.Add(new Tab());
                p.Add((entry.Item2 + amountToIncrement).ToString());
                p.SetProperty(Property.ACTION, PdfAction.CreateGoTo(destinationKey));
                document.Add(p);
            }

            int endingTOC = pdf.GetNumberOfPages();

            if (amountPages == null)
            {
                amountPages = (endingTOC - startingTOC) + 1;
            }

            for (int i = 0; i < amountPages.Value; i++)
            {
                var tocPage = pdf.GetLastPage();
                pdf.RemovePage(tocPage);
                if (addAfterRemove && tocPage.IsFlushed() == false)
                {
                    pdf.AddPage(locationToStartTOC, tocPage);
                }
            }
            return amountPages.Value;
        }
        //for placing the images, we calculate the stepsize and start index
        private Tuple<int, int> GetLoopInformation(int availablePositions, int amountToPlace)
        {
            if (amountToPlace == 0)
            {
                return new Tuple<int, int>(0, 0);
            }

            try
            {
                if (availablePositions == amountToPlace)
                {
                    //Tuple<stepSize, startIndex>
                    return new Tuple<int, int>(0, 0);
                }
                int optimalStepSize = (int)Math.Floor((decimal)availablePositions / (decimal)amountToPlace);
                int stepSize = Math.Min(optimalStepSize, availablePositions - 1);
                int startIndex = (int)Math.Floor(((decimal)availablePositions - (decimal)stepSize) / (decimal)amountToPlace);
                //Tuple<stepSize, startIndex>
                return new Tuple<int, int>(stepSize, startIndex);
            }
            catch
            {
            }
            return new Tuple<int, int>(0,0);
        }
        #endregion private functions

        #region testing stuff
        public Result TEST()
        {
            Result result = new Result();

            //Initialize PDF writer
            PdfWriter writer = new PdfWriter(@"c:\_Data_\BlendleParser\BlendleParser\bin\Debug\file.pdf");
            //Initialize PDF document
            PdfDocument pdf = new PdfDocument(writer);
            // Initialize document
            Document document = new Document(pdf, PageSize.A4);
            document.SetMargins(40,75,40,75);
            
            // Create a PdfFont
            PdfFont font = PdfFontFactory.CreateFont(FontConstants.COURIER_BOLD);
//            public const String DOG = "resources/img/dog.bmp";
//
//            public const String FOX = "resources/img/fox.bmp";
//
//            public const String DEST = "results/chapter01/quick_brown_fox.pdf";
//
//        iText.Layout.Element.Image fox = new Image(ImageDataFactory.Create(FOX));
//            iText.Layout.Element.Image dog = new iText.Layout.Element.Image(ImageDataFactory.Create(DOG));
//            Paragraph p = new Paragraph("The quick brown ").Add(fox).Add(" jumps over the lazy ").Add(dog);

            // Add a Paragraph
            document.Add(new Paragraph("iText is:").SetFont(font));
            // Create a List
            List list = new List().SetSymbolIndent(15).SetListSymbol("\u2022").SetFont(font);
            // Add ListItem objects
            list.Add(new ListItem("Never gonna give you up")).Add(new ListItem("Never gonna let you down")).Add(new ListItem
                ("Never gonna run around and desert you")).Add(new ListItem("Never gonna make you cry")).Add(new ListItem
                ("Never gonna say goodbye")).Add(new ListItem("Never gonna tell a lie and hurt you"));
            // Add the list
            document.Add(list);

            var par1 = new Paragraph(@"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas iaculis, tortor non faucibus pellentesque, enim enim pretium sapien, sed auctor lacus ligula ac augue. Ut nulla enim, condimentum nec molestie quis, venenatis at eros. Nam orci enim, consequat at elementum vitae, varius eu justo. Pellentesque purus odio, tempor nec malesuada vel, sollicitudin vitae ligula. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi in elit tellus. Maecenas vel ullamcorper odio. Pellentesque arcu metus, posuere in vulputate sed, posuere eu nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque laoreet venenatis metus, ac fermentum lacus blandit in.");

            var par2 = new Paragraph(@"Proin lacinia urna vitae quam tempor hendrerit. Nam dignissim vehicula massa, quis blandit nibh laoreet in. Ut convallis condimentum feugiat. Nulla semper at purus eget elementum. Nam at velit sit amet lectus dictum consequat. Suspendisse pretium eros et arcu pellentesque, eget tempor sapien dapibus. Aliquam erat volutpat. Suspendisse consequat ipsum erat, facilisis elementum urna tincidunt eget. Phasellus eget dui pretium augue tincidunt posuere. Quisque accumsan egestas egestas. Mauris iaculis ex non metus mattis, sit amet pharetra lorem congue. Suspendisse lacinia commodo ullamcorper. Sed odio neque, tempor in euismod in, gravida sit amet magna. Phasellus a magna finibus, maximus justo vel, laoreet tortor. Mauris ac urna laoreet, tempus eros scelerisque, malesuada erat. Nulla aliquet, urna congue tincidunt accumsan, ligula nunc posuere turpis, id consequat magna metus vel sapien.");

            var par3 = new Paragraph(@"Fusce non vehicula risus, id maximus mauris. Donec sodales, augue a malesuada tempor, risus augue scelerisque felis, quis dapibus arcu risus in neque. Sed dictum ex lorem, non rhoncus nulla vestibulum et. Ut a ipsum tortor. Phasellus id suscipit magna, at molestie lorem. Nullam dapibus felis et nisl porttitor pretium. Morbi dolor velit, malesuada ut enim non, vehicula auctor massa. Cras aliquet laoreet lectus at sodales. Mauris posuere libero id feugiat pellentesque. Morbi lectus nisl, feugiat in consectetur quis, euismod et nibh.");

            var par4 = new Paragraph(@"Donec iaculis nec felis quis ultrices. Ut consequat quam erat, in tempor diam venenatis eu. Aenean cursus nulla vitae augue fermentum posuere quis quis neque. Phasellus luctus odio nec felis commodo fringilla. Nam semper ante gravida, condimentum dui nec, tempus urna. Donec vulputate ligula tellus, vel sagittis elit dignissim in. In condimentum, metus nec imperdiet facilisis, magna felis vestibulum orci, id maximus massa dui ut nulla. Morbi tincidunt sapien nec nibh interdum venenatis.");

            var par5 = new Paragraph(@"Suspendisse egestas dignissim tellus ultricies efficitur. Aliquam a neque sollicitudin, pretium dolor non, viverra urna. Praesent eleifend eleifend ante, sed varius diam pharetra vel. Proin a elit augue. Ut egestas imperdiet ex non rutrum. Proin ut mauris non felis aliquam vulputate sed a lacus. Aenean ipsum nisl, egestas vehicula aliquet sit amet, ullamcorper sit amet eros. Ut aliquam laoreet elit, sit amet suscipit diam lobortis nec. Aliquam erat volutpat. Donec imperdiet malesuada orci, sed egestas massa fermentum nec. Cras egestas id tortor id sagittis. Ut in placerat ligula. Sed blandit nisl at mollis bibendum. Donec volutpat orci et nunc ullamcorper, mollis fringilla risus suscipit.");

            par1.SetFontSize(25);
            par2.SetFontSize(20);
            par3.SetFontSize(15);
            par4.SetFontSize(10);
            par5.SetFontSize(5);

            document.Add(par1);
            document.Add(par2);
            document.Add(par3);
            document.Add(par4);
            document.Add(par5);

            //Close document
            document.Close();

            return result;
        }
        public Result TEST2()
        {
            Result result = new Result();
            string fileFullPath = @"c:\_Data_\BlendleParser\BlendleParser\bin\Debug\file.pdf";
            if(File.Exists(fileFullPath))
                File.Delete(fileFullPath);

            //Initialize PDF writer
            PdfWriter writer = new PdfWriter(fileFullPath);
            //Initialize PDF document
            PdfDocument pdf = new PdfDocument(writer);
            // Initialize document
            Document document = new Document(pdf, PageSize.A4);
            document.SetMargins(40, 75, 40, 75);

            // Create a PdfFont
            PdfFont font = PdfFontFactory.CreateFont(FontConstants.COURIER_BOLD);
            //            public const String DOG = "resources/img/dog.bmp";
            //
            //            public const String FOX = "resources/img/fox.bmp";
            //
            //            public const String DEST = "results/chapter01/quick_brown_fox.pdf";
            //
            //        iText.Layout.Element.Image fox = new Image(ImageDataFactory.Create(FOX));
            //            iText.Layout.Element.Image dog = new iText.Layout.Element.Image(ImageDataFactory.Create(DOG));
            //            Paragraph p = new Paragraph("The quick brown ").Add(fox).Add(" jumps over the lazy ").Add(dog);

            // Add a Paragraph
            document.Add(new Paragraph("iText is:").SetFont(font));
            // Create a List
            List list = new List().SetSymbolIndent(15).SetListSymbol("\u2022").SetFont(font);
            // Add ListItem objects
            list.Add(new ListItem("Never gonna give you up")).Add(new ListItem("Never gonna let you down")).Add(new ListItem
                ("Never gonna run around and desert you")).Add(new ListItem("Never gonna make you cry")).Add(new ListItem
                ("Never gonna say goodbye")).Add(new ListItem("Never gonna tell a lie and hurt you"));
            // Add the list
            document.Add(list);

            var par1 = new Paragraph(@"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas iaculis, tortor non faucibus pellentesque, enim enim pretium sapien, sed auctor lacus ligula ac augue. Ut nulla enim, condimentum nec molestie quis, venenatis at eros. Nam orci enim, consequat at elementum vitae, varius eu justo. Pellentesque purus odio, tempor nec malesuada vel, sollicitudin vitae ligula. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi in elit tellus. Maecenas vel ullamcorper odio. Pellentesque arcu metus, posuere in vulputate sed, posuere eu nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque laoreet venenatis metus, ac fermentum lacus blandit in.");

            var par2 = new Paragraph(@"Proin lacinia urna vitae quam tempor hendrerit. Nam dignissim vehicula massa, quis blandit nibh laoreet in. Ut convallis condimentum feugiat. Nulla semper at purus eget elementum. Nam at velit sit amet lectus dictum consequat. Suspendisse pretium eros et arcu pellentesque, eget tempor sapien dapibus. Aliquam erat volutpat. Suspendisse consequat ipsum erat, facilisis elementum urna tincidunt eget. Phasellus eget dui pretium augue tincidunt posuere. Quisque accumsan egestas egestas. Mauris iaculis ex non metus mattis, sit amet pharetra lorem congue. Suspendisse lacinia commodo ullamcorper. Sed odio neque, tempor in euismod in, gravida sit amet magna. Phasellus a magna finibus, maximus justo vel, laoreet tortor. Mauris ac urna laoreet, tempus eros scelerisque, malesuada erat. Nulla aliquet, urna congue tincidunt accumsan, ligula nunc posuere turpis, id consequat magna metus vel sapien.");

            var par3 = new Paragraph(@"Fusce non vehicula risus, id maximus mauris. Donec sodales, augue a malesuada tempor, risus augue scelerisque felis, quis dapibus arcu risus in neque. Sed dictum ex lorem, non rhoncus nulla vestibulum et. Ut a ipsum tortor. Phasellus id suscipit magna, at molestie lorem. Nullam dapibus felis et nisl porttitor pretium. Morbi dolor velit, malesuada ut enim non, vehicula auctor massa. Cras aliquet laoreet lectus at sodales. Mauris posuere libero id feugiat pellentesque. Morbi lectus nisl, feugiat in consectetur quis, euismod et nibh.");


            par1.SetFontSize(25);
            par2.SetFontSize(20);
            par3.SetFontSize(15);


            document.Add(par1);
            document.Add(par2);
            document.Add(par3);
            

            var page1 = pdf.GetLastPage();
            pdf.RemovePage(page1);
            pdf.AddPage(1, page1);

            var page2 = pdf.GetLastPage();
            pdf.RemovePage(page2);
            pdf.AddPage(1, page2);

            document.Add(new AreaBreak());
            var par4 = new Paragraph(@"1111111111111111111 Donec iaculis nec felis quis ultrices. Ut consequat quam erat, in tempor diam venenatis eu. Aenean cursus nulla vitae augue fermentum posuere quis quis neque. Phasellus luctus odio nec felis commodo fringilla. Nam semper ante gravida, condimentum dui nec, tempus urna. Donec vulputate ligula tellus, vel sagittis elit dignissim in. In condimentum, metus nec imperdiet facilisis, magna felis vestibulum orci, id maximus massa dui ut nulla. Morbi tincidunt sapien nec nibh interdum venenatis.");
            var par5 = new Paragraph(@"Suspendisse egestas dignissim tellus ultricies efficitur. Aliquam a neque sollicitudin, pretium dolor non, viverra urna. Praesent eleifend eleifend ante, sed varius diam pharetra vel. Proin a elit augue. Ut egestas imperdiet ex non rutrum. Proin ut mauris non felis aliquam vulputate sed a lacus. Aenean ipsum nisl, egestas vehicula aliquet sit amet, ullamcorper sit amet eros. Ut aliquam laoreet elit, sit amet suscipit diam lobortis nec. Aliquam erat volutpat. Donec imperdiet malesuada orci, sed egestas massa fermentum nec. Cras egestas id tortor id sagittis. Ut in placerat ligula. Sed blandit nisl at mollis bibendum. Donec volutpat orci et nunc ullamcorper, mollis fringilla risus suscipit.");
            par4.SetFontSize(15);
            par5.SetFontSize(5);
            document.Add(par4);
            document.Add(par5);
            document.Add(par5);
            document.Add(par5);

            document.Add(new AreaBreak());
            document.Add(new AreaBreak());
            document.Add(par4);
            document.Add(par5);

            //Close document
            document.Close();

            return result;
        }
        #endregion testing stuff
    }
}