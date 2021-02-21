// ==UserScript==
// @name         Petmogule clicker - test
// @namespace    https://violentmonkey.github.io
// @version      1.7t
// @description  try to take over the world!
// @author       You
// @match        https://petmogul-2-0.com/profile.php?id=*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// ==/UserScript==

var jQuery = window.jQuery;
const myId = getMyId();
const pageId = getPageId();
var ibuying = false;
initUI();

setInterval(buy, 100);
setInterval(quickCan,1000);
setInterval(level,1000);
setInterval(flipBoard, 10000);
setInterval(makeStats, 5000);
setInterval(whosOnline, 10000);

function buy(){
    if(!jQuery("#autoBuyCheck").prop("checked")) return;
    if(!!document.getElementById("pubt")){
        document.getElementById("pubt").click();
        GM_setValue("LAST_BUY"+myId, jQuery.now());
    }else{
        var lastBuy = GM_getValue("LAST_BUY"+myId,jQuery.now());
        if(jQuery.now()-lastBuy > 60000){
            GM_setValue("LAST_BUY"+myId, jQuery.now());
            reloadPage();
        }
    }    
}

function getCash(){
    var scash = jQuery('#curentcash :first-child').html().split(' ');
    var exp;
    if(scash[1] == "Quint") {exp = "e18";}
    else if (scash[1] == "Quad") {
        exp = "e15";        
    }
    return parseFloat(scash[0]+exp);
}
function getTargetCash(){
   var t = parseFloat(jQuery('#playercash').html().replace(/,/g,""));
    return t;
}

function getLevel(){
  return parseInt(jQuery('#curentlevel').html());
}
function getTargetLevel(){
  return parseInt(jQuery('#playerlevel').html().split('<')[0]);
 
}


function getPageId(){
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function getMyId(){
    return parseInt(String(jQuery('#pvt_notice').prop('onclick')).match(/[0-9]+/g)[1]);
}

function quickCan(){
    var icash = getCash();
    if(icash < 9e18) document.getElementById("quickcan").click();
    if(icash > 17e18){
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
    if(jQuery("#lvlbt1").length == 1) GM_setValue("FLIP_NEXT", true); //if lvlpt pops go to next
    if(!GM_getValue("FLIP_NEXT", true)) return;
    jQuery('#pubboard > div:contains("LInk")').find("a").each(function(index){
        var url = new URL(jQuery(this).prop('href'));
        if(url.searchParams.get('id')!=pageId){
            GM_setValue("FLIP_NEXT", false);
            window.location.href=url.href;
        }
    });
}

function markStats(){
    GM_setValue("LEVEL"+myId, getLevel());
    GM_setValue("TARGET_LEVEL"+myId, getTargetLevel());
    GM_setValue("LAST_STAT_UPDATE"+myId, jQuery.now());
}

function makeStats(){
    var delta = (jQuery.now() - GM_getValue("LAST_STAT_UPDATE"+myId, 0))/60000;
    if(delta > 1440) markStats();
  
    // lvl/m while on
    var lastLevel = GM_getValue("LEVEL"+myId, 0);
    var lph = (getLevel() - lastLevel)/(delta/60);
    jQuery('#lph').html(lph.toFixed(1) + ' l/h ');
  
    var tlastLevel = GM_getValue("TARGET_LEVEL"+myId, 0);
    var tlph = (getTargetLevel() - tlastLevel)/(delta/60);
    jQuery('#tlph').html(tlph.toFixed(1) + ' l/h ');

}
  
function initUI(){
    jQuery('.features-items > li').first().after('<li id="clickerBox" class="feature-item profileblocks showblock "></li>')
    var zNode = jQuery('<div class="right-content"></div>');
  zNode.html(`<h4>PMClicker v${GM_info.script.version}</h4>
<div><center>
       <input id="autoBuyCheck" type="checkbox"><label for="autoBuyCheck">Auto Buy</label>
       <input id="autoLevelCheck" type="checkbox"><label for="autoLevelCheck">Auto Level</label>
       <input id="crawlBoardCheck" type="checkbox"><label for="crawlBoard">Crawl Board</label>
  </center></div>
    <div>You: <span id='cpm'></span> <span id='lph'></span></div>
    <div>Target: <span id='tcpm'></span> <span id='tlph'></span></div>
<div>Online (<span id='playerCount'></span>):</div>
<list id='listBox'></list>
    `);
    //zNode.attr({'id': 'clickerContainer','style':'border:3px double red'});
    jQuery("#clickerBox").append(zNode);

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
  
    //couple UI tweeks
    jQuery('#purchaselink').css('height','30px');
    jQuery('marquee').css('display','none');
}

function whosOnline(){
  var onlinePlayerList = jQuery('<list></list>');
  var onlineSelect = jQuery('#onlinemembers > a');
  jQuery('#playerCount').html(onlineSelect.length);
  onlineSelect.each(function(index){
    var link = jQuery(this).prop('href');
    var name = jQuery(this).find('img').prop('title');
    var lio = name.lastIndexOf('Member');
    var shortName = name.slice(0,lio);
    var newLink = jQuery(`<li><a href='${link}'>${shortName}</a></li>`);
    onlinePlayerList.append(newLink);
  });
  jQuery('#listBox').html(onlinePlayerList.html()); 
}
