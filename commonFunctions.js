

function saveStringToTextFile(str1, basename = "myfile", fileType = ".txt") {
        let filename = basename + fileType;
        let blobVersionOfText = new Blob([str1], {
            type: "text/plain"
        });
        let urlToBlob = window.URL.createObjectURL(blobVersionOfText);
        let downloadLink = document.createElement("a");
        downloadLink.style.display = "none";
        downloadLink.download = filename;
        downloadLink.href = urlToBlob;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.parentElement.removeChild(downloadLink);
}

function copyAndSaveString(str1, basename = "myfile", fileType = ".txt") {
    copyToClipBoard(str1, false);
    if (confirm("Copied to clipboard, save to file also?")){
        saveStringToTextFile(str1,basename,fileType);
    }
}


//Date related functions for convience, uses same format as input type="date"
function getTodaysDate() {
    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let today = now.getFullYear() + "-" + month + "-" + day;
    return today;
}

function getFirstDayOfThisMonthDate() {
    let now = new Date();
    let day = "01";
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear() + "-" + month + "-" + day;
}

function getLastDayOfThisMonthDate() {
    let now = new Date();
    let day = daysInThisMonth().toString();
    day = "0" + day;
    day = day.slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear() + "-" + month + "-" + day;
}

function daysInSomeMonth(someMonth, someYear) { //use jan month is 0
    return new Date(someYear, someMonth + 1, 0).getDate();
}

function daysInThisMonth() {
    thisDate = new Date();
    thisMonth = thisDate.getMonth();
    thisYear = thisDate.getYear();
    return daysInSomeMonth(thisMonth, thisYear);
}

function getDayOfWeek(isoYearMonthDay) {
    let d = new Date(isoYearMonthDay + "T00:00");
    return d.getDay(); //zero based day
}

///////////////// serialize to web page //////////////////////

function serializeElementToPage(id, extraStyle = "") {
    let boilerPlate1 = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title></title><style>";

    let allStyleTags = document.getElementsByTagName('style');

    let styleElementContent = "";
    for (let i = 0; i < allStyleTags.length; i++) {
        styleElementContent = allStyleTags[i].innerHTML;
    }
    let boilerPlate2 = "</style></head><body>";
    let boilerPlate3 = "</body></html>";
    let s = new XMLSerializer();
    let myElement = document.getElementById(id);
    let str = s.serializeToString(myElement);
    let htmlPage = boilerPlate1 + styleElementContent + extraStyle + boilerPlate2 + str + boilerPlate3;
    console.log(htmlPage);
    return htmlPage;
}

function simulateUndo() {
    document.execCommand('undo', false, null);
}

function simulateRedo() {
    document.execCommand('redo', false, null);
}

function askConfirm() {
    return "Did you remember to save your data?";
}

//page navigation//

function showMain(id) {
    //console.log("show mains called with " + id);
    let mains = document.getElementsByTagName('main');
    for (let main of mains) {
        main.style.display = "none";
    }
    document.getElementById(id).style.display = "flex";
}

//          clipboard function          //
function copyToClipBoard(str, message=true) {
    //https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
    let el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {
        position: 'absolute',
        left: '-9999px'
    };
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (message){
        alert('Copied to Clipboard.');
    }
    return (str);
}


//  "Table" related functions where tables have data (array of objects) and header (array)
function fillInEmptyPropertyValues(table) {
    let data = table["data"];
    let headers = table["headers"];
    for (let i = 0; i < data.length; i++) { //fill in empty property values;
        for (let j = 0; j < headers.length; j++) {
            if (data[i][headers[j]] === undefined) {
                data[i][headers[j]] = "";
            }
        }
    }
}

//              CSV related functions                   //
function makeCSV(thisTable, saveWithHeader = true) { ////This one fixed
    return JSONToCSV(thisTable, saveWithHeader ,"\n");
    // let csvString = "";
    // let tempString = "";
    // let headers = thisTable["headers"];
    // if (saveWithHeader === true) {
    //     //fill in header from object
    //     for (let header of headers) {
    //         tempString = header.toString().split('"').join('""'); //any interior " needs to be replaced with ""
    //         csvString += "\"" + tempString + "\","; //surround each field with quotes
    //     }
    //     csvString = csvString.slice(0, -1) + "\n"; //remove last comma and add new line
    // }
    // //fill in body data
    // let bodyData = thisTable["data"];
    // let numberOfRows = bodyData.length;
    // let numberOfColumns = headers.length;
    // for (let i = 0; i < numberOfRows; i++) {
    //     for (let j = 0; j < numberOfColumns; j++) {
    //         tempString = bodyData[i][headers[j]].toString().split('"').join('""'); //any interior " needs to be replaced with ""
    //         csvString += "\"" + tempString + "\","; //surround each field with quotes
    //     }
    //     csvString = csvString.slice(0, -1) + "\n"; //remove last comma and add new line
    // }
    // console.log(csvString);
    // return (csvString);
}



function tokenMaker(intSize) {
    let token = "";
    let specialString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let index = 0;
    for (let i = 0; i < intSize; i++) {
        token += specialString[Math.floor(Math.random() * specialString.length)];
    }
    console.log(token);
    return token;
}

function processCSVClick(table) {
    let thisCSV = "";
    //if (confirm("Include header as first line in csv file?")) {
        thisCSV = makeCSV(table, true);
    //} else {
    //    thisCSV = makeCSV(table, false);
    //}
    copyToClipBoard(thisCSV);
    if (confirm("Table copied to CSV.\n\nSave to file also?")) {
        copyAndSaveString(thisCSV, table["name"] + getTodaysDate(), ".csv");
    }
}

//              sort array by field
function destructiveSort(arrayOfObjects, field, direction = 1) {
    //direction -1 is descending, otherwise ascending
    if (direction != -1) { direction = 1; }
    arrayOfObjects.sort((a, b) => {
        if (a[field] < b[field]) {
            return -1 * direction;
        }
        if (a[field] > b[field]) {
            return 1 * direction;
        }
        return 0;
    });
}

function destructiveDoubleSortAscending(arrayOfObjects,date,time){
    arrayOfObjects.sort((a, b) => {
        if (a[date] > b[date]) {
            return 1;
        }
        else if (a[date] < b[date]) {
            return -1;
        }
        if (a[time] > b[time]) {
            return 1;
        }
        else if (a[time] < b[time]) {
            return -1;
        }
        return 0;
    });
}
// function sortF(ob1,ob2) {
//     if (ob1.strength > ob2.strength) {
//         return 1;
//     } else if (ob1.strength < ob2.strength) { 
//         return -1;
//     }

//     // Else go to the 2nd item
//     if (ob1.name < ob2.name) { 
//         return -1;
//     } else if (ob1.name > ob2.name) {
//         return 1
//     } else { // nothing to split them
//         return 0;
//     }
// }

function makeFavicon(letter, color, backgroundColor) {
    //put this in head of html document
    //<link id="favicon-link" rel="icon" type="image/x-icon" href="">
    let canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    let ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, 16, 16);

    let ctx2 = canvas.getContext("2d");
    ctx2.fillStyle = color;
    ctx2.font = "bold 12px Arial";
    ctx2.fillText(letter, 4, 12);

    let link = document.getElementById("favicon-link");
    link.href = canvas.toDataURL("image/x-icon");
}
