//
//
#target photoshop


var GA_Emitter = function () {
	this.TID = "UA-4450500-1";		// site-specific constant
	this.userAgent = "Photoshop/"+app.systemInformation.match(/Photo.hop Version:\s*(\S*)/)[1];
	var sn = app.systemInformation.match(/Serial number:\s*(\d*)/)[1];
	this.cid = sn.slice(0,8)+"-"+sn.slice(8,12)+"-"+sn.slice(12,16)+"-"+sn.slice(16,20)+"-"+sn.slice(0,12);
	this.url = "http://www.google-analytics.com";
	this.domain = "www.google-analytics.com:80";
	this.required = "v=1&tid="+this.TID+"&cid="+this.cid+"&";
	//this.call = "POST /collect HTTP/1.1\r\nHost: www.google-analytics.com\r\nUser-Agent: "+this.userAgent+"\r\nContent-Length: "+this.payload.length+"\r\n\r\n" +this.payload+"\r\nConnection: close\r\n\r\n";
	this.reply = new String();
	this.conn = new Socket();
	this.conn.encoding = "binary";

	GA_Emitter.prototype.send_payload = function(payload) {
		this.payload = this.required + payload;
		this.call = "POST /collect HTTP/1.1\r\nHost: www.google-analytics.com\r\nUser-Agent: "+this.userAgent+"\r\nContent-Length: "+this.payload.length+"\r\n\r\n" +this.payload+"\r\nConnection: close\r\n\r\n";
		//alert(this.payload);
		if (this.conn.open(this.domain,"binary")) {
			this.conn.write(this.call);
			this.reply = this.conn.read(9999999999);
			this.conn.close();
		} else {
			this.reply = "";
		}
		return this.reply.substr(this.reply.indexOf("\r\n\r\n")+4);;
	};
}


//var sa = app.systemInformation.match(/Photo.hop Version:\s*(\S*)/);
//alert(uu+"\r\n"+userAgent);
/*alert(app.systemInformation.length);
var i;
for (i=0; i<app.systemInformation.length; i += 1300) {
	alert(app.systemInformation.slice(i,i+1300));
}*/


var hyle = new GA_Emitter();
hyle.send_payload("t=pageview&dp=%2Fchartthrob&dt=ChartThrob");
//alert(hyle.getFile());
