const georgeJSMusicPlayerPannel = (class {
    constructor() {
        this.objParent = arguments[0];

        let properties = {};
        for (let i = 1; i < arguments.length; i++)
            properties = Object.assign(properties, arguments[i]);

        let defaultProperties = {
            subField_InnerPannel00: 'style',
            width: '300px',
            height: '90px',
            backgroundColor: 'rgb(192,192,192)',
            position: 'absolute',
            left: '0',
            top: '0',
            margin: '0',
            padding: '0',
            subField_InnerPannel01: '..',
        };

        this.objPannel = georgeJSBase.createElement(
            { tagName: 'div', parentObject: this.objParent },
            defaultProperties,
            properties)[0];

        let ctrlWidth = Math.trunc(this.objPannel.clientWidth / 11) - 6;
        let ctrlHeight = Math.trunc(this.objPannel.clientHeight / 3) - 6;
        ctrlWidth = ctrlWidth > ctrlHeight ? ctrlHeight : ctrlWidth;

        let commonBtnStyle = {
            subField: 'style',
            width: `${ctrlWidth}px`,
            height: `${ctrlWidth}px`,
            background: window.getComputedStyle(this.objPannel).getPropertyValue('background-color'),
            textAlign: 'center',
            display: 'inline-block',
            padding: '0px',
            margin: `${(ctrlHeight - ctrlWidth) / 2}px 3px`,
            cursor: 'pointer',
            verticalAlign: 'middle',
            overflow: 'hidden',
            position: 'absolute',
            top: '3px',
        };

        let clsBtn = georgeJSBase.CButton;
        this.Controls = {
            Play: null, Pause: null, Stop: null, Prev: null, Next: null, Loop: null, Mute: null,
            Volume: null, Duration: null, Time: null, Name: null
        };
        let btns=[
            ['Play', {
                innerText0: '▶', id: 'btnPlay', onclick: this.onPlay,
                NormalImage0: './img/play_normal.png',
                HoverImage0: './img/play_hover.png',
                ActiveImage0: './img/play_active.png',
                DisableImage0: './img/play_disabled.png',
            }],
            ['Pause', { innerText0: '❙❙', id: 'btnPause', onclick: this.onPause }],
            ['Stop', { innerText0: '◼', id: 'btnStop', onclick: this.onStop }],
            ['Prev', { innerText0: '॥◀', id: 'btnPrev', onclick: this.onPrev }],
            ['Next', { innerText0: '▶॥', id: 'btnNext', onclick: this.onNext }],
            ['Loop', { innerText0: '⮔', innerText1: '⟗', innerText2: '⟲', AutoCheck: true, id: 'btnLoop', onclick: this.onLoop }],
            ['Mute', { innerText0: '<))', innerText1: '⒳', AutoCheck: true, id: 'btnMute', onclick: this.onMute }]
        ];

        let left = 3;
        for (let i = 0; i < btns.length; i++, left += ctrlWidth + 6) {
            this.Controls[btns[i][0]] = new clsBtn(this.objPannel, btns[i][1], commonBtnStyle, { left: `${left}px` });
        }

        left += 3;
        let ctrls=[['Volume',{
                tagName: 'input', parentObject: this.objPannel, id: 'rangeVolume',
                type: 'range', min: '0', max: '1', step: '0.01', value: '0.5',
                onchange: this.onVolumeChanged,
                subField: 'style',left: `${left}px`, position: 'absolute',height: `${ctrlHeight}px`,
                display: 'inline-block', width: `${this.objPannel.clientWidth - 6 - left}px`, 
            }],
            ['Duration',{
                tagName: 'input', parentObject: this.objPannel, id: 'rangeProgress',
                type: 'range', min: '0', max: '100', step: '0.1', value: '0',
                onchange: this.onDurationChanged,
                subField: 'style',left: `3px`, position: 'absolute',height: `${ctrlHeight}px`,
                width: `${left-6}px`, top: `${ctrlHeight}px`,
            }],
            ['Time',{
                tagName: 'div', parentObject: this.objPannel, id: 'infoTime', innerText: '00:00/00:00',
                subField: 'style', background: commonBtnStyle.background,
                position: 'absolute', width: `${this.objPannel.clientWidth - 6 - left}px`, height: `${ctrlHeight}px`,
                textAlign: 'center', verticalAlign: 'middle', left: `${left}px`, top: `${ctrlHeight}px`
            }],
            ['Name',{
                tagName: 'div', parentObject: this.objPannel, id: 'infoName',
                innerText: "Song's Name", 
                subField: 'style', background: commonBtnStyle.background,
                position: 'absolute', width: `${this.objPannel.clientWidth - 6}px`, height: `${ctrlHeight}px`,
                textAlign: 'center', verticalAlign: 'middle', left: `3px`, top: `${2*ctrlHeight}px`
            }]
        ];

        for (let i = 0; i < ctrls.length; i++) {
            this.Controls[ctrls[i][0]] = georgeJSBase.createElement(ctrls[i][1])[0];
        }
    }

    onPlay(event) {
        console.log(event.target.innerText+" clicked");
    }
    onPause(event) {
        console.log(event.target.innerText + " clicked");
    }
    onStop(event) {
        console.log(event.target.innerText + " clicked");
    }
    onPrev(event) {
        console.log(event.target.innerText + " clicked");
    }
    onNext(event) {
        console.log(event.target.innerText + " clicked");
    }
    onLoop(event) {
        console.log(event.target.innerText + " clicked");
    }
    onMute(event) {
        console.log(event.target.innerText + " clicked");
    }
    onVolumeChanged(event) {
        console.log('Volume: '+event.target.value);
    }
    onDurationChanged(event) {
        //if (this.statePlay !== 'stateInvalid') this.objAudio.currentTime = event.target.value / 100. * this.objAudio.duration; 
        console.log('Volume: ' + event.target.value);
    }
});
