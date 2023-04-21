let license = "MIT License\n\n\
Copyright (c) 2022 Gary Davenport\n\n\
Permission is hereby granted, free of charge, to any person obtaining a copy \
of this software and associated documentation files (the \"Software\"), to deal \
in the Software without restriction, including without limitation the rights \
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell \
copies of the Software, and to permit persons to whom the Software is \
furnished to do so, subject to the following conditions:\n\n\
The above copyright notice and this permission notice shall be included in all \
copies or substantial portions of the Software.\n\n\
THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR \
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, \
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE \
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER \
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, \
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE \
SOFTWARE.";

//------------------contacts and calendar database ----------------------
let contactsTableElement = document.getElementById("contacts-table");
let contactsEditForm = document.getElementById("contacts-edit-form");
let contactsEditFormMessage = document.getElementById("contacts-edit-form-message");
let contactsSortAscending = 1;

let contactsTable = {
    "name": "Contacts",
    "headers": ["First Name","Middle Name","Last Name","Mobile Phone","Home Phone","Business Phone","E-mail Address","Home Address", "Notes"],
    "inputTypes": {
        "First Name": "text",
        "Middle Name": "text",
        "Last Name": "text",
        "Mobile Phone": "tel",
        "Home Phone": "tel",
        "Business Phone": "tel",
        "E-mail Address": "email",
        "Home Address": "textarea",
        "Notes": "textarea"
    },
    "data": []
}

//----------------calendar-------------------------
let calendarTable = document.getElementById("calendar-table");
let calendarEditForm = document.getElementById("calendar-edit-form");
let calendarEditFormMessage = document.getElementById("calendar-edit-form-message");
let monthChooser = document.getElementById("month-chooser");
let daysAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
let calendarSortAscending = 1;

let calendarDatabase = {
    "name": "Calendar",
    "headers": ["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description"],
    "inputTypes": {
        "Subject": "text",
        "Start Date": "date",
        "Start Time": "time",
        "End Date":"date",
        "End Time": "time",
        "Description": "textarea"
    },
    "data":[]
}

//	COMBINED DATABASE

let combinedDatabase = {
    "contacts": contactsTable,
    "calendar": calendarDatabase
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                                                //
// FUNCTION NAME                                       				INPUT                                           OUTPUT                                        //
// csvToArrays(csvString)                              				csv                                             array of arrays                               //
// arraysToCSV(arrayOfArrays,newLineString="\n")       				array of arrays, "\n" or "\r\n"                 csv                                           //
// arraysToJSON(arrays, usingHeaders)                  				array of arrays                                 JSON {["headers"]=[],["data"]=[{},{},{}...]}  //
// JSONToArrays(jsonObject, includeHeaders)            				JSON {["headers"]=[],["data"]=[{},{},{}...]}    array of arrays                               //
// unorderdJSONToArrays(jsonObject,includeHeaders)     				JSON [{"key":"value"},{k:v},...]                array of arrays                               //
//                                                                                                                                                                //
// COMPOSITE FUNCTIONS:                                                                                                                                           //
// csvToJSON(csvString, usingHeaders)                  				csv                                             JSON {["headers"]=[],["data"]=[{},{},{}...]}  //                                        
// JSONToCSV(jsonObject, includeHeaders=true,newLineString="\n")	JSON {["headers"]=[],["data"]=[{},{},{}...]}    csv                                           //
// unorderedJSONToCSV(jsonObject, includeHeaders)      				JSON [{"key":"value"},{k:v},...]                csv                                           //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function _replaceReallCommmasInCSV(contents, commaReplacement) {

    //temp fix
    //contents=contents.split("\r\n").join("\n");
    //temp fix
    let newContents = "";
    let inside = -1;
    for (let i = 0; i < contents.length; i++) {
        let thisChar = contents.charAt(i);
        if (thisChar === '"') {
            inside = inside * -1;
            newContents += thisChar;
        }
        else if (thisChar === ",") {
            if (inside === -1) {//comma is outside of quotes, replace
                newContents += commaReplacement;
            }
            else {//comma is inside of quotes, don't replace
                newContents += thisChar;
            }
        }
        // else if (thisChar === "\n") {
        //     if (inside === -1) {//\n is outside of quotes, replace
        //         newContents += newlineReplacement;
        //     }
        //     else {//comma is inside of quotes, don't replace
        //         newContents += thisChar;
        //     }
        // }
        else {
            newContents += thisChar;
        }
    }
    return (newContents);
}

function _replaceRealNewlinesInCSV(contents, newLineReplacement) {
    //temp fix
    //contents=contents.split("\r\n").join("\n");
    //temp fix
    let newContents = "";
    let inside = -1;
    for (let i = 0; i < contents.length; i++) {
        let thisChar = contents.charAt(i);
        if (thisChar === '"') {
            inside = inside * -1;
            newContents += thisChar;
        }
        // else if (thisChar === ",") {
        //     if (inside === -1) {//comma is outside of quotes, replace
        //         newContents += commaReplacement;
        //     }
        //     else {//comma is inside of quotes, don't replace
        //         newContents += thisChar;
        //     }
        // }
        else if (thisChar === "\n") {
            if (inside === -1) {//\n is outside of quotes, replace
                newContents += newLineReplacement;
            }
            else {//comma is inside of quotes, don't replace
                newContents += thisChar;
            }
        }
        else {
            newContents += thisChar;
        }
    }
    return (newContents);
}



function _replaceRealCommasAndRealNewlinesInCSV(contents, commaReplacement, newlineReplacement) {
    //temp fix
    //contents=contents.split("\r\n").join("\n");
    //temp fix
    let newContents = "";
    let inside = -1;
    for (let i = 0; i < contents.length; i++) {
        let thisChar = contents.charAt(i);
        if (thisChar === '"') {
            inside = inside * -1;
            newContents += thisChar;
        }
        else if (thisChar === ",") {
            if (inside === -1) {//comma is outside of quotes, replace
                newContents += commaReplacement;
            }
            else {//comma is inside of quotes, don't replace
                newContents += thisChar;
            }
        }
        else if (thisChar === "\n") {
            if (inside === -1) {//\n is outside of quotes, replace
                newContents += newlineReplacement;
            }
            else {//comma is inside of quotes, don't replace
                newContents += thisChar;
            }
        }
        else {
            newContents += thisChar;
        }
    }
    //new added this will replace the "\r\n" with "\n", some programs
    //use the \r\n (ms outlook for example) instead of \n
    //newContents=JSON.stringify(newContents);
    //newContents.split("\"\r"+newlineReplacement).join(newlineReplacement);
    //newContents=JSON.parse(newContents);
    return (newContents);
}


function tokenMaker(intSize) {
    let token = "";
    let specialString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < intSize; i++) {
        token += specialString[Math.floor(Math.random() * specialString.length)];
    }
    //console.log(token);
    return token;
}

//Works with earlier versions of NodeJS and anywhere replaceAll not available
//from: https://stackoverflow.com/questions/62825358/javascript-replaceall-is-not-a-function-type-error
//author: https://stackoverflow.com/users/9513184/unmitigated
//Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function myReplaceAll(str, match, replacement) {
    return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
}


function getTokenNotInString(myString, intSize = 16) {
    let token = tokenMaker(16);
    while (myString.indexOf(token) !== -1) {
        token = tokenMaker(16);
    }
    return token;
}
function csvToArrays(CSVString) {
    // CSVString.split("\r\n").join("\n");
    // CSVString.split("\r\n").join("\n");
    //CSVString = myReplaceAll(CSVString,"\r\n", "\n");

    CSVString=CSVString.trim();

    let carriageReturnToken = getTokenNotInString(CSVString);
    CSVString = CSVString.split("\r").join(carriageReturnToken);
    CSVString = CSVString.split(carriageReturnToken + "\n").join("\n");

    let myArray = []; //initialization
    CSVString = CSVString.trim();

    let commaToken = getTokenNotInString(CSVString);

    CSVString = _replaceReallCommmasInCSV(CSVString, commaToken);

    let newlineToken = getTokenNotInString(CSVString);
    //find a string that is not present in CSV for using as temporary tag
    //while (CSVString.indexOf(newlineToken) !== -1) {
    //    newlineToken = tokenMaker(16);
    //}

    CSVString = _replaceRealNewlinesInCSV(CSVString, newlineToken);
    /////////////REALLY should be doing one string replacement at a time, not 2

    //CSVString = _replaceRealCommasAndRealNewlinesInCSV(CSVString, commaToken, newlineToken);

    let lines = CSVString.split(newlineToken);

    for (let i = 0; i < lines.length; i++) {
        //an array of cells from row in csv line
        //it contains the quotes and is formatted with double quotes
        let rowArray = lines[i].split(commaToken);
        for (let j = 0; j < rowArray.length; j++) {

            //remove outer quotes if present
            if (rowArray[j][rowArray[j].length - 1] === '"') {
                rowArray[j] = rowArray[j].slice(0, rowArray[j].length - 1);
            }
            if (rowArray[j][0] === '"') {
                rowArray[j] = rowArray[j].slice(1, rowArray[j].length);
            }
            //replace double inner quotes with singles
            rowArray[j] = rowArray[j].split('""').join('"');
        }
        myArray.push(rowArray);
    }
    return myArray;
}

function arraysToCSV(arrayOfArrays, newLineString = "\n") {
    let CSVString = "";
    //go through each 'line'
    for (let i = 0; i < arrayOfArrays.length; i++) {
        //go through each csv cell and build line
        for (let j = 0; j < arrayOfArrays[i].length; j++) {
            CSVString += '"';
            CSVString += arrayOfArrays[i][j].split('"').join('""');
            CSVString += '",'
        }
        CSVString = CSVString.slice(0, -1) + newLineString; //takes off last comma and adds new line
    }
    CSVString = CSVString.slice(0, -(newLineString.length)); //takes off last \n character
    return CSVString;
}

function arraysToJSON(arrayOfArrays, usingHeaders = true) {
    let headers = [];
    let data = [];
    let table = {};
    if (usingHeaders === true) {                                //read in headers
        for (let i = 0; i < arrayOfArrays[0].length; i++) {
            let header = arrayOfArrays[0][i];
            let index = 0;
            while (headers.includes(header)) {                  //prevents duplicates
                console.log("WARNING - Duplicate header found: " + header);
                index += 1;
                header = header + index.toString();
                console.log("Attempting rename to: " + header);
            }
            headers.push(header);
        }
    } else {
        for (let i = 0; i < arrayOfArrays[0].length; i++) {     //make headers
            headers.push("header" + i.toString());
        }
    }
    if (usingHeaders === true) {
        startRow = 1;
    }
    else {
        startRow = 0;
    }
    for (let i = startRow; i < arrayOfArrays.length; i++) {//go throught every line
        let tempRow = {};
        for (let j = 0; j < headers.length; j++) {
            tempRow[headers[j]] = arrayOfArrays[i][j];
        }
        // console.log(tempRow);
        data.push(tempRow);
    }
    table["headers"] = headers;
    table["data"] = data;
    // console.log(JSON.stringify(table))
    return (table);
}

function JSONToArrays(jsonObject, includeHeaders = true) {
    let headers = jsonObject["headers"];
    let data = jsonObject["data"];
    let arrayOfArrays = [];
    if (includeHeaders === true) {
        let row = [];
        for (let i = 0; i < headers.length; i++) {
            row.push(headers[i].toString());
        }
        arrayOfArrays.push(row);
    }
    for (i = 0; i < data.length; i++) {
        let row = [];
        for (let j = 0; j < headers.length; j++) {
            if (data[i][headers[j]] === undefined) {
                row.push("");
            }
            else {
                row.push(data[i][headers[j]].toString());
            }
        }
        arrayOfArrays.push(row);
    }
    return (arrayOfArrays);
}

function unorderedJSONToArrays(jsonObject, includeHeaders = true) {
    //takes an array of objects [{},{},{}] where objects have key/value pairs
    let newObject = {};
    newObject["data"] = jsonObject;
    let headers = [];
    for (rowObject of jsonObject) { //rows of objects
        for (const key in rowObject) {
            if (!headers.includes(key)) {
                headers.push(key.toString());
            };
        }
    }
    newObject["headers"] = headers;
    return JSONToArrays(newObject, includeHeaders);
}

//COMPOSITE FUNCTIONS
function csvToJSON(csvString, usingHeaders = true) {
    let arrays = csvToArrays(csvString);
    let jsonObject = arraysToJSON(arrays, usingHeaders);
    return jsonObject;
}

function JSONToCSV(jsonObject, includeHeaders = true, newLineString = "\n") {
    let arrays = JSONToArrays(jsonObject, includeHeaders);
    let csvString = arraysToCSV(arrays, newLineString);
    return csvString;
}

function unorderedJSONToCSV(jsonObject, includeHeaders = true) {
    let arrays = unorderedJSONToArrays(jsonObject, includeHeaders);
    let csvString = arraysToCSV(arrays);
    return csvString;
}function loadCombinedDatabase() {
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

                //when data is loaded in or changed, sort value is added and calendar always sorted
                //addSortValueToCalendarData();
                //destructiveSort(calendarDatabase["data"], "sort value");
                ////////////////////
                
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
function showPlannerDiv(id) {
    //console.log("show mains called with " + id);
    let divs = document.getElementsByClassName('planner-div');
    for (let div of divs) {
        div.style.display = "none";
    }
    document.getElementById(id).style.display = "unset";
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
    //if (confirm("Include header as first line in csv file?")) {
        thisCSV = makeCSV(table, true);
    //} else {
    //    thisCSV = makeCSV(table, false);
    //}
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
initializeCalendarApp();

function initializeCalendarApp() {
    monthChooser.addEventListener("input", makeCalendar);
    monthChooser.addEventListener("change", makeCalendar);
    monthChooser.value = getTodaysDate().slice(0, -3);
    console.log(getTodaysDate().slice(0, -3));
    makeCalendar();
}

function processCalendarHome() {
    makeCalendar();
    showPlannerDiv("planner-calendar-start");
}

function processCalendarCSVClick() {
    let date = document.getElementById("calendar-date").value;;
    let tempTable = {};
    tempTable["data"] = [];

    for (let i = 0; i < calendarDatabase["data"].length; i++) {
        if (
            (date === calendarDatabase["data"][i]["Start Date"]) ||
            (date === calendarDatabase["data"][i]["End Date"]) ||
            ((date >= calendarDatabase["data"][i]["Start Date"]) && (date <= calendarDatabase["data"][i]["End Date"]))
        ) {

            tempTable["data"].push(calendarDatabase["data"][i]);
        }
    }

    tempTable["headers"] = calendarDatabase["headers"];
    //tempTable["data"] = calendarDatabase["data"];
    
    tempTable=JSON.parse(JSON.stringify(tempTable));
    
    tempTable["name"] = "Calendar";

    //destructiveSort(tempTable["data"], "Start Time");
    processCSVClick(tempTable);
}

function buildCalendarTableElement(date) { //needs headers data


    //first go through all entries in the calendars dates
    //if they meet the criteria, push them to an array, and add on their location/index in the base array
    //order the array by start time
    //use the array to build the table element
    //(make sure the element contains the index)

    let allRows=calendarDatabase["data"];
    let filteredRows=[];
    let numberOfColumns = calendarDatabase["headers"].length;
    //let numberOfRows = daysEntries.length;

    for (let i = 0; i < allRows.length; i++) {
        if (
            (date === allRows[i]["Start Date"]) ||
            (date === allRows[i]["End Date"]) ||
            ((date >= allRows[i]["Start Date"]) && (date <= allRows[i]["End Date"]))
        ) {
            let tempRow=JSON.parse(JSON.stringify(allRows[i]));
            tempRow["intBaseIndex"]=i;
            filteredRows.push(tempRow);
            //for (let i = 0; i < numberOfRows; i++) {
        }

    }

    destructiveSort(filteredRows,"Start Time");

    //start table

    let tableElement = "";
    tableElement += "<table>";

    //build table header
    tableElement += "<thead><tr>";
    for (let j = 0; j < numberOfColumns; j++) {
        tableElement += "<th onclick='//sortCalendarByField(this);'>" + calendarDatabase["headers"][j] + "</th>";
    }
    tableElement += "</tr></thead>";
    //build table body	
    tableElement += "<tbody>";

    for (let i = 0; i < filteredRows.length; i++) {
        // if (
        //     (date === filteredRows[i]["Start Date"]) ||
        //     (date === filteredRows[i]["End Date"]) ||
        //     ((date >= filteredRows[i]["Start Date"]) && (date <= filteredRows[i]["End Date"]))
        // ) 
            {
            
            //for (let i = 0; i < numberOfRows; i++) {
            tableElement += "<tr id='calendar-table-row-" + i.toString() + "' onclick=\"selectCalendarEditForm(" + (filteredRows[i]["intBaseIndex"]).toString() + ")\">";
            for (let j = 0; j < numberOfColumns; j++) {
                let fieldName = calendarDatabase["headers"][j];
                tableElement += "<td><pre>" + filteredRows[i][fieldName] + "</pre></td>";
            }
            tableElement += "</tr>";
            //}

        }

    }

    tableElement += "</tbody>";

    return tableElement;


    //destructiveSort(calendarDatabase["dates"][date]["data"], calendarDatabase["headers"][0]); //sort by start time

    //let daysEntries = calendarDatabase["dates"][date]["data"];

}

function newCalendarEntry(table) {
    //show what's being edited
    calendarEditFormMessage.innerHTML = document.getElementById("calendar-date").value + ": New Entry";
    calendarEditForm.innerHTML = buildCalendarEditForm(-1);
    showPlannerDiv("planner-calendar-form")
}

function selectCalendarEditForm(calendarDatabaseRowIndex) {
    //show what's being edited
    calendarEditFormMessage.innerHTML = document.getElementById("calendar-date").value + ": Entry " + calendarDatabaseRowIndex.toString();
    calendarEditForm.innerHTML = buildCalendarEditForm(calendarDatabaseRowIndex);
    showPlannerDiv("planner-calendar-form");
}

function buildCalendarEditForm(index) {
    let date = document.getElementById("calendar-date").value;


    let thisEntry = calendarDatabase["data"][index];


    let editForm = "";
    editForm += "<form>";
    editForm = "<input type='hidden' id='calendar-row-index' value='" + index.toString() + "'>";
    let numberOfColumns = calendarDatabase["headers"].length;
    let headers = calendarDatabase["headers"];
    let row = thisEntry;
    let inputTypes = calendarDatabase["inputTypes"];

    //make blank form
    for (let j = 0; j < numberOfColumns; j++) {
        let extraString = "";
        if (inputTypes[headers[j]] === "number") {
            extraString = " step='any' ";
        } else if (inputTypes[headers[j]] === "tel") {
            extraString = " placeholder='304-424-1000' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' ";
        }
        if ((headers[j] === "Start Date") && (index === -1)) { extraString = "value=" + date };
        if ((headers[j] === "End Date") && (index === -1)) { extraString = "value=" + date };
        if (inputTypes[headers[j]] != "textarea") {
            console.log("not textarea")
            if (index === -1) { //adding new
                editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='" + headers[j] + "' " + extraString + "></div>";
            } else { //editing existing
                editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='" + headers[j] + "' value='" + row[headers[j]].split("\"").join("&quot;").split("\'").join("&apos;") + "'" + extraString + "></div>";
            }
        } else {
            console.log("textarea!")
            if (index === -1) { //adding new
                editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label></div><div><textarea id='" + headers[j] + "' " + extraString + "></textarea></div>";
            } else { //editing existing
                let textAreaContents=row[headers[j]].split("\"").join("&quot;").split("\'").join("&apos;");
                console.log(textAreaContents);
                editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label></div><div><textarea id='" + headers[j] + "' " + extraString + ">"+textAreaContents+"</textarea></div>";
            }

        }

    }
    editForm += "</form>";
    return editForm;
}

function saveCalendarEntry() {
    let index = parseInt(document.getElementById("calendar-row-index").value);
    let date = document.getElementById("calendar-date").value;
    let headers = calendarDatabase["headers"];
    let row = {};
    //make a row to add onto array of entries
    //or
    //make a row to update the array
    for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = document.getElementById(headers[j]).value;
    }


    //if ((row["start date"]==="") || (row["start"]==="")){
    //	row["sort value"]="";
    //}
    //else{
    //	row["sort value"]=row["start date"]+row["start"];
    //}


    //insist start date exists
    if (row["Start Date"] === "") {
        row["Start Date"] = date;
    }
    if (row["Start Time"] === "") {
        row["Start Time"] = "00:00";
    }
    //row["sort value"] = row["Start Date"] + row["Start Time"];
    //console.log(row);


    if (index >= 0) { //an existing entry
        calendarDatabase["data"][index] = row;
    } else { // a new entry
        calendarDatabase["data"].push(row);
    }
    clearCalendarFormEntries();

    //destructiveSort(calendarDatabase["data"], "sort value");

    calendarTable.innerHTML = buildCalendarTableElement(date);


    showPlannerDiv("planner-calendar-table");
}

function purgeCalendar() {
    //let dates = calendarDatabase["dates"];
    //for (let date in dates) {
    //    console.log(date);cancelCalend
    //    console.log(dates[date]["data"]);
    //    console.log(dates[date]["data"].length);
    //    if (dates[date]["data"].length === 0) {
    //        delete dates[date];
    //    }
    //}
}

function deleteCalendarEntry() {
    let index = parseInt(document.getElementById("calendar-row-index").value);
    let date = document.getElementById("calendar-date").value;
    if (index >= 0) { //editing an entry
        if (confirm("Delete this entry?")) {
            calendarDatabase["data"].splice(index, 1);
        }
    }
    clearCalendarFormEntries();
    calendarTable.innerHTML = buildCalendarTableElement(date);
    showPlannerDiv("planner-calendar-table");
}

function cancelCalendarEntry() {
    let date = document.getElementById("calendar-date").value;
    clearCalendarFormEntries();
    calendarTable.innerHTML = buildCalendarTableElement(date);
    showPlannerDiv("planner-calendar-table");
}

function clearCalendarFormEntries() {
    let headers = calendarDatabase["headers"];
    for (let j = 0; j < headers.length; j++) {
        document.getElementById(headers[j]).value = "";
    }
    document.getElementById("calendar-row-index").value = -1;
    calendarEditFormMessage.innerHTML = "";
}

function sortCalendarByField(clickedHeaderElement) {
    let date = document.getElementById("calendar-date").value;
    let field = clickedHeaderElement.innerHTML;
    if (calendarDatabase["dates"][date]["data"].length > 1) { //don't sort if less than 2 rows.
        if (confirm("Sort by " + clickedHeaderElement.innerHTML + "?")) {
            destructiveSort(calendarDatabase["dates"][date]["data"], field, calendarSortAscending);
            calendarTable.innerHTML = buildCalendarTableElement(date);
            calendarSortAscending = -1 * calendarSortAscending;
        };
    }
}

function makeCalendar() {
    console.log("--------------------");
    console.log(monthChooser.value);
    console.log("--------------------");

    let d = new Date(monthChooser.value + "-01T00:00");
    let startDayIndex = d.getDay(); //zero based day
    let monthToUse = parseInt(monthChooser.value.split("-")[1]) - 1;
    let yearToUse = parseInt(monthChooser.value.split("-")[0]);
    let daysInMonth = daysInSomeMonth(monthToUse, yearToUse);

    let calendarString = "<table>";
    //header
    calendarString += "<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>";

    //start rows
    calendarString += "<tr>";

    //blank days
    //so start day is the number of loops to do conincidentally
    for (let i = 0; i < startDayIndex; i++) {
        console.log("x", daysAbbreviations[i]);
        calendarString += "<td>" + "-" + "</td>";
    }

    //days
    for (let i = 0; i < daysInMonth; i++) {
        let thisDate = i + 1; //date 1 indexed
        let thisDayOfWeek = daysAbbreviations[(i + startDayIndex) % 7];
        if ((i + startDayIndex) % 7 === 0) {
            console.log("--------new line ----------");
            calendarString += "</tr><tr>"
        }
        calendarString += "<td class='return-calendar-date'>" + (i + 1).toString() + "</td>";
        //console.log(thisDate, thisDayOfWeek);
    }

    //blank days at end
    //find out what day of week last day is on
    let lastDayIndex = (daysInMonth - 1 + startDayIndex) % 7;
    let blankSpacesRemaining = 6 - lastDayIndex;
    for (let i = 0; i < blankSpacesRemaining; i++) {
        //console.log("x", daysAbbreviations[lastDayIndex + 1 + i]);
        calendarString += "<td>" + "-" + "</td>";
    }
    calendarString += "</tr></table>";

    document.getElementById('special-calendar').innerHTML = calendarString;
    addEventListenersToCalendarEntries();
    purgeCalendar();
    colorCalendarEntries();
    return calendarString;

}

function addEventListenersToCalendarEntries() {
    let calendarEntries = document.getElementsByClassName('return-calendar-date');
    for (let entry of calendarEntries) {
        entry.addEventListener("click", (evt) => { openDayEntry(evt) });
    }
}

function openDayEntry(evt) {
    //add "0" to date then slice -2 to ensure leading 0
    let theDate = monthChooser.value + "-" + ("0" + evt.target.innerHTML).slice(-2);
    document.getElementById("calendar-date").value = theDate;
    if (theDate === "") {
        return;
    }


    //go through

    //check to see if year entry is in database, if needed make entry
    //if (calendarDatabase["dates"][theDate] === undefined) {
    //    calendarDatabase["dates"][theDate] = {};
    //    calendarDatabase["dates"][theDate]["data"] = [];
    //}

    document.getElementById("calendar-table-name").innerHTML = daysAbbreviations[getDayOfWeek(theDate)] + " " + theDate + "</span>";
    calendarTable.innerHTML = buildCalendarTableElement(theDate);
    showPlannerDiv("planner-calendar-table");
}

function colorCalendarEntries() {
    purgeCalendar();
    let calendarEntries = document.getElementsByClassName('return-calendar-date');
    for (let entry of calendarEntries) {
        entry.style["backgroundColor"] = "#E0E0E0;";
        let thisDate = monthChooser.value + "-" + ("0" + entry.innerHTML).slice(-2);
        //go through all entries in the calendar data
        for (let i = 0; i < calendarDatabase["data"].length; i++) {
            //if thisDate === calendar entry start date, color darkorange
            //if thisDate === calendar entry end date, color darkorange
            //if thisDate >= calendar entry start date and thisDate <= end date, color darkorange
            if (
                (thisDate === calendarDatabase["data"][i]["Start Date"]) ||
                (thisDate === calendarDatabase["data"][i]["End Date"]) ||
                ((thisDate >= calendarDatabase["data"][i]["Start Date"]) && (thisDate <= calendarDatabase["data"][i]["End Date"]))
            ) {
                entry.style["backgroundColor"] = "darkorange";
            }
        }

        //need to change,
        // go through all dates
        //if (calendarDatabase["dates"][thisDate] === undefined) { 
        //    entry.style["backgroundColor"] = "#E0E0E0;";
        //} else {
        //    entry.style["backgroundColor"] = "darkorange";
        //}

        if (getTodaysDate() === thisDate) {
            entry.style["border"] = "1px solid grey";
            entry.style["font-weight"] = "bold";
            //entry.style["backgroundColor"] = "yellow";
        }
    }
}



function createOutlookCSV(){
	let outlookCSV=JSONToCSV(calendarDatabase,true,"\r\n");
	console.log(outlookCSV);
	copyToClipBoard(outlookCSV);
    if (confirm("Table copied to CSV.\n\nSave to file also?")) {
        saveStringToTextFile(outlookCSV, "plannerToOutlookExport" + getTodaysDate(), ".csv");
	}
}
	
function loadOutlookCSV(){
	if (confirm("This will add entries to the existing current calendar.\n\nIf you want to over-write all contents, please clear the calendar first, then proceed with loading the data."))
	{
	let fileContents = "";
	let inputTypeIsFile = document.createElement('input');
	inputTypeIsFile.type = "file";
	inputTypeIsFile.accept = ".csv";
	inputTypeIsFile.addEventListener("change", function() {
		let inputFile = inputTypeIsFile.files[0];
		let fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) {
			fileContents = fileLoadedEvent.target.result;
			
			console.log(fileContents);

			let outlookCSVObject=csvToJSON(fileContents);
			console.log(outlookCSVObject);

			let outlookData=outlookCSVObject["data"];
			let headers=calendarDatabase["headers"];
			let outlookHeaders=outlookCSVObject["headers"];
			
			
			//original method
			//for (let i=0;i<outlookData.length;i++){
			//	let row={};
			//	console.log(outlookData[i]);
			//	for (let j=0;j<headers.length;j++){
			//		if ((headers[j]==="Start Date")||(headers[j]==="End Date")){
			//			row[headers[j]]=outlookDateToPlannerDate(outlookData[i][headers[j]]);
			//		}
			//		else if((headers[j]==="Start Time")||(headers[j]==="End Time")){
			//			row[headers[j]]=outlookTimeToPlannerTime(outlookData[i][headers[j]]);
			//		}
			//		else{
			//			row[headers[j]]=outlookData[i][headers[j]];
			//		}	
			//	}	
			//	calendarDatabase["data"].push(row);
			//}
			
			//new method
			for (let i=0;i<outlookData.length;i++){
				let row={};
				console.log(outlookData[i]);
                //for any row, convert dates and times to html input type=date format
				for (let j=0;j<headers.length;j++){
					if ((headers[j]==="Start Date")||(headers[j]==="End Date")){
						row[headers[j]]=outlookDateToPlannerDate(outlookData[i][headers[j]]);
					}
					else if((headers[j]==="Start Time")||(headers[j]==="End Time")){
						row[headers[j]]=outlookTimeToPlannerTime(outlookData[i][headers[j]]);
					}
					else{
						row[headers[j]]=outlookData[i][headers[j]];
					}	
				}
                //any header that is in outlook csv data but not a planner heading is added to Description
				let addOnString="\nAdditional Information:\n_______________________";
				for (let j=0;j<outlookHeaders.length;j++){
					//console.log("XXXXXXXXXXXXXXXXXX "+outlookHeaders[j]+":"+outlookData[i][outlookHeaders[j]]);
					if (row.hasOwnProperty(outlookHeaders[j])){
						//do nothing
					}
					else{
						if ((outlookData[i][outlookHeaders[j]].trim()!=="")&&(outlookData[i][outlookHeaders[j]].trim()!=="Normal")){//check to make sure that field is not empty 
							//row["Description"]+="\r\n"+outlookHeaders[j]+":"+outlookData[i][outlookHeaders[j]];
							addOnString+="\n"+outlookHeaders[j]+":"+outlookData[i][outlookHeaders[j]];
						}
					}
				}

				if (addOnString!=="\nAdditional Information:\n_______________________"){

					row["Description"]+=addOnString.trim();//
					row["Description"]=row["Description"].trim();
				}
                //now add all properties that are not under heading and concatenate to description in key val pairs
				
				
				calendarDatabase["data"].push(row);
			}

            //go through each row and add a value called "sort value" for sorting data when needed, consists of startdate followed by start time.
            //"sort value" is not added to header, as it is used in the program but not for display saving etc.
			
            //when data is loaded in or changed, sort value is added and calendar always sorted
            //addSortValueToCalendarData();
            //destructiveSort(calendarDatabase["data"], "sort value");
            ////////////////////


			//calendarTable.innerHTML = buildCalendarTableElement(date);
			showPlannerDiv("planner-calendar-start");
			makeCalendar();
		};
		fileReader.readAsText(inputFile, "UTF-8");
	});
	inputTypeIsFile.click();
	console.log("loadOutlookCSV called");
	}

}
function addSortValueToCalendarData(){
    for (let i=0;i<calendarDatabase["data"].length;i++){
        let row=calendarDatabase["data"][i];

        //insist start date exists
        if ((row["Start Date"] === "")||(row["Start Date"] === undefined)) {
            row["Start Date"] = "1970-01-01";
        }
        if ((row["Start Time"] === "")||(row["Start Time"] === undefined)) {
            row["Start Time"] = "00:00";
        }

        calendarDatabase["data"][i]["sort value"]=row["Start Date"]+row["Start Time"];
    }
}
	
	
function outlookDateToPlannerDate(outlookDate){
	let outlookData=outlookDate.trim().split("/");

    if (outlookData.length!==3){
        return outlookDate;
    }
	let month=("0"+outlookData[0]).slice(-2);
	let day=("0"+outlookData[1]).slice(-2);
	let year=outlookData[2];
	
	console.log(outlookDate);
	console.log(outlookData);
	
	let plannerDate=year+"-"+month+"-"+day;
	console.log(plannerDate);
	return plannerDate;
}

function outlookTimeToPlannerTime(outlookTime){
	
	//input format is "8:20:00 PM"
	//output format is "20:00"
	//	leading 0 must be added
	//	add 12 to PM hours
	//	only report hour and minutes

    let PM=false;
	if (outlookTime.indexOf("PM")!=-1){
		//alert("has PM!");
		PM=true;
	}
	
	let outlookData=outlookTime.split(":");

	if (!(outlookData.length>=2)){return outlookTime};//not parsing right for sure
	
	let strHour=outlookData[0];
	let intHour=parseInt(strHour);

    //add 12 hours if needed
    if ((PM===true)&&(intHour!==12)){
        intHour+=12;
    }

	strHour = intHour.toString();//convert back to string
	strHour=("0"+strHour).slice(-2);//add leading 0 if needed
	
	let minutes=outlookData[1];
	
	return strHour+":"+minutes;
	
}
	
	
function clearCalendar(){
	if (confirm("Are you sure?  This will clear all calendar entries")){
		calendarDatabase = {
		"name": "Calendar",
		"headers": ["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description"],
		"inputTypes": {
			"Subject": "text",
			"Start Date": "date",
			"Start Time": "time",
			"End Date":"date",
			"End Time": "time",
			"Description": "textarea"
		},
		"data":[]
		}
	}
	makeCalendar();
}	
	//let outlookTable={
	//	"name":"Outlook Table",
	//	"headers":["Subject","Start Date","Start Time","End Date","End Time","All day event","Reminder on/off","Reminder Date","Reminder Time","Meeting Organizer","Required Attendees","Optional Attendees","Meeting Resources","Billing Information","Categories","Description","Location","Mileage","Priority","Private","Sensitivity","Show time as"],
	//	"data":[]
	//	}
	//let headers=outlookTable["headers"];
	//for (let i=0;i<calendarDatabase["data"].length;i++){ //go through the calendar data
	//	let row={}
	//	for (let j=0;j<headers.length;j++){ //go through every outlook key
	//		row[headers[j]]=calendarDatabase["data"][i][headers[j]];
	//	}
	//	outlookTable["data"].push(row);
	//}
	//console.log(outlookTable);
	//
	//let outlookCSV=JSONToCSV(outlookTable);
	//console.log(outlookCSV);
	//
	//
	//copyToClipBoard(outlookCSV);
    //if (confirm("Table copied to CSV.\n\nSave to file also?")) {
    //    saveStringToTextFile(outlookCSV, "OutlookCSVExport" + getTodaysDate(), ".csv");
    //}



	
	
initializeContactsApp();

function initializeContactsApp() {
    fillInEmptyPropertyValues(contactsTable);
    //document.getElementById("contacts-table-name").innerHTML = contactsTable["name"];
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    contactsEditForm.innerHTML = buildContactsEditForm(contactsTable, -1);
}

function backupContactsDatabase() {
    return JSON.parse(JSON.stringify(contactsTable));
}

function buildContactsTableElement(contactsTable) {
    let tableElement = "";
    let numberOfColumns = contactsTable["headers"].length;
    //numberOfColumns = 2; //only showing first 3
    let numberOfRows = contactsTable["data"].length;

    //start contactsTable
    tableElement += "<table>";

    //build table header
    tableElement += "<thead><tr>";
    for (let j = 0; j < numberOfColumns; j++) {
        tableElement += "<th onclick='sortContactsByField(this);'>" + contactsTable["headers"][j] + "</th>";
    }
    tableElement += "</tr></thead>";

    //build table body	
    tableElement += "<tbody>";

    for (let i = 0; i < numberOfRows; i++) {
        tableElement += "<tr id='contacts-table-row-" + i.toString() + "' onclick='selectContactsEditForm(this)'>";
        for (let j = 0; j < numberOfColumns; j++) {
            let fieldName = contactsTable["headers"][j];
            //console.log(contactsTable["data"][i][fieldName]);
            tableElement += "<td><pre>" + contactsTable["data"][i][fieldName] + "</pre></td>";
        }
        tableElement += "</tr>";
    }
    tableElement += "</tbody>";

    return tableElement;
}

function newContactsEntry() {
    //show what's being edited
    contactsEditFormMessage.innerHTML = contactsTable["name"] + ": New Entry";
    contactsEditForm.innerHTML = buildContactsEditForm(contactsTable, -1);
    showPlannerDiv("planner-contacts-form");
}

function selectContactsEditForm(clickedRow) {
    //show what's being edited
    let index = parseInt(clickedRow.id.split("-")[3]);
    contactsEditFormMessage.innerHTML = contactsTable["name"] + ": Entry " + index.toString();
    contactsEditForm.innerHTML = buildContactsEditForm(contactsTable, index);
    showPlannerDiv("planner-contacts-form");
}

function buildContactsEditForm(contactsTable, index) {
    let editForm = "";
    editForm += "<form>";
    editForm = "<input type='hidden' id='contacts-row-index' value='" + index.toString() + "'>";
    let numberOfColumns = contactsTable["headers"].length;
    let headers = contactsTable["headers"];
    let row = contactsTable["data"][index];
    let inputTypes = contactsTable["inputTypes"];

    //make blank form
    for (let j = 0; j < numberOfColumns; j++) {
        let extraString = "";
        if (inputTypes[headers[j]] === "number") {
            extraString = " step='any' ";
        } else if (inputTypes[headers[j]] === "tel") {
            extraString = " placeholder='304-424-1000' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' ";
        }
        if (index === -1) { //adding new
			if (inputTypes[headers[j]]==="textarea"){
			//handle text area
				editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><textarea id='contact-" + headers[j] + "' " + extraString + "></textarea></div>";
			} else {
				editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='contact-" + headers[j] + "' " + extraString + "></div>";
			}
        } else { //editing existing
			if (inputTypes[headers[j]]==="textarea"){
			//handle text area
				let textAreaContents=row[headers[j]].split("\"").join("&quot;").split("\'").join("&apos;");
				editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><textarea id='contact-" + headers[j] + "' " + extraString + ">"+textAreaContents+"</textarea></div>";
			} else {
        
				editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='contact-" + headers[j] + "' value='" + row[headers[j]].split("\"").join("&quot;").split("\'").join("&apos;") + "'" + extraString + "></div>";
			}
        }
    }
    editForm += "</form>";
    return editForm;
}

function saveContactsEntry() {
    let index = parseInt(document.getElementById("contacts-row-index").value);
    //console.log(index);
    let headers = contactsTable["headers"];
    let row = {};
    for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = document.getElementById("contact-" + headers[j]).value;
    }
    if (index >= 0) { //an existing entry
        contactsTable["data"][index] = row;
    } else { // a new entry
        contactsTable["data"].push(row);
    }
    clearContactFormEntries(contactsTable);
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    showPlannerDiv("planner-contacts-table");
}

function deleteContactsEntry() {
    let index = parseInt(document.getElementById("contacts-row-index").value);
    if (index >= 0) { //editing an entry
        if (confirm("Delete this entry?")) {
            contactsTable["data"].splice(index, 1); //an object
        }
    }
    clearContactFormEntries(contactsTable);
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    showPlannerDiv("planner-contacts-table");
}

function cancelContactsEntry() {
    clearContactFormEntries(contactsTable);
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    showPlannerDiv("planner-contacts-table");
}


function clearContactFormEntries(contactsTable) {
    let headers = contactsTable["headers"];
    for (let j = 0; j < headers.length; j++) {
        document.getElementById("contact-" + headers[j]).value = "";
    }
    document.getElementById("contacts-row-index").value = -1;
    contactsEditFormMessage.innerHTML = "";
}

function sortContactsByField(clickedHeaderElement) {
    let field = clickedHeaderElement.innerHTML;
    if (contactsTable["data"].length > 1) {
        if (confirm("Sort by " + clickedHeaderElement.innerHTML + "?\n\nThis cannot be undone.")) {
            destructiveSort(contactsTable["data"], field, contactsSortAscending);
            contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
            contactsSortAscending = -1 * contactsSortAscending;
        }
    }
}



function loadOutlookContactsCSV(){
	if (confirm("This will merge entries.\n\nIf you want to over-write all contents, please clear the contacts first, then proceed with loading the data."))
	{
	let fileContents = "";
	let inputTypeIsFile = document.createElement('input');
	inputTypeIsFile.type = "file";
	inputTypeIsFile.accept = ".csv";
	inputTypeIsFile.addEventListener("change", function() {
		let inputFile = inputTypeIsFile.files[0];
		let fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) {
			fileContents = fileLoadedEvent.target.result;
			
			console.log(fileContents);

			let outlookCSVObject=csvToJSON(fileContents);
			console.log(outlookCSVObject);

			let outlookData=outlookCSVObject["data"];
			let headers=contactsTable["headers"];
			let outlookHeaders=outlookCSVObject["headers"];
			
			//original method
			//for (let i=0;i<outlookData.length;i++){
			//	let row={};
			//	console.log(outlookData[i]);
			//	for (let j=0;j<headers.length;j++){
			//		if ((headers[j]==="Start Date")||(headers[j]==="End Date")){
			//			row[headers[j]]=outlookDateToPlannerDate(outlookData[i][headers[j]]);
			//		}
			//		else if((headers[j]==="Start Time")||(headers[j]==="End Time")){
			//			row[headers[j]]=outlookTimeToPlannerTime(outlookData[i][headers[j]]);
			//		}
			//		else{
			//			row[headers[j]]=outlookData[i][headers[j]];
			//		}	
			//	}	
			//	calendarDatabase["data"].push(row);
			//}
			
			//new method
			for (let i=0;i<outlookData.length;i++){
				let row={};
				console.log(outlookData[i]);
				for (let j=0;j<headers.length;j++){
					row[headers[j]]=outlookData[i][headers[j]];
				}
				let addOnString="\r\nAdditional Information:\r\n_______________________";
				for (let j=0;j<outlookHeaders.length;j++){
					console.log(outlookHeaders[j]);
					if (row.hasOwnProperty(outlookHeaders[j])){
						//alert("has own property"+outlookHeaders[i]);
					}
					else{
						if ((outlookData[i][outlookHeaders[j]].trim()==="")||(outlookHeaders[j].trim()==="Categories")){
							//do nothing
						}else {
							addOnString+="\r\n"+outlookHeaders[j]+":"+outlookData[i][outlookHeaders[j]];
							console.log("extra: "+outlookHeaders[j]+"\n"+outlookData[i][outlookHeaders[j]]);	
						}

					}
				}
				if (addOnString==="\r\nAdditional Information:\r\n_______________________"){//no changes made
					//do nothing
					row["Notes"]=row["Notes"].trim();
				} else {//changes made, add on to description
					row["Notes"]=row["Notes"].trim();
					//now add all properties that are not under heading and concatenate to description in key val pairs
					row["Notes"]+="\r\n"+addOnString;
				}
				contactsTable["data"].push(row);
			}

			contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
			showPlannerDiv("planner-contacts-table");
			//makeCalendar();
		};
		fileReader.readAsText(inputFile, "UTF-8");
	});
	inputTypeIsFile.click();
	console.log("loadOutlookContactsCSV called");
	}
}

function saveOutlookContactsCSV(){
	let thisCSV = makeCSV(contactsTable, true);
    saveStringToTextFile(thisCSV, contactsTable["name"] + getTodaysDate(), ".csv");
}

function importVCF() {
    if (confirm("This will merge entries.\n\nIf you want to over-write all contents, please clear the contacts first, then proceed with loading the data.")) {
        let fileContents = "";
        let inputTypeIsFile = document.createElement('input');
        inputTypeIsFile.type = "file";
        inputTypeIsFile.accept = ".vcf";
        inputTypeIsFile.addEventListener("change", function () {
            let inputFile = inputTypeIsFile.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                fileContents = fileLoadedEvent.target.result;
                readInAllVcards(fileContents);
                contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
                showPlannerDiv("planner-contacts-table");
                //makeCalendar();
            };
            fileReader.readAsText(inputFile, "UTF-8");
        });
        inputTypeIsFile.click();
    }
}

function readInAllVcards(contents) {
    let startIndex = contents.indexOf("BEGIN:VCARD");
    let endIndex = contents.indexOf("END:VCARD");
    while (startIndex !== -1) {
        let vCard = contents.substring(startIndex, endIndex + 9);
        let contactObject = parseContactFromVCard(vCard);
        contactsTable["data"].push(contactObject);
        startIndex = contents.indexOf("BEGIN:VCARD", endIndex);
        endIndex = contents.indexOf("END:VCARD", startIndex + 1);
    };
}

function parseContactFromVCard(vCard) {
    vCard = vCard.trim();
    vCard = vCard.replace(/;PREF/g, "");
    vCard = vCard.replace(/;VOICE/g, ";HOME");
    vCard = vCard.replace(/\r\n|\n|\r/gm, "\n");
    let lines = vCard.split("\n");
    let prefixes = ["ADR;HOME:", "EMAIL:", "FN:", "NOTE:", "TEL;CELL:", "TEL;HOME:", "TEL;WORK:", "N:"];
    let contactObjectKeys = ["Home Address", "E-mail Address", "First Name", "Notes", "Mobile Phone", "Home Phone", "Business Phone", "Last Name", "Middle Name"];
    let contactObject = {};
    for (let i = 0; i < prefixes.length; i++) {
        for (j = 0; j < lines.length; j++) {
            if (lines[j].substring(0, prefixes[i].length) === prefixes[i]) {
                if (prefixes[i] === "N:") {
                    let lastName = lines[j].substring(prefixes[i].length).split(";")[0];
                    //console.log("Last Name is " + lastName);
                    //if ((lastName!==undefined)&&(lastName!=="")){
                    contactObject["Last Name"] = lastName;
                    //}
                    let middleName = lines[j].substring(prefixes[i].length).split(";")[2];
                    //console.log("Middle Name is " + middleName);
                    //if ((middleName!==undefined)&&(middleName!=="")){
                    contactObject["Middle Name"] = middleName;
                    //}
                    let firstName = lines[j].substring(prefixes[i].length).split(";")[1];
                    //console.log("Middle Name is " + middleName); 
                    //if ((firstName!==undefined)&&(firstName!=="")){
                    contactObject["First Name"] = firstName;
                    //}
                }
                else {
                    console.log("found match for ", prefixes[i],);
                    // if (prefixes[i]==="FN:"){// only use first name from FN if it has not been defined from N
                    //     if ((contactObject["First Name"]=== undefined)||(contactObject["First Name"].trim()=== "")){
                    //         contactObject["First Name"] = lines[j].substring(3);//start after "FN:"
                    //     }
                    // }
                    // else
                    {
                        contactObject[contactObjectKeys[i]] = lines[j].substring(prefixes[i].length);
                    }
                }
            }
        }
    }
    //if N data is present, convert it to first name
    //


    let headers = contactsTable["headers"];
    for (let i = 0; i < headers.length; i++) {
        if (contactObject.hasOwnProperty(headers[i])) {
            //do nothing
        }
        else {
            contactObject[headers[i]] = "";
        }
    }


    let extras = ["ADR", "AGENT", "ANNIVERSARY", "BDAY", "CALADRURI", "CALURI", "CATEGORIES", "CLASS", "CLIENTPIDMAP", "FBURL", "GENDER", "GEO", "IMPP", "KEY", "KIND", "LABEL", "LANG", "MAILER", "MEMBER", "NAME", "NICKNAME", "ORG", "PRODID", "PROFILE", "RELATED", "REV", "ROLE", "SORT-STRING", "SOURCE", "TEL", "TITLE", "TZ", "UID", "URL", "XML"];
    for (let i = 0; i < lines.length; i++) {
        if (prefixes.includes(lines[i].split(":")[0] + ":")) {
            //do nothing, move to next line
        }
        else {
            for (j = 0; j < extras.length; j++) {
                if (lines[i].substring(0, extras[j].length) === extras[j]) {
                    console.log("found extra ", extras[j]);
                    contactObject["Notes"] += "\n" + extras[j] + lines[i].substring(extras[j].length);
                }
            }
        }
    }
    return contactObject;
}

//All vCards begin with 
//BEGIN:VCARD
//VERSION:
//END:VCARD. All vCards must contain the VERSION property, which specifies the vCard version. VERSION must come immediately after BEGIN, except in the vCard 2.1 standard, which allows it to be anywhere in the vCard. Otherwise, properties can be defined in any order.
function exportVCF() {
    let str = "";
    let rows = contactsTable["data"];
    for (let i = 0; i < rows.length; i++) {
        console.log(rows[i]);
        str += "BEGIN:VCARD\n";
        str += "VERSION:2.1\n";
        //let prefixes = ["ADR;HOME:", "EMAIL:", "FN:", "NOTE:", "TEL;CELL:", "TEL;HOME:", "TEL;WORK:", "N:"];
        //let contactObjectKeys = ["Home Address", "E-mail Address", "First Name", "Notes", "Mobile Phone", "Home Phone", "Business Phone", "Last Name", "Middle Name"];
        let familyName = "";
        let givenName = "";
        let middleName = "";
        if (rows[i]["Last Name"] !== undefined) {
            familyName = rows[i]["Last Name"];
            familyName = familyName.replace(/\;/g, " ");//remove ; because will throw off format, prevents user injection of ;
        }
        if (rows[i]["First Name"] !== undefined) {
            givenName = rows[i]["First Name"];
            givenName = givenName.replace(/\;/g, " ");
        }
        if (rows[i]["Middle Name"] !== undefined) {
            middleName = rows[i]["Middle Name"];
            middleName = middleName.replace(/\;/g, " ");
        }
        str += "N:" + familyName + ";" + givenName + ";" + middleName + ";;\n"
        //if (givenName.trim()!==""){
        str += "FN:" + givenName + " " + middleName + " " + familyName + "\n";
        //}

        if ((rows[i]["Mobile Phone"] !== undefined) && (rows[i]["Mobile Phone"] !== "")) {
            str += "TEL;CELL:" + rows[i]["Mobile Phone"] + "\n";
        }
        if ((rows[i]["Home Phone"] !== undefined) && (rows[i]["Home Phone"] !== "")) {
            str += "TEL;HOME:" + rows[i]["Home Phone"] + "\n";
        }
        if ((rows[i]["Business Phone"] !== undefined) && (rows[i]["Business Phone"] !== "")) {
            str += "TEL;WORK:" + rows[i]["Business Phone"] + "\n";
        }
        if ((rows[i]["E-mail Address"] !== undefined) && (rows[i]["E-mail Address"] !== "")) {
            str += "EMAIL:" + rows[i]["E-mail Address"] + "\n";
        }
        if ((rows[i]["Home Address"] !== undefined) && (rows[i]["Home Address"] !== "")) {
            str += "ADR;HOME:" + rows[i]["Home Address"] + "\n";
        }
        if ((rows[i]["Notes"] !== undefined) && (rows[i]["Notes"] !== "")) {
            str += "NOTE:" + rows[i]["Notes"] + "\n";
        }
        str += "END:VCARD\n";
    }

    console.log(str);
    copyToClipBoard(str);
    if (confirm(".vcf contents copied to clipboard.  Also save to file?")) {
        saveStringToTextFile(str, "vcf" + contactsTable["name"] + getTodaysDate(), ".vcf");
    }
}


