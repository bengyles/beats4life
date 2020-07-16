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
    ]).then(function() {
      // can do stuff with the playlist.
    });
  }

  play = () => {
    playlist.play();
  };

  pause = () => {
    playlist.pause();
  };

  render() {
    // }
    return (
        <div className="container">
          <Head>
            <title>Beats 4 life</title>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous"/>
            <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"/>
            <link rel="stylesheet" href="/css/styles.css"/>
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
