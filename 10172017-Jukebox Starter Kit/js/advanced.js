(function () {

    const clrBkgrnd = 'rgb(192,192,192)';
    const clrLightEdge = 'rgb(230,230,230)';
    const clrDarkEdge = 'rgb(120,120,120)';

    const CAudioPlayCtrl = class CAudioPlayCtrl {
        constructor(objParent, listMusic) {
            this.objParent = objParent;
            this.listMusic = listMusic;
            this.modeLoop = 'loopAll';
            this.modeOrder = 'orderSequence';
            this.statePlay = 'stateInvalid';
            this.objAudio = null;
            this.indexMusic = -1;
        }

        createElement() {
            let args = {};
            let i = 0;
            for (; i < arguments.length - 1; i++)
                args = Object.assign(args, arguments[i]);

            if (!args['tagName']) return undefined;

            let el = document.createElement(args['tagName']);
            el.innerText = args['innerText'] || '';
            el.id = this.objParent.id + '_' + args['id'];
            Object.keys(args).forEach(key => el.style[key] = args[key]);

            if (typeof (args['parentObject']) === 'object') {
                args['parentObject'].insertBefore(el, args['insertBefore']);
            }

            Object.keys(arguments[i]).forEach(key => el[key] = arguments[i][key]);

            return el;
        }

        formatPadZero(num, len) {
            let s = num.toString();
            while (s.length < len)
                s = '0' + s;
            return s;
        }

        formatDuration(dur) {
            let s = Math.trunc(dur);
            let h = Math.trunc(s / 3600);
            s %= 3600;
            let m = Math.trunc(s / 60);
            s %= 60;
            return h > 0 ? (this.formatPadZero(h, 2) + ':') : '' + this.formatPadZero(m, 2) + ':' + this.formatPadZero(s, 2);
        }

        onMouseHover(event) {
            event.target.style.boxShadow = `
            -1.5px -1.5px 0 2px ${clrLightEdge},
            1.5px 1.5px 0 2px ${clrDarkEdge},
            -1.5px 1.5px 0 2px ${clrLightEdge},
            1.5px -1.5px 0 2px ${clrDarkEdge}
        `;
        }

        playNext(step) {
            if (this.modeOrder !== 'orderSequence')
                this.indexMusic = Math.round(Math.random() * this.listMusic.children.length);
            else if (this.modeLoop !== 'loopSingle') {
                this.indexMusic += step;
                if (this.indexMusic < 0)
                    this.indexMusic = this.listMusic.children.length - 1;
                else if (this.indexMusic >= this.listMusic.children.length)
                    this.indexMusic = 0;
            }

            if (this.indexMusic >= this.listMusic)
                return;

            this.musicName.innerText = this.listMusic.children[this.indexMusic].innerText;
            this.objAudio.src = this.listMusic.children[this.indexMusic].url;
            this.rangeProgress.value = 0;
            this.musicTime.innerText = '00:00/00:00';
            if (this.statePlay === 'statePlaying')
                this.objAudio.play().catch(e=>{
                    this.statePlay = 'stateInvalid';
                    this.objAudio.src = '';
                    this.musicName.innerText = '';
                    this.musicTime.innerText = '';
                    this.rangeProgress.value = 0;
                    this.indexMusic = -1;
                });
        }

        Init() {
            this.objAudio = this.createElement({ tagName: 'audio', parentObject: this.objParent, id: `audio` },
                {
                    innerHTML: 'Your browser does not support HTML5 <code>audio</code> tags.',
                    ontimeupdate: event => {
                        if (this.statePlay !== 'stateInvalid') {
                            this.rangeProgress.value = this.objAudio.currentTime / this.objAudio.duration * 100.;
                            this.musicTime.innerText = this.formatDuration(this.objAudio.currentTime) + '/' + this.formatDuration(this.objAudio.duration);
                        }
                    },
                    onerror: event => {
                    },
                    onended: event => {
                        this.playNext(1);
                    }
                });

            var ctrlWidth = Math.trunc(this.objParent.clientWidth / 11) - 6;
            var ctrlHeight = Math.trunc(this.objParent.clientHeight / 3);
            ctrlWidth = ctrlWidth > ctrlHeight ? ctrlHeight : ctrlWidth;

            var commonBtnStyle = {
                boxSizing: 'border-box',
                tagName: 'div',
                parentObject: this.objParent,
                width: `${ctrlWidth}px`,
                height: `${ctrlWidth}px`,
                background: clrBkgrnd,
                textAlign: 'center',
                display: 'inline-block',
                padding: '0px',
                margin: `${(ctrlHeight - ctrlWidth) / 2}px 3px`,
                cursor: 'pointer',
                verticalAlign: 'middle',
                overflow: 'hidden',
            };

            var commonEventListener = {
                onmouseover: this.onMouseHover,
                onmouseup: this.onMouseHover,
                onmousedown: (event) => {
                    event.target.style.boxShadow = `
                    -1.5px -1.5px 0 2px ${clrDarkEdge},
                    1.5px 1.5px 0 2px ${clrLightEdge},
                    -1.5px 1.5px 0 2px ${clrDarkEdge},
                    1.5px -1.5px 0 2px ${clrLightEdge}
                    `;
                },
                onmouseleave: (event) => { event.target.style.boxShadow = '' },
                onclick: event => {
                    var id=event.target.id.substr(this.objParent.id.length+1);
                    if (id!=='btnPlay'&&this.statePlay === 'stateInvalid')
                        return;

                    switch (id)
                    {
                        case 'btnPlay':
                            switch(this.statePlay)
                            {
                                case 'stateInvalid':
                                    this.objAudio.volume = this.rangeVolume.value;
                                    this.statePlay = 'statePlaying';
                                    this.playNext(1);
                                    break;
                                default:
                                    this.objAudio.play();
                                    this.statePlay = 'statePlaying';
                                    break;
                            }
                            break;
                        case 'btnPause':
                            this.objAudio.pause();
                            this.statePlay = 'statePaused';
                            break;
                        case 'btnStop':
                            this.objAudio.pause();
                            this.statePlay = 'stateStopped';
                            this.objAudio.currentTime = 0;
                            this.rangeProgress.value = 0;
                            this.musicTime.innerText = '';
                            break;
                        case 'btnPrev':
                            this.playNext(-1);
                            break;
                        case 'btnNext':
                            this.playNext(1);
                            break;
                        case 'btnOrder':
                            this.modeOrder = this.modeOrder === 'orderSequence' ? 'orderRandom' : 'orderSequence';
                            this.btnOrder.innerText = this.modeOrder === 'orderSequence' ? '⇉' : 'Ⰾ';
                            break;
                        case 'btnLoop':
                            this.modeLoop = this.modeLoop === 'loopAll' ? 'loopSingle' : (this.modeLoop === 'loopSingle' ? 'loopNone' : 'loopAll');
                            switch(this.modeLoop)
                            {
                                case 'loopAll':
                                    this.btnLoop.innerText = '⮔';
                                    break;
                                case 'loopSingle':
                                    this.btnLoop.innerText = '⟲';
                                    break;
                                default:
                                    this.btnLoop.innerText = '⇾';
                                    break;
                            }
                            break;
                        case 'btnMute':
                            this.objAudio.muted = !this.objAudio.muted;
                            this.btnMute.innerText = this.objAudio.muted ? '⒳' : '<))';
                            break;
                    }
                }
            };

            this.createElement({ innerText: '▶', id: 'btnPlay' }, commonBtnStyle, commonEventListener);
            this.createElement({ innerText: '❙❙', id: 'btnPause' }, commonBtnStyle, commonEventListener);
            this.createElement({ innerText: '◼', id: 'btnStop' }, commonBtnStyle, commonEventListener);
            this.createElement({ innerText: '॥◀', id: 'btnPrev' }, commonBtnStyle, commonEventListener);
            this.createElement({ innerText: '▶॥', id: 'btnNext' }, commonBtnStyle, commonEventListener);
            this.btnOrder=this.createElement({ innerText: '⇉', id: 'btnOrder' }, commonBtnStyle, commonEventListener);
            this.btnLoop=this.createElement({ innerText: '⮔', id: 'btnLoop' }, commonBtnStyle, commonEventListener);
            this.btnMute=this.createElement({ innerText: '<))', id: 'btnMute' }, commonBtnStyle, commonEventListener);
            this.rangeVolume=this.createElement({
                    tagName: 'input', parentObject: this.objParent, id: 'rangeVolume',
                    display: 'inline-block', width: `${3 * ctrlWidth}px`, margin: `${(ctrlHeight - ctrlWidth) / 2}px 3px`
                },
                {
                    type: 'range', min: '0', max: '1', step: '0.01', value: '0.5',
                    onchange: event=> { this.objAudio.volume = event.target.value; }
                });

            this.rangeProgress=this.createElement({
                    tagName: 'input', parentObject: this.objParent, id: 'rangeProgress',
                    width: `${8*(ctrlWidth+4)}px`, height: `${ctrlHeight}px`
                },
                {
                    type: 'range', min: '0', max: '100', step: '0.1', value: '0',
                    onchange: event => { if (this.statePlay !== 'stateInvalid') this.objAudio.currentTime = event.target.value / 100. * this.objAudio.duration; }
                });
            this.musicTime = this.createElement({
                    tagName: 'div', parentObject: this.objParent, id: 'infoTime', background: clrBkgrnd,
                    display: 'inline-block', width: `${3 * (ctrlWidth + 4)}px`, height: `${ctrlHeight}px`,
                    textAlign: 'center', verticalAlign: 'middle',
                }, {});
            this.musicName = this.createElement({ tagName: 'div', parentObject: this.objParent, id: 'infoName', background: clrBkgrnd }, {});
        }

        playSpec(item) {
            this.indexMusic = item;
            this.statePlay = 'statePlaying';
            this.playNext(0);
        }
    }

    var ctrls = document.querySelector('#ctrls');
    let list = document.querySelector("#musicList");
    ctrls.style.backgroundColor = clrBkgrnd;
    ctrls.style.width = '480px';
    ctrls.style.height = '120px';
    var audioPlayCtrl = new CAudioPlayCtrl(ctrls,list);
    audioPlayCtrl.Init();

    function addMusic(musics) {
        musics.forEach(music => {
            var el = document.createElement('li');
            el.innerText = music.name;
            el.url = music.url;
            el.played = 0;
            el.selected = false;
            el.onclick = event=> {
                event.target.selected = !event.target.selected;
                if(event.target.selected){
                    event.target.style.background = 'blue'
                    event.target.style.color = 'white';
                } else {
                    event.target.style.background = 'white'
                    event.target.style.color = 'black';
                };
            }
            el.ondblclick = event=> {
                var i = 0;
                var child = event.target;
                while ((child = child.previousSibling) != null)
                    i++;
                audioPlayCtrl.playSpec(i);
            }
            list.appendChild(el);
        });
    }

    addMusic([
        { name: 'Song 1', url: './music/1.mp3' },
        { name: 'Song 2', url: './music/2.mp3' },
        { name: 'Song 3', url: './music/3.mp3' },
        { name: 'Song 4', url: './music/4.mp3' }]);

    document.querySelector("#btnAdd").addEventListener('click', event => {
        let musicName = document.querySelector("#inputMusicName");
        let musicUrl = document.querySelector("#inputMusicUrl");
        if (!musicName.value || !musicUrl.value) return;
        addMusic([{ name: musicName.value, url: musicUrl.value }]);
    });

    document.querySelector("#btnDel").addEventListener('click', event => {
        for (let index = 0; index < list.children.length; index++) {
            if (list.children[index].selected) {
                list.removeChild(list.children[index]);
                index--;
            }
        }
    });
})();
