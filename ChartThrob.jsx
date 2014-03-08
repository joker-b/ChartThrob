// ChartThrob.jsx by Kevin Bjorke
// bjorke@botzilla.com
// http://www.photorant.com/
//
// SEE DETAILED INSTRUCTIONS AND THE FAQ:
//	http://www.botzilla.com/blog/archives/000544.html
//
// THIS IS A JSX JAVASCRIPT PROGRAM FOR ADOBE PHOTOSHOP CS2 AND HIGHER
//	To install, place it in a folder under your Photoshop program
//	folder -- for CS2, the script should be in the folder
//	  "Adobe Photoshop CS2/Presets/Scripts"
//	after you've placed the file, restart Photoshop. You will now see
//	"ChartThrob" listed under the "File->Scripts..." menu.
//
// PLEASE DON'T DISTRIBUTE ALTERED COPIES. I WILL ONLY PROVIDE SUPPORT FOR COPIES
//	THAT WERE DISTRIBUTED BY MY OWN WEB SITE -- I CAN'T DEBUG OTHER PEOPLE'S
//	ERRORS!
// 
// Script (C)2006 Kevin Bjorke. Free for use and re-use.
//	If you like ChartThrob, consider contributing to http://www.photopermit.org/
//
// For use with Thomas Howard's grayscale chart method found at
//    http://LuminaryArts.com/Reference/Articles/PPDN/
//
// Intended Usage (or click "Help"):
// Print the chart to a digital negative, print as a contact print using
//   your printing method of choice (albumen, cyanotype, platinum...). Scan the
//   resultant print, and crop to the original chart boundaries (exact pixel counts
//   are not important, only the shape of the chart. Run the script and it will generate a
//   new adjustments curve layer to correct non-linearities in the printing
//   process. Save the curve itself -- when applied to B&W images, this new curve will
//   re-map the grayscale values of those images into a range that will give you the maximum
//   dynamic possibilities for your printing process.
#target photoshop
app.bringToFront();

// global values /////////

gVersion = 1.07;
gDate = "14 Nov 2006";
var gTitle = "ChartThrob V"+gVersion;

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;
var strButtonCancel = localize("$$$/JavaScripts/ChartThrob/Cancel=Cancel");
var strButtonHelp = localize("$$$/JavaScripts/ChartThrob/Help=Help");

// these widths etc used to generate new charts
var gDPI = 300.0;
var gDPIScale = 1.0;
var gWidth = 1200;
var gHeight = 1210;
var gXMarg = 6;
var gYMarg = 75;
var gPatch = 100;
var gStripWidth = 85;
var gGradWidth = 50;
var gX21 = gXMarg*2+10*gPatch;
var gXGrad = gX21 + gStripWidth;
var gXBar = gXGrad + gGradWidth;
var gLabel = gTitle;
var gChartName = "Grayscale_Chart";

var gNoisy = false;

// some useful colors
var Black = new SolidColor();
Black.rgb.red = 0;
Black.rgb.green = 0;
Black.rgb.blue = 0;
var White = new SolidColor();
White.rgb.red = 255;
White.rgb.green = 255;
White.rgb.blue = 255;
var Red = new SolidColor;
Red.rgb.red = 255.0;
Red.rgb.green = 0.0;
Red.rgb.blue = 0.0;

// these fracions used to determine boundaries in scanned charts
var gBorderL = (gXMarg/gWidth);
var gBorderR = (1.0-((gXMarg+10*gPatch)/gWidth));
var gBorderT = (gYMarg/gHeight);
var gBorderB = (1.0-((gYMarg+11*gPatch)/gHeight));
var gSampleFraction = 0.55;
// var gSampleFraction = 0.75;

// dynamic range of scanned chart
var gMin = 255;
var gMax = 0;
var gDarkestSample = -1;
var gLightestSample = -1;

// runtime on/off flags
var gShowSamples = false;
var gText = false;
var gLines = true;
var gMakeChart = false;

// functions ///////////////

function reset_dpi(newDPI)
{
// these widths etc used to generate new charts
    gDPI = newDPI;
    gDPIScale = newDPI / 300.0;
    gWidth = gDPIScale*1200;
    gHeight = gDPIScale*1210;
    gXMarg = gDPIScale*6;
    gYMarg = gDPIScale*75;
    gPatch = gDPIScale*100;
    gStripWidth = gDPIScale*85;
    gGradWidth = gDPIScale*50;
    gX21 = gXMarg*2+10*gPatch;
    gXGrad = gX21 + gStripWidth;
    gXBar = gXGrad + gGradWidth;
}

function help_dialog()
{
    function st(par,txt) {
	var p = par.add('statictext');
	p.text = txt;
    }
    var dlg = new Window('dialog', gTitle+" Help");
    dlg.gttl = dlg.add('group');
    dlg.gttl.orientation = "column";
    dlg.gttl.spacing = 2;
	st(dlg.gttl,gTitle);
	st(dlg.gttl,gDate);
    dlg.gtop = dlg.add('group');
    dlg.gtop.orientation = "column";
    dlg.gtop.spacing = 2;
	st(dlg.gtop,"ChartThrob is a tool for digital-negative contact printing.");
	st(dlg.gtop,"Using the ChartThrob script, you can both make test charts for your own specific");
	st(dlg.gtop,"printing process, and profile the printed results. ChartThrob can correct for");
	st(dlg.gtop,"both paper color and process color, providing you with predictable printing.");
    dlg.gmid3 = dlg.add('group');
    dlg.gmid3.orientation = "column";
    dlg.gmid3.spacing = 2;
	st(dlg.gmid3,"PLEASE REVIEW THE FAQ");
	st(dlg.gmid3,"http://www.botzilla.com/blog/archives/000544.html");
    dlg.gt2 = dlg.add('group');
    dlg.gt2.orientation = "column";
    dlg.gt2.spacing = 2;
	st(dlg.gt2,"Normally, you need to run ChartThrob at least TWICE:");
	st(dlg.gt2,"Once to create a chart,");
	st(dlg.gt2,"and once to analyze a print of that chart.");
    dlg.grp = dlg.add('panel');
    dlg.grp.orientation = "column";
    dlg.grp.alignChildren = "left";
    dlg.grp.text = "Steps:";
    dlg.grp.spacing = 3;
    dlg.grp.margins = 20;
	st(dlg.grp,"1. Create a new (positive) chart using ChartThrob.");
	st(dlg.grp,"2. Print to a digital negative (at any size).");
	st(dlg.grp,"3. Contact print using your process of choice.");
	st(dlg.grp,"4. Scan the resulting positive.");
	st(dlg.grp,"5. Crop the scan to the original bounds of the chart.");
	st(dlg.grp,"6. Evaluate the scanned chart using ChartThrob.");
	st(dlg.grp,"7. Save the resulting Photoshop Curve");
	st(dlg.grp,"8. Apply this curve to any B&W image you want to print");
	st(dlg.grp,"    using digital negatives. Their tonal ranges will be");
	st(dlg.grp,"    mapped directly to the optimal range for your process.");
    dlg.gmid = dlg.add('group');
    dlg.gmid.orientation = "column";
    dlg.gmid.spacing = 2;
	st(dlg.gmid,"ChartThrob can be used for platinum/palladium, cyanotype,");
	st(dlg.gmid,"silver printing, bromoils, etc.");
    dlg.gmid2 = dlg.add('group');
    dlg.gmid2.orientation = "column";
    dlg.gmid2.spacing = 2;
	st(dlg.gmid2,"Remember, for repeatable results,");
	st(dlg.gmid2,"your printing process should be repeatable.");
	st(dlg.gmid2,"Follow the same printing steps and timings each time,");
	st(dlg.gmid2,"use the same kind of paper,");
	st(dlg.gmid2,"and expose/develop uniformly across the entire paper");
	st(dlg.gmid2,"(at least when printing a chart).");
    dlg.p2 = dlg.add('panel');
    dlg.p2.orientation = "column";
    dlg.p2.alignChildren = "center";
    dlg.p2.spacing = 2;
    dlg.p2.margin = 20;
	st(dlg.p2,"Program: Kevin Bjorke, http://www.photorant.com/");
	st(dlg.p2,"Original Chart Design: Thomas Howard, http://LuminaryArts.com/");
	st(dlg.p2,"FAQ & UPDATES: http://www.botzilla.com/blog/archives/000544.html");

//    http://LuminaryArts.com/Reference/Articles/PPDN/
//
// Intended usage:
// Print the chart to a digital negative, print as a contact print using
//   your printing method of choice (albumen, cyanotype, platinum...). Scan the
//   resultant print, and crop to the original chart boundaries (exact pixel counts
//   are not important, only the shape of the chart. Run the script and it will generate a
//   new adjustments curve layer to correct non-linearities in the printng
//   process. Save the curve itself -- when applied to B&W images, this new curve will
//   re-map the grayscale values of those images into a range that will give you the maximum
//   dynamic possibilities for your printing process.
    var okayBtn = dlg.add('button');
    okayBtn.text = "Done";
    okayBtn.size = [100, 30];
    dlg.defaultElement = okayBtn;
    with (dlg) {
	okayBtn.onClick = function () {this.parent.close(1); }
    }
    dlg.center();
    var result = dlg.show();
}

function user_dialog()
{
    function st(par,txt) {
	var p = par.add('statictext');
	p.text = txt;
    }
    // var vers = version_string();
    var scannable = true;

    if (app.documents.length < 1) {
	gMakeChart = true;
	scannable = false;
//    } else {
//	var limit = new UnitValue(100,"px");
//	var w = app.activeDocument.width.value;
//	var h = app.activeDocument.height.value;
//	w.convert("px");
//	h.convert("px");
//	if ((w < limit) || (h < limit)) {
//	    alert(gTitle+" Warning:\nCurrent active document is too small\nto scan properly:\n"+w+","+h);
//	    gMakeChart = true;
//	    scannable = false;
//	}
    }
    //
    var dlg = new Window('dialog', gTitle);
	// dlg.alignChildren = "fill";
	dlg.alignChildren = "center";
    dlg.gttl = dlg.add('group');
    dlg.gttl.orientation = "column";
    dlg.gttl.spacing = 2;
	st(dlg.gttl,gTitle);
	st(dlg.gttl,gDate);

    // scan panel
    if (scannable == true) {
	dlg.wpnl = dlg.add('panel');
	    dlg.wpnl.text = "Analyze Chart \"" + app.activeDocument.name + "\"";
	    dlg.wpnl.helpTip = "Controls for Evaluating an Open, Scanned Chart";
	    dlg.wpnl.okayBtn = dlg.wpnl.add('button');
		dlg.wpnl.okayBtn.text = "Analyze \"" + app.activeDocument.name + "\" Now";
		dlg.wpnl.okayBtn.name = 'analyze';
		dlg.wpnl.okayBtn.helpTip = "Run analysis on scanned chart";
		var pw = dlg.wpnl.okayBtn.preferredSize.width + 40;
		dlg.wpnl.okayBtn.size = [pw, 30];
	    dlg.wpnl.strokeBtn = dlg.wpnl.add('checkbox');
		dlg.wpnl.strokeBtn.text = 'Outline Sample Areas';
		dlg.wpnl.strokeBtn.value = gShowSamples;
		dlg.wpnl.strokeBtn.helpTip = "Keep the Averaged Samples Around, and Outline Them?";
	    dlg.wpnl.noiseBtn = dlg.wpnl.add('checkbox');
		dlg.wpnl.noiseBtn.text = 'Excessive Messages';
		dlg.wpnl.noiseBtn.value = gNoisy;
		dlg.wpnl.noiseBtn.helpTip = "";
	dlg.defaultElement = dlg.wpnl.okayBtn;
    }

    // build panel
    dlg.bpnl = dlg.add('panel');
    if (scannable == true) {
	dlg.bpnl.text = "OR: Build New Chart Instead?";
    } else {
	dlg.bpnl.text = "Build New Printable Chart";
    }
    dlg.bpnl.helpTip = "Use these controls when creating a new, positive chart for test-printing";
    //
    dlg.bpnl.grp2 = dlg.bpnl.add('group');
	dlg.bpnl.grp2.junk = dlg.bpnl.grp2.add('statictext');
	    dlg.bpnl.grp2.junk.text = "New Name:";
	    dlg.bpnl.grp2.junk.helpTip = "New Document Name";
	dlg.bpnl.grp2.cName = dlg.bpnl.grp2.add('edittext');
	    dlg.bpnl.grp2.cName.text = gChartName;
	    dlg.bpnl.grp2.cName.helpTip = "New Document Name";
	    var pw = dlg.bpnl.grp2.cName.preferredSize.width + 40;
	    var ph = dlg.bpnl.grp2.cName.preferredSize.height;
	    dlg.bpnl.grp2.cName.size = [pw, ph];
	dlg.bpnl.grp2.junk2 = dlg.bpnl.grp2.add('statictext');
	    dlg.bpnl.grp2.junk2.text = "Label:";
	    dlg.bpnl.grp2.junk2.helpTip = "Label for this New Chart";
	dlg.bpnl.grp2.label = dlg.bpnl.grp2.add('edittext');
	    dlg.bpnl.grp2.label.text = gLabel;
	    dlg.bpnl.grp2.label.helpTip = "Label for this New Chart";
	    pw = dlg.bpnl.grp2.label.preferredSize.width + 40;
	    ph = dlg.bpnl.grp2.label.preferredSize.height;
	    dlg.bpnl.grp2.label.size = [pw, ph];
    //
    dlg.bpnl.grp = dlg.bpnl.add('group');
	dlg.bpnl.grp.textBtn = dlg.bpnl.grp.add('checkbox');
	    dlg.bpnl.grp.textBtn.text = 'Numbers';
	    dlg.bpnl.grp.textBtn.value = gText;
	    dlg.bpnl.grp.textBtn.helpTip = "Label Patch Values (Slows-down generation considerably)?";
	dlg.bpnl.grp.lineBtn = dlg.bpnl.grp.add('checkbox');
	    dlg.bpnl.grp.lineBtn.text = "Outlines";
	    dlg.bpnl.grp.lineBtn.value = gLines;
	    dlg.bpnl.grp.lineBtn.helpTip = "Draw Patch Borders?";
	dlg.bpnl.grp.dd = dlg.bpnl.grp.add('statictext');
	    dlg.bpnl.grp.dd.text = "DPI:";
	    dlg.bpnl.grp.dd.helpTip = "DPI for new chart (charts can be resized without harm)";
	dlg.bpnl.grp.dpiLabel = dlg.bpnl.grp.add('edittext');
	    dlg.bpnl.grp.dpiLabel.text = gDPI;
	    dlg.bpnl.grp.dpiLabel.alignment = 'fill';
	    dlg.bpnl.grp.dpiLabel.helpTip = "DPI for new chart (charts can be resized without harm)";
	    var pw = dlg.bpnl.grp.dpiLabel.preferredSize.width + 20;
	    var ph = dlg.bpnl.grp.dpiLabel.preferredSize.height;
	    dlg.bpnl.grp.dpiLabel.size = [pw, ph];
    //
    dlg.bpnl.okayBtn = dlg.bpnl.add('button');
	dlg.bpnl.okayBtn.text = "Build New Chart Now";
	dlg.bpnl.okayBtn.name = 'buildNew';
	dlg.bpnl.okayBtn.helpTip = "Build New Chart Document";
    if (scannable == false) {
	dlg.defaultElement = dlg.bpnl.okayBtn;
	dlg.bpnl.okayBtn.size = [200, 30];
    }
    //

    // group for bottom buttons
    dlg.bot = dlg.add('group');
	dlg.bot.spacing = 40;
	dlg.bot.cancelBtn = dlg.bot.add('button');
	    dlg.bot.cancelBtn.text = strButtonCancel;
	    dlg.bot.cancelBtn.name = 'cancel';
	    dlg.bot.cancelBtn.helpTip = "Get ChartThrob Help!";
	dlg.bot.helpBtn = dlg.bot.add('button');
	    dlg.bot.helpBtn.text = strButtonHelp;
	    dlg.bot.helpBtn.name = 'help';
	    dlg.bot.helpBtn.helpTip = "Get ChartThrob Help!";
    // need to set close-x to 'cancel'
    dlg.cancelElement = dlg.bot.cancelBtn;
    with (dlg) {
	dlg.bpnl.okayBtn.onClick = function () {gMakeChart = true; this.parent.parent.close(1); }
	if (scannable == true) {
	    dlg.wpnl.okayBtn.onClick = function () {gMakeChart = false; this.parent.parent.close(1); }
	}
	dlg.bot.helpBtn.onClick = function () {this.parent.parent.close(3); }
	dlg.bot.cancelBtn.onClick = function () {this.parent.parent.close(2); }
    }
    dlg.center();
    var result = dlg.show();
    if ((result == 2)||(result<1)) { return (-1); }
    if (result == 3) {
	help_dialog();
	return (-1);
    }
    gText = dlg.bpnl.grp.textBtn.value;
    gLines = dlg.bpnl.grp.lineBtn.value;
    gLabel = dlg.bpnl.grp2.label.text;
    gChartName = dlg.bpnl.grp2.cName.text;
    var dv = dlg.bpnl.grp.dpiLabel.text;
    if (dv<72) {
	alert("Odd dpi reset to 72 from "+dv);
	dv = 72;
    }
    reset_dpi(dv);
    // if (app.documents.length > 0) {
    if (scannable == true) {
	gShowSamples = dlg.wpnl.strokeBtn.value;
	gNoisy = dlg.wpnl.noiseBtn.value;
    }
    return 1;
}

//////////

function to_gray(C)
{
    return ((C.rgb.red+C.rgb.green+C.rgb.blue)/3.0);
    // return (C.rgb.red*0.2+C.rgb.green*0.7+C.rgb.blue*0.1);
}

function gray_values(ColorSamples)
{
    var graySamp = new Array(ColorSamples.length);
    var paperColor = ColorSamples[0]; // paper tone will be in the first sample
    if (gNoisy) {
	alert("Paper base color: ["+paperColor.rgb.red+","+
		paperColor.rgb.green+","+paperColor.rgb.blue+"]");
    }
    if ((paperColor.rgb.red < 128) ||
	(paperColor.rgb.green < 128) ||
	(paperColor.rgb.blue < 128)) {
	alert("Paper base color was identified as ["+paperColor.rgb.red+","+
		paperColor.rgb.green+","+paperColor.rgb.blue+"]\nwhich is unusually dark.\n"+
		"Perhaps you accidentally scanned a negative image of the chart.\n"+
		"Be sure to scan a positive print");

    }
    var g = new SolidColor();
    var nred;
    var ngreen;
    var nblue;
    for (var i=0; i<ColorSamples.length; i++) {
	s = ColorSamples[i];
	nred = 255 * s.rgb.red / paperColor.rgb.red;
	ngreen = 255 * s.rgb.green / paperColor.rgb.green;
	nblue = 255 * s.rgb.blue / paperColor.rgb.blue;
	if (nred > 255) { nred = 255; }
	if (ngreen > 255) { ngreen = 255; }
	if (nblue > 255) { nblue = 255; }
	// alert("s "+i+" rgb is "+s.rgb.red+"/"+s.rgb.green+"/"+s.rgb.blue+"\nResult rgb is "+nred+"/"+ngreen+"/"+nblue);
	g.rgb.red = nred;
	g.rgb.green = ngreen;
	g.rgb.blue = nblue;
	graySamp[i] = to_gray(g);
    }
    return graySamp;
}

/////////////////////////

// show all values as numbers
function show_all_grays(GraySamples,TheText)
{
    function st(par,txt) {
	var p = par.add('statictext');
	p.text = txt;
    }
    var dlg = new Window('dialog', gTitle+" "+TheText);
    var j = 0;
    for (var i=0; i<GraySamples.length; i++) {
	if (j == 0) {
	    dlg.grp = dlg.add('group');
	    dlg.grp.orientation = "row";
	    dlg.grp.spacing = 4;
	}
	st(dlg.grp,i+":"+GraySamples[i].toPrecision(4));
	j = j + 1;
	if (j > 10) {
	    j = 0;
	}
    }
    var okayBtn = dlg.add('button');
    okayBtn.text = "Done";
    with (dlg) {
	okayBtn.onClick = function () {this.parent.close(1); }
    }
    dlg.center();
    var result = dlg.show();
}

// look at the list of scanned values, and return a normalized copy
function determine_dynamic_range(GraySamples)
{
    gMin = 256;
    gMax = -1;
    for (var i=0; i<GraySamples.length; i++) {
	var s = GraySamples[i];
	if (s<1) {
	    if (gNoisy) {
		alert("Sample "+i+" is "+s);
	    }
	}
	if (s<=gMin) {
	    // alert("New min "+s+" @ "+i);
	    gMin = s;
	    gDarkestSample = i;
	}
	if (s>=gMax) {
	    // alert("New max "+s+" @ "+i);
	    gMax = s;
	    gLightestSample = i;
	}
    }
    var nSamps = new Array(GraySamples.length); // will hold our normalized copies
    var dR = gMax-gMin;
    if (gNoisy == true) {
	show_all_grays(GraySamples,"Sample Values");
	alert("Dynamic range ("+dR.toPrecision(5)+")\n[" +
	    gMin.toPrecision(5)+" to "+gMax.toPrecision(5)+"]");
    }
    if (dR < 1) {
	alert("Error - Bogus dynamic range ("+dR+")\n[" +
		    gMin+" to "+gMax+"]\nBlank or inverted scan?");
	for (var i=0; i<GraySamples.length; i++) { // just return linear values
	    nSamps[i] = Math.floor(0.5 + (255.0 * i/(GraySamples.length-1.0)));
	}
    } else {
	for (var i=0; i<GraySamples.length; i++) {
	    nSamps[i] = Math.floor(0.5 + (255.0 * (GraySamples[i]-gMin)/dR));
	}
    }
    if (gNoisy == true) {
	show_all_grays(nSamps,"Normalized Values");
    }
    return nSamps;
}

// given the original gray value, where along the samples should we place
//    a new grayscale value, so as to get the same thing within the normalized
//    range?
function find_value_that_gives(origValue,normalizedSamples)
{
    var lowerVal = -1;
    var L = normalizedSamples.length;
    // var qq = "";
    if (origValue == 0) {
	for (var i=L-2; i>=0; i--) {
	    if (origValue < normalizedSamples[i]) {
		i = i+1;
		lowerVal = normalizedSamples[i];
		break;
	    }
	}
    } else {
	for (var i=0; i<L; i++) {
	    // qq = qq + normalizedSamples[i].toPrecision(3) + "/";
	    if (origValue > normalizedSamples[i]) {
		lowerVal = normalizedSamples[i];
		break;
	    }
	}
    }
    if (lowerVal < 0) {
	if (origValue == 0) {
	    i = L-1;
	    lowerVal = normalizedSamples[i];
	} else {
	    // we should never reach here, since the samples are normalized
	    alert("Sample values start above "+origValue+", sorry."+
		    "Lowest was "+normalizedSamples[L-1]+
		    "\nPlease report this error to bjorke@photorant.com");
	    return -1;
	}
    }
    var n = 0;
    var higherVal;
    if (origValue == lowerVal) {
	n = i; // that was easy
	higherVal = lowerVal;
    } else {
	if (i == 0) {
	    // we should never reach here, since the samples are normalized
	    alert("Sample values never reach "+origValue+", sorry.\n" +
		    "Highest was "+normalizedSamples[0]+
		    "\nPlease report this error to bjorke@photorant.com");
	    return -1;
	}
	higherVal = normalizedSamples[i-1];
	var delta = higherVal - lowerVal;
	// use linear interpolation
	if (delta == 0) {
	    // n = i - 1; // higher
	    n = i; // lower
	} else {
	    var placement = origValue - lowerVal;
	    var t = placement/delta;
	    n = i - t;
	}
    }
    var s = (255 * (1.0-(n/(L-1.0))));
    // alert("To get "+origValue+", we should use "+s+"\ndelta "+delta+" i "+i);
    if (gNoisy) {
	alert("Returning "+s+" from "+origValue+", index "+i+" ("+lowerVal+"/"+higherVal+")");
    }
    // alert(origValue+":\n"+qq+"\n"+s);
    return s;
}

//////////

function boundArray(Left,Right,Bottom,Top)
{
    var b = new Array(new Array(Left,Bottom),new Array(Right,Bottom),new Array(Right,Top), new Array(Left,Top));
    return (b);
}

// == new from listener =====================================================
function draw_Gradient(x1,y1,x2,y2,color1,color2)
{
    var grdnID = charIDToTypeID( "Grdn" );
    // various IDs
    var hrznID = charIDToTypeID( "Hrzn" );
    var vrtcID = charIDToTypeID( "Vrtc" );
    var pxlID = charIDToTypeID( "#Pxl" );
    var pntID = charIDToTypeID( "Pnt " );
    var fromID = charIDToTypeID( "From" );
    var tID = charIDToTypeID( "T   " );
    var typeID = charIDToTypeID( "Type" );
    var grdtID = charIDToTypeID( "GrdT" );
    var lnrID = charIDToTypeID( "Lnr " );
    var dthrID = charIDToTypeID( "Dthr" );
    var usmsID = charIDToTypeID( "UsMs" );
    var gradID = charIDToTypeID( "Grad" );
    var nmID = charIDToTypeID( "Nm  " );
    var grdfID = charIDToTypeID( "GrdF" );
    var cstsID = charIDToTypeID( "CstS" );
    var intrID = charIDToTypeID( "Intr" );
    var clrsID = charIDToTypeID( "Clrs" );
    var clrID = charIDToTypeID( "Clr " );
    var cynID = charIDToTypeID( "Cyn " );
    var mgntID = charIDToTypeID( "Mgnt" );
    var ylwID = charIDToTypeID( "Ylw " );
    var blckID = charIDToTypeID( "Blck" );
    var cmycID = charIDToTypeID( "CMYC" );
    var clryID = charIDToTypeID( "Clry" );
    var usrsID = charIDToTypeID( "UsrS" );
    var id91 = charIDToTypeID( "TrnS" );
    var mdpnID = charIDToTypeID( "Mdpn" );
    var prcID = charIDToTypeID( "#Prc" );
    var id87 = charIDToTypeID( "Opct" );
    var id86 = charIDToTypeID( "TrnS" );
    var id82 = charIDToTypeID( "Opct" );
    var id81 = charIDToTypeID( "Trns" );
    var id80 = charIDToTypeID( "Clrt" );
    var id68 = charIDToTypeID( "Clrt" );
    var lctnID = charIDToTypeID( "Lctn" );
    // location of gradient
    var desc5 = new ActionDescriptor();
        var desc6 = new ActionDescriptor();
        desc6.putUnitDouble( hrznID, pxlID, x1 );
        desc6.putUnitDouble( vrtcID, pxlID, y1 );
    desc5.putObject( fromID, pntID, desc6 );
        var desc7 = new ActionDescriptor();
        desc7.putUnitDouble( hrznID, pxlID, x2 );
        desc7.putUnitDouble( vrtcID, pxlID, y2 );
    desc5.putObject( tID, pntID, desc7 );
    desc5.putEnumerated( typeID, grdtID, lnrID );
    desc5.putBoolean( dthrID, true );
    desc5.putBoolean( usmsID, true );
        var desc8 = new ActionDescriptor();
        desc8.putString( nmID, "Black, White" );
        desc8.putEnumerated( grdfID, grdfID, cstsID );
        desc8.putDouble( intrID, 4096.000000 );
            var list1 = new ActionList();
                var desc9 = new ActionDescriptor();
                    var desc10 = new ActionDescriptor();
                    desc10.putDouble( cynID, color1.cmyk.cyan );
                    desc10.putDouble( mgntID, color1.cmyk.magenta );
                    desc10.putDouble( ylwID, color1.cmyk.yellow );
                    desc10.putDouble( blckID, color1.cmyk.black );
                    // desc10.putDouble( cynID, 75.020000 );
                    // desc10.putDouble( mgntID, 68.010000 );
                    // desc10.putDouble( ylwID, 67.000000 );
                    // desc10.putDouble( blckID, 90.190000 );
                desc9.putObject( clrID, cmycID, desc10 );
                desc9.putEnumerated( typeID, clryID, usrsID );
                desc9.putInteger( lctnID, 0 );
                desc9.putInteger( mdpnID, 50 );
            list1.putObject( id68, desc9 );
                var desc11 = new ActionDescriptor();
                    var desc12 = new ActionDescriptor();
                    desc12.putDouble( cynID, color2.cmyk.cyan );
                    desc12.putDouble( mgntID, color2.cmyk.magenta );
                    desc12.putDouble( ylwID, color2.cmyk.yellow );
                    desc12.putDouble( blckID, color2.cmyk.black );
                    // desc12.putDouble( cynID, 0.000000 );
                    // desc12.putDouble( mgntID, 0.000000 );
                    // desc12.putDouble( ylwID, 0.000000 );
                    // desc12.putDouble( blckID, 0.000000 );
                desc11.putObject( clrID, cmycID, desc12 );
                desc11.putEnumerated( typeID, clryID, usrsID );
                desc11.putInteger( lctnID, 4096 );
                desc11.putInteger( mdpnID, 50 );
            list1.putObject( id80, desc11 );
        desc8.putList( clrsID, list1 );
            var list2 = new ActionList();
                var desc13 = new ActionDescriptor();
                desc13.putUnitDouble( id82, prcID, 100.000000 );
                desc13.putInteger( lctnID, 0 );
                desc13.putInteger( mdpnID, 50 );
            list2.putObject( id86, desc13 );
                var desc14 = new ActionDescriptor();
                desc14.putUnitDouble( id87, prcID, 100.000000 );
                desc14.putInteger( lctnID, 4096 );
                desc14.putInteger( mdpnID, 50 );
            list2.putObject( id91, desc14 );
        desc8.putList( id81, list2 );
    desc5.putObject( gradID, grdnID, desc8 );
    executeAction( grdnID, desc5, DialogModes.NO );
}

function vertical_grad()
{
    var bd = boundArray(gXGrad,gXGrad+gGradWidth,0,gHeight);
    app.activeDocument.selection.select(bd);
    var xc = gXGrad + (gGradWidth/2);
    draw_Gradient(xc,gHeight,xc,0,Black,White)
    app.activeDocument.selection.deselect();
}

//
function draw_bars(xStart,margin)
{
    var bd = boundArray(xStart,gWidth,0,gHeight);
    app.activeDocument.selection.select(bd);
    app.activeDocument.selection.fill(Black);
    bd = boundArray(xStart,gWidth-margin,margin,margin+(gHeight-margin)/2);
    app.activeDocument.selection.select(bd);
    app.activeDocument.selection.fill(White);
    app.activeDocument.selection.deselect();
}

function grad_line(x,bottom,top,dv,lv)
{
    var bd = boundArray(x-1,x+1,bottom,top);
    app.activeDocument.selection.select(bd);
    var dark = new SolidColor();
    dark.rgb.red = dv;
    dark.rgb.green = dv;
    dark.rgb.blue = dv;
    var light = new SolidColor();
    light.rgb.red = lv;
    light.rgb.green = lv;
    light.rgb.blue = lv;
    draw_Gradient(x,bottom,x,top,light,dark)
    app.activeDocument.selection.deselect();
}

function horiz_line(x0,x1,y,val)
{
    var c = new SolidColor();
    c.rgb.red = val;
    c.rgb.green = val;
    c.rgb.blue = val;
    var bd = boundArray(x0,x1,y-1,y+1);
    app.foreGroundColor = c;
    app.activeDocument.selection.select(bd);
    app.activeDocument.selection.fill(c);
    app.activeDocument.selection.deselect();
}

function grayPatch(bd,val)
{
    app.activeDocument.selection.select(bd);
    var c = new SolidColor();
    c.rgb.red = val;
    c.rgb.green = val;
    c.rgb.blue = val;
    app.activeDocument.selection.fill(c);
    app.activeDocument.selection.deselect();
}

function writeText(x,y,userString,val,just)
{
    var c = new SolidColor();
    c.rgb.red = val;
    c.rgb.green = val;
    c.rgb.blue = val;
    var newTextLayer = activeDocument.artLayers.add();
    newTextLayer.kind = LayerKind.TEXT;
    newTextLayer.textItem.font = "ArialMT";
    newTextLayer.textItem.size = 20*(72/300); // points, not pixels
    newTextLayer.textItem.contents = userString;
    newTextLayer.textItem.color = c;
    newTextLayer.textItem.position = Array(x, y);
    newTextLayer.textItem.justification = just;
    return newTextLayer; // ignored so far
}

function make101()
{
    var n=0;
    var p=1;
    var b;
    var x;
    var y;
    var v;
    for (var j=0; j<10; j++) {
	y = gYMarg + j*gPatch;
	for (var i=0; i<10; i++) {
	    x = gXMarg + i*gPatch;
	    v = Math.floor(0.5 + (255-255*(n/100)));
	    b = boundArray(x,x+gPatch,y,y+gPatch);
	    grayPatch(b,v);
	    if (gText) {
		var tv = 0;
		if (v < 128) tv = 255;
		writeText(x+6,y+20,(n+"%"),tv,Justification.LEFT);
		writeText(x+gPatch-6,y+20,(255-v),tv,Justification.RIGHT);
		if ((n % 5)==0) {
		    writeText(x+6,y+gPatch-6,p,tv,Justification.LEFT);
		    p++;
		}
		app.activeDocument.flatten();
	    }
	    n++;
	}
    }
    v = 0;
    y = gYMarg + 10*gPatch;
    b = boundArray(gXMarg,gXMarg+gPatch,y,y+gPatch);
    grayPatch(b,v);
    if (gText) {
	writeText(gXMarg+6,y+20,(n+"%"),255,Justification.LEFT);
	writeText(gXMarg+gPatch-6,y+20,"255",255,Justification.RIGHT);
	writeText(gXMarg+6,y+gPatch-6,p,255,Justification.LEFT);
	app.activeDocument.flatten();
    }
    if (gLines) {
	for (var i=0; i<=10; i++) {
	    x = gXMarg + i*gPatch;
	    v = 55+ 145*(i/10);
	    if (i<2) {
		grad_line(x,gYMarg-1,gYMarg+11*gPatch+1,55,200);
	    } else {
		grad_line(x,gYMarg-1,gYMarg+10*gPatch+1,55,200);
	    }
	    y = gYMarg + i*gPatch;
	    horiz_line(gXMarg-1,gXMarg+10*gPatch+1,y,v);
	}
	horiz_line(gXMarg-1,gXMarg+gPatch+1,y+gPatch,v);
    }
}

function make21()
{
    var x2 = gX21+gStripWidth;
    var ht = gHeight/21.0;
    for (var j=0; j<21; j++) {
	var y = j*ht;
	var v = 255-255*(j/20);
	var b = boundArray(gX21,x2,y,y+ht+1);
	grayPatch(b,v);
	if (gText) {
	    var tv = 0;
	    if (v < 128) tv = 255;
	    writeText(gX21+6,y+20,(j+1),tv,Justification.LEFT);
	    app.activeDocument.flatten();
	}
    }
    app.activeDocument.selection.deselect();
}

//////////////////////////////////////////////////////

function patchCenter(i,j)
{
    var w = app.activeDocument.width.value;
    var h = app.activeDocument.height.value;
    var rw = w*(1.0-(gBorderR+gBorderL));
    var rh = h*(1.0-(gBorderT+gBorderB));
    var px = Math.floor(0.5+(w*gBorderL + rw*((i+0.5)/10.0)));
    var py = Math.floor(0.5+(h*gBorderT + rh*((j+0.5)/11.0)));
    return new Array(px,py);
}

//
// define sampling area
//
function selectPatch(i,j)
{
    var c = patchCenter(i,j);
    var w = app.activeDocument.width.value;
    var h = app.activeDocument.height.value;
    var rw = w*(1.0-(gBorderR+gBorderL));
    var rh = h*(1.0-(gBorderT+gBorderB));
    var pw = 0.5*rw*(gSampleFraction/10.0);	// uniform for entire document
    var ph = 0.5*rh*(gSampleFraction/11.0);	// likewise
    var b = boundArray(c[0]-pw,c[0]+pw,c[1]-ph,c[1]+ph);
    app.activeDocument.selection.select(b);
}

// grab pixel color

getColorAt = function(doc, x, y) {
    function selectBounds(doc, b) {
	doc.selection.select([[ b[0], b[1] ],
                           [ b[2], b[1] ],
                           [ b[2], b[3] ],
                           [ b[0], b[3] ]]);
    }
    function findPV(h) {
	for (var i = 0; i <= 255; i++ ) {
	    if (h[i]) { return i; }
	}
	return 0;
    }
    var onePix = new UnitValue(1,"px");
    selectBounds(doc, [x, y, x+onePix, y+onePix]);
    var pColour = new SolidColor();
    pColour.rgb.red   = findPV(doc.channels[0].histogram);
    pColour.rgb.green = findPV(doc.channels[1].histogram);
    pColour.rgb.blue  = findPV(doc.channels[2].histogram);
    doc.selection.deselect(); // or, even better, undo
    return pColour;
};

//
// average the pixels in this area
//
function patch(i,j)
{
    doc = app.activeDocument;
    selectPatch(i,j);
    doc.activeLayer.applyAverage();
    if (gShowSamples) {
	doc.selection.stroke(Red,1);
    }
    //
    var c = patchCenter(i,j);
    var p = getColorAt(doc, c[0], c[1]);
    if (gNoisy == true) {
	alert("patchCenter("+i+","+j+") -> ["+c[0]+","+c[1]+"] -> ["+p.rgb.red+","+
		p.rgb.green+","+p.rgb.blue+"]");
    }
    return p;
}

//new
function outStroke()
{
    var bd = boundArray(0,gWidth,0,gHeight);
    app.activeDocument.selection.select(bd);
    app.activeDocument.selection.stroke(Black,1);
    app.activeDocument.selection.deselect(); // or, even better, undo
}

function patchStrip(colorList,patchSize)
{
    var n = colorList.length;
    if (n < 1) {
	alert("No colors for new strip");
	return;
    }
    var newDoc = app.documents.add(patchSize*n,patchSize,gDPI,"CStrip",NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
    var c = new SolidColor();
    for (var i=0; i<n; i++) {
	c = colorList[i];
	var l = i*patchSize;
	var b = boundArray(l,l+patchSize,0,patchSize);
	newDoc.selection.select(b);
	newDoc.selection.fill(c);
    }
    newDoc.selection.deselect(); // or, even better, undo
}

////////////

var duplicateDocument = function(doc, name, merged) {
  function _ftn() {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Frst"));
    desc.putReference(charIDToTypeID("null"), ref );

    if (name) {
      desc.putString(charIDToTypeID("Nm  "), name);
    }
    if (merged == true) {
      desc.putBoolean(charIDToTypeID("Mrgd"), true);
    }
    executeAction(charIDToTypeID("Dplc"), desc, DialogModes.NO );
    return app.activeDocument;
  }
  return _ftn();
};

//////////////////

function verifyCurve(curvePoints)
{
    var p = curvePoints[0][0];
    for(i=1;i<curvePoints.length;i++) {
	var n = curvePoints[i][0];
	if (n < p) {
	    alert("Invalid curve values!\n" +
		    "Non-progressive values...\n" +
		    "Is this image really a scanned chart?\n" +
		    "Has it been cropped properly?");
	    return(-1);
	}
    }
    return 1;
}

function curveLayer(curvePoints)
{
    var desc14 = new ActionDescriptor();
    var ref9 = new ActionReference();
    ref9.putClass( charIDToTypeID( "AdjL" ) );
    desc14.putReference( charIDToTypeID( "null" ), ref9 );
    var desc15 = new ActionDescriptor();
    var desc16 = new ActionDescriptor();
    var list1 = new ActionList();
    var desc17 = new ActionDescriptor();
    var ref10 = new ActionReference();
    ref10.putEnumerated( charIDToTypeID( "Chnl" ), charIDToTypeID( "Chnl" ), charIDToTypeID( "Cmps" ) );
    desc17.putReference( charIDToTypeID( "Chnl" ), ref10 );
    var list2 = new ActionList();
    for(i=0;i<curvePoints.length;i++) {
	var desc18 = new ActionDescriptor();
	desc18.putDouble( charIDToTypeID( "Hrzn" ), curvePoints[i][0] );
	desc18.putDouble( charIDToTypeID( "Vrtc" ), curvePoints[i][1] );
	list2.putObject( charIDToTypeID( "Pnt " ), desc18 );
    }
    desc17.putList( charIDToTypeID( "Crv " ), list2 );
    list1.putObject( charIDToTypeID( "CrvA" ), desc17 );
    desc16.putList( charIDToTypeID( "Adjs" ), list1 );
    desc15.putObject( charIDToTypeID( "Type" ), charIDToTypeID( "Crvs" ), desc16 );
    desc14.putObject( charIDToTypeID( "Usng" ), charIDToTypeID( "AdjL" ), desc15 );
    executeAction( charIDToTypeID( "Mk  " ), desc14, DialogModes.NO );
}

/////////////////////////////////////////////////////

function scan_results_report()
{
    function st(par,txt) {
	var p = par.add('statictext');
	p.text = txt;
    }
    var dlg = new Window('dialog', gTitle+" Report");
    st(dlg,"ChartThrob Scan Analysis Complete.");
    dlg.ghid = dlg.add('group');
    dlg.ghid.orientation = "column";
    dlg.ghid.spacing = 2;
    st(dlg.ghid,"See the hidden 'Print Curve' Layer?");
    st(dlg.ghid,"You can save this curve to disk for");
    st(dlg.ghid,"later use, or drag the 'Print Curve'");
    st(dlg.ghid,"layer onto any other positive B&W image");
    st(dlg.ghid,"before printing a digital negative.");
    dlg.gmid = dlg.add('group');
    dlg.gmid.orientation = "column";
    dlg.gmid.spacing = 2;
    st(dlg.gmid,"Lightest scan value was @ sample "+gLightestSample);
    st(dlg.gmid,"Darkest scan value was @ sample "+gDarkestSample);
    var shoulder = gLightestSample;
    var toe = 101-gDarkestSample;
    var doSugg = false;
    var sugg = "";
    var sugg2 = "";
    if ((toe > (shoulder*1.5))  && (toe > 5)) {
	doSugg = true;
	sugg = "decreased";
	sugg2 = "less";
    }
    if ((shoulder > (toe*1.5)) && (shoulder > 5)) {
	doSugg = true;
	sugg = "increased";
	sugg2 = "more";
    }
    if (doSugg) {
	dlg.gsugg = dlg.add('panel');
	dlg.gsugg.orientation = "column";
	dlg.gsugg.spacing = 2;
	dlg.gsugg.text = "Suggestion:";
	st(dlg.gsugg,"While the current curves are valid,");
	st(dlg.gsugg,"you may want to reprint this chart with a "+sugg+" exposure time,");
	st(dlg.gsugg,"to align midtones and optimal paper response.");
	st(dlg.gsugg,"Then scan & analyze the new "+sugg2+"-exposed chart print.");
    }
    var okayBtn = dlg.add('button');
    okayBtn.text = "Done";
    with (dlg) {
	okayBtn.onClick = function () {this.parent.close(1); }
    }
    dlg.center();
    var result = dlg.show();
}

//
// scan the active document
//
function scan_chart()
{
    if (!app.documents.length > 0) {    // stop if no document is opened.
	alert("Sorry, No Current Document\n" +
		"To use this script, crop a scanned print to the\n" +
		"original chart boundaries.\n" +
		"The script will generate a correction curves layer\n" +
		"that will linearize the values of the scanned chart.\n" +
		"Use this new curve to correct for the printing process\n" +
		"when creating digital contact-printing negatives.");
	return;
    }
    var origDoc = app.activeDocument;
    var samplerDoc = duplicateDocument(origDoc,"ChartThrob_Samples",true);
    samplerDoc.info.source = "Made from '" + origDoc.name + "' by ChartThrob.jsx";
    samplerDoc.info.category = "TextureMap";
    samplerDoc.flatten();
    if ((samplerDoc.mode == DocumentMode.BITMAP)||
	(samplerDoc.mode == DocumentMode.CMYK)||
	(samplerDoc.mode == DocumentMode.DUOTONE)||
	(samplerDoc.mode == DocumentMode.GRAYSCALE)||
	(samplerDoc.mode == DocumentMode.INDEXEDCOLOR)) {
	    samplerDoc.changeMode(DocumentMode.RGB);
    }
    app.activeDocument = samplerDoc;
    // stuff....
    var scannedValues = new Array(101);
    var n=0;
    for (var j=0; j<10; j++) {
	for (var i=0; i<10; i++) {
	    scannedValues[n] = patch(i,j);
	    n++;
	}
    }
    scannedValues[n] = patch(0,10.0);
    var scannedGrayValues = gray_values(scannedValues);
    var normSamps = determine_dynamic_range(scannedGrayValues);
    var curvePoints = new Array;
    var i=0;
    for (var j=0; j<14; j++) {	// unfortunately PS allows only a few curve points
	var origPicVal = Math.floor(0.5+(255.0 * j / 13.0));
	var mapToVal = find_value_that_gives(origPicVal,normSamps)
	if (mapToVal >= 0) {
	    curvePoints[i++] = [origPicVal,mapToVal];
	}
    }
    app.activeDocument = samplerDoc;
    if ((!gShowSamples) && (!gNoisy)) {
	samplerDoc.close(SaveOptions.DONOTSAVECHANGES);
    }
    app.activeDocument = origDoc;
    app.activeDocument.selection.deselect();
    if (i < 2) {
	alert("Sorry, not enough samples had values to estimate a curve");
    } else {
	if (verifyCurve(curvePoints) > 0) {
	    curveLayer(curvePoints);
	    app.activeDocument.activeLayer.name = "Print Curve";
	    app.activeDocument.activeLayer.visible = false;
	}
    }
}

function build_chart()
{
    var newDoc = app.documents.add(gWidth,gHeight,gDPI,gChartName,NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
    app.backGroundColor = White;
    app.activeDocument.flatten();
    make101();
    make21();
    var cCtr = gXMarg+gPatch*5.5;
    var cBot = gYMarg+gPatch*11;
    var cJust = Justification.CENTER;
    var L;
    var S = 16*(72/300.0); // points, not pixels
    L = writeText(cCtr,cBot-gDPIScale*75,gTitle+" ©2006 Kevin Bjorke",0,cJust);
    L.textItem.size = S;
    L = writeText(cCtr,cBot-gDPIScale*58,"http://www.photorant.com/",0,cJust);
    L.textItem.size = S;
    L = writeText(cCtr,cBot-gDPIScale*41,"Original Chart Design by Thomas Howard",0,cJust);
    L.textItem.size = S;
    L = writeText(cCtr,cBot-gDPIScale*24,"http://LuminaryArts.com/",0,cJust);
    L.textItem.size = S;
    L = writeText(cCtr,cBot-gDPIScale*3,"THIS IS A POSITIVE IMAGE WITH DARK TEXT ON WHITE",0,cJust);
    L = writeText(cCtr,cBot+gDPIScale*17,"MORE INFO: http://www.botzilla.com/blog/archives/000544.html",0,cJust);
    app.activeDocument.flatten();
    vertical_grad();
    app.activeDocument.flatten();
    draw_bars(gXBar,10);
    outStroke();
    L = writeText(gXMarg+gPatch*5,gYMarg-gDPIScale*20,gLabel,0,cJust);
    L.textItem.size = S*3;
    app.activeDocument.flatten();
}

function main()
{
    if (user_dialog() < 1) return;
    var strtRulerUnits = app.preferences.rulerUnits;
    if (strtRulerUnits != Units.PIXELS) {
	app.preferences.rulerUnits = Units.PIXELS; // selections are always in pixels
    }
    if (gMakeChart) {
	build_chart();
    } else {
	scan_chart();
	scan_results_report();
    }
    if (strtRulerUnits != Units.PIXELS) {
	app.preferences.rulerUnits = strtRulerUnits;
    }
}

main();

// scan_chart();
// build_chart();

// eof
