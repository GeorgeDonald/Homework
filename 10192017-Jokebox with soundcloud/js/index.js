var JukeboxWithSoundCloudProgram = (function () {
    var playingList = [];
    var nextRef;
    var currentPlayState = 'invalid';
    var playingtrack = null;
    var playingitem = -1;
    var playPannel;
    var prevProgress = -1000;

    var audioElement = document.createElement('audio');
    document.querySelector('body').appendChild(audioElement);

    class audioPlayer {
        constructor(type,player,cbUpdateProgress,cbPlayEnd) {
            this.type = type;
            this.player = player;
            this.cbUpdateProgress = cbUpdateProgress;
            this.cbPlayEnd = cbPlayEnd;

            switch (this.type) {
                case 'htmlAudio':
                    player.onended = this.onPlayEnd;
                    player.ontimeupdate = this.onUpdateProgress;
                    player.ptrThisClass = this;
                    break;
                case 'soundCloud':
                    player.on('finish', this.onPlayEnd);
                    player.on('time', this.onUpdateProgress);
                    player.ptrThisClass = this;
                    break;
                default:
                    throw Error('Unsupported player');
            }
        }

        onUpdateProgress() {
            if (this.ptrThisClass && this.ptrThisClass.cbUpdateProgress) {
                this.ptrThisClass.cbUpdateProgress();
            } else {
                console.log(this);
                console.log(this.cbUpdateProgress);
                console.log(this.ptrThisClass);
                console.log("I'm lost in onUpdateProgress callback.");
            }
        }

        onPlayEnd() {
            if (this.ptrThisClass && this.ptrThisClass.cbPlayEnd)
                this.ptrThisClass.cbPlayEnd();
            else {
                console.log(this.cbUpdateProgress);
                console.log(this.ptrThisClass);
                console.log("I'm lost in onPlayEnd callback.");
            }
        }

        set currentTime(val) {
            switch (this.type) {
                case 'htmlAudio':
                    this.player.currentTime = val/1000;
                    break;
                case 'soundCloud':
                    this.player.seek(val);
                    break;
            }
        }

        get currentTime() {
            switch (this.type) {
                case 'htmlAudio':
                    return this.player.currentTime*1000;
                case 'soundCloud':
                    return this.player.currentTime();
            }
        }

        get duration() {
            switch (this.type) {
                case 'htmlAudio':
                    return this.player.duration*1000;
                case 'soundCloud':
                    return this.player.getDuration();
            }
        }

        set volume(val) {
            switch (this.type) {
                case 'htmlAudio':
                    this.player.volume = val;
                    break;
                case 'soundCloud':
                    this.player.setVolume(val);
                    break;
            }
        }

        get volume() {
            switch (this.type) {
                case 'htmlAudio':
                    return this.player.volume;
                case 'soundCloud':
                    return this.player.getVolume();
            }
        }

        play() {
            switch (this.type) {
                case 'htmlAudio':
                    return this.player.play();
                case 'soundCloud':
                    return this.player.play();
            }
        }

        pause() {
            switch (this.type) {
                case 'htmlAudio':
                    return this.player.pause();
                case 'soundCloud':
                    return this.player.pause();
            }
        }
    }

    //*
    (function (ENV) {
        const id = ENV.client_id;
        SC.initialize({
            client_id: id
        });
    })(ENV)

    function onPlayFinished() {
        playNext(1);
    }

    function onUpdateProgress()
    {
        if (playingtrack == null)
            return;

        let cur = playingtrack.currentTime;
        if ((cur - prevProgress) < 1000)
            return;

        prevProgress = cur;
        let dur = playingtrack.duration;
        playPannel.Controls.Duration.value = cur / dur * 100;
        playPannel.Controls.Time.innerText = georgeJSBase.formatDuration(cur/1000) + ' / ' + georgeJSBase.formatDuration(dur/1000);
    }

    function getNextTrack(jump) {
        if (!playingList.length)
            return null;

        switch (playPannel.Controls.Loop.ButtonState) {
            default:
            case 0:     //loop all
                if (playingitem === -1)
                    playingitem = 0;
                else {
                    playingitem+=jump;
                    if (playingitem >= playingList.length)
                        playingitem = 0;
                    else if (playingitem < 0)
                        playingitem = playingList.length - 1;
                }
                break;
            case 1:     //random
                playingitem = Math.trunc(Math.random() * (playingList.length - 1));
                break;
            case 2:     //single
                if (playingitem === -1)
                    playingitem = 0;
                break;
        }

        return playingList[playingitem].Track;
    }

    function playNext(jump) {
        let track = getNextTrack(jump);
        if (track == null)
            return;

        if (playingtrack != null)
            playingtrack.pause();

        playingtrack = null;
        if (track.id !== null) {
            SC.stream(`/tracks/${track.id}`).then(function (player) {
                playingtrack = new audioPlayer('soundCloud', player, onUpdateProgress, onPlayFinished);
                playingtrack.volume = playPannel.Controls.Volume.value;
                playPannel.Controls.Name.innerText = track.title;
                prevProgress = -1000;
                playingtrack.play();
                currentPlayState = 'Playing';
            });
        } else {
            audioElement.src = track.personnal_url;
            playingtrack = new audioPlayer('htmlAudio', audioElement, onUpdateProgress, onPlayFinished);
            playingtrack.volume = playPannel.Controls.Volume.value;
            playPannel.Controls.Name.innerText = track.title;
            prevProgress = -1000;
            playingtrack.play();
            currentPlayState = 'Playing';
        }
    }

    function onPlay(pannel) {
        if (currentPlayState === 'Playing')
            return;

        if (playingtrack === null) {
            playNext(pannel, 1);
        }
        else {
            playingtrack.play();
            currentPlayState = 'Playing';
        }
    }

    function onPause(pannel) {
        if (playingtrack != null) {
            playingtrack.pause();
            currentPlayState = 'Paused';
        }
    }

    function onStop(pannel) {
        if (playingtrack != null) {
            playingtrack.pause();
            playingtrack.currentTime = 0;
             currentPlayState = 'Paused';
       }
    }

    function onPrev(pannel) {
        playNext(-1);
    }

    function onNext(pannel) {
        playNext(1);
    }

    function onLoop(pannel, state) {
    }

    function onMute(pannel, state) {
        console.log(state);
        if (playingtrack != null)
            playingtrack.volume = state ? 0 : pannel.Controls.Volume.value;
    }

    function onVolumeChanged(pannel, volume) {
        if (playingtrack != null)
            playingtrack.volume = pannel.Controls.Volume.value;
    }

    function onDurationChanged(btn, current) {
        console.log(current);
        if (playingtrack != null)
            playingtrack.currentTime=(current / 100 * playingtrack.duration);
    }


    var pannelHolder = document.querySelector('#playPannel')
    playPannel = new georgeJSMusicPlayerPannel(pannelHolder,
        {
            onPlay,
            onPause,
            onStop,
            onPrev,
            onNext,
            onLoop,
            onMute,
            onVolumeChanged,
            onDurationChanged,
            subField: 'style',
            width: '400px',
            position: 'absolute',
            left: 'calc((100vw-400px)/2)',
            top: '0',
            height: '100%',
            background: 'rgb(120, 120, 240)',
        });
    playPannel.Enable = false;

    class CMusicItem extends georgeJSImageInfoItem {
        constructor(parent, track) {
            super(parent,
                {
                    subField: 'style',
                    display: 'block',
                    width: '100vw',
                    minHeight: '100px',
                });
            this.imgSrc = track.artwork_url ? track.artwork_url : './img/default.jpg';
            this.Track = track;

            this.InfoTable = georgeJSBase.createElement({
                tagName: 'table',
                parentObject: this.Columns[1],
            })[0];

            this.InfoTableRows = georgeJSBase.createElement(
                {
                    tagName: 'tr',
                    parentObject: this.InfoTable,
                    innerHTML: track.user.permalink_url ? '<td style="overflow:hidden">Artist Name: <a href="' + track.user.permalink_url + '">' + track.user.username + '</a></td>' :
                        '<td style="overflow:hidden">Artist Name: ' + track.user.username + '</td>',
                }, {
                    tagName: 'tr',
                    parentObject: this.InfoTable,
                    innerHTML: track.permalink_url ? '<td style="overflow:hidden"><a href="' + track.permalink_url + '">' + track.title + '</a></td>' :
                        '<td style="overflow:hidden">' + track.title + '</td>',
                }, {
                    tagName: 'tr',
                    parentObject: this.InfoTable,
                    innerHTML: track.release_year ? '<td style="overflow:hidden">Description: ' + track.description + '. Genre: ' + track.genre + '. Release Date: ' +
                        track.release_month + '/' + track.release_day + '/' + track.release_year + '</td>' : '<td>Release Date: unknown</td>',
                });
            this.bAutoSelect = true;
        }
    }

    var songItems = [];
    function listTracks(arr) {
        let lst = document.querySelector('#songList');
        for (; songItems.length;) {
            lst.removeChild(songItems.pop().objPannel);
        }

        for (let i = 0; i < arr.length; i++) {
            songItems.push(new CMusicItem(lst, arr[i]));
        }
    }

    function onSearch(event) {
        let q = document.querySelector('#searchText').value;
        q = q.replace(/ /g, '&');
        SC.get('/tracks', {
            q, limit: 10, linked_partitioning: 1
        }).then(function (tracks) {
            listTracks(tracks.collection);
            nextRef = tracks.next_href;
        });
    }

    function onAddToList(event) {
        let plst = document.querySelector('#playingList');
        for (let i = 0; i < songItems.length; i++) {
            if (songItems[i].Select) {
                let exist = false;
                for (let j = 0; j < playingList.length; j++) {
                    if (playingList[j].Track.id === songItems[i].Track.id) {
                        exist = true;
                        break;
                    }
                }
                if (!exist)
                    playingList.push(new CMusicItem(plst, songItems[i].Track));
            }
        }
        playPannel.Enable = !!playingList.length;
    }

    function onAddPersonal(event) {
        let add = document.querySelector('#addText');
        if (!add.value)
            return;

        var track = {};
        track['title'] = 'unknown';
        track['id'] = null;
        track['personnal_url'] = add.value;
        track['artwork_url'] = './img/default.jpg';
        track['user'] = {};
        track['user']['username'] = 'unknown';
        track['user']['permalink'] = '';

        let plst = document.querySelector('#playingList');
        playingList.push(new CMusicItem(plst, track));
        playPannel.Enable = !!playingList.length;
    }

    function onDelete() {
        let plst = document.querySelector('#playingList');
        let isPlaying = false;
        for (let i = 0; i < playingList.length; i++) {
            if (i == playingitem && playingList[i].Select) {
                playingtrack.pause();
                playingtrack = null;
                isPlaying = true;
                break;
            }
        }

        for (let i = 0; i < playingList.length; i++) {
            if (playingList[i].Select) {
                plst.removeChild(playingList[i].objPannel);
                playingList.splice(i,1);
                i--;
            }
        }

        if (currentPlayState == 'Playing' && isPlaying)
            playNext(1);

        if (!playingList.length)
            playPannel.Enable = false;
    }

    document.querySelector('#searchButton').addEventListener('click', onSearch);
    document.querySelector('#addToList').addEventListener('click', onAddToList);
    document.querySelector('#addPersonal').addEventListener('click', onAddPersonal);
    document.querySelector('#del').addEventListener('click', onDelete);
})();
