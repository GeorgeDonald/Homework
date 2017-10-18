(function () {
    var lst = document.querySelectorAll(".lst");
    var ctrls = document.querySelectorAll(".ctrls");
    var audio = document.querySelector("#audio");
    var sn = document.querySelector("#name");
    var ct = document.querySelector("#currenttime");
    var playstate = 'invalid';

    lst.forEach(x=>x.addEventListener('click', function (event) {
        event.preventDefault();
        audio.src = event.target.href;
        sn.innerText = "Current: " + event.target.innerText;
        playstate === 'play' ? audio.play() : playstate = 'pause';
    }
    ));

    function formatPadZero(num, len) {
        let s = num.toString();
        while (s.length < len)
            s = '0' + s;
        return s;
    }

    function updateTime() {
        if (playstate !== 'invalid') {
            let s = Math.trunc(audio.currentTime);
            let h = Math.trunc(s / 3600);
            s %= 3600;
            let m = Math.trunc(s / 60);
            s %= 60;
            ct.innerText = formatPadZero(h, 2) + ':' + formatPadZero(m, 2) + ':' + formatPadZero(s, 2);
        }
    }

    ctrls.forEach(x=>x.addEventListener('click', function (event) {
        event.preventDefault();
        if (playstate === 'invalid')
            return;

        switch (event.target.id) {
            case 'play':
                audio.play();
                playstate = 'play';
                break;
            case 'pause':
                audio.pause();
                playstate = 'pause';
                break;
            case 'stop':
                audio.pause();
                audio.currentTime = 0;
                playstate = 'pause';
                updateTime();
                break;
        }
    }
    ));

    window.setInterval(updateTime, 1000);
})();