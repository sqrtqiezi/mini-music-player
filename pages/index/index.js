//index.js
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
      isPlaying: false,
      isRepeat: true
    }
  },

  onLoad() {
    this.setNavigationBarTitle();
  },

  onReady() {
    this.loadData();
  },

  play() {
    this.setData({ "control.isPlaying": !this.data.control.isPlaying });
  },

  forward() {
    const index = this.data.index + 1;
    if (index < this.data.songs.length) {
      this.setData({ index }, this.setNavigationBarTitle.bind(this));
    } else {
      this.setData({ index: 0 }, this.setNavigationBarTitle.bind(this));
    }
  },

  backward() {
    const index = this.data.index - 1;
    if (index < 0) {
      this.setData(
        { index: this.data.songs.length - 1 },
        this.setNavigationBarTitle.bind(this)
      );
    } else {
      this.setData({ index }, this.setNavigationBarTitle.bind(this));
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
        this.setData({ index: res.tapIndex });
      }
    });
  },

  loadData() {
    wx.showLoading({ title: "加载中..." });

    new app.globalData.AV.Query("Song")
      .limit(6) // 坑爹的小程序 showActionSheet 只支持六个选项
      .find()
      .then(results => {
        if (results.length > 0) {
          const songs = [];
          results.forEach(item => {
            songs.push({
              title: item.attributes.title,
              artist: item.attributes.artist,
              cover: item.attributes.cover.attributes.url,
              music_url: item.attributes.music_data.attributes.url
            });
          });

          this.setData(
            {
              songs,
              index: 0
            },
            () => {
              this.setNavigationBarTitle();
              wx.hideLoading();
            }
          );
        }
      });
  },

  setNavigationBarTitle() {
    const index = this.data.index;
    if (index >= 0) {
      const song = this.data.songs[index];
      const title = `${song.title} - ${song.artist}`;
      wx.setNavigationBarTitle({ title });
    }
  }
});
