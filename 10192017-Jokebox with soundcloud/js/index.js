var track;
var trackList;
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

var pannelHolder = document.querySelector('#playPannel')
var pannel = new georgeJSMusicPlayerPannel(pannelHolder,
    {
        subField: 'style',
        width: '480px',
        position: 'absolute',
        left: 'calc((50%-480px)/2)',
        top: '0',
        height: '100%',
        background: 'rgb(160, 160, 240)',
    });

function onSearch(event) {
    let q = document.querySelector('searchText').value;
    SC.get('/tracks', {
        q: 'songs', limit: 20, linked_partitioning: 1
    }).then(function (tracks) {
        trackList = tracks;
    });
}
var searchButton = document.querySelector('#searchButton');
searchButton.addEventListener('click', onSearch);