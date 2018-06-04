let jsxml = require('js2xmlparser');
let xmlescape = require('xml-escape');
var encode = require('urlencode');

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '，': return ',';
            case '？': return '?';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function htmlSpecialChars(unsafe) {
    return unsafe
    .replace(/，/g, ",")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

var data = {
    "notes": "John's profile is not complete..ßßiihello我们的?..."
};

    // "notes": "女友下班回家来，不停的清着嗓子。我说：怎么了？她：嗓子痒痒的，给我看看是不是嗓子发炎了。我叫她张开了嘴，用筷子从嗓子口夹出了一根黑黑的卷毛………"

var options = {
    useCDATA: true
};

console.log(jsxml.parse("person", data, options));

const genTextMessage = (xml, content) => {
	console.log(content)
	console.log(String(content))
	console.log(content.indexOf('，'))
	let body = {
		ToUserName: xml.fromusername,
		FromUserName: xml.tousername,
		Content: content, 
		MsgType: 'text',
		CreateTime: new Date().getTime()
	}

	let ast = `<?xml version='1.0'? encoding="UTF-8"><xml>
		<ToUserName>${xml.fromusername}</ToUserName>
		<FromUserName>${xml.tousername}</FromUserName>
		<Content>${content}</Content>
		<MsgType>text</MsgType>
		<CreateTime>${new Date().getTime()}</CreateTime>
	<xml>`	

	let msg = jsxml.parse('xml', body, options);
	console.log(msg);
	return msg;

}

module.exports.genTextMessage = genTextMessage;