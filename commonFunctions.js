function loadCombinedDatabase() {
    //let proceed = false;
    //if (compareCombinedDatabase === initialCombinedDatabase) {
    //    proceed = true;
    //} else {
    //    proceed = confirm("This will overwrite current personal database");
    //}
    //if (proceed) 
    //{
        let fileContents = "";
        let inputTypeIsFile = document.createElement('input');
        inputTypeIsFile.type = "file";
        inputTypeIsFile.accept = ".bof";
        inputTypeIsFile.addEventListener("change", function() {
            let inputFile = inputTypeIsFile.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) {
                fileContents = fileLoadedEvent.target.result;
                combinedDatabase = JSON.parse(fileContents);
                //compareCombinedDatabase = JSON.stringify(combinedDatabase);
                contactsTable = combinedDatabase["contacts"];
                calendarDatabase = combinedDatabase["calendar"];
                clearContactFormEntries(contactsTable);
                contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
                makeCalendar();
            };

            fileReader.readAsText(inputFile, "UTF-8");
        });
        inputTypeIsFile.click();
    //}

}

function saveCombinedDatabase() {
    purgeCalendar();
    let str = JSON.stringify(combinedDatabase);
    let baseFilename = "bitOfficePlanner" + getTodaysDate();
    saveStringToTextFile(str, baseFilename, ".bof");
    //compareCombinedDatabase = JSON.stringify(combinedDatabase);
}

function processGoToApp(theApp) {
    if ((theApp === 'contacts') || (theApp === 'calendar')) {
        compareCombinedDatabase = JSON.stringify(combinedDatabase);
    }
    if (theApp === 'tables') {
        compareTablesTable = JSON.stringify(tablesTable);
    }
    if (theApp === 'notes') {
        compareNoteValue = note.value;
    }
    if (theApp === 'write') {
        compareWriteData = makeCompareWriteData();
    }
    currentApp = theApp;
    document.getElementById('top-nav').style.display = "none";
    document.getElementById('back-nav').style.display = "flex";
}

function processGoBackFromApp(currentApp) {
    console.log("process check save for " + currentApp);
    if ((currentApp === "contacts") || (currentApp === "calendar")) {
        if (JSON.stringify(combinedDatabase) != compareCombinedDatabase) {
            if (confirm("The database has changed, save the changes to a file?")) {
                saveCombinedDatabase();
                compareCombinedDatabase = JSON.stringify(combinedDatabase);
            }
        }
    }
    if (currentApp === "tables") {
        updateDataFromCurrentInputs(tablesTable);
        if (JSON.stringify(tablesTable) != compareTablesTable) {
            if (confirm("The table has changed, save the changes to a file?")) {
                tablesSave();
                compareTablesTable = JSON.stringify(tablesTable);
            }
        }
    }
    if (currentApp === "notes") {
        if (note.value != compareNoteValue) {
            if (confirm("The note has changed, save the changes to a file?")) {
                notesSave();
                compareNoteValue = note.value;
            }
        }
    }
    if (currentApp === "write") {
        if (compareWriteData != makeCompareWriteData()) {
            if (confirm("The document has changed, save the changes to a file?")) {
                writeDataToJSON();
                compareWriteData = makeCompareWriteData();
            }
        }
    }
    document.getElementById('top-nav').style.display = "flex";
    document.getElementById('back-nav').style.display = "none";
    showMain("main-startup");
}


/*function downloadPageAsText(url, basename, suffix){
	let xhttp = new XMLHttpRequest();
	xhttp.timeout = 1000;
    xhttp.ontimeout = function(e) {
        alert("Request timed out.  Try again later");
    };
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		   saveStringToTextFile(xhttp.responseText, basename, suffix);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
	}
*/

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
function copyToClipBoard(str) {
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
    alert('Copied to Clipboard.');
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
    let csvString = "";
    let tempString = "";
    let headers = thisTable["headers"];
    if (saveWithHeader === true) {
        //fill in header from object
        for (let header of headers) {
            tempString = header.toString().split('"').join('""'); //any interior " needs to be replaced with ""
            csvString += "\"" + tempString + "\","; //surround each field with quotes
        }
        csvString = csvString.slice(0, -1) + "\n"; //remove last comma and add new line
    }
    //fill in body data
    let bodyData = thisTable["data"];
    let numberOfRows = bodyData.length;
    let numberOfColumns = headers.length;
    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            tempString = bodyData[i][headers[j]].toString().split('"').join('""'); //any interior " needs to be replaced with ""
            csvString += "\"" + tempString + "\","; //surround each field with quotes
        }
        csvString = csvString.slice(0, -1) + "\n"; //remove last comma and add new line
    }
    console.log(csvString);
    return (csvString);
}

//needs rewritten to match above format
/*
function readCSV(csvString, loadWithHeader = true) {
    //trim string
    csvString = csvString.trim();
    //make lines out of csvString
    let lines = csvString.split("\n");
    let newCSVArrayOfArrays = [];
    for (let i = 0; i < lines.length; i++) {
        //trim whitespace of each line
        lines[i] = lines[i].trim();
        //remove leading and trailing " character
        lines[i] = lines[i].slice(1, -1);
        //split by ","
        let tempRowArray = lines[i].split('","');
        //make randomString
        let randomString = tokenMaker(32);
        while (lines[i].includes(randomString) === true) { //tests to see if randomString already in line (seems unlikely)
            randomString = tokenMaker(32);
        };
        //join by a randome string (make real random string here)
        let newString = tempRowArray.join(randomString);
        //look for the double quotes around randomString that is where the "," ie "","" (CSV convention) was
        newString = newString.split('"' + randomString + '"').join('","');
        //split by randomString without the quotes
        tempRowArray = newString.split(randomString);
        //for each element in the row of elements, replace the "" with " CSV convention
        for (let j = 0; j < tempRowArray.length; j++) {
            tempRowArray[j] = tempRowArray[j].split('""').join('"');
        }
        newCSVArrayOfArrays.push(tempRowArray); //add each row to the new array
    }
    //console.log(newCSVArrayOfArrays); //now we have a straight array of arrays of strings in a csv style grid
    //convert to headers and data.
    let headers = [];
    let data = [];
    if (newCSVArrayOfArrays.length > 0) {
        if (loadWithHeader === true) {
            headers = newCSVArrayOfArrays[0];
            if (newCSVArrayOfArrays.length > 1) {
                for (let i = 1; i < newCSVArrayOfArrays.length; i++) { //loop through rows
                    let tempRow = {};
                    for (let j = 0; j < newCSVArrayOfArrays[i].length; j++) { //loop through cells in rows
                        tempRow[headers[j]] = newCSVArrayOfArrays[i][j];
                    }
                    data.push(tempRow);
                }
            }
        } else {
            if (newCSVArrayOfArrays.length > 0) {
                for (let j = 0; j < newCSVArrayOfArrays[0].length; j++) {
                    headers.push("Column " + (j + 1).toString());
                }
                for (let i = 0; i < newCSVArrayOfArrays.length; i++) { //loop through rows
                    let tempRow = {};
                    for (let j = 0; j < newCSVArrayOfArrays[i].length; j++) { //loop through cells in rows
                        tempRow[headers[j]] = newCSVArrayOfArrays[i][j];
                    }
                    data.push(tempRow);
                }
            }
        }
    }

    let finalTable = {};
    finalTable["headers"] = headers;
    finalTable["data"] = data;
    console.log(JSON.stringify(finalTable));
    return JSON.parse(JSON.stringify(finalTable));
}
* */

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
    if (confirm("Include header as first line in csv file?")) {
        thisCSV = makeCSV(table, true);
    } else {
        thisCSV = makeCSV(table, false);
    }
    copyToClipBoard(thisCSV);
    if (confirm("Table copied to CSV.\n\nSave to file also?")) {
        saveStringToTextFile(thisCSV, table["name"] + getTodaysDate(), ".csv");
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
