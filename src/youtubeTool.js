import { google } from 'googleapis';
import { musicAccess } from './fireRepo';
import urlencode from 'urlencode';
import child_process from 'child_process';
import { Observable } from 'rxjs';

let MUSIC_DIR = process.env.WX_MUSIC_DIR;
let MUSIC_BASE_URL = process.env.HTTP_WX_MUSIC_URL;

const getMusicUrl = id => MUSIC_BASE_URL + urlencode(id + '.mp3');

var youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyAzn1Cq-NB4KKpktGtPlFRvVt3k8QvOz80'
});

const stripIllegalChars = str => str.replace(/[\|&;\$%@"<>\(\)\+,]/g, '');

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
          const youtubeId = item.id.videoId;
          resolve({
            ...item.snippet,
            title: stripIllegalChars(item.snippet.title),
            youtubeId
          });
        }
      }
    );
  });

query('My heart will go on').then(a => console.log(a));



const downloadMusic = musicQueryStr => {
  if (musicQueryStr == '') {
    return musicAccess
      .randomItem()
      .take(1)
      .map(item => ({
        ...item,
        musicUrl: MUSIC_BASE_URL + urlencode(item.id + '.mp3')
      }));
  }

  //   return musicAccess.checkExist(musicQueryStr)

  return new Promise((resolve, reject) => {
    // const [exist$, notExist$] = musicAccess
    //   .checkExist(musicQueryStr)
    //   .partition(exist => exist);

    const [exist$, notExist$] = Observable.of(musicQueryStr)
      .flatMap(str => query(str))
      .partition(config => musicAccess.findById(config.youtubeId));

    exist$.subscribe(a => console.log('existsssss', a));

    notExist$
      .map(config => {
        const {
          youtubeId,
          title,
          publishedAt,
          channelTitle,
          description
        } = config;
        const id = title + '-' + youtubeId;
        child_process.exec(
          `cd /hdd/wechat_web/Music/youtube_music; youtube-dl --extract-audio --audio-format mp3 --output "${id}.%(ext)s" ${youtubeId}`,
          (err, res) => {
            console.log('downloaded -', res);
            musicAccess.newItem(id, {
              youtubeId,
              publishedAt: new Date(Date.parse(publishedAt)),
              channelTitle,
              title,
              description
            });
          }
        );

        return {
          ...config,
          musicUrl: getMusicUrl(id),
          id
        };
      })
      .delay(1500)
      .subscribe(r => console.log('there you go', r));
  });
};

downloadMusic('where is the love');

export { query };
