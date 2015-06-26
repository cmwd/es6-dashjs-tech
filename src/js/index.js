import { videojs, Dash, MediaPlayer } from 'global/window';

let Html5 = videojs.getComponent('Html5');

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
                this.setSource(source);
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
        
        return super.duration();
    }

    currentTime() {

        if (this.mediaPlayer) {
        
            try {
                return this.mediaPlayer.time();
        
            } catch (err) {
                // console.log('err', err.stack);
            }
        }

        return super.currentTime();
    }

    setCurrentTime(time) {

        if (this.mediaPlayer) {
            this.mediaPlayer.seek(time);
        
        } else {
            super.setCurrentTime(time);
        }
    }

    setSource(source) {

        this.mediaPlayer.attachSource(source.src, null, null);
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
