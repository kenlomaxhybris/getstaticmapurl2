var http = require('http');
var https = require('https');
var util = require('util')

initjason = (jason) => {
  // when called via "functions call", the jason.daa is found in body..
  if (jason && jason.body)
    jason = jason.body
  // When called via events (see later), jason is in jason.data..
  if (jason && jason.data)
    jason = jason.data;
  return jason
}
  
exports.getstaticmapurl2 = (jason, res) => {
  jason = initjason(jason)
  var END_POINT= "https://cloudlab6.cloudlab6.cluster.extend.cx.cloud.sap/purchasesByNameSpace?nameSpace=mylambda"

  var request = https.get(END_POINT, (res1) => {	
	res1.on('data', (d) => {
		var purchases =	JSON.parse(d)
		var purchasesurl=""
		var center=""
		purchases.forEach( purchase => {
	        const address = purchase["postalCode"]+","+purchase["town"]
	        purchasesurl += purchase["town"]+","+ purchase["postalCode"] +"|"
	        if (center=="")
	        	center = purchase["town"]+","+ purchase["postalCode"]   	
	    });

		purchasesurl =  purchasesurl.slice(0, purchasesurl.length-1);
	    console.log("purchasesurl " + purchasesurl)
	    console.log("center " + center)
	    purchasesurl = encodeURIComponent(purchasesurl)
	    center = encodeURIComponent(center);
	    console.log("purchasesurl" +purchasesurl)
	 	console.log("center" +center)

       res.setHeader('Content-Type', 'application/json');
    	res.set('Access-Control-Allow-Origin', '*')    
	   	.set('Access-Control-Allow-Methods', 'GET, POST')
      
		var staticmapurl = "https://maps.googleapis.com/maps/api/staticmap?center="+center+"&zoom=1&size=400x400&markers=color:blue%7Clabel:S%7C"+purchasesurl+"&markers=size:tiny%7Ccolor:green%7CDelta+Junction,AK&markers=size:mid%7Ccolor:0xFFFF00%7Clabel:C%7CTok,AK&key=YOURKEY"
		console.log("staticmapurl" +staticmapurl)
		if (res){
			res.status(200).send('{"url":"'+staticmapurl +'"}');	
		}	
	})
  })
}
