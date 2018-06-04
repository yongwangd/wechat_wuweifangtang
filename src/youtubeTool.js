import { google } from 'googleapis';

var youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyAzn1Cq-NB4KKpktGtPlFRvVt3k8QvOz80'
});

const query = querystr =>
  new Promise((resolve, rejest) => {
    youtube.search.list(
      {
        part: 'snippet',
        type: 'video',
        q: querystr
      },
      (err, response) => {
        if (err) reject(err);
        else {
          const item = response.data.items[0];
          const id = item.id.videoId;
          resolve({
            ...item.snippet,
            id
          });
        }
      }
    );
  });

query('My heart will go on').then(a => console.log(a));

export { query };
