const georgeJSMusicPlayerPannel = (class {
    constructor() {
        this.objParent = arguments[0];

        let properties = georgeJSBase.combineArguments(arguments, 1);
        this.eventCallbacks={};
        let cbs=[
            'onPlay',
            'onPause',
            'onStop',
            'onPrev',
            'onNext',
            'onLoop',
            'onMute',
            'onVolumeChanged',
            'onDurationChanged',
        ];
        for (let i = 0; i < cbs.length; i++) {
            this.eventCallbacks[cbs[i]] = properties[cbs[i]];
            delete properties[cbs[i]];
        }

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
            this.Controls[btns[i][0]].ptrThisClass = this;
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
            this.Controls[ctrls[i][0]].ptrThisClass = this;
        }
    }

    onPlay(event, btn) {
        let oThis = btn.ptrThisClass;
        if (oThis.eventCallbacks.onPlay)
            oThis.eventCallbacks.onPlay(oThis);
    }
    onPause(event, btn) {
        let oThis = btn.ptrThisClass;
        if (oThis.eventCallbacks.onPause)
            oThis.eventCallbacks.onPause(oThis);
    }
    onStop(event, btn) {
        let oThis = btn.ptrThisClass;
        if (oThis.eventCallbacks.onStop)
            oThis.eventCallbacks.onStop(oThis);
    }
    onPrev(event, btn) {
        let oThis = btn.ptrThisClass;
        if (oThis.eventCallbacks.onPrev)
            oThis.eventCallbacks.onPrev(oThis);
    }
    onNext(event, btn) {
        let oThis = btn.ptrThisClass;
        if (oThis.eventCallbacks.onNext)
            oThis.eventCallbacks.onNext(oThis);
    }
    onLoop(event, btn) {
        let oThis = btn.ptrThisClass;
        if (oThis.eventCallbacks.onLoop)
            oThis.eventCallbacks.onLoop(oThis, oThis.Controls.Loop.ButtonState);
    }
    onMute(event, btn) {
        let oThis = btn.ptrThisClass;
        if (oThis.eventCallbacks.onMute)
            oThis.eventCallbacks.onMute(oThis, oThis.Controls.Play.ButtonState);
    }
    onVolumeChanged(event) {
        let oThis = this.ptrThisClass;
        if (oThis.eventCallbacks.onVolumeChanged)
            oThis.eventCallbacks.onVolumeChanged(oThis, event.target.value);
    }
    onDurationChanged(event) {
        let oThis = this.ptrThisClass;
        if (oThis.eventCallbacks.onDurationChanged)
            oThis.eventCallbacks.onDurationChanged(oThis, event.target.value);
    }
});


const georgeJSImageInfoItem = (class {
    constructor(parent) {
        this.bAutoSelect = false;
        this.bSelected = false;
        let properties = georgeJSBase.combineArguments(arguments, 1);
        this.objPannel = georgeJSBase.createElement({
            tagName: 'table',
            parentObject: parent,
            onclick: this.onTableClicked,
            subField_ImageInfoItem0: 'style',
            color: 'black',
            border: '1px 0 1px 0 black',
            subField_ImageInfoItem1: '..',
        }, properties)[0];

        this.objPannel.ptrThisClass = this;

        this.objRow = georgeJSBase.createElement({
            tagName: 'tr',
            parentObject: this.objPannel,
        })[0];

        this.Columns = georgeJSBase.createElement(
            {
                tagName: 'td',
                parentObject: this.objRow,
                subField: 'style',
                width: '96px',
                verticalAlign: 'middle',
                overflow: 'hidden',
            },
            {
                tagName: 'td',
                parentObject: this.objRow,
                subField: 'style',
                verticalAlign: 'middle',
                overflow: 'hidden',
            }
        );

        georgeJSBase.Assert(this.Columns.length === 2, 'Two items should be created.')
        this.objImage = georgeJSBase.createElement(
            {
                tagName: 'img',
                parentObject: this.Columns[0],
                subField: 'style',
                width: '80%',
                height: 'auto',
            })[0];
    }

    set imgSrc(val) {
        this.objImage.src = val;
    }

    set Select(val) {
        this.bSelected = val;
        this.onSelectStateChanged();
    }

    get Select() {
        return this.bSelected;
    }

    onSelectStateChanged() {
        this.objPannel.style.backgroundColor = this.bSelected ? 'blue' : 'white';
        this.objPannel.style.color = this.bSelected ? 'white' : 'black';
        console.log('changed?');
    }

    set AutoSelect(val) {
        this.bAutoSelect = val;
    }

    onTableClicked(event) {
        let oThis = this.ptrThisClass;
        if (!oThis.bAutoSelect)
            return;
        oThis.bSelected = !oThis.bSelected;
        oThis.onSelectStateChanged();
    }
});
