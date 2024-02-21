function decodeAccess(string) {
    let rowsBroken = string.split(`\n`);
    let rows = [];
    for (let i = 0; i < rowsBroken.length; i++) {
        rows.push(rowsBroken[i].split(`\t`));
    }
    let toReturn = [];
    for (let i = 2; i < rows.length; i++) {
        let alsoFit = [];
        for (let j = 0; j < 41; j++) {
            if (rows[i][j + 1] == 'x') {
                alsoFit.push(rows[1][j+1])
            }
        }
        toReturn.push({
            name: rows[i][0],
            fit: alsoFit,
        })
    }
    return toReturn;
}
function decodeMatrix(string) {
    let nfm = [];
    let stake = [];
    let keys = [];
    let letters = [];

    string = string.split(`\n`);
    let newString = [];
    for (let i = 0; i < string.length; i++) {
        newString.push(string[i].split(`\t`));
    }
    rows = newString;

    //Find Stake
    for (let i = 1; i < 17; i++) {
        let keyWay, cut, buildings = [];

        keyWay = rows[3][i];
        cut = Number(rows[4][i]);
        for (let j = 0; j < 8; j++) {
            if (Number(rows[j + 5][i]) === 0) continue;
            buildings.push(Number(rows[j + 5][i]));
        }
        stake.push({
            keyWay: keyWay,
            cut: cut,
            buildings: buildings,
        })
    }
    //Find Wards
    for (let j = 15; j < 30; j++) {
        for (let i = 3; i < 7; i++) {
            if (rows[j][i] == '') continue;
            keys.push({
                name: rows[j][i],
                cuts: [Number(rows[j][1]),Number(rows[j][2]),Number(rows[14][i])],
            })
        }
    }
    //Find Buildings
    for (let j = 15; j < 18; j++) {
        for (let i = 11; i < 15; i++) {
            letters.push({
                name: rows[j][i],
                cuts: [Number(rows[j][10]),Number(rows[14][i])],
            })
        }
    }
    //Finding NFM
    nfm = [Number(rows[0][1]),Number(rows[0][2]),Number(rows[0][3]),Number(rows[0][4]),Number(rows[0][5]),Number(rows[0][6])];

    return {
        nfm: nfm,
        stake: stake,
        keys: keys,
        letters: letters,
    }
}
function decodeBuildings(string) {
    let rowsBroken = string.split(`\n`);
    let rows = [];
    for (let i = 0; i < rowsBroken.length; i++) {
        rows.push(rowsBroken[i].split(`\t`));
    }
    let buildings = [];
    for (let i = 1; i < rows.length; i++) {
        buildings.push({
            name: Number(rows[i][0]),
            address: rows[i][1].split(", "),
            letter: rows[i][2],
            stake: rows[i][3],
        })
    }
    return buildings;
}

function decodeOrder(string) {
    let rowsBroken = string.split(`\n`);
    let rows = [];
    for (let i = 0; i < rowsBroken.length; i++) {
        rows.push(rowsBroken[i].split(`\t`));
    }
    let order = [];
    for (let i = 0; i < rows.length; i++) {
        order.push({
            name: rows[i][0],
            order: Number(rows[i][1]),
            title: rows[i][2],
        })
    }
    return order;
}


function decodeSiteMaps() {
    let newMaps = [];
    for (let i = 0; i < siteMaps.length; i++) {
        let obj = {
            building: false,
            doors: [],
        }

        let currentMap = [];

        let rows = siteMaps[i].split(/\r?\n/)
        for (let j = 0; j < rows.length; j++) {
            currentMap.push(rows[j].split(','))
        }
        
        //Find Building Number
        let numbers = ["0","1","2","3","4","5","6","7","8","9"]
        findNumber: for (let j = 0; j < currentMap.length; j++) {
            for (let k = 0; k < currentMap[j].length; k++) {
                let foundN = false;
                let number = '';
                for (let p = 0; p < currentMap[j][k].length; p++) {
                    let char = currentMap[j][k].charAt(p).toLowerCase();
                    if (char == 'n' && foundN === false) foundN = true;
                    else if (foundN && numbers.includes(char)) {
                        number += char;
                    } else if (foundN && !numbers.includes(char) && number !== '') {
                        obj.building = Number(number);
                        break findNumber;
                    } else {
                        foundN = false;
                    }
                }

                if (currentMap[j][k].toLowerCase().includes('bld ')) {
                    let a = currentMap[j][k].toLowerCase().split('bld ');
                    number = Number(a[1]);
                }
                if (currentMap[j][k].toLowerCase().includes('bldg # ')) {
                    let a = currentMap[j][k].toLowerCase().split('bldg # ');
                    number = Number(a[1]);
                }
                if (number !== '') {

                    obj.building = Number(number);
                    break findNumber;
                }
            }
        }

        //Find All Doors
        let lines = {
            line: false,
            door: false,
            quantity: false,
            brand: false,
            type: false,
            finish: false,
            hand: false,
            backset: false,
            tail: false,
            keyId: false,
            remarks: false,
        }
        let startingLine = 99999;
        let lineCases = ["Line#"];
        let doorCases = ["Door#"];
        let quantityCases = ["Cyl Quantity","Quan","Cyl Quan"];
        let brandCases = ["Brand"];
        let typeCases = ["Type"];
        let finishCases = ["Finish"];
        let handCases = ["Hand"];
        let backsetCases = ["Backset"];
        let tailCases = ["Cam/Tail"];
        let keyIdCases = ["Key ID"];
        let remarksCases = ["Remarks"];
        for (let j = 0; j < currentMap.length; j++) {
            if (lineCases.includes(currentMap[j][0])) {
                startingLine = j+1;
                for (let k = 0; k < currentMap[j].length; k++) {
                    let cell = currentMap[j][k];
                    if (lineCases.includes(cell)) {
                        lines.line = k;
                    }
                    if (doorCases.includes(cell)) {
                        lines.door = k;
                    }
                    if (quantityCases.includes(cell)) {
                        lines.quantity = k;
                    }
                    if (brandCases.includes(cell)) {
                        lines.brand = k;
                    }
                    if (typeCases.includes(cell)) {
                        lines.type = k;
                    }
                    if (finishCases.includes(cell)) {
                        lines.finish = k;
                    }
                    if (handCases.includes(cell)) {
                        lines.hand = k;
                    }
                    if (backsetCases.includes(cell)) {
                        lines.backset = k;
                    }
                    if (tailCases.includes(cell)) {
                        lines.tail = k;
                    }
                    if (keyIdCases.includes(cell)) {
                        lines.keyId = k;
                    }
                    if (remarksCases.includes(cell)) {
                        lines.remarks = k;
                    }

                }
            }
            if (j >= startingLine) {
                if (currentMap[j][lines.door] == undefined) break;
                if (numbers.includes(currentMap[j][lines.door].charAt(0))) {
                    let door = {};
                    for (let k = 0; k < currentMap[j].length; k++) {
                        let cell = currentMap[j][k];
                        if (lines.line == k) door.line = cell;
                        if (lines.door == k) door.door = cell;
                        if (lines.quantity == k) door.quantity = cell;
                        if (lines.brand == k) door.brand = cell;
                        if (lines.type == k) door.type = cell;
                        if (lines.finish == k) door.finish = cell;
                        if (lines.hand == k) door.hand = cell;
                        if (lines.backset == k) door.backset = cell;
                        if (lines.tail == k) door.tail = cell;
                        if (lines.keyId == k) door.keyId = cell;
                        if (lines.remarks == k) door.remarks = cell;
                    }
                    obj.doors.push(door);
                }
            }
        }

        newMaps.push(obj)
    }
    siteMaps = newMaps;
}
decodeSiteMaps();