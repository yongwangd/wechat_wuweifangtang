let SQLAccess = require('../utils/sqlAccess');
let fs = require('fs');
let { promisify } = require('../utils/commonUtils');
let {addSongToDb} = require('../dao/songDao');

let access = new SQLAccess();

let wxDir = '/hdd/shared/Music/wx_music_folder';

const vid = name => name.slice(name.lastIndexOf('.') - 11, name.lastIndexOf('.'));


const syncSongsToDb = () => {

    promisify(fs.readdir, fs)(wxDir).then(items => {
    	items.forEach(it => addSongToDb(it));
    });

}

const syncDbToSongs = () => {
    return access.findAll('wx_songs').then(songs => {
        console.log(songs.length)

        songs.forEach(so => {

            if (!fs.existsSync(wxDir + '/' + so.filename)) {
                console.log('***** delete file ===> ', so.filename, so.ytb_id);
                access.delete('wx_songs', { ytb_id: so.ytb_id })
            }
        });
    });
}

syncSongsToDb();
// syncDbToSongs();
