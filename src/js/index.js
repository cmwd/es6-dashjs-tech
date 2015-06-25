import window from 'global/window';

let videojs = window.videojs;
let Dash = window.Dash;
let MediaPlayer = window.MediaPlayer;
let Html5 = videojs.getComponent('Html5');
let ErrorDisplay = videojs.getComponent('ErrorDisplay');

console.log(ErrorDisplay);

class Dashjs extends Html5 {

    constructor(options, ready) {
        let source = options.source;
        
        delete options.source;

        super(options, ready);
        this.context = options.context || new Dash.di.DashContext();
        this.mediaPlayer = options.mediaPlayer || new MediaPlayer(this.context);
        this.mediaPlayer.startup();
        this.mediaPlayer.attachView(this.el());

        if (!options.autoplay) {
            this.mediaPlayer.setAutoPlay(false);
        }

        if (source) {
            this.ready(() => {

                this.mediaPlayer.attachSource(source.src);
            });
        }
    }

    duration() {

        if (this.mediaPlayer) {
            
            try {
                return this.mediaPlayer.duration();
            
            } catch (err) {
                // console.log('err', err.stack);
            }
        }
        
        return Html5.prototype.duration.call(this);
    }

    currentTime() {

        if (this.mediaPlayer) {
        
            try {
                return this.mediaPlayer.time();
        
            } catch (err) {
                // console.log('err', err.stack);
            }
        }

        return Html5.prototype.currentTime.call(this);
    }

    setCurrentTime(time) {

        if (this.mediaPlayer) {
            this.mediaPlayer.seek(time);
        
        } else {
            Html5.prototype.setCurrentTime.call(this, time);
        }
    }
}

Dashjs.isSupported = function() {

    return !!window.MediaSource;
};

Dashjs.canPlaySource = function(srcObj) {

    if (srcObj.type === 'application/dash+xml') {
        // TODO: allow codec info and check browser support
        return 'maybe';

    } else {

        return '';
    }
};

videojs.registerComponent('Dashjs', Dashjs);

export default Dashjs;
