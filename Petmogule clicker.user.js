// ==UserScript==
// @name         Petmogule clicker
// @namespace    https://violentmonkey.github.io
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://petmogul-2-0.com/profile.php?id=*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// ==/UserScript==
   
var jQuery = window.jQuery;

function buy(){
    if(!clickerOn) return;
    if(!!document.getElementById("pubt")){
        document.getElementById("pubt").click();
    }
}

function quickCan(){
    if(!clickerOn) return;
    var scash = document.getElementById("curentcash").getElementsByTagName("SPAN")[0].getAttribute("title").split(",")[0].substr(1);
    var icash = parseInt(scash);
    if(icash < 9) document.getElementById("quickcan").click();
    if(icash == 17){
        document.getElementById("pd").click();
        var drop = document.getElementById("dropvalue");
        drop.selectedIndex = "9";
        drop.dispatchEvent(new Event('change', {bubbles: true }));
    }
}

function level(){
    let id = GM_getValue("LEVEL_ID", 0)
    if(!clickerOn) return;
    var urlParams = new URLSearchParams(window.location.search);
    if(id!=urlParams.get('id')) return;
    if(!!jQuery("#lvlbt1") && !ibuying)
    {
        jQuery("#quickcan").click();
        jQuery("#lvlbt1").click();
        ibuying = true;
        setTimeout(() => {jQuery("#lvlbt").click(); ibuying = false;},500);
    }
    if(jQuery('#lvlbt').is('[disabled=disabled]')) reloadPage();
}

function reloadPage(){
    location.reload();
}

var ibuying = false;
var clickerOn = true;
  
setInterval(buy, 10);
setInterval(quickCan,1000);
setInterval(level(),1000);
setInterval(reloadPage, GM_getValue("REFRESH_INTERVAL", 600000));

var zNode = document.createElement ('div');
zNode.innerHTML = `
   <input id="myButton" type="checkbox"><label for="myButton">Auto Buy</label>
   <input id="autoLevelCheck" type="checkbox"><label for="autoLevelCheck">Auto Level</label>
`;
zNode.setAttribute('id', 'myContainer');
jQuery("#playercash").after(zNode);
jQuery("#myButton").on("click", ClickerPowerOn);

function ClickerPowerOn(zEvent){
    jQuery("#myButton").text(function(i, text){return text === "Clicker On" ? "Clicker Off" : "Clicker On";});
    clickerOn = clickerOn ? false : true;
}
