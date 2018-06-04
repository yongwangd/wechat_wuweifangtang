let express = require('express');
let wechat = require('wechat');
let {
	handleMsg
} = require('./services/messageService');
let url = require('url');


var config = {
	token: 'weixin',
	appid: 'wxcc7e307e8a6570ee',
	encodingAESKey: '7IHBWnUPPWZyci7hgjhkOw6BHW41py5GahCG5rPpZGs'
};
let app = express();

app.use(express.query());

app.get('/*', function (req, res) {
	console.log(req.query)
	let query = url.parse(req.url, true).query;
	res.send(query.echostr)
});

app.post('/*', wechat(config, (req, res, next) => {
	console.log(req.body);
	handleMsg(req.weixin).then(answer => {
		console.log('============================  RESPONSE BODY ==================================');
		console.log(answer)
		res.reply(answer);
	})
}));

// app.post('/*', wechat(config, function (req, res, next) {
//   // 微信输入信息都在req.weixin上
//   var message = req.weixin;
//   if (message.FromUserName === 'diaosi') {
//     // 回复屌丝(普通回复)
//     res.reply('hehe');
//   } else if (message.FromUserName === 'text') {
//     //你也可以这样回复text类型的信息
//     res.reply({
//       content: 'text object',
//       type: 'text'
//     });
//   } else if (message.FromUserName === 'hehe') {
//     // 回复一段音乐
//     res.reply({
//       type: "music",
//       content: {
//         title: "来段音乐吧",
//         description: "一无所有",
//         musicUrl: "http://mp3.com/xx.mp3",
//         hqMusicUrl: "http://mp3.com/xx.mp3",
//         thumbMediaId: "thisThumbMediaId"
//       }
//     });
//   } else {
//     // 回复高富帅(图文回复)
//     res.reply('我们的爱情，好像睡觉？')
//     // res.reply([
//     //   {
//     //     title: '你来我家接我吧,，ßß',
//     //     description: '这是女神与高富帅之间的对话',
//     //     picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
//     //     url: 'http://nodeapi.cloudfoundry.com/'
//     //   }
//     // ]);
//   }
// }));

app.listen(3000, () => console.log('Wechat app running on port', 3000));