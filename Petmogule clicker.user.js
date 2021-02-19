// ==UserScript==
// @name         Petmogule clicker
// @namespace    https://violentmonkey.github.io
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://petmogul-2-0.com/profile.php?id=*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        none
// ==/UserScript==

(function(){
    const me = 143;
    
    var jQuery = window.jQuery;
    function buy(){
        if(!!document.getElementById("pubt")){
            document.getElementById("pubt").click();
        }
    }

    function quickCan(){
        var scash = document.getElementById("curentcash").getElementsByTagName("SPAN")[0].getAttribute("title").split(",")[0].substr(1);
        var icash = parseInt(scash);
        if(icash < 6) document.getElementById("quickcan").click();
        if(icash == 17){
            document.getElementById("pd").click();
            var drop = document.getElementById("dropvalue");
            drop.selectedIndex = "9";
            drop.dispatchEvent(new Event('change', {bubbles: true }));
        }
    }

    function level(){
        if(!!document.getElementById("lvlbt1") && !ibuying)
        {
            document.getElementById("quickcan").click();
            document.getElementById("lvlbt1").click();
            ibuying = true;
            setTimeout(() => {document.getElementById("lvlbt").click(); ibuying = false;},500);
        }
    }
    var ibuying = false;

    setInterval(buy, 100);
    setInterval(quickCan,1000);

    setInterval(function(){
        var urlParams = new URLSearchParams(window.location.search);
        var id = urlParams.get('id');
        if(id==me) level();
    },1000);
  
  
  var zNode = document.createElement ('div');
  zNode.innerHTML = '<button id="myButton" type="button">Clicker Off</button><br>';
  zNode.setAttribute('id', 'myContainer');
  jQuery("#playercash").after(zNode);
  jQuery("#myButton").on("click", ClickerPowerOn);
  function ClickerPowerOn(zEvent){
    console.log('clicker');
      jQuery("#myButton").text(function(i, text){return text === "Clicker On" ? "Clicker Off" : "Clicker On";});
  }

})();
