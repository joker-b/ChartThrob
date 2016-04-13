<b>_ChartThrob_</b> is a tool for maximizing the useful tonal range of digital negatives used for alternative-process printing. Photographers have been printing with _ChartThrob_ every day since its launch in 2006, using almost every kind of alternative process: ambrotype, cyanotype, platinum, aristotype, and many more. Even [color!](http://katharinethayer.com/html/tricolor.html)

_ChartThrob_ runs inside of <a href="http://www.adobe.com/">Adobe Photoshop</a> and is easy to install and use.  _ChartThrob_ runs in all Photoshop versions since CS2. It won't run under Photoshop 7 or Photoshop CS (sorry, that's the price of progress). _It works for both Windows and Mac versions of Photoshop. It's free._

_ChartThrob_ creates profiles for _your_ process of choice, for _your_ printer, and lets you create consistently-beautiful digital negatives from _your_ pictures &#151; every single time.

#### Current Version: 1.14

The current version is <b>1.14</b> -- by request, an option was added to negate (invert) the final output curve, for use with [QuadToneRIP.](http://www.quadtonerip.com/html/QTRoverview.html)

# Installing _ChartThrob_

To install, first either clone this GitHub repository or download as a .zip file (if you're new to GitHub: look at the download/clone buttons on the right side of the GitHub page). Once you've got the repo on your local disk, copy the file  "ChartThrob.jsx" into your Photoshop scripts directory, which will typically be something like "Adobe Photoshop CS6 (64 Bit)/Presets/Scripts" (the relative location within the Photoshop directory is the same for both Windows and Macintosh)

That's it! The next time you start Photoshop, _ChartThrob_ will appear as an option under Photoshop's "File&#8594;Scripts" menu.

# Using _ChartThrob_

_ChartThrob_ is really two scripts in one. First, it's a script for _creating_ grayscale calibration charts. Second, it's a tool for automatically _evaluating_ scanned prints of those charts and setting up appropriate profiles depending on the nature of your printing process.

The _ChartThrob_ workflow has a few basic steps:

1. <b>Create</b> a Grayscale chart in _ChartThrob._
1. <b>Print</b> a digtial negative from that chart (on Pictorico material etc).
1. <b>Contact-print</b> that negative onto your medium of choice (platinum, mimeo, silver-gelatine paper, sun prints, etc).
1. <b>Scan</b> the resultant positive print.
1. <b>Crop</b> the scan back to the original chart boundaries.
1. <b>Analyze</b> the chart in _ChartThrob_ &#151; the result will be a new Curves layer containing a Printing Curve, which you can use on the spot or save for repeated use later.
1. <b>Apply</b> that curve to any B&W images you like, before printing them to digital negatives. The curve will correct the original image grayscale values to neatly fit to the grayscale range of your chosen medium.

So let's begin! From any Photoshop session, you can start-up _ChartThrob_ by selecting "File&#8594;Scripts&#8594;ChartThrob." A ChartThrob dialog box will appear:

<center><img alt="ctCreate106.jpg" src="http://www.botzilla.com/blog/pix2006/ctCreate106.jpg" width="515" height="280" border="0" vspace=4 hspace=6  /></center>

If you have no documents open, you should see a dialog box similar to the one above. If you already have documents open, the dialog will be more complex, but will still contain this info along with additional options (The illustrations in this doc page show both Windows and Mac examples). Pressing <b>"Help"</b> will provide you with step-by-step instructions, or pressing <b>"Build New Chart Now"</b> will do exactly that &#151; it will create a new document and start filling it with profiling information. Photoshop draws very quickly, but this will typically take several seconds &#151; especially if you have the 'Numbers' option checked. The result will look like the picture below (with or without the numeric labels).

<center><img alt="ChartThrobTemp.jpg" vspace=4 hspace=6 src="http://www.botzilla.com/blog/pix2006/ChartThrobTemp.jpg" width="400" height="403" border="0"/></center>

This is a _positive_ chart &#151; that is, you'll either have to invert it when you print it to a negative, or before (depending on your printer). The text at the bottom reads: "THIS IS A POSITIVE IMAGE WITH DARK TEXT ON WHITE." Keep that in mind, because _ChartThrob_ creates and analyzes _positive_ images.

You may want to resize the chart when printing, by default it's pretty large. You should be able to resize it according to your own printing habits. Then print to a (typically transparent) negative, and contact-print that negative according to whatever process suits your fancy: silver-gelative, old xerox, woodburytype, cyanotype, whatever, so that once again you have a positive print that looks like the original chart. Be sure that you have a solid, dependable printing process so that you can repeat your results later. The chart print doesn't need to be huge, just big enough to see the individual patches (platinum printers will probably be happy to hear that, considering they pay by the droplet...).

If you have a good grasp of your printing already, try to print so that the midtones are as properly-exposed as you think you can get them. The blacks and pure whites will work themselves out.

Also, be sure that your printing is uniform across the entire size of the chart &#151; if the exposure varies from one side to the other, or from the center of your prints to the edges, there won't be any way for the calibrator to second-guess that. You'll just get junk.

Okay, so now you've made a positive print from the chart. Let it dry, and then scan it, making sure you have a linear (gamma 1.0) scan with the full grayscale range  (see the <a href="#faq">FAQ</a> below on how to do this). Crop the scan back to the boundaries of the chart, and you'll have something perhaps like the image here.

_ChartThrob_ should accept scans in RGB, grayscale, CMYK, etc.

> _For cyanotype printers only:_ Be careful when scanning your cyanotype prints, the strong blue
> tone can challenge some grayscale
> conversions. If you have issues with the results, consider forcing the grayscale mix. Use the Photoshop
> color mixer, set to monochrome. Get a result you like and use the same color-mix values for _every_ scan.

<center><img alt="ChartThrobScan.jpg" vspace=4 hspace=6 src="http://www.botzilla.com/blog/pix2006/ChartThrobScan.jpg" width="400" height="403" border="0" /></center>

With this new scanned print loaded, call _ChartThrob_ again. The dialog box will still let you create a new chart if you want one, but now it also contains options for analysing a scanned printed chart.

<img alt="ctScanDialog.gif" vspace=4 hspace=6 src="http://www.botzilla.com/blog/archives/ctScanDialog.gif" width="314" height="360" border="0" align="left" />If we hit <b>&lt;return&gt;</b> or press <b>"Analyze,"</b> that's exactly what _ChartThrob_ will do: analyze the scanned chart, adjusting for paper tone and process color and evaluating every patch. When done, it will display a brief report telling you everything's okay, and will add a new curves layer to your scanned chart document, called "Print Curve."

<img alt="ctCurve.gif" vspace=4 hspace=6 src="http://www.botzilla.com/blog/pix2006/ctCurve.gif" width="128" height="128" border="0" align="right" />If we double-click the "Print Curve" in the Photoshop layers palette to view the resultant curve, it would look like the one shown here (we're just showing the curve rather than the whole dialog, to save web-page space).

The new curve layer is hidden, because the curve isn't meant for adjusting the scan itself &#151; instead, it's for adjusting other B&W images so that they can be printed using the same process that you used to create the scan.

When a _ChartThrob_ curve is applied to a B&W image, the image's original gray values will be remapped so that they will print to match the grayscale range of the target printing medium, as long as you're consistent in the print exposure and processing. So if you expose a silver-gelatin contact print for 30 seconds, then as long as you expose and process all subsequent prints the same amount, they should print consistently and the curves will adjust them perfectly to that tonal range.

You can apply the curve to other images either by saving & loading it as a Photoshop .csv file, or just drag the curves layer from the layers palette onto another picture if it's opened in Photoshop.

<center><img alt="IMG_7240-180x120-trio.jpg" src="http://www.botzilla.com/blog/pix2006/IMG_7240-180x120-trio.jpg" width="380" height="150" border="0" /></center>

With the curve applied, the original image may look dull and washed out on the monitor, but those tones are what's needed to hit the darkest blacks and whitest whites that the particular printing process can handle &#151;  at least the tones that were in the printed chart. If the chart is strongly over or under exposed, _ChartThrob_ will still make a curve, though it will tell you if the midtones seem to be strongly skewed.

<b>Checking Your Results:</b> If things have gone well, you can take your original chart (as created by _ChartThrob_), apply that correction curve to it, print again and you should get a full range of grays from the new corrected print.


<!-- SPACER ----------------------------------------- -->

# The _ChartThrob_ FAQ</a>

<dl>
<dt>Will <i>ChartThrob</i> work with 16-bit images? I keep giving it 16-bit scans but  it reduces them to 8-bit.</dt>
  <dd>Yes. You can absolutely apply a printing curve made by <i>ChartThrob</i> to 16-bit  images. Just apply the curve in the usual ways. <i>ChartThrob</i> does all of its calibration work in 8-bit, but unless you have an extremely narrow and contrasty process (say, rubber stamps), that should be plenty of precision for the purpose. Applying the resultant curve to a 16-bit image will still give you a 16-bit image.</dd>

<dt>What about 32-bit  images?</dt>
  <dd>Do you have a 32-bit printer? Call me...</dd>

<dt>Can <i>ChartThrob</i> be ued to calibrate B&W images printed by bookprint services like <a href="http://www.lulu.com/">Lulu</a> and <a href="http://www.blurb.com/">Blurb,</a> or on my local newspaper's press?</dt>
  <dd>If the printer is reasonably consistent from run to run, then absolutely yes.</dd>

<dt>How do I contact you to make a report or tell you my great idea for an enhancement or to send you money?</dt>
  <dd><i>ChartThrob is free.</i> You are, however, welcome to buy my photos. You can contact me here on GitHub or at PhotoRant as 'bjorke' at botzilla.com.</dd>

<dt>How can I be notified of new versions of <i>ChartThrob?</i></dt>
   <dd>Use the <a href="http://www.botzilla.com/blog/index.xml">Botzilla RSS feed</a> and "watch" this GitHub repo
    (see the "Watch" button at the top of the GitHub page). Feel free to [star](https://github.com/joker-b/ChartThrob/star) ChartThroub as a favorite, too :)</dd>

<dt>Does<i>ChartThrob</i> work with Photoshop CS3 (or 4, 5, 6...), now that it's out?</dt>
   <dd>Yes.</dd>

<dt>I only have Photoshop 5 (or 7, or CS). Will you change <i>ChartThrob</i> to work with my old version of Photoshop?</dt>
   <dd>Nope. <i>ChartThrob</i> uses UI tools that were introduced with CS2, and Photoshop pre-7 didn't have scripting at all.</dd>

<dt>Why doesn't <i>ChartThrob</i> set curve points for <i>all</i> of the patches? It only seems to set about a dozen points on the curve.</dt>
   <dd>This is a limitation of Photoshop, but 14 points (along a parametric curve) seem to be plenty for real-world printing. The full range of patches are there for <i>you</i> to see.</dd>

<dt>What do all those extra check boxes do?</dt>
   <dd>Try them out!</dd>

<dt>Can you make <i>ChartThrob</i> as an Action instead? I don't like having to call scripts from the 'File' menu, I'd rather see it in the actions palette and attach it to a hot key.</dt>
   <dd>Actions can't do everything scripts can do, especially the stuff that <i>ChartThrob</i> does. You <i>can</i> create an Action that will start-up <i>ChartThrob.</i> That's easy, do it the normal way. The Action won't see the stuff you click in the <i>ChartThrob</i> dialogue boxes, though. That seems to be a limitation of the current Photoshop.</dd>

<dt>I resized the chart scan to be really, really small and now I'm getting junky values from <i>ChartThrob</i>.</dt>
   <dd>The program averages-out an area of the scanned chart and samples this average. It does this to compensate for grain and paper texture. If the scan is too small to get a good average, the quality of the curve will suffer. In general, don't let your scanned-chart image get smaller than, say, 600 pixels across.</dd>

<dt>The defaut chart size is 4 inches at 300 dpi. I want 7.3 inches at 1440 dpi. Can you resize it?</dt>
   <dd>You can use Photoshop's 'Image Size' command for now. I'm considering adding more print-size options, though they will make the dialog box more complicated.</dd>

<dt>Should I be setting stuff up using "Relative Colormetric" in the print dialog? What color space should I use?</dt>
   <dd>It doesn't really matter what your print settings are, as long as they are always the same each time you make a printing negative. In general, try to avoid anything in your printing or scanning processes described as "automatic," since such functions may be changing stuff behind your back &#151; and be sure that your scan is in the same color space (particularly w.r.t. gamma) as the B&W images you plan to print.<br />&nbsp;<br />Be sure that your scan covers the full print range from darkest to lightest within the <i>straight-line portion</i> of the scan. Some scanners will "roll-off" the shadows and/or highlights. This sort of compression of the original print values will give <i>ChartThrob</i> a distorted input.<br /><center><img alt="ChartScan-WrongRight.jpg" src="http://www.botzilla.com/blog/pix2006/ChartScan-WrongRight.jpg" width="720" height="592" border="0" vspace=6 /><br /><i><font size="-2">You want the <b>full range</b> when scanning. These dialogs from EpsonScan&#8482;<br />show that the Automatic exposure of a printed ChartThrob chart<br />distorts the grayscale values. Instead, <b>manually</b> set the max and min pointers <br />to beyond the brightest and darkest vales, &amp; <b>set the gamma to 1.00.</b><br />Note that the entire grayscale will thus be linear: the "shoulder" &amp; "toe" buttons will be ignored.<br />&nbsp;</font></i></center></dd>

<dt>I have a fax scanner and the quality is not so great. I'm losing light (or dark) tones in the printed chart! I can see them, but my scanner can't</dt>
<dd>Either get a better scanner, borrow a better scanner, or try creating a "camera scan" &#151; take a glare-free, evenly-lit photo of the printed chart using a good-quality digital camera &#151; this may also be a solution for printing materials where the dark tones are more reflective than the light tones, thus "fooling" the scanner and not scanning well.</dd>

<dt>Why isn't the generated chart a negative, since I'll be printing it as a negative? It hurts my hand to have to press &lt;Ctrl-I&gt; to invert the chart before printing.</dt>
   <dd>Get a better grip on your printing! Some people print directly from a positive image to a negative and let their print driver do the inversion for them. Others need to print from an inverted image. <i>ChartThrob</i> can't know if you are a negative person or a positive person. So it looks on the bright side and assumes that everyone is positive.</dd>

<dt>Why does <i>ChartThrob</i> use the font 'Myriad Pro,' which I don't have? I have to click lots of stupid 'okay' dialog boxes when I generate a new chart.</dt>
   <dd>First: <i>Upgrade your version of (free) ChartThrob and/or (not free but worth it) Photoshop.</i> <i>ChartThrob</i> doesn't actually use "Myriad" &#151; it only uses "Arial." I'm told it's "an Adobe Thing" which was also updated in Photoshop CS3. <i>IFF</i> you get those (annoying but harmless) "font not found" messages: Just upgrade to V1.06 or later. <i>Or,</i> if you're insanely determined to use an old version, install 'Myriad' and those dialog boxes will vanish forever.</dd>

<dt>Where can I find out more about <i>ChartThrob,</i> and compare results with other users?</dt>
   <dd>See <a href="http://www.hybridphoto.com/forums/showthread.php?t=36">this discussion thread</a> at HybridPhoto.com. In addition, check out this page by Michael Koch-Schulte, who has done additional work in understanding how to get the most out of the varying color sensitivities of different alt-process materials: <i><a href="http://www.inkjetnegative.com/images/RNP/quick_guide_to_making_digital_ne.htm">A Quick Guide to Making Digital Negatives with RNP-Arrays and ChartThrob.</a></i> Or just poke it into <a href="https://www.google.com/search?q=chartThrob+-elton&tbm=isch">Google</a> &#151; it's been encouraging to see <i>ChartThrob</i> users have cropped up all over the net.</dd>

<dt>Sometimes <i>ChartThrob</i> seems to take a long time to run. How do I know that it's working at all?</dt>
   <dd>Leave the 'Histogram,' 'History,' or 'Info' panels open, and you'll see just how fast and furious <i>ChartThrob's</i> drawing and analysis really is. It's edu-taining!</dd>
</dl>

# Learn More

Many people have described their processes and success using ChartThrob. [Google is your friend](https://www.google.com/search?q=chartThrob+print+-elton) in finding them. Here are a couple of specific references worth seeing:

* The [original ChartThrob blog post on Botzilla.Com](http://www.botzilla.com/blog/archives/000544.html)
* A [Third-Party Guide to using Charthrob](http://www.inkjetnegative.com/images/RNP/quick_guide_to_making_digital_ne.htm) on inkjetnegative.com
* A recent (2013) demo: [ChartThrob for President](http://fourtoes.co.uk/iblog/?p=6475) !?
* A long shoe-horning of ChartThrob into QuadToneRIP profiles, with [great results after the inital effort](http://www.luminous-landscape.com/tutorials/qtr.shtml), on Luminous Landscape
* [Flickr search for ChartThrob](http://www.flickr.com/search/?q=chartthrob)
* [Google Image Search](https://www.google.com/search?q=chartThrob+print+-elton&tbm=isch)

Enjoy, [star the ChartThrob repo](https://github.com/joker-b/ChartThrob/star), and share your great prints!

kb
