let p = require("puppeteer");

let url = process.argv[2];
let tab;
(async function(){
let browser = await p.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
});

let tabs = await browser.tabs();
tab = tabs[0];

await tab.goto(url);
let reqTime = await tab.evaluate(async function () {

    function hmsToSecondsOnly(str) {
        var p = str.split(':'),
            s = 0, m = 1;
    
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }
    
        return s;
    }

    let tVids =  document.querySelector("#stats .style-scope.yt-formatted-string");
    let totalvids = Number(tVids.innerText);
    let scrolls = Math.ceil(totalvids / 100);
let tVal = await new Promise(function(resolve,reject){
    let interval =setInterval(function()
    {
        let vids = document.querySelectorAll(".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer");
        vids[vids.length-1].scrollIntoView();


        if(Math.ceil (vids.length /100)== scrolls){
        clearInterval(interval);
        let timeArr = document.querySelectorAll("span.style-scope.ytd-thumbnail-overlay-time-status-renderer");
        let totalTime = 0;
        for(let i = 0; i < timeArr.length; i++){
            totalTime += hmsToSecondsOnly(timeArr[i].innerText);
        }
        console.log(totalTime / (60*60));
        resolve(totalTime);
        }
    }, 5000); 
});
return tVal;
});
let totalSeconds = reqTime;
let hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
let minutes = Math.floor(totalSeconds / 60);
let seconds = totalSeconds % 60;
console.log("1x: Normal speed " + hours + "h : " + minutes + "m : " + seconds + "s");

totalSeconds = reqTime/2;
hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
minutes = Math.floor(totalSeconds / 60);
seconds = totalSeconds % 60;
console.log("2x: Faster speed " + hours + "h : " + minutes + "m : " + seconds + "s");

totalSeconds = reqTime/5;
hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
minutes = Math.floor(totalSeconds / 60);
seconds = totalSeconds % 60;
console.log("5x: Faster speed " + hours + "h : " + minutes + "m : " + seconds + "s");

})();
