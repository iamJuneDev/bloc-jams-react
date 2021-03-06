import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';


class Album extends Component {
  constructor(props) {
    super(props);
     
    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration, 
      currentVolume: 0.3,
      isPlaying: false,
      currentlyHovered: false
    };
     
    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = this.state.currentVolume;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }

  componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }
  
  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { 
        this.setSong(song); 
      }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    if (!this.state.isPlaying) {
      return null;
    }
    if (!currentIndex) {
      return null;
  }
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const nextIndex = Math.min(this.state.album.songs.length, currentIndex + 1);
    const newSong = this.state.album.songs[nextIndex];
    if (!this.state.isPlaying) {
      return null;
  }
    if (!newSong) {
      return null;
  }
    this.setSong(newSong);
    this.play();

  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  formatTime(sec) {
    if (!sec) { return "-:--"; }
    const totalSec = Math.ceil(sec);
    const min = Math.floor(totalSec / 60);
    const secRemainder = (totalSec % 60);
    let convertedTime = min + ':';
    if (secRemainder < 10) {
      convertedTime += '0';
    }
    convertedTime += secRemainder;
    return convertedTime;
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ currentVolume: newVolume });
  }

  hoverOn(index) {
    console.log("hovering button")

    this.setState({ hover: index })
  }

  hoverOff() {
    this.setState({ hover: false })
  }

  onMouseEnter(song) {
    this.setState({ hoveredSong: song });
  }

  onMouseLeave(song) {
    this.setState({ hoveredSong: null });
  }

  showIcon(song, index) {
    if(this.state.currentSong === song && this.state.isPlaying === true) {
      return <span className="icon ion-md-pause"></span>
    } else if (this.state.hoveredSong === song){
        return <span className="icon ion-md-play"></span>
    }
      else {
        return <span>{index + 1}</span>
      }
  };


  render() {
    return (
      <section className="album">
         <section id="album-info">
         <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
           <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
         </section>
         <table id="song-list">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>
            <tbody>
              {this.state.album.songs.map( (song, index) =>
                 <tr className="song" key={index} onClick={ () => this.handleSongClick(song) }
                    onMouseEnter={ () => this.onMouseEnter(song) } onMouseLeave={ () => this.onMouseLeave(null) } >
                    { this.showIcon(song, index) }
                    <td><ion-icon name="ios-radio"></ion-icon></td>
                    <td className="song-title-row">{song.title}</td>
                    <td className="song-duration-row">{this.formatTime(song.duration)}</td>
                  </tr>
                )
              } 
            </tbody>  
          </table>
          <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           currentVolume={this.state.currentVolume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           formatTime={(e) => this.formatTime(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
         />
      </section>
    );
  }
}

export default Album;