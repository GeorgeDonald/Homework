var track;
var trackList;
var nextRef;

//*
(function (ENV) {
    const id = ENV.client_id;
    SC.initialize({
        client_id: id
    });
})(ENV)

function playTrack(num) {
    // stream track id 293
    SC.stream(`/tracks/${num}`).then(function (player) {
        track = player;
    });
}
//*/

function onPlay(pannel) {
    console.log('clicked');
}

function onPause(pannel) {
    console.log('clicked');
}

function onStop(pannel) {
    console.log('clicked');
}

function onPrev(pannel) {
    console.log('clicked');
}

function onNext(pannel) {
    console.log('clicked');
}

function onLoop(pannel, state) {
    console.log('clicked');
}

function onMute(pannel, state) {
    console.log('clicked');
}

function onVolumeChanged(pannel, volume) {
    console.log('clicked');
}

function onDurationChanged(btn,current) {
    console.log('clicked');
}


var pannelHolder = document.querySelector('#playPannel')
var pannel = new georgeJSMusicPlayerPannel(pannelHolder,
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

class CMusicItem extends georgeJSImageInfoItem {
    constructor(parent,track) {
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
                innerHTML: track.user.permaling_url?'<td style="overflow:hidden">Artist Name: <a href="'+track.user.permaling_url+'">'+track.user.username+'</a></td>':
                    '<td style="overflow:hidden">Artist Name: ' + track.user.username + '</td>',
            }, {
                tagName: 'tr',
                parentObject: this.InfoTable,
                innerHTML: track.permaling_url?'<td style="overflow:hidden"><a href="' + track.permaling_url + '">' + track.title + '</a></td>':
                    '<td style="overflow:hidden">' + track.title + '</td>',
            }, {
                tagName: 'tr',
                parentObject: this.InfoTable,
                innerHTML: track.release_year?'<td style="overflow:hidden">Description: ' + track.description + '. Genre: ' + track.genre + '. Release Date: ' +
                    track.release_month+'/'+track.release_day+'/'+track.release_year+'</td>':'<td>Release Date: unknown</td>',
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
            new CMusicItem(plst, songItems[i].Track);
        }
    }
}

document.querySelector('#searchButton').addEventListener('click', onSearch);
document.querySelector('#addToList').addEventListener('click', onAddToList);
