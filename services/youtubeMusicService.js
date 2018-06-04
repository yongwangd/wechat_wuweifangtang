let request = require('request');
let querystring = require('querystring');
let child_process = require('child_process');
let urlencode = require('urlencode');
let SQLAccess = require('../utils/sqlAccess');
let { promisify, delayResolve } = require('../utils/commonUtils');
let { getRandomSong, addSongToDb, getSongById } = require('./songDbService');
let youtubeApi = require('../api/youtubeApi');

let MUSIC_DIR = process.env.WX_MUSIC_DIR;
let MUSIC_BASE_URL = process.env.HTTP_WX_MUSIC_URL;
console.log('music dir is ', MUSIC_DIR)

const getMusicUrl = id => MUSIC_BASE_URL + urlencode(id + '.mp3');

const getYoutubeMusic = song => {
    if (song == '') {
        console.log('Getting a random song from local')
        return getRandomSong().then(song => ({
            title: song.title,
            description: song.description,
            musicUrl: MUSIC_BASE_URL + urlencode(song.id + '.mp3')
        }));
    }

    let vd, id;

    return youtubeApi.query(song, 1)
        .then(items => items[0])
        .then(item => {
            console.log(item);
            vd = item.snippet;
            id = item.id.videoId;
            return getSongById(id)
        })
        .then(exist => {
            let result = {
                title: vd.title,
                description: vd.description,
                musicUrl: getMusicUrl(id)
            };
            if (!exist) {
                console.log(vd.title, 'not found, I will be downloading it ***********');
                promisify(child_process.exec, child_process)('cd /hdd/wechat_web/Music/youtube_music; youtube-dl --extract-audio --audio-format mp3 --output "%(id)s.%(ext)s" ' + id)
                    .then(res => addSongToDb({
                        id,
                        channel: vd.channelTitle,
                        title: vd.title,
                        description: vd.description,
                        publish_time: new Date(Date.parse(vd.publishedAt))
                    }))
                    .then(res => console.log(`\n============\n Finished downloading ${vd.title} \n===============\n`))
                    .catch(console.log);
                //DELAY the response for 1.5s for downloading
                return delayResolve(result, 1500)
            } else {
                console.log('find the song ', exist);
                return result;
            };

        })
}

module.exports.getYoutubeMusic = getYoutubeMusic;
