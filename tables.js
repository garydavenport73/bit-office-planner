//---tables----
let tableElement = document.getElementById('tables-table');
let tablesTable = {
    "name": "Table",
    "headers": ["Column 1", "Column 2", "Column 3"],
    "data": [
        { "Column 1": "", "Column 2": "", "Column 3": "" },
        { "Column 1": "", "Column 2": "", "Column 3": "" },
        { "Column 1": "", "Column 2": "", "Column 3": "" }
    ]
}

// let compareTablesTable = JSON.stringify(tablesTable);
// let initialTablesTable = compareTablesTable;
let initialTablesTable = JSON.stringify(tablesTable);
initializeTablesApp();


//////////TABLES//////////
function showTablesDiv(id) {
    //console.log("show mains called with " + id);
    updateDataFromCurrentInputs(tablesTable);

    let divs = document.getElementsByClassName('tables-div');
    for (let div of divs) {
        div.style.display = "none";
    }
    document.getElementById(id).style.display = "unset";
    // document.getElementById(id).style.flexDirection="column";
}



function initializeTablesApp() {
    makeTable(JSON.parse(initialTablesTable));
    updateDataFromCurrentInputs(tablesTable);
    showTablesDiv('tables-tables-table');
}

function backupTablesTable() {
    updateDataFromCurrentInputs(tablesTable);
    return JSON.parse(JSON.stringify(currentTablesTable));
}

function processColumnClick(header) {
    updateDataFromCurrentInputs(tablesTable);
    populateMoveColumnSelect(tablesTable);
    document.getElementById("tables-current-header").innerHTML = header;
    document.getElementById("tables-new-header-name").value = header;
    showTablesDiv("tables-tables-header-form");
}

function processRowClick(row) {
    updateDataFromCurrentInputs(tablesTable);
    populateMoveRowSelect(tablesTable);
    document.getElementById("tables-current-row").innerHTML = row.toString();
    showTablesDiv("tables-tables-row-form");
}

function makeTable(table) {
    //let tableElement = document.getElementById('tables-table');
    let str = "";

    //fill in header from object
    str = "";
    let headers = table["headers"]; //an array of strings
    str += "<thead><tr><th></th>";
    for (let i = 0; i < headers.length; i++) {
        str += "<th id='" + headers[i] + "' onclick=\"processColumnClick('" + headers[i] + "');\">" + headers[i].replace(/</g, "&lt;").replace(/>/g, "&gt;"); + "</th>";
    }
    str += "<th id='add-column' onclick='addColumn(tablesTable)'>+</th>";
    str += "</tr></thead>";
    let tableHeader = str;

    //fill in body data from object
    str = "<tbody>";
    let bodyData = table.data; //an array of objects;
    console.log("bodyData");
    console.log(bodyData);
    let rowCount = bodyData.length;
    for (let i = 0; i < rowCount; i++) {
        str += "<tr><td class='tables-table-row-number' onclick='processRowClick(" + i.toString() + ")'>" + i.toString() + "</td>";
        let columnCount = headers.length;
        console.log(columnCount);
        for (let j = 0; j < columnCount; j++) {
            //console.log(headers[j]);
            //console.log(bodyData[i][headers[j]]);
            if (bodyData[i][headers[j]] === undefined) {
                bodyData[i][headers[j]] = "input read error";
            }
            str += "<td><input type='text' id='cell-" + i.toString() + "-" + j.toString() + "' value='" + bodyData[i][headers[j]].toString() + "'></td>";
            //str += "<td><input type='text' id='cell-" + (i + 1).toString() + "-" + (j + 1).toString() + "' value='" + i.toString()+j.toString() + "'></td>";
        }
        str += "</tr>";
    }
    str += "</tbody>"
    let tableBody = str;

    //make footer for additional controls
    str = "<tfoot><tr><th id='add-row' onclick='addRow(tablesTable)'>+</th>";
    for (let i = 0; i < headers.length; i++) {
        str += "<th id='footer-" + (i + 1).toString() + "' onclick=\"processColumnClick('" + headers[i] + "');\"></th>";
    }
    str += "</tr></tfoot>";
    let tableFooter = str;
    let strTable = tableHeader + tableBody + tableFooter;

    //addListenersToTable();
    populateMoveColumnSelect(table);
    populateMoveRowSelect(table);

    tableElement.innerHTML = strTable;

    return strTable;
}


function populateMoveColumnSelect(table) {
    let moveColumnSelect = document.getElementById('move-column');
    moveColumnSelect.options.length = 0;
    // moveColumnSelect.style.backgroundColor = "orange";
    let currentTableHeaders = table.headers; //an array of header names
    for (th of currentTableHeaders) {
        let option = document.createElement('option');
        option.value = th;
        option.text = th;
        moveColumnSelect.add(option);
    }
}

function populateMoveRowSelect(table) {
    // document.getElementById(selectbox).options.length = 0;
    let moveRowSelect = document.getElementById('move-row');
    moveRowSelect.options.length = 0;
    // moveRowSelect.style.backgroundColor = 'orange';
    for (let i = 0; i < table["data"].length; i++) {
        let option = document.createElement('option');
        option.value = i.toString();
        option.text = i.toString();
        moveRowSelect.add(option);
    }
}

function updateDataFromCurrentInputs(table) {
    let headers = table["headers"];
    console.log("headers");
    console.log(headers);
    for (let i = 0; i < table.data.length; i++) {
        for (let j = 0; j < table.headers.length; j++) {
            let id = "cell-" + i.toString() + "-" + j.toString();
            let thisCell = document.getElementById(id);
            table.data[i][headers[j]] = thisCell.value;
        }
    }
}
//Column functions
function updateHeaderName() {
    //let table = tablesTable;
    //get old name
    let fieldName = document.getElementById("tables-current-header").innerHTML;
    //get new name
    let newName = document.getElementById('tables-new-header-name').value;

    //do nothing if they are the same
    if (fieldName === newName) {
        makeTable(tablesTable);
        return;
    }
    if (newName === "") { //if blank make new
        newName = prompt("There is no name listed, please enter the new name");
        if (newName === null) {
            return;
        }
    }

    //newName = newName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    tablesTable = _changeHeaderAndDataPropertyName(tablesTable, newName, fieldName);

    makeTable(tablesTable);
    showTablesDiv('tables-tables-table');
}

function tablesSort(direction) {
    let field = document.getElementById("tables-current-header").innerHTML;
    sortTablesByField(field, direction);

}

function sortTablesByField(field, direction = 1) {
    if (confirm("Sort by " + field + "?\n\nThis is destructive and irreversible.")) {
        destructiveSort(tablesTable["data"], field, direction);
        makeTable(tablesTable);
        showTablesDiv('tables-tables-table');
    }
}

function _changeHeaderAndDataPropertyName(table, newName, oldName) {
    let data = table["data"];
    newName = getBestName(table, newName);
    let index = table["headers"].indexOf(oldName); //get index of field 
    table["headers"][index] = newName; //change header name
    //update rows
    for (let i = 0; i < data.length; i++) {
        data[i][newName] = data[i][oldName]; //set new property to old
        delete data[i][oldName]; //delete old
    }
    return table;
}


function deleteColumn() {
    let columnName = document.getElementById("tables-current-header").innerHTML;
    if (confirm("Are you sure? \n\nDelete Column: " + columnName + "?")) {
        let index = tablesTable["headers"].indexOf(columnName);
        tablesTable["headers"].splice(index, 1); //delete from header array
        //loop through rows
        for (let i = 0; i < tablesTable["data"].length; i++) {
            delete tablesTable["data"][i][columnName];
        }
        makeTable(tablesTable);
        showTablesDiv('tables-tables-table');
    }
}

function addColumn(table) {
    //alert("need to process add column");
    updateDataFromCurrentInputs(table);
    let newIndex = 1;
    let newColumnName = "new" + newIndex.toString(); //make a new name

    //if name already in use, make a new name
    while (table["headers"].includes(newColumnName)) {
        console.log("column name already in use");
        newIndex += 1;
        newColumnName = "new" + newIndex.toString();
    }

    table.headers.push(newColumnName);

    fillInEmptyPropertyValues(table);
    makeTable(table);
}

function moveColumn() {
    let columnName = document.getElementById("tables-current-header").innerHTML;
    let destinationColumnName = document.getElementById("move-column").value;
    if (columnName === destinationColumnName) {
        console.log("destination is same as source");
        return;
    }
    let index = tablesTable["headers"].indexOf(columnName);
    let destinationIndex = tablesTable["headers"].indexOf(destinationColumnName);
    let headerToMove = tablesTable["headers"].splice(index, 1)[0]; //splice returns an array length 1
    tablesTable["headers"].splice(destinationIndex, 0, headerToMove);
    makeTable(tablesTable);
    showTablesDiv('tables-tables-table');
}

function getBestName(table, name) { //if header name taken, returns similar name
    let headers = table["headers"];
    let nameCount = 0;
    let bestName = name;
    while (headers.includes(bestName)) {
        console.log("column name already in use");
        nameCount += 1;
        bestName = name + "-" + nameCount.toString();
    }
    return bestName;
}

function copyColumn() {
    //get column 
    let columnName = document.getElementById("tables-current-header").innerHTML;

    //make name for new column
    let newName = getBestName(tablesTable, columnName);

    //add to headers			
    tablesTable["headers"].push(newName);

    //go through rows of data
    for (let i = 0; i < tablesTable["data"].length; i++) {
        tablesTable["data"][i][newName] = tablesTable["data"][i][columnName];
    }

    makeTable(tablesTable);
    showTablesDiv('tables-tables-table');
}

function calculateTotal() {
    //get column 
    let columnName = document.getElementById("tables-current-header").innerHTML;

    let total = 0;
    for (let row of tablesTable.data) {
        total = total + Number(row[columnName]);
    }
    if (confirm("The total is: " + total.toString() + "\nCopy to clipboard?")) {
        copyToClipBoard(total.toString());
    };
    showTablesDiv('tables-tables-table');
}

function tablesCancel() {
    console.log("tablesCancel called");
    makeTable(tablesTable); //probably not needed
    showTablesDiv('tables-tables-table');

}

function calculateAverage() {
    alert("calculate average called");
    console.log("calcualtoe average called");

    let columnName = document.getElementById("tables-current-header").innerHTML;

    let total = 0;

    for (let row of tablesTable.data) {
        total = total + Number(row[columnName]);
    }

    let average = total / tablesTable.data.length;

    if (confirm("The average is: " + average.toString() + "\nCopy to clipboard?")) {
        copyToClipBoard(average.toString());
    }
    showTablesDiv('tables-tables-table');
}

//row functions
function addRow(table) {
    let headers = table["headers"];
    updateDataFromCurrentInputs(table);
    let numberOfColumns = table.headers.length;
    let tempRow = {};
    for (let i = 0; i < numberOfColumns; i++) {
        tempRow[headers[i]] = "";
    }
    table["data"].push(tempRow);
    makeTable(table);
}

function deleteRow() {
    let index = parseInt(document.getElementById("tables-current-row").innerHTML);
    let data = tablesTable["data"];
    data.splice(index, 1);
    makeTable(tablesTable);
    showTablesDiv('tables-tables-table');
}

function copyRow() {
    console.log("copy row called");
    let index = parseInt(document.getElementById("tables-current-row").innerHTML);
    let data = tablesTable["data"];
    console.log(data);
    let rowToCopy = JSON.parse(JSON.stringify(tablesTable.data[index]));
    data.push(rowToCopy);
    makeTable(tablesTable);
    showTablesDiv('tables-tables-table');
}

function moveRow() {
    console.log("move row called");
    let index = parseInt(document.getElementById("tables-current-row").innerHTML);
    let data = tablesTable["data"];
    let destinationIndex = parseInt(document.getElementById("move-row").value);
    let rowToMove = data.splice(index, 1)[0];
    data.splice(destinationIndex, 0, rowToMove);
    makeTable(tablesTable);
    showTablesDiv('tables-tables-table');
}


function tablesNewTable() {
    if (confirm("Are you sure?  This will erase all current data.")) {
        initializeTablesApp();
    }
}

function tablesLoad() {
    console.log("tablesLoad() called");
    let fileContents = "";
    let inputTypeIsFile = document.createElement('input');
    inputTypeIsFile.type = "file";
    inputTypeIsFile.accept = ".csv";
    inputTypeIsFile.addEventListener("change", function() {
        let inputFile = inputTypeIsFile.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            fileContents = fileLoadedEvent.target.result;
            if (confirm("Use the first line as the header row?")) {
                //tablesTable = readCSV(fileContents, true);
                tablesTable=csvToJSON(fileContents, true);
            } else {
                //tablesTable = readCSV(fileContents, false);
                tablesTable=csvToJSON(fileContents, true);
            }
            makeTable(tablesTable);
            // compareTablesTable = JSON.stringify(tablesTable);
        };
        fileReader.readAsText(inputFile, "UTF-8");
    });
    inputTypeIsFile.click();
}

function tablesSave() {
    console.log("tablesSave() called");
    updateDataFromCurrentInputs(tablesTable);

    if (confirm("Include header as first line in csv file?")) {
        saveStringToTextFile(makeCSV(tablesTable, true), "csvTable" + getTodaysDate(), ".csv");
    } else {
        saveStringToTextFile(makeCSV(tablesTable, false), "csvTable" + getTodaysDate(), ".csv");
    }
    // compareTablesTable = JSON.stringify(tablesTable);
}

// function tablesShowRules() {
//     alert('FORMATTING RULES:\n\nWhen Saving:\n1) All cells are quoted text.\n2) Interior double quotes in cells are converted like this: "->""\n\nIf loading CSV from other apps:\n1) Cells should all be text type.\n2) Quote all text strings when saving.')
// }

function tablesCopyCSVToClipboard() {
    updateDataFromCurrentInputs(tablesTable);
    let thisResult = "";
    if (confirm("Include header as first line?")) {
        thisResult = copyToClipBoard(makeCSV(tablesTable, true));
    } else {
        thisResult = copyToClipBoard(makeCSV(tablesTable, false));
    }
    return thisResult;
}