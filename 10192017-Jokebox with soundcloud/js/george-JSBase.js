const georgeJSBase = (function () {
    var debugMode = true;
    var LogMessage = debugMode ? (
        function () {
            let msg = '';
            for (let i = 0; i < arguments.length; i++)
                msg += arguments[i] + (arguments.length - 1 === i ? '' : ',');
            console.log(msg);
        }
        ) : undefined;
    var Assert=function(bool, msg){
        if (!debugMode || bool) return;
        alert(msg);
    }

    function combineArguments(args,startIndex) {
        let comb = {};
        for (let i = startIndex || 0; i < args.length; i++)
            comb = Object.assign(comb, args[i]);
        return comb;
    }

    function objectToArray(obj, arr) {
        Object.keys(obj).map(function (key) {
            arr.push([key, obj[key]]);
        });
    }

    //{tagName,parentObject,subField,...
    function createElement() {
        let args = [];
        for (let i=0; i < arguments.length; i++)
            objectToArray(arguments[i],args);

        if (args[0][0] !== 'tagName')
            return undefined;

        let curElement;
        let path = [];
        let pathIndex;
        let curParent, curInsertBefore;
        let rtnNewElements = [];

        args.forEach(arg=>{
            if (arg[0].substring(0, 8) === 'subField') {
                if (arg[1] === '..') {
                    path.pop();
                    pathIndex--;
                } else {
                    path.push(path[pathIndex][arg[1]]);
                    pathIndex++;
                }
            } else {
                switch (arg[0]) {
                    case 'tagName':
                        if (curParent !== undefined && typeof (curParent) === 'object') {
                            curParent.insertBefore(curElement, curInsertBefore);
                        }

                        curElement = document.createElement(arg[1]);
                        rtnNewElements.push(curElement);

                        path = [curElement];
                        pathIndex = 0;
                        curParent = undefined;
                        curInsertBefore = undefined;

                        break;

                    case 'parentObject':
                        curParent = arg[1];
                        break;
                    case 'insertBefore':
                        curInsertBefore = arg[1];
                        break;

                    case 'curObject':
                        break;

                    default:
                        path[pathIndex][arg[0]] = arg[1];
                        //LogMessage(path[pathIndex][arg[0]], arg[1]);
                        break;
                }
            }
        });

        if (typeof (curParent) === 'object') {
            curParent.insertBefore(curElement, curInsertBefore);
        }

        return rtnNewElements;
    }

    function setElementProperties() {
        let args = [];
        for (let i = 0; i < arguments.length; i++)
            objectToArray(arguments[i], args);

        if (!args[0][0] !== 'curObject')
            return undefined;

        let path = [];
        let pathIndex = -1;

        args.forEach(arg=> {
            switch (arg[0]) {
                case 'tagName':
                case 'parentObject':
                case 'insertBefore':
                    break;

                case 'curObject':
                    path = [];
                    path.push([arg[1]]);
                    pathIndex = 0;
                    break;

                case 'subField':
                    if (arg[1] === '..') {
                        path.pop();
                        pathIndex--;
                    } else {
                        path.push(path[pathIndex][arg[1]]);
                        pathIndex++;
                    }
                    break;

                default:
                    path[pathIndex][arg[0]] = arg[1];
                    break;
            }
        });
    }

    function formatNumber(num, len, complement, prefix, radix) {
        let s = num.toString(radix?radix:10);
        while (s.length < len)
            s = (complement ? complement : '0') + s;
        if (prefix)
            s = prefix + s;
        return s;
    }

    function formatDuration(dur) {
        let s = Math.trunc(dur);
        let h = Math.trunc(s / 3600);
        s %= 3600;
        let m = Math.trunc(s / 60);
        s %= 60;
        return h > 0 ? (this.formatNumber(h, 2) + ':') : '' + this.formatNumber(m, 2) + ':' + this.formatNumber(s, 2);
    }

    function getNamedColorHex(clr) {
        var colours = {
            "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
            "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff",
            "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
            "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50",
            "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
            "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400",
            "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
            "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f",
            "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
            "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
            "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
            "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080",
            "green": "#008000", "greenyellow": "#adff2f",
            "honeydew": "#f0fff0", "hotpink": "#ff69b4",
            "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
            "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd",
            "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
            "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a",
            "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
            "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
            "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd",
            "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
            "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970",
            "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
            "navajowhite": "#ffdead", "navy": "#000080",
            "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
            "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093",
            "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd",
            "powderblue": "#b0e0e6", "purple": "#800080",
            "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
            "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57",
            "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd",
            "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
            "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
            "violet": "#ee82ee",
            "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
            "yellow": "#ffff00", "yellowgreen": "#9acd32"
        };

        return colours[clr];
    }

    function getRGB(clrStr) {
        let clr = { r: 255, g: 255, b: 255 };

        clrStr=clrStr.replace(/ /g,'');
        let hexClr = getNamedColorHex(clrStr);
        if (hexClr)
            clrStr = hexClr;

        if (clrStr[0] === '#') {
            clrStr = clrStr.substring(1);
            if (clrStr.length === 3) clrStr += clrStr;
            if (clrStr.length === 6) {
                clr['r'] = parseInt(clrStr.substring(0, 2), 16);
                clr['g'] = parseInt(clrStr.substring(2, 4), 16);
                clr['b'] = parseInt(clrStr.substring(4, 6), 16);
            }
        } else if (clrStr.substring(0, 3) == 'rgb') {
            clrStr = clrStr.replace(/rgb\(|rgba\(|\)/g, '');
            let t = clrStr.split(',');
            clr['r'] = parseInt(t[0]);
            clr['g'] = parseInt(t[1]);
            clr['b'] = parseInt(t[2]);
        }
        return clr;
    }

    class CButton {
        constructor() {
            this.objParent = arguments[0];
            if (typeof (this.objParent) !== 'object' || !this.objParent.style)
                throw Error('Button parent must be a HTML element');

            let defaultProperties = {
                onmouseout: this.onMouseOut,
                onmouseover: this.onMouseOver,
                onmousedown: this.onMouseDown,
                onmouseup: this.onMouseUp,
                onclick: this.onMouseClick,
                ondblclick: this.onMouseDblClick,
                onmouseenter: this.onMouseEnter,
                onmouseleave: this.onMouseLeave,
                onmousemove: this.onMouseMove,
                oncontextmenu: this.onContextmenu,
                subFieldffff: 'style',
                textAlign: 'center',
                verticalAlign: 'middle',
                background: 'rgb(192,192,192)',
                color: 'rgb(0,0,0)',
                overflow: 'hidden',
                width: '64px',
                height: '24px',
                position: 'relative',
                margin: '0',
                padding: '0',
                boxSizing: 'border-box',
                cursor: 'pointer',
            };

            let properties = combineArguments(arguments,1);

            this.bDisabled = properties.Disable || false;
            delete properties.Disable;
            this.bAutoCheck = properties.AutoCheck || false;

            this.stateCurrent = 0;
            this.stateImages = [];
            this.parseImages(properties);

            this.imgDisabled = properties.DisableImage;
            delete properties.DisableImage;

            this.clrDisabled = properties.DisableColor || 'rgb(160,160,160)';
            this.clrNormal = properties.color || 'rgb(0,0,0)';

            this.stateTexts = [];
            this.parseTexts(properties);
            if (!this.stateTexts)
                stateText.push('Button');

            this.onMouseEvent = {};
            let events = [
                'onmouseover',
                'onmouseout',
                'onmousedown',
                'onmouseup',
                'onclick',
                'ondblclick',
                'onmouseenter',
                'onmouseleave',
                'oncontextmenu',
                'onmousemove'
            ];

            for (let i = 0; i < events.length; i++) {
                if (properties[events[i]]) {
                    this.onMouseEvent[events[i]] = properties[events[i]];
                    delete properties[events[i]];
                }
            }

            this.objElement = createElement({
                tagName: 'div',
                parentObject: this.objParent,
            }, defaultProperties, { subFieldfffe: '..' }, properties)[0];
            this.objElement.ptrInstanceClass = this;
            if (this.bDisabled) this.objElement.style.color = this.clrDisabled;

            this.objText = createElement({
                tagName: 'p',
                parentObject: this.objElement,
                innerText: this.stateTexts[0],
                subField: 'style',
                width: 'auto',
                height: 'auto',
                overflow: 'hidden',
                position: 'relative',
                display: (this.stateImages[0]&&this.stateImages[0].imgNormal) ? 'none' : 'block',
            })[0];
            this.objText.ptrInstanceClass = this;
            this.objText.style.top = `${(this.objElement.clientHeight - this.objText.clientHeight) / 2}px`;

            this.objImg = createElement({
                tagName: 'img',
                parentObject: this.objElement,
                innerText: this.stateTexts[0],
                src: (this.stateImages[0]&&this.stateImages[0].imgNormal?this.stateImages[0].imgNormal:''),
                subField: 'style',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                display: (this.stateImages[0]&&this.stateImages[0].imgNormal) ? 'block' : 'none',
            })[0];
            this.objImg.ptrInstanceClass = this;

            let bc = this.objElement.style.backgroundColor ||
                window.getComputedStyle(this.objElement).getPropertyValue('background-color') ||
                'white';

            bc = getRGB(bc);

            let lt1=`rgb(${Math.min(bc['r']+60,255)},${Math.min(bc['b']+60,255)},${Math.min(bc['b']+60,255)})`;
            let lt2=`rgb(${Math.min(bc['r']+30,255)},${Math.min(bc['b']+30,255)},${Math.min(bc['b']+30,255)})`;

            let rb1=`rgb(${Math.max(bc['r']-30,0)},${Math.max(bc['b']-30,0)},${Math.max(bc['b']-30,0)})`;
            let rb2=`rgb(${Math.max(bc['r']-60,0)},${Math.max(bc['b']-60,0)},${Math.max(bc['b']-60,0)})`;

            this.hoverShadow = `
                    1px 1px 1px 1px ${rb2},
                    2px 2px 1px 2px ${rb1},
                    -1px -1px 1px 1px ${lt2},
                    -2px -2px 1px 2px ${lt1},
                    1px -1px 1px 1px ${lt2},
                    2px -2px 1px 2px ${lt1},
                    -1px 1px 1px 1px ${lt2},
                    -2px 2px 1px 2px ${lt1}
                `;
            this.activeShadow = `
                    1px 1px 1px 1px ${lt1},
                    2px 2px 1px 2px ${lt2},
                    -1px -1px 1px 1px ${rb1},
                    -2px -2px 1px 2px ${rb2},
                    1px -1px 1px 1px ${rb1},
                    2px -2px 1px 2px ${rb2},
                    -1px 1px 1px 1px ${rb1},
                    -2px 2px 1px 2px ${rb2}
                `;
        }

        parseImages(properties) {
            for (let i = 0; ; i++) {
                let key = `NormalImage${i}`;
                if (!properties[key])
                    break;

                let imgs = {};
                imgs['imgNormal'] = properties[key];
                delete properties[key];

                key = `HoverImage${i}`;
                imgs['imgHover'] = properties[key];
                delete properties[key];

                key = `ActiveImage${i}`;
                imgs['imgActive'] = properties[key];
                delete properties[key];

                this.stateImages.push(imgs);
            }
        }

        parseTexts(properties) {
            for (let i = 0; ; i++) {
                let key = `innerText${i}`;
                if (!properties[key])
                    break;

                this.stateTexts.push(properties[key]);
                delete properties[key];
            }
        }

        modifyProperties(properties) {
            this.bDisabled = properties.Disable === undefined ? this.bDisabled : !!properties.Disable;
            delete properties.Disable;

            this.stateCurrent = 0;
            this.stateImages = [];
            this.parseImages(properties);

            this.imgDisabled = properties.DisableImage;
            delete properties.DisableImage;

            this.stateTexts = [];
            this.parseTexts(properties);
            if (!stateTexts)
                stateText.push('Button');

            if (properties.innerText !== undefined && typeof (properties.innerText) === 'string') {
                this.objText.innerText = this.stateTexts[0];
                this.objImg.innerText = this.stateTexts[0];
            }

            if (this.stateImages&&this.stateImages[0].imgNormal) {
                this.objText.style.display = 'none';
                this.objImg.style.display = 'block';
            } else {
                this.objText.style.display = 'block';
                this.objImg.style.display = 'none';
            }

            setElementProperties({ curObject: this.Element }, properties);
        }

        onMouseClick(event) {
            let oThis = this.ptrInstanceClass;
            if (oThis.bDisabled)
                return;

            if (oThis.stateImages.length > 1 && oThis.bAutoCheck) {
                oThis.stateCurrent++;
                if (oThis.stateCurrent >= oThis.stateImages.length)
                    oThis.stateCurrent = 0;

                if (oThis.stateImages[oThis.stateCurrent].imgHover)
                    oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgHover;
                else
                    oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgNormal;
            } else if (oThis.stateTexts.length > 1 && oThis.bAutoCheck) {
                oThis.stateCurrent++;
                if (oThis.stateCurrent >= oThis.stateTexts.length)
                    oThis.stateCurrent = 0;
                oThis.objText.innerText = oThis.stateTexts[oThis.stateCurrent];
                oThis.objImg.innerText = oThis.stateTexts[oThis.stateCurrent];
            }

            if (oThis.onMouseEvent.onclick)
                oThis.onMouseEvent.onclick(event,oThis);
        }

        onMouseDblClick(event) {
            let oThis = this.ptrInstanceClass;
            if (oThis.bDisabled)
                return;
            if (oThis.onMouseEvent.ondblclick)
                oThis.onMouseEvent.ondblclick(event, oThis);
        }
        onMouseEnter(event) {
            let oThis = this.ptrInstanceClass;
            if (oThis.bDisabled)
                return;
            if (oThis.onMouseEvent.onmouseenter)
                oThis.onMouseEvent.onmouseenter(event, oThis);
        }
        onMouseLeave(event) {
            let oThis = this.ptrInstanceClass;
            //LogMessage(oThis.stateTexts[0] + " received mouseLEAVE event.");
            if (oThis.bDisabled)
                return;
            if (oThis.onMouseEvent.onmouseleave)
                oThis.onMouseEvent.onmouseleave(event, oThis);
        }
        onMouseMove(event) {
            let oThis = this.ptrInstanceClass;
            if (oThis.bDisabled)
                return;
            if (oThis.onMouseEvent.onmousemove)
                oThis.onMouseEvent.onmousemove(event, oThis);
        }
        onContextmenu(event) {
            let oThis = this.ptrInstanceClass;
            if (oThis.bDisabled)
                return;
            if (oThis.onMouseEvent.oncontextmenu)
                oThis.onMouseEvent.oncontextmenu(event, oThis);
        }

        onMouseOut(event) {
            let oThis = this.ptrInstanceClass;
            //LogMessage(oThis.stateTexts[0] + " received mouseOUT event.");
            oThis.objElement.style.boxShadow = '';
            if (oThis.bDisabled)
                return;

            if (oThis.stateImages[oThis.stateCurrent] && oThis.stateImages[oThis.stateCurrent].imgNormal) {
                oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgNormal;
            }
            if (oThis.onMouseEvent.onmouseout)
                oThis.onMouseEvent.onmouseout(event, oThis);
        }

        onMouseOver(event) {
            let oThis = this.ptrInstanceClass;
            if (oThis.bDisabled)
                return;
            if (oThis.stateImages[oThis.stateCurrent] && oThis.stateImages[oThis.stateCurrent].imgNormal) {
                if (oThis.stateImages[oThis.stateCurrent].imgHover)
                    oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgHover;
                else
                    oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgNormal;
            }
            else
                oThis.objElement.style.boxShadow = oThis.hoverShadow;
            if (oThis.onMouseEvent.onmouseover)
                oThis.onMouseEvent.onmouseover(event, oThis);
        }

        onMouseDown(event) {
            let oThis = this.ptrInstanceClass;
            if (oThis.bDisabled)
                return;
            if (oThis.stateImages[oThis.stateCurrent] && oThis.stateImages[oThis.stateCurrent].imgNormal) {
                if (oThis.stateImages[oThis.stateCurrent].imgActive)
                    oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgActive;
                else
                    oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgNormal;
            }
            else
                oThis.objElement.style.boxShadow = oThis.activeShadow;
            if (oThis.onMouseEvent.onmousedown)
                oThis.onMouseEvent.onmousedown(event, oThis);
        }

        onMouseUp(event) {
            let oThis = this.ptrInstanceClass;
            if (oThis.bDisabled)
                return;
            if (oThis.stateImages[oThis.stateCurrent] && oThis.stateImages[oThis.stateCurrent].imgNormal) {
                if (oThis.stateImages[oThis.stateCurrent].imgHover)
                    oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgHover;
                else
                    oThis.objImg.src = oThis.stateImages[oThis.stateCurrent].imgNormal;
            }
            else
                oThis.objElement.style.boxShadow = oThis.hoverShadow;
            if (oThis.onMouseEvent.onmouseup)
                oThis.onMouseEvent.onmouseup(event, oThis);
        }

        set Enable(val) {
            this.bDisabled = !val;
            if (this.bDisabled) {
                this.objElement.style.boxShadow = '';
                this.objElement.style.color = this.clrDisabled;
                if (this.stateImages[0]&&this.stateImages[0].imgNormal) {
                    if (this.imgDisabled)
                        this.objImg.src = this.imgDisabled;
                    else
                        this.objImg.src = this.stateImages[0].imgNormal;
                }
            } else {
                this.objElement.style.color = this.clrNormal;
                if (this.stateImages[0] && this.stateImages[0].imgNormal) {
                    this.objImg.src = this.stateImages[0].imgNormal;
                }
            }
        }

        get Enable() {
            return !this.bDisabled;
        }

        set AutoCheck(val) {
            this.bAutoCheck = val;
        }

        get AutoCheck() {
            return this.bAutoCheck;
        }

        set ButtonState(val) {
            if (typeof (val) != 'number' || val < 0 || val >= (this.stateImages ? this.stateImages.length : this.stateTexts.length))
                return;
            this.stateCurrent = value;
        }

        get ButtonState() {
            return this.stateCurrent;
        }
    }

    return {
        LogMessage, Assert, combineArguments, objectToArray,
        createElement, formatNumber, formatDuration, getNamedColorHex, getRGB,
        CButton
    };
})();
