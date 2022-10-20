var workbook,activeSheet,ranking,about;
function initViz() {
    var containerDiv = document.getElementById("tableauViz");
    var iFrameDiv = document.getElementById("iFrameViz");

    url = "https://public.tableau.com/views/A3_V6/POIDashboard?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link";
    // url_barchart = "https://public.tableau.com/views/A3_V6/PedestrainDashboard?:language=zh-CN&:display_count=n&:origin=viz_share_link";
    var options = {
        width:'100%',
        height:1000,
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive:function(){
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();

        }

    }

    var viz = new tableau.Viz(containerDiv, url,options);
    // var viz_iframe = new tableau.Viz(iFrameDiv, url_barchart,options);
}

function initRanking(){
    var container = document.getElementById("viz_iframe");
    url = "https://public.tableau.com/views/A3_V6/TOP30POIRatings?:language=zh-CN&:display_count=n&:origin=viz_share_link";
    var options = {
        width:'100%',
        height:1000,
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive:function(){
            ranking = viz.getWorkbook();
            activeSheet = ranking.getActiveSheet();

        }
    }
    var viz = new tableau.Viz(container, url, options);
}

function filterOnHotel() {
    var hotel = document.getElementById("hotel");
    if (hotel.checked == true) {
        filterOnTransport;
        activeSheet.applyFilterAsync(
            'Theme',
            'Hotel',
            tableau.FilterUpdateType.REPLACE
        );
    }
    else{
        activeSheet.clearFilterAsync('Theme');
    }
}

function filterOnPlace() {
    var place = document.getElementById("palce");
    if (place.checked == true) {
        filterOnTransport;
        activeSheet.applyFilterAsync(
            'Theme',
            'Place To Go',
            tableau.FilterUpdateType.REPLACE
        );
    }
    else{
        activeSheet.clearFilterAsync('Theme');
    }
}

function filterOnRestaurant() {
    var restaurant = document.getElementById("restaurant");
    if (restaurant.checked == true) {
        filterOnTransport;
        activeSheet.applyFilterAsync(
            'Theme',
            'Restaurant',
            tableau.FilterUpdateType.REPLACE
        );
    }
    else{
        activeSheet.clearFilterAsync('Theme');
    }
}

function filterOnTransport() {
    var trans = document.getElementById("trans");
    if (trans.checked == true) {
        filterOnTransport;
        activeSheet.applyFilterAsync(
            'Theme',
            'Transport',
            tableau.FilterUpdateType.REPLACE
        );
    }
    else{
        activeSheet.clearFilterAsync('Theme');
    }
}

function SwitchTab(sheetName) {
    workbook.activateSheetAsync(sheetName);
    document.getElementById("weather111").style.visibility = "hidden"
        console.log(document.getElementById('weather111').style.visibility)

        console.log(sheetName)
        if (sheetName === 'POI Dashboard'){
            console.log('check')
                    document.getElementById("weather111").style.visibility = "visible";
                    document.getElementById("text").style.display = "none";

        }
        if (sheetName === 'Expanding Donut Chart'){
            document.getElementById("weather111").style.visibility = "hidden";
            document.getElementById("tableauViz").style.marginLeft = '30px';
            document.getElementById("text").style.display = "contents";
        }
        else {
            console.log('wrong')
                    document.getElementById("weather111").style.visibility = 'hidden';
                    document.getElementById("text").style.display = "none";

        }
}

function SwitchBtn(sheetName) {
    ranking.activateSheetAsync(sheetName);
}



function hideIframe(iframe_id) {
    let element = document.getElementById(iframe_id);
    let button = document.getElementById('hide_frame_btn')
    let hidden = element.getAttribute("hidden");

    let floatmapid = "FloatMap" + iframe_id[6]

    
    if (hidden) {
        element.removeAttribute("hidden");
        //button.innerText = "Hide Iframe";
        //document.getElementById("FloatMap").style.width = "visible";
        document.getElementById(floatmapid).style.width = 800+'px';
        } else {
            element.setAttribute("hidden", "hidden");
            //button.innerText = "Show Iframe";
            //document.getElementById("FloatMap").style.visibility = 'hidden';
            document.getElementById(floatmapid).style.width = 1 +'px';
    }
}

function showIframe(iframe_id) {
    let element = document.getElementById(iframe_id);
    let button = document.getElementById('show_frame_btn')
    let hidden = element.getAttribute("hidden");

    
    if (hidden) 
    {
        element.setAttribute("show", "show");
        button.innerText = "Show Iframe";
    } else {
        element.setAttribute("hide", "hide");
        button.innerText = "Hide Iframe";
    }
}


