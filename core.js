
function findAllKeysThatFit(building,chart) {
    let fit = [];

    keys: for( let j = 0; j < keyAccessCharts.length+1; j++) {
        let key;
        if ( j < keyAccessCharts.length) key = findCuts(building,keyAccessCharts[j].name);
        else key = findCuts(building,"SCM");
        let keyFits = true;
        chambers: for(let k = 0; k < chart.length; k++) {
            let value = 0;
            let passed = false;
            chamber: for (let p = 0; p < chart[k].length; p++) {
                value += chart[k][p];
                if (key[k] === value) {
                    passed = true;
                    break chamber;
                }
            }
            if (!passed) keyFits = false;
        }
        if (keyFits) {
            if ( j < keyAccessCharts.length) {
                fit.push({
                    building: building,
                    key: keyAccessCharts[j].name,
                    cuts: [findCuts(building,keyAccessCharts[j].name)],
                })
            } else {
                fit.push({
                    building: building,
                    key: "SCM",
                    cuts: [findCuts(building,"SCM")],
                })
            }
        } 
    }
    fit.push({
        building: 0,
        key: "TMK",
    })
    fit.push({
        building: building,
        key: "SM",
    })
    fit.push({
        building: building,
        key: "BM",
    })

    return fit;
}
function buildPinningChart(keys) {
    let chambers = []
    for (let i = 0; i < 6; i++) {
        chambers.push([])
        for (let j = 0; j < keys.length; j++) {
            chambers[i].push(keys[j][i]);
        }
        chambers[i] = [...new Set(chambers[i])].sort(function(a, b) {
            return a - b;
          });
    }
    
    let chart = [];
    for (let i = 0; i < chambers.length; i++) {
        chart.push([]);
        chart[i].push(chambers[i][0]);
        for (let j = 1; j < chambers[i].length; j++) {
            chart[i].push(chambers[i][j]-chambers[i][j-1]);
        }
    }

    return chart;
}

function findCuts(building,keyName) {
    let cuts = [];
    let stakeCut = "Can't Find";
    for (let i = 0; i < pinningMatrix.stake.length; i++) {
        if (pinningMatrix.stake[i].buildings.includes(building)) stakeCut = pinningMatrix.stake[i].cut
    }
    cuts.push(stakeCut)
    let wardCuts = ["Can't Find","Can't Find","Can't Find"];
    for (let i = 0; i < pinningMatrix.keys.length; i++) {
        if (pinningMatrix.keys[i].name == keyName) {
            wardCuts = pinningMatrix.keys[i].cuts;
        }
    }
    cuts = cuts.concat(wardCuts);

    let letter = false;
    let buildingCuts = ["Can't Find","Can't Find"];
    for (let i = 0; i < buildings.length; i++) {
        if (buildings[i].name == building) letter = buildings[i].letter; 
    }
    for (let i = 0; i < pinningMatrix.letters.length; i++) {
        if (pinningMatrix.letters[i].name == letter) buildingCuts = pinningMatrix.letters[i].cuts
    }
    cuts = cuts.concat(buildingCuts)

    if (keyName == 'BM') {
        cuts[1] = pinningMatrix.nfm[1];
        cuts[2] = pinningMatrix.nfm[2];
        cuts[3] = pinningMatrix.nfm[3];
        cuts[4] = findCuts(building,"C1")[4];
        cuts[5] = findCuts(building,"C1")[5];
    }
    if (keyName == 'SM') {
        cuts[1] = pinningMatrix.nfm[1];
        cuts[2] = pinningMatrix.nfm[2];
        cuts[3] = pinningMatrix.nfm[3];
        cuts[4] = pinningMatrix.nfm[4];
        cuts[5] = pinningMatrix.nfm[5];
    }
    if (keyName == 'SCM') {
        cuts[1] = pinningMatrix.nfm[1];
        cuts[2] = pinningMatrix.nfm[2];
        cuts[3] = findCuts(building,"C1")[3];
        cuts[4] = pinningMatrix.nfm[4];
        cuts[5] = pinningMatrix.nfm[5];
    }
    if (keyName == 'TMK') {
        cuts[0] = pinningMatrix.nfm[0];
        cuts[1] = pinningMatrix.nfm[1];
        cuts[2] = pinningMatrix.nfm[2];
        cuts[3] = pinningMatrix.nfm[3];
        cuts[4] = pinningMatrix.nfm[4];
        cuts[5] = pinningMatrix.nfm[5];
    }

    return cuts;
}
function findAllKeys(keyName) {
    for (let i = 0; i < keyAccessCharts.length; i++) {
        if (keyAccessCharts[i].name == keyName) {
            return keyAccessCharts[i].fit;
        }
    }
    if (keyName == 'TMK') return ["TMK"];
    if (keyName == 'BM') return ["BM"];
    if (keyName == 'SCM') return ["SCM"];
    return "Can't Find Any"
}
function gatherKeys(building,keys,justName) {
    let allKeys = [];
    for (let i = 0; i < keys.length; i++) {
        allKeys = allKeys.concat(findAllKeys(keys[i]));
    }
    allKeys = [...new Set(allKeys)];
    let allCuts = [];
    for (let i = 0; i < allKeys.length; i++) {
        allCuts.push(findCuts(building,allKeys[i]));
    }
    allCuts.push(pinningMatrix.nfm);
    return justName ? allKeys : allCuts;
}