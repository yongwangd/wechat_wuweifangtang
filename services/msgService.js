let request = require('request');
let cheerio = require('cheerio');
let {genTextMessage} = require('../utils/xmlMessageUtils');
let SQLAccess = require('../utils/sqlAccess');
let {promisify} = require('../utils/commonUtils');
let child_process = require('child_process');
let access = new SQLAccess();

const cleanMsg = msg => {
	

}

const handleMsg = xml => {

	let {msgtype, content} = xml;

	let q = access.find('quotes', {id: 511})
	console.log(q); 
	q.then(res=> console.log(res));

	if(msgtype == 'text') return handleTextMsg(xml, xml.content);
	if(msgtype == 'voice') return handleTextMsg(xml, xml.recognition);


}


const handleTextMsg = (xml, content) => {

	if(content.slice(0,2) == '段子') {
		return getRandomJoke().then(joke => genTextMessage(xml, joke));
	} else if(content.slice(0,2) == '天气') {

		return Promise.resolve(genTextMessage(xml, getWeather('123')));
	} else if (content.slice(0,2) == '电影') {

		return Promise.resolve(genTextMessage(xml, 'http://baidu.com'));
	} else if(content.slice(0,2) == '温度'){

		return promisify(child_process.exec, child_process)('sensors')
			.then(out => genTextMessage(xml, out));

	} else {
		return Promise.resolve(genTextMessage(xml, content + '==> 我也不知道怎么回答你~'));
	} 

}

const getWeather = url => {
	return 'today is sunny';
}

const getRandomJoke = () => {
	return promisify(request)('http://www.budejie.com/text/')
		.then(res => {
			console.log(res.body)
			return cheerio.load(res.body)})
		.then($ => {
			console.log($('.jokes-river--content p').slice(1).text())
			return $('.jokes-river--content p').slice(1).text();
			return $('#post-220955').text().trim();
			return 'hahaha一点都不好玩'

		})

}

module.exports.handleMsg = handleMsg;
