import Head from 'next/head';
import React, {Component} from 'react';
import ExternalWaveformPlaylist from 'waveform-playlist';

let playlist;
let userMediaStream;
let constraints = {audio: true};
let ee;

export default class WaveformPlaylist extends Component {
  state = {
    downloadUrl: null,
  };

  async componentDidMount() {
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    function gotStream(stream) {
      userMediaStream = stream;
      playlist.initRecorder(userMediaStream);
    }

    function logError(err) {
      console.error(err);
    }

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(constraints)
          .then(gotStream)
          .catch(logError);
    } else if (navigator.getUserMedia && 'MediaRecorder' in window) {
      navigator.getUserMedia(
          constraints,
          gotStream,
          logError,
      );
    }

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

    await playlist.load([
      {
        src: 'media/audio/alone.mp3',
        name: 'loop',
        gain: 1,
      },
    ]);
    // initialize the WAV exporter.
    playlist.initExporter();
    ee = playlist.getEventEmitter();
    ee.on('audiorenderingfinished', this.onAudioRenderingFinished);
  }

  onAudioRenderingFinished = (type, data) => {
    if (type == 'wav') {
      if (this.state.downloadUrl) {
        window.URL.revokeObjectURL(this.state.downloadUrl);
      }

      let downloadUrl = window.URL.createObjectURL(data);
      console.log(downloadUrl);
      this.setState({downloadUrl});
      //
      // let a = document.createElement('a');
      // a.href = downloadUrl;
      // a.download = 'beats4life.wav';
      // a.click();
    }
  };

  play = () => {
    playlist.play();
  };

  record = () => {
    if (playlist.tracks.length > 1) {
      playlist.tracks.splice(-1, 1);
    }
    playlist.record();
  };

  stop = () => {
    playlist.stop();
  };

  download = () => {
    ee.emit('startaudiorendering', 'wav');
  };

  render() {
    return (
        <div className="container">
          <Head>
            <title>Beats 4 life</title>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
            <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"/>
            <link rel="stylesheet" href="/css/styles.css"/>
          </Head>

          <main>
            <div id="playlist">

            </div>
            <div>
              <button onClick={this.play}>Play</button>
              <button onClick={this.record}>Record</button>
              <button onClick={this.stop}>Stop</button>
              <button onClick={this.download}>Download</button>
              {this.state.downloadUrl && (
                  <p style={{marginTop: 20}}>
                    <a href={this.state.downloadUrl} download="beats4life.wav">Klik hier om het bestand te downloaden</a>
                  </p>
              )}
            </div>
          </main>
        </div>
    );
  }
}
