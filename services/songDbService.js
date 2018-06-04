let SQLAccess = require('../utils/sqlAccess');
let fs = require('fs');
let { promisify } = require('../utils/commonUtils');
var urlencode = require('urlencode');
let access = new SQLAccess();

// const vid = name => name.slice(name.lastIndexOf('.') - 11, name.lastIndexOf('.'));

let tablename = 'youtube_music';
let MUSIC_BASE_URL = process.env.HTTP_WX_MUSIC_URL;

const isSongExist = id => {
    return access.findOne(tablename, { id })
}

const getSongById = isSongExist;


const getRandomSong = () => access.query(`select * from ${tablename} ORDER BY RAND() LIMIT 0,1`).then(songs => songs[0]);

const addSongToDb = (song) => {
    let id = song.id;
    if(!id) {
        console.log('Fail! try to insert empty song to DB');
        return;
    }

    return isSongExist(id)
        .then(exist => {
            if(exist) {
                console.log(`\n ********* ${song.title} already in DB pass ****\n`);
                return true;
            }else {
                console.log('\n***** INSERTING ${song.title} to DB *****');
                return access.insert(tablename, song)
            }
        })
}

// const addSongToDb = (filename, description) => {
//     if (!filename) {
//         console.log('Fail! try to insert empty song to DB');
//         return;
//     }
//     let ytb_id = vid(filename);

//     return isSongExist(ytb_id)
//         .then(exist => {
//             if (exist) {
//                 console.log('********** ${filename} found in DB, pass ******');
//                 return Promise.resolve(true);
//             } else {
//                 console.log(`INSERTING ${filename} == ${ytb_id} to DB \n`);
//                 return access.insert(tablename, { ytb_id, filename, description })
//             }
//         })
// }

module.exports = {
    addSongToDb,
    isSongExist,
    getSongById,
    getRandomSong
};
