import Head from 'next/head';
import React, {Component} from 'react';
import ExternalWaveformPlaylist from 'waveform-playlist';

let playlist;

export default class WaveformPlaylist extends Component {

  componentDidMount() {
    // if (process.browser) {
    playlist = ExternalWaveformPlaylist({
      samplesPerPixel: 3000,
      mono: true,
      waveHeight: 70,
      container: document.getElementById('playlist'),
      state: 'cursor',
      colors: {
        waveOutlineColor: '#E0EFF1',
        timeColor: 'grey',
        fadeColor: 'black',
      },
      controls: {
        show: true,
        width: 200,
      },
      zoomLevels: [500, 1000, 3000, 5000],
    });

    playlist.load([
      {
        src: 'media/audio/alone.mp3',
        name: 'loop',
        gain: 1,
      },
    ])
        .then(function() {
          // can do stuff with the playlist.
          // playlist.play();
        });
  }

  play = ()=>{
    playlist.play();
  }

  pause = ()=>{
    playlist.pause();
  }

  render() {
    // }
    return (
        <div className="container">
          <Head>
            <title>Beats 4 life</title>
            <link rel="icon" href="/favicon.ico"/>
          </Head>

          <main>
            <div id="playlist">

            </div>
            <div>
              <button onClick={this.play}>Play</button>
              <button onClick={this.pause}>Pause</button>
            </div>
          </main>


        </div>
    );
  }
}
