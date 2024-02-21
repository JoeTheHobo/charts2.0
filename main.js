let selectedKeys = ["TMK","BM","SM"];
let chosenKeys = [];
let building = 11;
let allKeyBoxes = [];
let oldBuildingInfo = '';
let newBuildingInfo = '';
let oldtableClass = 'table';
let oldOpacity = 0;
let oldVisible = false;
let onPage3 = false;

function generateKeyBoxes() {
    let boxes = [];
    let currentBox = 0;
    for (let i = 0; i < order.length; i++) {
        if (order[i].order > currentBox) {
            currentBox++;
            boxes.push({
                title: order[i].title,
                keys: [],
            });
        }

        boxes[currentBox-1].keys.push(order[i].name);
    }


    let allBoxes = $('allBoxes');
    allBoxes.innerHTML = '';
    allKeyBoxes = [];
    for (let i = 0; i < boxes.length; i++) {
        let holder = allBoxes.create('div');
        holder.id = 'keyBoxHolder';

        let title = holder.create('div');
        title.id = 'kbTitle';
        title.innerHTML = boxes[i].title;

        let switchHolder = holder.create("div");
        switchHolder.id = 'switchHolder';
        let toggle = switchHolder.create('label');
        toggle.className = 'switch';
        let input = toggle.create('input');
        input.className = 'sinput';
        input.type = 'checkbox';
        input.changed = false;
        input.onchange = function() {
            input.changed = true;
            generateChart();
        }
        let slider = toggle.create('slider')
        slider.className = 'slider round';

        let keyBox = {
            parent: holder,
            children: [],
            toggle: input,
        };

        let keys = holder.create('div');
        keys.id = 'kbKeys';

        let allkeys = [];

        for (let j = 0; j < boxes[i].keys.length; j++) {
            let key = keys.create('div');
            key.className = 'kbKey';
            key.id = 'key' + boxes[i].keys[j];
            key.innerHTML = boxes[i].keys[j];

            keyBox.children.push(key);
            key.chosen = false;
            key.warning = false;
            key.collateral = false;
            key.active = false;


            key.onclick = function() {
                this.active = this.active ? false : true;
                generateChart();
            }

            allkeys.push(key);
        }

        allKeyBoxes.push(keyBox);
    }
    generateChart();
}

function generateChart() {
     //Start Checking Cells For Colors

    /*
        Make Blue

        Make Yellow
    */

        selectedKeys = ["TMK","SM","BM"];
        chosenKeys = [];
        //Go Through First Wave Of Colors Finding Keys Selected
        for (let i = 0; i < allKeyBoxes.length; i++) {
            let oneActive = false;
            let allActive = true;
            let toggleDown = allKeyBoxes[i].toggle.checked;
            let toggleChanged = allKeyBoxes[i].toggle.changed;
            if (toggleChanged) {
                for (let j = 0; j < allKeyBoxes[i].children.length; j++) {
                    let child = allKeyBoxes[i].children[j];
                    if (toggleDown) child.active = true;
                    else child.active = false;

                    
                }
            }
            allKeyBoxes[i].toggle.changed = false;
            
            for (let j = 0; j < allKeyBoxes[i].children.length; j++) {
                let child = allKeyBoxes[i].children[j];
                child.warning = false;
                child.collateral = false;
                if (child.active) {
                    oneActive = true;
                    chosenKeys.push(child.innerHTML);
                    selectedKeys.push(child.innerHTML);
                    child.style.background = "#3E6F7E";
                } else {
                    child.style.background = "#383838";
                    allActive = false;
                }
            }
            if (allActive) allKeyBoxes[i].toggle.checked = true;
            else allKeyBoxes[i].toggle.checked = false;
            

            if (oneActive) {
                allKeyBoxes[i].parent.style.background = "linear-gradient(85.71deg, #3E6F7E 1.92%, #414141 97.64%)";
            } else {
                allKeyBoxes[i].parent.style.background = "linear-gradient(90deg, rgba(56,56,56,1) 0%, rgba(65,65,65,1) 100%)";
            }
        }

        let chart = buildPinningChart(gatherKeys(building,selectedKeys));

        let keysFit = findAllKeysThatFit(building,buildPinningChart(gatherKeys(building,selectedKeys)));
        let keyThatShouldFit = gatherKeys(building,selectedKeys,true);

        let keyWay = false;
        for (let i = 0; i < pinningMatrix.stake.length; i++) {
            if (pinningMatrix.stake[i].buildings.includes(building)) keyWay = pinningMatrix.stake[i].keyWay;
        }
        $('buildingName').innerHTML = "Keyway: " + keyWay;

        let nameList = [];
        let accurateList = [];
        for (let i = 0; i < keysFit.length; i++) {
            if (!nameList.includes(keysFit[i].key)) {
                nameList.push(keysFit[i].key);
                accurateList.push(keysFit[i]);
            }
        }
        keysFit = accurateList;
        let keyNamesThatFit = [];
        for (let i = 0; i < keysFit.length; i++) {
            keyNamesThatFit.push(keysFit[i].key);
        }

        //Go Through Second Wave Of Colors
        for (let i = 0; i < allKeyBoxes.length; i++) {
            let oneActive = false;
            let oneWarning = false;
            for (let j = 0; j < allKeyBoxes[i].children.length; j++) {
                let child = allKeyBoxes[i].children[j];
                if (child.active) {
                    oneActive = true;
                    continue;
                }
                if (keyNamesThatFit.includes(child.innerHTML)) {
                    if (keyThatShouldFit.includes(child.innerHTML)) {
                        child.collateral = true;
                        oneActive = true;
                        child.style.background = "#256";

                    } else {
                        oneWarning = true;
                        child.warning = true;
                        child.style.background = "#EC9D34B2";
                    }
                }
            }
            if (oneActive) {
                allKeyBoxes[i].parent.style.background = "linear-gradient(85.71deg, #3E6F7E 1.92%, #414141 97.64%)";
            }
            if (oneWarning) {
                allKeyBoxes[i].parent.style.background = "linear-gradient(85.8deg, rgba(236, 157, 52, 0.2) 1.8%, #414141 99.71%)";
            }
        }

    //End

    //Generate HTML Chart
    let table = $('chart');
    table.innerHTML = '';
    //Find Longest Coloumn
    let length = 0;
    for (let i = 0; i < chart.length; i++) {
        if (chart[i].length > length) length = chart[i].length;
    }
    for (let i = length-1; i > -1; i--) {
        let row = table.insertRow(0);
        for (let j = 5; j > -1; j--) {

            let cell = row.insertCell(0);
            cell.id = 'i' + i + 'j' + j;
            cell.className = 'tableCell';
            if (i == 0) cell.className = 'tableCell2';
        }
    }
    for (let i = 0; i < chart.length; i++) {
        for (let j = 0; j < chart[i].length; j++) {
            $('i' + j + 'j' + i).innerHTML = chart[i][j];
        }
    }

    $('tableTop').style.width = table.offsetWidth + 'px';
    let keysName = '';
    for (let i = chosenKeys.length-1; i > -1; i--) {
        keysName += chosenKeys[i];
        if (i > 0) keysName += ' / ';
    }
    if (keysName == '') keysName = 'SM';
    $('chartName').innerHTML = keysName;
    
    for (let i = 0; i < buildings.length; i++) {
        if (buildings[i].name == building) $('labelStamp').innerHTML = building + '.' +  buildings[i].letter; 
    }


    //Save File for Download
    /*
    html2canvas($("chartHolder"), {
        onrendered: function(canvas) {
            var img = canvas.toDataURL("image/png");
            $('download').setAttribute("download", "LDS Chart");
            $('download').setAttribute("href", img);
        }
    });
    */
}
$('deselect').onclick = function() {

    for (let i = 0; i < allKeyBoxes.length; i++) {
        for (let j = 0; j < allKeyBoxes[i].children.length; j++) {
            allKeyBoxes[i].children[j].active = false;
        }
    }

    generateChart();
}

generateKeyBoxes();

document.body.onscroll = function() {
    if ($('.screen2').style.display == 'none') return;
    let rect = $('keySelection')[0].getBoundingClientRect();

    console.log(rect.top)
    if (rect.top < 348) {
        $('.table').className = 'table table2';
        $('.table2').style.background = "rgba(83, 83, 83," + (1-((rect.top-305)/45)) + ")";
        $('tableOver').style.color = "rgba(255, 255, 255, " + (1-((rect.top-305)/45)) + ")";
        
        $('.table').style.left = ((window.innerWidth-$('.table').offsetWidth)/2) + 'px';
        $('tableOver').style.display = 'block';
        $('keySelection')[0].className = 'keyOver';
    } else {
        $('.table').className = 'table';
        $('.table').style.left = ((window.innerWidth-$('.table').offsetWidth)/2) + 'px';
        
        $('tableOver').style.display = 'none';
        $('keySelection')[0].className = '';

    }
}
$('.table').style.left = ((window.innerWidth-$('.table').offsetWidth)/2) + 'px';

function allScreenOff() {
    for(var child=$('.screens').firstChild; child!==null; child=child.nextSibling) {
        if (child.firstChild == null) continue;
        child.style.display = 'none';
    }
}
function switchScreen(screen) {
    allScreenOff();
    $('.screen' + screen).style.display = 'block';
}


//First Screen
window.addEventListener('resize',function() {
    fixBackgroundSlider();

})
function fixBackgroundSlider() {
    let moveBack = $('background');
    moveBack.style.transition = '';

    moveBack.style.top = ($('buildingNum').offsetTop) + 'px';

    if ($('ifBuilding').style.display == 'flex' || $('ifBuilding').style.display === '') {
        moveBack.style.left = $('buildingNum').offsetLeft + 'px';

    } else {
        moveBack.style.left = $('address2').offsetLeft + 'px';
    }

    moveBack.style.transition = '0.3s ease';
    moveBack.style.display = 'flex';
}
document.addEventListener("DOMContentLoaded", function () {

    const slider = $('background');
    const buildingLabel = $("buildingNum");
    const addressLabel = $("address2");
  
    buildingLabel.addEventListener("click", function () {
      slider.style.left = buildingLabel.offsetLeft + 'px';
      $('ifBuilding').style.display = 'flex';
      $('ifAddress').style.display = 'none';
      $('warningText').style.display = 'none';
    });
    addressLabel.addEventListener("click", function () {
      slider.style.left = "50.5%";
      $('ifBuilding').style.display = 'none';
      $('ifAddress').style.display = 'block';
      $('warningText').style.display = 'none';
    });

    fixBackgroundSlider();
  });

function searchBuildingAdd() {
    let build = findClosestAddress();
    //Check to make sure there is an input
    if ($('streetInput').value == '' || $('cityInput').value == '') {
        showWarning("Both Street And City Required");
        return;
    }
    if (!build) {
        showWarning("Couldn't Find Address");
        return;
    }
    $('Binput').value = '';
    building = Number(build);
    oldBuildingInfo = $('streetInput').value + ', ' + $('cityInput').value;

    showPage2();

}
//To Be Added
$('Binput').addEventListener("input",function() {
    let value = Number($('Binput'));
    let pass = false;
    for (let i = 0; i < buildings.length; i++) {
        if (buildings[i].name == value) pass = true;
    }
    if (pass) {
    } else {
    }
})
function searchBuilding() {
    //Check Building Value is Correct
    let value = $('Binput').value;
    //Check to make sure there is an input
    if (value == '') {
        showWarning("Number Value Required");
        return;
    }
    //Check to make sure only numbers
    if (isNaN(value)) {
        showWarning("Input May Only Include Numbers");
        return;
    }
    value = Number(value);
    //Check To make sure building exists
    let pass = false;
    for (let i = 0; i < buildings.length; i++) {
        if (buildings[i].name == value) pass = true;
    }
    if (!pass) {
        showWarning("Couldn't Find Building With That ID");
        return;
    }
    building = value;
    //
    $('streetInput').value = '';
    $('cityInput').value = '';
    oldBuildingInfo = newBuildingInfo;
    showPage2();
}
function showWarning2(warning) {
    $('warningText2').style.display = 'block';
    $('warningText2').innerHTML = warning;
}
function showWarning(warning) {
    $('warningText').style.display = 'block';
    $('warningText').innerHTML = warning;
}

function showPage2() {
    
    $('.table').className = 'table';
    
    $('tableOver').style.display = 'none';
    $('keySelection').className = '';

    if (oldBuildingInfo !== newBuildingInfo) {
        $('cfaPopUp').innerHTML = "Couldn't Find " + oldBuildingInfo + '<br> Showing ' + newBuildingInfo;
        $('cfaPopUp').style.visibility = 'visible';
        $('cfaPopUp').style.background = 'rgba(0,0,0,0.8)';
        $('cfaPopUp').style.color = 'rgba(255,255,255,1)';
        
        setTimeout(function() {
            $('cfaPopUp').style.background = 'rgba(0,0,0,0)';
            $('cfaPopUp').style.color = 'rgba(255,255,255,0)';
            
            setTimeout(function() {
                $('cfaPopUp').style.visibility = 'hidden';
            },200);
        },2500);
    }
    oldBuildingInfo = newBuildingInfo;

    if (!onPage3) {

        for (let i = 0; i < allKeyBoxes.length; i++) {
            for (let j = 0; j < allKeyBoxes[i].children.length; j++) {
                allKeyBoxes[i].children[j].active = false;
            }
        }
    }

    generateChart();
    let address = [];
    let letter = false;
    for (let i = 0; i < buildings.length; i++) {
        if (building == buildings[i].name) {
            address = buildings[i].address;
            letter = buildings[i].letter;
        }
    }
    $('address').innerHTML = address[0] + ', ' + address[1];
    $('buildingNumber').innerHTML = 'Building ' + building + '.' + letter;

    switchScreen(2);
    window.scrollTo(0,0);
    generateChart();
    onPage3 = false;
    $('.table').style.left = ((window.innerWidth-$('.table').offsetWidth)/2) + 'px';
}

for (let i = 0; i < $('goBack').length; i++) {
    $('goBack')[i].onclick = function() {
        if ($('shareBackground').style.display === 'block') {
            $('shareBackground').style.display = 'none';
            $('.table').className = oldtableClass;
            document.body.style.overflow = 'auto';
            $('tableOver').className = ''; 
            $('goKey').style.display = 'block';
            $('goBars').style.display = 'block';
            $('share').style.display = 'block';
            $('deselect').style.display = 'block';
        } else if ($('.screen3').style.display == 'block') {
            showPage2();

        } else if ($('.screen4').style.display == 'block') {
            showPage2();
        } else {
            $('warningText').style.display = 'none';
            $('background').style.display = 'none';
            switchScreen(1);
            fixBackgroundSlider();
        }
    }
}

$('Binput').addEventListener('keypress',function(e) {
    if (e.key == 'Enter') {
        e.preventDefault();
        searchBuilding();
    }
})
$('cityInput').addEventListener('keypress',function(e) {
    if (e.key == 'Enter') {
        e.preventDefault();
        searchBuildingAdd();
    }
})
$('streetInput').addEventListener('keypress',function(e) {
    if (e.key == 'Enter') {
        e.preventDefault();
        $('cityInput').focus();
    }
})

function download(filename, img) {
    var element = document.createElement('a');
    element.setAttribute('href', img);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

$('share').onclick = function() {
    $('shareBackground').style.display = 'block';
    oldtableClass = $('.table').className;
    document.body.style.overflow = 'hidden';
    $('.table').className = 'table table3';
    $('tableOver').className = 'tableOver2';
    $('goBars').style.display = 'none';
    $('goKey').style.display = 'none';
    oldVisible = $('tableOver').style.display;
    $('share').style.display = 'none';
    $('deselect').style.display = 'none'; 
    navigator
    .share({
        title: "Pinning Chart",
        text: 'Hello World',
        url: window.location.href
    })
    .then(() => console.log('Successful share! 🎉'))
    .catch(err => console.error(err));

    /*
    html2canvas($("chartHolder"), {
        onrendered: function(canvas) {
            var img = canvas.toDataURL("image/png");
            download("LDS Chart",img);
            navigator.share({
                title: "Pinning Chart",
                text: 'Share File',
                url: img,
            })
            .then(() => console.log('Successful share! 🎉'))
            .catch(err => console.error(err));
        }
    });
    */
}




function findClosestAddress() {
    let input = $('streetInput').value + ', ' + $("cityInput").value;
    //Find If City MAtches Any
    let cityIs;
    for (let i = 0; i < buildings.length; i++) {
        if (buildings[i].address[1].toLowerCase() === $("cityInput").value.toLowerCase()) cityIs = $("cityInput").value.toLowerCase();
    }

    //Find List Of Buildings to Search Through
    let buildingsToUse = [];
    for (let i = 0 ; i < buildings.length; i++) {
        if (cityIs) {
            if (buildings[i].address[1].toLowerCase() == cityIs) buildingsToUse.push(buildings[i]);
        } else buildingsToUse.push(buildings[i]);
    }

    //Search Through All Buildings
    for (let i = 0; i < buildingsToUse.length; i++) {
        buildingsToUse.matches = 0;
        let newInput = []
        for (let j = 0; j < input.length; j++) {
            newInput.push(input.charAt(j));
        }
        let addy = buildingsToUse[i].address[0] + ', ' + buildingsToUse[i].address[1];
        let addInput = [];
        for (let j = 0; j < addy.length; j++) {
            addInput.push(addy.charAt(j));
        }

        let matchesFound = 0;
        for (let j = 0; j < newInput.length; j++) {
            input: for (let k = 0; k < addInput.length; k++) {
                if (newInput[j].toLowerCase() === addInput[k].toLowerCase()) {
                    matchesFound++;
                    addInput.splice(k,1);
                    break input;
                }
            }
        }
        buildingsToUse[i].matches = matchesFound;
    }
    let highest = 0;
    let highBuild = false;
    for (let i = 0; i < buildingsToUse.length; i++) {
        if (buildingsToUse[i].matches > highest) {
            highest = buildingsToUse[i].matches;
            highBuild = buildingsToUse[i];
        }
    }
    newBuildingInfo = highBuild.address[0] + ', ' + highBuild.address[1];
    return highBuild.name;
}


//Using Back Button
function onLoad() {
    document.addEventListener('deviceready',onDeviceReady,false);
}
function onDeviceReady() {
    document.addEventListener('backbutton',onBackKeyDown,false);
}
function onBackKeyDown() {
    switchScreen(1);
}

window.addEventListener('hashchange',function(e) {
    switchScreen(1);
})

/*
document.addEventListener('backbutton',function(e) {
    e.preventDefault();
    switchScreen(1);
})*/
//End

function showPage3() {
    switchScreen(3);
    onPage3 = true;
    
    
    let address = [];
    let letter = false;
    for (let i = 0; i < buildings.length; i++) {
        if (building == buildings[i].name) {
            address = buildings[i].address;
            letter = buildings[i].letter;
        }
    }
    $('address3')[0].innerHTML = address[0] + ', ' + address[1];
    $('buildingNumber2')[0].innerHTML = 'Building ' + building + '.' + letter;

    let keyWay = '';
    for (let i = 0; i < pinningMatrix.stake.length; i++) {
        if (pinningMatrix.stake[i].buildings.includes(building)) keyWay = pinningMatrix.stake[i].keyWay;
    }
    drawCanvas(findCuts(building,"BM"),letter.toUpperCase() + 'M',keyWay);
    $('s3Key').innerHTML = "BM";
    let cuts = findCuts(building,"BM")
    cuts2 = '';
    for (let i =0 ; i < cuts.length; i++) {
        cuts2 += cuts[i] + ' ';
    }
    $('s3Cuts').innerHTML = cuts2;

    //Generate All Catagories
    let boxes = [];
    let currentBox = 0;
    for (let i = 0; i < order.length; i++) {
        if (order[i].order > currentBox) {
            currentBox++;
            boxes.push({
                title: order[i].title,
                keys: [],
            });
        }

        boxes[currentBox-1].keys.push(order[i].name);
    }
    $('s3Catagories').innerHTML = '';
    for (let i = 0; i < boxes.length; i++) {
        let holder = $('s3Catagories').create('div');
        holder.css({
            "background": "#555",
            position: "relative",
            borderRadius: "20px",
            marginTop: "8px",
        })

        let topBar = holder.create('div');
        topBar.css({
            "height": "3em",
            width: "100%",
        })
        let title = topBar.create('div');
        title.css({
            "color": "white",
            "position": "absolute",
            "top": "10px",
            "left": "30px",
            lineHeight: "30px",
            fontSize: "20px",
        })
        title.innerHTML = boxes[i].title;

        let arrow = topBar.create('img');
        arrow.css({
            width: "30px",
            rotate: "270deg",
            "position": "absolute",
            "top": "5px",
            "right": "20px",
        })
        arrow.src = 'img/back.png';
        topBar.id = 's3Arrow';
        topBar.onclick = function() {
            let closed = this.kid.style.maxHeight == '0px' ? false : true;
            //Close All
            for (let i = 0; i < $('s3Arrow').length; i++) {
                $('s3Arrow')[i].kid.style.maxHeight = '0';
                $('s3Arrow')[i].kid.style.visibility = 'hidden';
                $('s3Arrow')[i].arrow.style.rotate = '270deg';
            }

            if (!closed) {
                this.kid.style.visibility = "visible";
                this.kid.style.maxHeight = "200px";
                this.arrow.style.rotate = '90deg';
            }
        }

        let bottomDiv = holder.create('div');
        bottomDiv.css({
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            maxHeight: "0",
            visibility: "hidden",
            transition: "max-height 0.3s",
            flexWrap: "wrap",
            padding: "5px",
        })

        for (let j = 0; j < boxes[i].keys.length; j++) {
            let key = bottomDiv.create('div');
            key.innerHTML = boxes[i].keys[j];
            key.className ='kbKey2';

            key.onclick = function() {
                //Reset All Other Keys
                for (let i = 0; i < $('.kbKey2').length; i++) {
                    $('.kbKey2')[i].className = 'kbKey2';
                }

                this.className = 'kbKey2 kbKey3';
                $('s3Key').innerHTML = this.innerHTML;

                let cuts = findCuts(building,this.innerHTML)
                cuts2 = '';
                for (let i =0 ; i < cuts.length; i++) {
                    cuts2 += cuts[i] + ' ';
                }
                $('s3Cuts').innerHTML = cuts2;
                drawCanvas(findCuts(building,this.innerHTML),this.innerHTML,keyWay);
            }
        }
        if (i === 0) {
            let keys = ["TMK","SM","BM"];
            for (let j = 0; j < keys.length; j++) {
                let key = bottomDiv.create('div');
                key.innerHTML = keys[j];
                key.className ='kbKey2';
    
                key.onclick = function() {
                    //Reset All Other Keys
                    for (let i = 0; i < $('.kbKey2').length; i++) {
                        $('.kbKey2')[i].className = 'kbKey2';
                    }
    
                    this.className = 'kbKey2 kbKey3';
                    $('s3Key').innerHTML = this.innerHTML;
    
                    let cuts = findCuts(building,this.innerHTML)
                    cuts2 = '';
                    for (let i =0 ; i < cuts.length; i++) {
                        cuts2 += cuts[i] + ' ';
                    }
                    $('s3Cuts').innerHTML = cuts2;
                    drawCanvas(findCuts(building,this.innerHTML),this.innerHTML,keyWay);
                }
                
                if (key.innerHTML == 'BM') {
                    key.className = 'kbKey2 kbKey3';
                }
            }
        }

        topBar.arrow = arrow;
        topBar.kid = bottomDiv;
    }
}



function drawCanvas(cuts,keyName,keyWay) {
    let canvas = $('s3Canvas');
    let ctx = canvas.getContext("2d");

    canvas.width = $('s3Title')[0].offsetWidth;
    canvas.height = 200;
    canvas.css({
        width: $('s3Title')[0].offsetWidth + 'px',
        height: "200px",
    })
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let img = $('keyImg');
    let keyScale = 0.35;
    let imgWidth = img.width * keyScale;
    let imgHeight = img.height * keyScale;
    ctx.drawImage(img,(canvas.width-imgWidth)/2,0,imgWidth,imgHeight)

    ctx.fillStyle = '#414141';
    let cutDistance = 18; //Distance Between Cuts
    let botDist = 5; //Distance In Cut Bottom Trapazoid
    let angle = 45; //Angle 
    let scaleHeight = 2.3;
    let top = 58.5;
    let left = canvas.width*0.6;
    let bladeLength = 30;
    let x1,x2,y1,y2;
    for (let i = 0 ; i < cuts.length; i++) {
        ctx.fillStyle = '#414141';
        //ctx.fillRect((left+(i*cutDistance))-2.5,(top-2.5)+(cuts[i]*scaleHeight),5,5);

        ctx.beginPath();
        ctx.moveTo((left+(i*cutDistance))-(botDist/2),(top)+(cuts[i]*scaleHeight));
        x1 = (left+(i*cutDistance))-(botDist/2);
        y1 = (top)+(cuts[i]*scaleHeight);
        x2 = Math.round(Math.cos((angle-180) * Math.PI / 180) * bladeLength + x1);
        y2 = Math.round(Math.sin((angle-180) * Math.PI / 180) * bladeLength + y1);
        ctx.lineTo(x2,y2);

        
        ctx.lineTo((left+(i*cutDistance))-(botDist/2),(top)+(cuts[i]*scaleHeight));
        ctx.lineTo((left+(i*cutDistance))+(botDist/2),(top)+(cuts[i]*scaleHeight));

        
        ctx.lineTo((left+(i*cutDistance))+(botDist/2),(top)+(cuts[i]*scaleHeight));
        x1 = (left+(i*cutDistance))+(botDist/2);
        y1 = (top)+(cuts[i]*scaleHeight);
        x2 = Math.round(Math.cos(-angle * Math.PI / 180) * bladeLength + x1);
        y2 = Math.round(Math.sin(-angle * Math.PI / 180) * bladeLength + y1);
        ctx.lineTo(x2,y2);

        
        x1 = (left+(i*cutDistance))+(botDist/2);
        y1 = (top)+(cuts[i]*scaleHeight);
        x2 = Math.round(Math.cos(-angle * Math.PI / 180) * bladeLength + x1);
        y2 = Math.round(Math.sin(-angle * Math.PI / 180) * bladeLength + y1);
        ctx.lineTo(x2,y2);
        x1 = (left+(i*cutDistance))-(botDist/2);
        y1 = (top)+(cuts[i]*scaleHeight);
        x2 = Math.round(Math.cos((angle-180) * Math.PI / 180) * bladeLength + x1);
        y2 = Math.round(Math.sin((angle-180) * Math.PI / 180) * bladeLength + y1);
        ctx.lineTo(x2,y2);

        ctx.fill();
    }

    let letter = false;
    for (let i = 0; i < buildings.length; i++) {
        if (building == buildings[i].name) {
            letter = buildings[i].letter;
        }
    }
    let text = 'N' + building + '.' + letter.toUpperCase() + '.' + keyName;
    if ((letter == text.charAt(text.length-2) && text.charAt(text.length-1) == 'M') || keyName == 'BM') {
        text = "N" + building + '.' + letter + 'M';
    }
    ctx.save();
    ctx.fillStyle = 'black';
    let leftDistance = (canvas.width-imgWidth)/2+(imgWidth*0.285);
    ctx.translate(leftDistance, canvas.height/2-(ctx.measureText(text).width/2));
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.font = "20px Arial";
    ctx.fillText(text, 0, 0);
    ctx.restore();

    ctx.fillStyle = 'white';
    ctx.font = "20px Arial";
    ctx.fillText(keyWay, (canvas.width-imgWidth)/2+(imgWidth*0.4), 140);

}

$('goKey').addEventListener('click',function() {
    showPage3();
})
$('goBars').addEventListener('click',function() {
    showPage4();
})

function showPage4() {
    let address = [];
    let letter = false;
    for (let i = 0; i < buildings.length; i++) {
        if (building == buildings[i].name) {
            address = buildings[i].address;
            letter = buildings[i].letter;
        }
    }
    $('address3')[1].innerHTML = address[0] + ', ' + address[1];
    $('buildingNumber2')[1].innerHTML = 'Building ' + building + '.' + letter;

    switchScreen(4);

    $('doorsHolder').innerHTML = '';
    let correctMap = false;
    findingSiteMap: for (let i = 0; i < siteMaps.length; i++) {
        if (building === siteMaps[i].building) {
            correctMap = i;
            break findingSiteMap;
        }
    }
    for (let i = 0; i < siteMaps[correctMap].doors.length; i++) {
        let door = siteMaps[correctMap].doors[i];

        let holder = $('doorsHolder').create('div');
        holder.className = 'smHolder';

        let topLeft = holder.create('div');
        topLeft.className = 'smTopLeft';
        let doorNum = topLeft.create('div');
        doorNum.className = 'smDoorNum';
        doorNum.innerHTML = door.door;
        let remarks = topLeft.create('div');
        remarks.className = 'smRemarks';
        remarks.innerHTML = door.remarks == undefined ? '--' : door.remarks;

        let key = holder.create('div');
        key.className = 'smKey';
        key.innerHTML = door.keyId == undefined ? '--' : door.keyId;

        let table = holder.create('table');
        table.className = 'smTable';
        for (let j = 0; j < 4; j++) {
            let row = table.insertRow(0);
            let cell;
            cell = row.insertCell(0);
            switch (j) {
                case 0: 
                    cell.innerHTML = door.finish == undefined ? '--' : door.finish;
                    break;
                case 1: 
                    cell.innerHTML = door.brand == undefined ? '--' : door.brand;
                    break;
                case 2: 
                    cell.innerHTML = door.tail == undefined ? '--' : door.tail;
                    break;
                case 3: 
                    cell.innerHTML = door.type == undefined ? '--' : door.type;
                    break;
            } 
            cell.className = 'smValue';

            cell = row.insertCell(0);
            switch (j) {
                case 0: 
                    cell.innerHTML = 'Finish: '
                    break;
                case 1: 
                    cell.innerHTML = 'Brand: '
                    break;
                case 2: 
                    cell.innerHTML = 'Tailpiece: '
                    break;
                case 3: 
                    cell.innerHTML = 'Type: '
                    break;
            } 
            cell.className = 'smType';
        }

    }
}


document. addEventListener('backbutton', function(e) {e. preventDefault();})