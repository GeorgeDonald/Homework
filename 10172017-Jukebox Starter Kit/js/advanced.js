const clrBkgrnd = 'rgb(192,192,192)';
const clrLightEdge = 'rgb(230,230,230)';
const clrDarkEdge = 'rgb(120,120,120)';

const CAudioPlayCtrl = class CAudioPlayCtrl {
    constructor(objParent) {
        this.objParent = objParent;
        this.modeLoop = 'loopAll';
        this.modeOrder = 'orderSequence';
        this.statePlay = 'stateInvalid';
        this.objAudio = null;
    }

    createElement() {
        let args = {};
        let i = 0;
        for (; i < arguments.length-1; i++)
            args=Object.assign(args,arguments[i]);

        if (!args['tagName']) return undefined;

        let el = document.createElement(args['tagName']);
        el.innerText = args['innerText'] || '';
        el.id = this.objParent.id+'_'+args['id'];
        Object.keys(args).forEach(key => el.style[key] = args[key]);

        if(typeof(args['parentObject'])==='object') {
            args['parentObject'].insertBefore(el,args['insertBefore']);
        }

        Object.keys(arguments[i]).forEach(key => el[key] = arguments[i][key]);

        return el;
    }

    onMouseHover(event) { 
        event.target.style.boxShadow = `
            -1.5px -1.5px 0 2px ${clrLightEdge},
            1.5px 1.5px 0 2px ${clrDarkEdge},
            -1.5px 1.5px 0 2px ${clrLightEdge},
            1.5px -1.5px 0 2px ${clrDarkEdge}
        `;
    }

    Init() {
        this.objAudio = this.createElement({ tagName: 'audio', parentObject: this.objParent, id: `audio` },
            { innerHTML: 'Your browser does not support HTML5 <code>audio</code> tags.' });

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
            margin: `${(ctrlHeight-ctrlWidth)/2}px 3px`,
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
        };

        this.createElement({ innerText: '▶', id: 'btnPlay' }, commonBtnStyle, commonEventListener);
        this.createElement({ innerText: '❙❙', id: 'btnPause' }, commonBtnStyle, commonEventListener);
        this.createElement({ innerText: '◼', id: 'btnStop' }, commonBtnStyle, commonEventListener);
        this.createElement({ innerText: '॥◀', id: 'btnPrev' }, commonBtnStyle, commonEventListener);
        this.createElement({ innerText: '▶॥', id: 'btnNext' }, commonBtnStyle, commonEventListener);
        this.createElement({ innerText: '⋈', id: 'btnOrder' }, commonBtnStyle, commonEventListener);
        this.createElement({ innerText: '⟲', id: 'btnLoop' }, commonBtnStyle, commonEventListener);
        this.createElement({ innerText: '<))', id: 'btnMute' }, commonBtnStyle, commonEventListener);
        this.createElement({
                tagName: 'input', parentObject: this.objParent, id: 'rangeVolume',
                display: 'inline-block', width: `${3 * ctrlWidth}px`, margin: `${(ctrlHeight - ctrlWidth) / 2}px 3px`
            },
            { type: 'range', min: '0', max: '1', step: '0.01', value: '0.3', onchange: event=>console.log(event.target.value) });

        this.createElement({
                tagName: 'input', parentObject: this.objParent, id: 'rangeProgress', display: 'block',
                width: `${this.objParent.clientWidth}px`,height: `${ctrlHeight}px`
            },
            { type: 'range', min: '0', max: '100', step: '0.1', value: '0' });
        this.createElement({ tagName: 'div', parentObject: this.objParent, id: 'infoName', background: clrBkgrnd }, {});
    }
}

//⮔Ⰾ⒳⇾

var ctrls = document.querySelector('#ctrls');
ctrls.style.backgroundColor = clrBkgrnd;
ctrls.style.width = '480px';
ctrls.style.height = '120px';
var audioPlayCtrl = new CAudioPlayCtrl(ctrls);
audioPlayCtrl.Init();

document.querySelector("#btnAdd").addEventListener('click',event => {
    let input = document.querySelector("#inputMusic");
    if (!input.value) return;
    let list = document.querySelector("#musicList");
    list.innerHTML += '<li>' + input.value+ '</li>';
});


/*
var str = '';
for (let i = 8000; i < 20000; i++) {
    if (i % 50 === 0) str += '<br/>';
    str += String.fromCharCode(i);
}
ctrls.innerHTML += str;
//*/
