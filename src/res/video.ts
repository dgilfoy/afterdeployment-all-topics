import * as videos from './videos';

export default class VideoData{
  private videos;
  constructor(vgroup){
    this.videos = this.process(videos[vgroup + 'Vids']);
  }
  process(videosRaw){
    let videosRaw2 = videosRaw.map(item => { //run images through webpack
      item.img = require('../images/videos/' + item.img);
      return item;
    });
    return videosRaw2
  }
  get(){
    return this.videos;
  }
}
