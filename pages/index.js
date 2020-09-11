import Head from 'next/head';
import React, {Component} from 'react';
import ExternalWaveformPlaylist from 'waveform-playlist';
import {Container, Icon, Button} from 'semantic-ui-react';

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
            <link
                async
                rel="stylesheet"
                href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
            />
            <script
                async
                src="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.js"
            ></script>
          </Head>


          <Container style={{marginTop: 20}} fluid textAlign="center">
            <div style={{display: 'none'}} id="playlist">
            </div>
            <Button onClick={this.record} circular color="white" size="massive" style={{height: 250, width: 250, marginBottom: 50, marginTop: 50}}>
              <Icon name="microphone" color="red" size="massive" style={{align: 'center', margin: -20}}/>
            </Button>
            <br/>

            <Button onClick={this.play} icon="play">
            </Button>
            <Button onClick={this.stop} icon="stop">
            </Button>
            <Button onClick={this.download} icon="save">
            </Button>
            <br/>
            {this.state.downloadUrl && (
                <p style={{marginTop: 50}}>
                  <a href={this.state.downloadUrl} download="beats4life.wav"><Button size="big"><Icon name="download"/>Download</Button></a>
                </p>
            )}
          </Container>
        </div>
    );
  }
}
