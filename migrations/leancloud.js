const AV = require('leanengine');
const config = require('../src/config');
const fs = require('fs');

AV.init({
  appId: config.APP_ID,
  appKey: config.APP_KEY
});

const songs = JSON.parse(fs.readFileSync('migrations/data/songs.json', 'utf8'));

const uploaders = []
songs.map(function(item) {
  const cover = fs.readFileSync(item.cover);
  uploaders.push(function(then) {
    const fileName = item.title + '.jpg';
    console.log('上传文件:', fileName);

    new AV.File(fileName, { base64: cover.toString('base64')})
      .save().then(function(cover) {
        item.cover = cover;
        then();
      });
  })

  const music_data = fs.readFileSync(item.music_data);
  uploaders.push(function(then) {
    const fileName = item.title + '.mp3';
    console.log('上传文件:', fileName);

    new AV.File(fileName, { base64: music_data.toString('base64')})
      .save().then(function(music_data) {
        item.music_data = music_data;
        then();
      });
  })
});

console.info('开始文件上传')
function doUpload() {
  let uploader = uploaders.pop();
  if (uploader) {
    uploader(doUpload)
  } else {
    console.info('文件全部成功上传');
    saveSongs();
  }
}
doUpload();


function saveSongs() {
  console.info('开始保存对象')
  const Song = AV.Object.extend('Song');
  const savePromises = [];
  songs.map(item => {
    const song = new Song();
    song.set('title', item.title);
    song.set('artist', item.artist);
    song.set('lyric', item.lyric);
    song.set('cover', item.cover);
    song.set('music_data', item.music_data);
    savePromises.push(song.save());
  })
  
  Promise.all(savePromises).then(() => {
    console.log('对象全部成功保存');
  }, (error) => {
    console.error('发生异常', error);
  });
}
