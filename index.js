// const { query } = require('./api/youtubeApi');
// const request = require('request');
// let querystring = require('querystring');

// query('Complicated', 2).then(r => {
//   console.log(r);
// });

// let params = {
//   part: 'snippet',
//   key: 'AIzaSyAzn1Cq - NB4KKpktGtPlFRvVt3k8QvOz80',
//   type: 'video',
//   maxResults: 2,
//   q: 'Complicated'
// };

// let url =
//   'https://www.googleapis.com/youtube/v3/search?' +
//   querystring.stringify(params);
// console.log(url);

// request(url, function(res) {
//   console.log(JSON.stringify(res));
// });

let { google } = require('googleapis');

// google.client.setApiKey('AIzaSyAzn1Cq-NB4KKpktGtPlFRvVt3k8QvOz80');

var youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyAzn1Cq-NB4KKpktGtPlFRvVt3k8QvOz80'
});

youtube.search.list(
  {
    part: 'snippet',
    q: 'My Heart will go on'
  },
  function(err, data) {
    console.log(data.data.items[0].snippet, err);
  }
);
