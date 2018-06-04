let SQLAccess = require('../utils/sqlAccess');

let access = new SQLAccess();

let tablename = 'insta_videos';

let VIDEO_BASE_URL = process.env.HTTP_WX_VIDEO_URL;

const isVideoExist = path => access.findOne(tablename, {path});

const getRandomVideos = (limit = 1) => access.query(`select * from ${tablename} ORDER BY RAND() LIMIT 0,${limit}`);

const addVideoToDb = (path, thumbnail) => {
	return isVideoExist(path).then(exist => {
		if(exist) console.log(path + ' exists, ======> pass ');
		else {
			console.log(`INSERTING ${path} ====== `);
			return access.insert(tablename, {path, thumbnail});
		}
	});
};

module.exports = {
	isVideoExist,
	addVideoToDb,
	getRandomVideos
};
