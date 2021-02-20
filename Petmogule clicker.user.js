// ==UserScript==
// @name         Petmogule clicker
// @namespace    https://violentmonkey.github.io
// @version      1.3
// @description  try to take over the world!
// @author       You
// @match        https://petmogul-2-0.com/profile.php?id=*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
   
var jQuery = window.jQuery;
var myId = parseInt(String(jQuery('#pvt_notice').prop('onclick')).match(/[0-9]+/g)[1]);
function buy(){
    if(!jQuery("#autoBuyCheck").prop("checked")) return;
    if(!!document.getElementById("pubt")){
        document.getElementById("pubt").click();
        GM_setValue("LAST_BUY"+myId, jQuery.now());
    }else{
        var lastBuy = GM_getValue("LAST_BUY"+myId,jQuery.now());
        if(jQuery.now()-lastBuy > 60000) reloadPage();
    }    
}


function getCash(){
  var scash = document.getElementById("curentcash").getElementsByTagName("SPAN")[0].getAttribute("title").split(",")[0].substr(1);
  return parseInt(scash);
}
function quickCan(){
    var icash = getCash();
    if(icash < 9) document.getElementById("quickcan").click();
    if(icash == 17){
        document.getElementById("pd").click();
        var drop = document.getElementById("dropvalue");
        drop.selectedIndex = "9";
        drop.dispatchEvent(new Event('change', {bubbles: true }));
    }
}

function level(){
    if(!jQuery("#autoLevelCheck").prop("checked")) return;
    if(jQuery("#lvlbt1").length == 1 && !ibuying)
    {
        console.log('beep');
        if(getCash() < 5) jQuery("#quickcan").click();
        jQuery("#lvlbt1").click();
        ibuying = true;
        setTimeout(() => {jQuery("#lvlbt").click(); ibuying = false;},500);
    }
    if(jQuery('#lvlbt').prop('disabled')) reloadPage();
}

function reloadPage(){
    location.reload();
}

function flipBoard(){
    if(!jQuery("#crawlBoardCheck").prop("checked")) return;
    jQuery('#pubboard > div:contains("LInk")').find("a").each(function(index){
        let id = jQuery(this).attr('href').split('=')[1]
        var urlParams = new URLSearchParams(window.location.search);
        if(id!=urlParams.get('id')) jQuery(this).click();
    });
}

var ibuying = false;
  
setInterval(buy, 10);
setInterval(quickCan,1000);
setInterval(level,1000);
//setInterval(reloadPage, GM_getValue("REFRESH_INTERVAL", 600000));

setInterval(flipBoard, 10000);

var zNode = document.createElement ('div');
zNode.innerHTML = `
   <input id="autoBuyCheck" type="checkbox"><label for="autoBuyCheck">Auto Buy</label>
   <input id="autoLevelCheck" type="checkbox"><label for="autoLevelCheck">Auto Level</label>
   <input id="crawlBoardCheck" type="checkbox"><label for="crawlBoard">Crawl Board</label><br />
<center>PMClicker v${GM_info.script.version}</center>
`;

zNode.setAttribute('id', 'clickerContainer');
zNode.setAttribute('style','border:3px double red');
jQuery("#playercash").after(zNode);

jQuery("#autoBuyCheck").prop("checked",GM_getValue("AUTO_BUY"+myId,false));
jQuery("#autoBuyCheck").on("click", function(){
    GM_setValue("AUTO_BUY"+myId,jQuery("#autoBuyCheck").prop("checked"));
});
jQuery("#autoLevelCheck").prop("checked",GM_getValue("AUTO_LEVEL"+myId,false));
jQuery("#autoLevelCheck").on("click", function(){
    GM_setValue("AUTO_LEVEL"+myId,jQuery("#autoLevelCheck").prop("checked"));
    GM_setValue("CRAWL"+myId, false);
});
jQuery("#crawlBoardCheck").prop("checked",GM_getValue("CRAWL"+myId,false));
jQuery("#crawlBoardCheck").on("click", function(){
    GM_setValue("CRAWL"+myId,jQuery("#crawlBoardCheck").prop("checked"));
    GM_setValue("AUTO_LEVEL"+myId,false);
});



