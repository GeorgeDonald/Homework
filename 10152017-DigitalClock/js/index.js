var body = document.querySelector('body');
var dectime = document.querySelector('#decTime');
var hextime = document.querySelector('#hexTime');
var preHour = -1;

/*
function toHexWithPadding(int,len) {
    let hex=int.toString(16);
	  hex = hex.toUpperCase();
    while(hex.length<len)
        hex = '0' +hex;
	  return hex;
}
*/

function toDecWidthPadding(int,len){
    let dec=int.toString(10);
    while(dec.length<len)
        dec='0'+dec;
    return dec;
}

function onTimer() {
    let dt=new Date();
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    let seconds = dt.getSeconds();
    dectime.innerText = toDecWidthPadding(hours,2)+':'+toDecWidthPadding(minutes,2)+':'+toDecWidthPadding(seconds,2);

	  //let clr=`#${toHexWithPadding(hours*10,2)}${toHexWithPadding(minutes*4,2)}${toHexWithPadding(seconds*4,2)}`;
    //let clr=`#${toDecWidthPadding(hours,2)}${toDecWidthPadding(minutes,2)}${toDecWidthPadding(seconds,2)}`;
    //hextime.innerText=clr;
    //body.style.backgroundColor=clr;

    /*clock.style.fontSize = `${Math.random() * 80}px`;*/
    if(hours!==preHour) {
      preHour=hours;
      body.style.backgroundImage =`url(img/${toDecWidthPadding(hours,2)}.jpg)`;
      console.log('background image changed to '+ body.style.backgroundImage);
    }
    hexTime.innerText = "Good " + (hours < 12 ? "morning" :
      (hours < 18 ? "afternoon" : "evening")) + "!";
}

var tid=setInterval( onTimer,1000);
