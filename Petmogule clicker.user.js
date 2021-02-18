// ==UserScript==
// @name         Petmogule clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://petmogul-2-0.com/profile.php?id=*
// @grant        none
// ==/UserScript==

(function(){
    const me = 176;
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
        //console.error('id=',id);
        if(id==me) level();
    },1000);

})();
