let ffmpeg = require('fluent-ffmpeg');
let uuid = require('uuid');
let {
	getRandomVideos
} = require('../dao/videoDao');
let fs = require('fs');
let {
	query,
	downloadMp4
} = require('../api/youtubeApi');
let {
	promisify,
	delayResolve
} = require('../utils/commonUtils');

// const getUUID = () => uuid.v4();

let INS_VIDEO_DIR = '/hdd/wechat_web/Videos/insta_videos/';
let YTB_VIDEO_DIR = '/hdd/wechat_web/Videos/youtube_videos/';
let SCREENSHOT_DIR = '/hdd/wechat_web/Videos/video_thumbnails/';
let SCREEN_BASE_URL = 'http://flamingwhite.com:7000/Videos/video_thumbnails/'

const getVideos = querystr => {
	querystr = querystr.trim();
	console.log('\nquery str is ', querystr)
	if (!querystr) {
		return getInsVideos();
	}
	return getYoutubeVideos(querystr);
}

const getYoutubeVideos = querystr => {
	return query(querystr, 2)
		.then(items => items.map(it => ({
			id: it.id.videoId,
			title: it.snippet.title,
			// description: it.snippet.description,
			relativePath: `youtube_videos/${it.id.videoId}.mp4`,
			thumbnailUrl: it.snippet.thumbnails.medium.url
		})))
		.then(items => {
			console.log(items);
			let pro = null;
			items.forEach(vd => {
				let r = downloadMp4(vd.id);
				if (!pro) pro = r;
			});
			return pro.then(res => items);
		});

}


const createScreenShot = (videoPath, filename) => {
	// let filePath = SCREEN_BASE_URL + id + '.jpg'
	let thing = new ffmpeg(videoPath);
	promisify(thing.takeScreenshots, thing)({
		count: 1,
		filename: filename,
		timemarks: ['3'],
		size: '640x480'
	}, SCREENSHOT_DIR);
	return filename;

};

const getInsVideos = () => {

	return getRandomVideos(3).then(videos => videos.map(vd => {
		let test = fs.exists(`${SCREENSHOT_DIR}${vd.id}.png`, exists => {
			if (!exists) {
				console.log('screenshot not exists, creating', vd.id)
				createScreenShot(`${INS_VIDEO_DIR}${vd.username}/${vd.id}.mp4`, vd.id)
			}
		});

		return {
			id: vd.id,
			title: vd.title,
			relativePath: `insta_videos/${vd.username}/${vd.id}.mp4`,
			screenshot: vd.id + '.png'
		}

	}));

	// return getRandomVideos(3).then(videos => Promise.all(videos.map(vd => {
	//     let name = createScreenShot(INS_VIDEO_DIR + vd.path)
	//         // .then(screenshot => ({
	//         //     path: vd.path,
	//         //     screenshot
	//         // }));
	//     return {
	//     	path: vd.path,
	//     	screenshot: name+'.png'
	//     }
	// })))

	// return Promise.all(all).catch(console.log)
}

module.exports = {
	createScreenShot,
	getVideos
};