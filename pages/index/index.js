//index.js

const util = require("../../utils/util");

//获取应用实例
const app = getApp();

Page({
  data: {
    index: -1,
    songs: [],
    icons: {
      play: "../../assets/images/music_play_button.png",
      pause: "../../assets/images/music_pause_button.png",
      playlist: "../../assets/images/music_playlist.png",
      forward: "../../assets/images/music_fastforward_button.png",
      backward: "../../assets/images/music_rewind_button.png",
      repeat: "../../assets/images/music_repeat_button.png",
      shuffle: "../../assets/images/music_shuffle_button.png"
    },
    control: {
      isPlaying: true,
      isRepeat: true,
      progress: 0,
      currentTime: "00:00",
      duration: "00:00",
      handlerTouchMove: null
    },
    system: {
      pixelRatio: 0
    }
  },

  onLoad() {
    const { pixelRatio } = wx.getSystemInfoSync();
    this.setData({ "system.pixelRatio": pixelRatio });
  },

  onReady() {
    this.loadData();
  },

  play() {
    const isPlaying = !this.data.control.isPlaying;
    this.setData({ "control.isPlaying": isPlaying });
    if (isPlaying) {
      app.globalData.audioManager.play();
    } else {
      app.globalData.audioManager.pause();
    }
  },

  forward() {
    const index = this.data.index + 1;
    if (index < this.data.songs.length) {
      this.setData({ index }, this.refresh.bind(this));
    } else {
      this.setData({ index: 0 }, this.refresh.bind(this));
    }
  },

  backward() {
    const index = this.data.index - 1;
    if (index < 0) {
      this.setData(
        { index: this.data.songs.length - 1 },
        this.refresh.bind(this)
      );
    } else {
      this.setData({ index }, this.refresh.bind(this));
    }
  },

  moveVernier(e) {
    const touch = e.touches[0];
    const offsetX = touch.pageX * this.data.system.pixelRatio;
    if (offsetX < 115 || offsetX > 650) {
      return;
    }
    const progress = (offsetX - 115) / 520 * 100;
    this.setProgress(progress);
  },

  setProgress(progress) {
    this.setData({ "control.progress": progress });

    if (!this.data.control.handlerTouchMove) {

      // 播放进度设置节流
      const hanlder = setTimeout(() => {
        const { duration } = app.globalData.audioManager;
        app.globalData.audioManager.seek(progress / 100 * duration);
        clearTimeout(hanlder);
        this.setData({ "control.hanlderTouchMove": null });
      }, 200);

      this.setData({ "control.hanlderTouchMove": hanlder });
    }
  },

  changeMode() {
    this.setData({ "control.isRepeat": !this.data.control.isRepeat });
  },

  showPlaylist() {
    const songs = this.data.songs.map(item => {
      return item.title + " - " + item.artist;
    });

    wx.showActionSheet({
      itemList: songs,
      success: res => {
        this.setData({ index: res.tapIndex }, this.refresh.bind(this));
      }
    });
  },

  loadData() {
    wx.showLoading({ title: "加载中..." });

    new app.globalData.AV.Query("Song")
      .limit(6) // 坑爹的小程序 showActionSheet 只支持六个选项
      .descending('createdAt')
      .find()
      .then(results => {
        if (results.length > 0) {
          const songs = [];
          results.forEach(item => {
            songs.push({
              title: item.attributes.title,
              artist: item.attributes.artist,
              cover: item.attributes.cover.attributes.url,
              music_url: item.attributes.music_data.attributes.url,
              lyric: item.attributes.lyric
            });
          });

          this.setData(
            {
              songs,
              index: 0
            },
            () => {
              this.refresh();
              wx.hideLoading();
            }
          );
        }
      });
  },

  refresh() {
    const index = this.data.index;
    if (index >= 0) {
      const song = this.data.songs[index];
      const title = `${song.title} - ${song.artist}`;
      wx.setNavigationBarTitle({ title });

      const audioManager = app.globalData.audioManager;
      audioManager.title = song.title;
      audioManager.epname = song.title;
      audioManager.singer = song.artist;
      audioManager.coverImgUrl = song.cover;
      audioManager.src = song.music_url;

      console.log(song.lyric);

      audioManager.onTimeUpdate(() => {
        const { duration, currentTime } = audioManager;
        this.setData({
          "control.duration": util.formatTime(duration),
          "control.currentTime": util.formatTime(currentTime)
        });

        if (!this.data.control.handlerTouchMove) {
          this.setData({ "control.progress": currentTime / duration * 100 });
        }
      });

      audioManager.onEnded(() => {
        if(this.data.control.isRepeat) {
          this.forward();
        } else {
          this.setData({ index: Math.floor(Math.random() * 6) }, this.refresh.bind(this)); 
        }
      });
    }
  }
});
