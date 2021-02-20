// ==UserScript==
// @name         Petmogule clicker
// @namespace    https://violentmonkey.github.io
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://petmogul-2-0.com/profile.php?id=*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
   
var jQuery = window.jQuery;

function buy(){
    if(!jQuery("#autoBuyCheck").prop("checked")) return;
    if(!!document.getElementById("pubt")){
        document.getElementById("pubt").click();
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
    //let id = GM_getValue("LEVEL_ID", 0)
    if(jQuery("#lvlbt1").length == 1) GM_setValue("CRAWLING_ID",0);
    if(!jQuery("#autoLevelCheck").prop("checked")) return;
    //var urlParams = new URLSearchParams(window.location.search);
    //if(id!=urlParams.get('id')) return;
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
    
    if(jQuery("#crawlBoardCheck").prop("checked") && GM_getValue("CRAWLING_ID",0) == 0){
        jQuery('#pubboard > div:contains("LInk")').find("a").each(function(index){
            let id = jQuery(this).attr('href').split('=')[1]
            var urlParams = new URLSearchParams(window.location.search);
            if(id!=urlParams.get('id')) {
                GM_setValue("CRAWLING_ID",id);
                jQuery(this).click();
            }
        });
    }
}

var ibuying = false;
  
setInterval(buy, 10); //buy every 10msec
setInterval(quickCan, 1000); //check if need to can every 1sec
setInterval(level, 1000); //check leveling every 1sec
setInterval(reloadPage, GM_getValue("REFRESH_INTERVAL", 600000)); //refresh page every 10min

setInterval(flipBoard, 10000); //check boardflip every 10sec

var zNode = document.createElement ('div');
zNode.innerHTML = `
   <input id="autoBuyCheck" type="checkbox"><label for="autoBuyCheck">Auto Buy</label>
   <input id="autoLevelCheck" type="checkbox"><label for="autoLevelCheck">Auto Level</label>
   <input id="crawlBoardCheck" type="checkbox"><label for="crawlBoard">Crawl Board</label>
`;

zNode.setAttribute('id', 'clickerContainer');
zNode.setAttribute('style','border:3px double red');
jQuery("#playercash").after(zNode);

jQuery("#autoBuyCheck").prop("checked",GM_getValue("AUTO_BUY",false));
jQuery("#autoBuyCheck").on("click", function(){
    GM_setValue("AUTO_BUY",jQuery("#autoBuyCheck").prop("checked"));
});
jQuery("#autoLevelCheck").prop("checked",GM_getValue("AUTO_LEVEL",false));
jQuery("#autoLevelCheck").on("click", function(){
    GM_setValue("AUTO_LEVEL",jQuery("#autoLevelCheck").prop("checked"));
    GM_setValue("CRAWL", false);
});
jQuery("#crawlBoardCheck").prop("checked",GM_getValue("CRAWL",false));
jQuery("#crawlBoardCheck").on("click", function(){
    GM_setValue("CRAWL",jQuery("#crawlBoardCheck").prop("checked"));
    GM_setValue("AUTO_LEVEL",false);
});



