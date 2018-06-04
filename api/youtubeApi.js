let fs = require('fs');
let request = require('request');
let querystring = require('querystring');
let urlencode = require('urlencode');
let { promisify, delayResolve } = require('../utils/commonUtils');
let child_process = require('child_process');

const query = (querystr, limit) => {
    let params = {
        part: 'snippet',
        key: 'AIzaSyAzn1Cq - NB4KKpktGtPlFRvVt3k8QvOz80',
        type: 'video',
        maxResults: limit,
        q: querystr
    }

    let url = 'https://www.googleapis.com/youtube/v3/search?' + querystring.stringify(params);
    console.log(url);
    return promisify(request)(url)
        .then(res => JSON.parse(res.body).items)
}

const downloadMp3 = (id) => {
    return promisify(child_process.exec, child_process)(`cd /hdd/wechat_web/Music/youtube_music; youtube-dl --extract-audio --audio-format mp3 --output "%(id)s.%(ext)s" https://www.youtube.com/watch?v=${id}`);
}

const downloadMp4 = (id) => {
    let folder = '/hdd/wechat_web/Videos/youtube_videos/';
    if (fs.existsSync(`${folder}/${id}.mp4`)) {
        console.log('Vide found in folder ', id, 'pass the download');
        return Promise.resolve(id);
    }

    if (fs.existsSync(`${folder}/${id}.mp4.part`)) {
        console.log('Video part found in folder ', id, 'I will continue the process');
        return delayResolve(id, 2000);
    }

    console.log('not find video ', id, 'I will downloading it \n');
    return promisify(child_process.exec, child_process)(`cd /hdd/wechat_web/Videos/youtube_videos; youtube-dl -f mp4/worstvideo --output "%(id)s.%(ext)s" https://www.youtube.com/watch?v=${id}; touch -- "${id}.mp4"`);
}

module.exports = { query, downloadMp3, downloadMp4 };
