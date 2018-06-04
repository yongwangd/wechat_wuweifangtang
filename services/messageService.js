let request = require('request');
let cheerio = require('cheerio');
let querystring = require('querystring');
let {
	promisify
} = require('../utils/commonUtils');
let child_process = require('child_process');
let SQLAccess = require('../utils/sqlAccess');
let fs = require('fs');
var urlencode = require('urlencode');
let {
	addSongToDb,
	getSongById,
	getMusicUrl,
	getRandomSong
} = require('../dao/songDao');
let {
	getYoutubeMusic
} = require('./youtubeMusicService');
let {
	getVideos
} = require('./videoService');

let {
	turnon,
	turnoff
} = require('./lightService');

let access = new SQLAccess();


const handleMsg = xml => {
	console.log('The message i GOt ');
	console.log(xml)
	let type = xml.MsgType;
	console.log('Message type is ===> ' + type);

	if (type == 'text') return handleTextMsg(xml, xml.Content);
	if (type == 'voice') return handleTextMsg(xml, xml.recognition);
	if (type == 'video') return handleVideoMsg(xml);
	if (type == 'image') return handleImageMsg(xml);

	return Promise.resolve('欢迎订阅~ \n用法：\n1. 发送“音乐”或者“music”返回随机下载的视频\n2. 发送“音乐”或者“music”加上歌曲名会返回相应的歌曲，可能会卡！\n3. 发送“视频”或者“video”返回从instagram随机搜取得恶趣味小视频\n4. 发送“video”或者“视频”加视频名返回Youtube解码的视频，可能比较慢，需要下载和解码，如果不成功就在发送一次\n5. 发送“电影”或者“movie”加电影名返回豆瓣电影影评\n6. 发送“quote”或者“短句”返回一条短句或者心灵鸡汤');
}


const getQuote = () => {
	return access.query('select * from quotes ORDER BY RAND() LIMIT 0,1')
		.then(qs => qs.map(q => `${q.quote} \n\n-- ${q.author}`).join('. '))
}


const handleImageMsg = xml => Promise.resolve({
	type: "image",
	content: {
		mediaId: xml.MediaId
	}
});

const handleVideoMsg = xml => {
	console.log('mediaid is ', xml.MediaId)
	return Promise.resolve({
		type: "video",
		content: {
			title: 'How is that',
			description: 'Just say it',
			mediaId: xml.MediaId
		}
	});
}


const getLocalMovie = () => {
	let random = len => Math.floor(Math.random() * len);
	return access.findAll('douban_movies').then(movies => {
		let mov = movies[random(movies.length)];
		return `${mov.title}, ${mov.score}, ${mov.bio}`;
	})

};

const getDoubanMovie = movieName => {
	if (movieName == '') {
		return Promise.resolve('No movie name specified')
	}
	let url = `https://api.douban.com/v2/movie/search?` + querystring.stringify({
		count: 4,
		q: movieName.trim()
	})
	console.log(url, '----url')
	return promisify(request)({
		url,
		forever: true
	}).then(info => {
		console.log(info.body)
		let moviesJson = JSON.parse(info.body)
		return moviesJson.subjects.map(mv => ({

			title: mv.title,
			description: `${mv.year}, ${mv.original_title}`,
			picurl: mv.images.large,
			url: mv.alt
		}));
	});
}


const getRandomJoke = () => {
	return promisify(request)('http://www.rd.com/jokes/')
		.then(res => {
			console.log(res.body)
			return cheerio.load(res.body)
		})
		.then($ => {
			console.log($('.jokes-river--content p').find('span').length)
			return $('#post-220955').text().trim();
			return 'hahaha一点都不好玩'

		})
		.catch(console.log);

}

const getFunnyVideo = videoName => {

	console.log('the video name is ', videoName, ' =---jajaja')
	return getVideos(videoName).then(videos => {
		console.log('\n\n----', videos, '----')
		return Promise.resolve(videos.map(vd => {
			let title = vd.title.trim();
			return {
				// title: vd.path.slice(vd.path.lastIndexOf('/') + 1, vd.path.lastIndexOf('.')),
				title: title || vd.id,
				picurl: vd.thumbnailUrl || 'http://flamingwhite.com:7000/Videos/video_thumbnails/' + vd.screenshot,
				// url: 'http://flamingwhite.com:7000/Videos/insta' + vd.id +'.mp4'
				url: `http://flamingwhite.com:7000/Videos/${vd.relativePath}`
			}
		}))
	}).catch(console.log)

};


const textMsgConfig = [{
	key: '短句',
	fn: getQuote
}, {
	key: 'quote',
	fn: getQuote
}, {
	key: '段子',
	fn: getRandomJoke
}, {
	key: 'joke',
	fn: getRandomJoke
}, {
	key: '电影',
	fn: getDoubanMovie
}, {
	key: 'movie',
	fn: getDoubanMovie
}, {
	key: '音乐',
	fn: getYoutubeMusic
}, {
	key: 'video',
	fn: getFunnyVideo
}, {
	key: '视频',
	fn: getFunnyVideo

}, {
	key: 'music',
	fn: getYoutubeMusic
}, {
	key: 'on',
	fn: turnon
}, {
	key: 'off',
	fn: turnoff
}];

const handleTextMsg = (xml, content) => {
	content = (content || '').trim();
	for (let config of textMsgConfig) {
		let key = content.slice(0, config.key.length) || '';
		if (key.toLowerCase() == config.key.toLowerCase()) {
			let txt = content.slice(config.key.length).trim();
			console.log(txt)
			return config.fn(txt);
		}
	}

	return Promise.resolve('用法：\n1. 发送“音乐”或者“music”返回随机下载的视频\n2. 发送“音乐”或者“music”加上歌曲名会返回相应的歌曲，可能会卡！\n3. 发送“视频”或者“video”返回从instagram随机搜取得恶趣味小视频\n4. 发送“video”或者“视频”加视频名返回Youtube解码的视频，可能比较慢，需要下载和解码，如果不成功就在发送一次\n5. 发送“电影”或者“movie”加电影名返回豆瓣电影影评\n6. 发送“quote”或者“短句”返回一条短句或者心灵鸡汤');
}

module.exports.handleMsg = handleMsg;