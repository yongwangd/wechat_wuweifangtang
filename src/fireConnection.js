const firebase = require('firebase');
require('firebase/firestore');
import { Subject, ReplaySubject } from 'rxjs';
import 'rxjs/Rx';
import { eventPayloadOfType$, emitEvent } from 'rx-event';
import { MUSIC_COLLECTION } from './constants';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyC6V1mLwi9A_mgWVFDT0-o0szdZkRXYvUQ',
  authDomain: 'wechat-wuweifangtang.firebaseapp.com',
  databaseURL: 'https://wechat-wuweifangtang.firebaseio.com',
  projectId: 'wechat-wuweifangtang',
  storageBucket: 'wechat-wuweifangtang.appspot.com',
  messagingSenderId: '373165681762'
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const createDataAccess = collectionName => {
  const ref = firestore.collection(collectionName);
  const stream = new ReplaySubject(1);

  ref.onSnapshot(snapshot => {
    let result = [];
    snapshot.forEach(s => result.push({ ...s.data(), id: s.id }));
    stream.next(result);
  });

  return {
    ref,
    stream
  };
};

export { createDataAccess };
