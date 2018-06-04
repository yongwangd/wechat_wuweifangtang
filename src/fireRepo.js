import { createDataAccess } from './fireConnection';

const randomArrayItem = array =>
  array[Math.floor(Math.random() * array.length)];

const enhanceDataAccess = collectionName => {
  const access = createDataAccess(collectionName);

  const checkExist = id =>
    access.stream.map(items => items.find(it => it.id === id) != null);

  const newItem = (id, item) => access.ref.doc(id).set(item);

  const randomItem = () => access.stream.map(randomArrayItem);

  return {
    ...access,
    checkExist,
    newItem,
    randomItem
  };
};

const musicAccess = enhanceDataAccess('music');
const videoAccess = enhanceDataAccess('video');

musicAccess.checkExist('complicated').subscribe(a => console.log('exist', a));
musicAccess.stream.subscribe(a => console.log('list', a));

musicAccess.randomItem().subscribe(item => console.log('random', item));

// musicAccess.newItem('firestoreid', { id: 'whereisit', name: 'its mystore' });

export { musicAccess, videoAccess };
