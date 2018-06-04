let { addVideoToDb } = require('../dao/videoDao');
let glob = require('glob');
let { promisify } = require('../utils/commonUtils');

let ffmpeg = require('fluent-ffmpeg');
let uuid = require('uuid');

const getUUID = () => uuid.v4();

let videoDir = '/hdd/shared/Videos';


process.chdir(videoDir);

promisify(glob)('./**/*.mp4').then(videos => videos.forEach(v => {
    path = v.slice(2);
    try {

        addVideoToDb(path);
    } catch (e) {
        console.log(e)
    }
}));
