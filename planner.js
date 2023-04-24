

//------------------contacts and calendar database ----------------------
let contactsTableElement = document.getElementById("contacts-table");
let contactsEditForm = document.getElementById("contacts-edit-form");
let contactsEditFormMessage = document.getElementById("contacts-edit-form-message");
let contactsSortAscending = 1;

let contactsTable = {
    "name": "Contacts",
    "headers": ["First Name", "Middle Name", "Last Name", "Mobile Phone", "Home Phone", "Business Phone", "E-mail Address", "Home Address", "Notes"],
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
    "headers": ["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description", "UID"],
    "inputTypes": {
        "Subject": "text",
        "Start Date": "date",
        "Start Time": "time",
        "End Date": "date",
        "End Time": "time",
        "Description": "textarea",
        "UID": "text"
    },
    "data": []
}

//	COMBINED DATABASE

let combinedDatabase = {
    "contacts": contactsTable,
    "calendar": calendarDatabase
}

///////////////////CALENDAR//////////////////////
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

    tempTable = JSON.parse(JSON.stringify(tempTable));

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

    let allRows = calendarDatabase["data"];
    let filteredRows = [];
    let numberOfColumns = calendarDatabase["headers"].length;
    //let numberOfRows = daysEntries.length;

    for (let i = 0; i < allRows.length; i++) {
        if (
            (date === allRows[i]["Start Date"]) ||
            (date === allRows[i]["End Date"]) ||
            ((date >= allRows[i]["Start Date"]) && (date <= allRows[i]["End Date"]))
        ) {
            let tempRow = JSON.parse(JSON.stringify(allRows[i]));
            tempRow["intBaseIndex"] = i;
            filteredRows.push(tempRow);
            //for (let i = 0; i < numberOfRows; i++) {
        }

    }

    //destructiveSort(filteredRows, "Start Time");

    destructiveDoubleSortAscending(filteredRows,"Start Date","Start Time");

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
        if (headers[j] === "UID") { extraString = "disabled" };
        // ////////Added in order for UIDs not in previous data table, now loads at import
        // if (row[headers[j]]===undefined){
        //     row[headers[j]]="";
        // }
        ////////////////
        if (inputTypes[headers[j]] !== "textarea") {
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
                let textAreaContents = row[headers[j]].split("\"").join("&quot;").split("\'").join("&apos;");
                console.log(textAreaContents);
                editForm += "<div><label for='" + headers[j] + "'>" + headers[j] + "</label></div><div><textarea id='" + headers[j] + "' " + extraString + ">" + textAreaContents + "</textarea></div>";
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
    //insist start date exists
    if (row["Start Date"] === "") {
        row["Start Date"] = date;
    }
    if (row["Start Time"] === "") {
        row["Start Time"] = "00:00";
    }
    if ((row["UID"] === "") || (row["UID"] === undefined)) {
        row["UID"] = makeUID(row["Start Date"], row["Start Time"]);
    }

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

function exportSingleICalEvent(){
    let index = parseInt(document.getElementById("calendar-row-index").value);
    let date = document.getElementById("calendar-date").value;
    let headers = calendarDatabase["headers"];
    let row = {};
    for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = document.getElementById(headers[j]).value;
    }
    if ((row["UID"]==="")||row["UID"]===undefined){
        row["UID"]=makeUID(row["Start Date"],row["Start Time"]);
        document.getElementById("UID").innerHTML=row["UID"];
    }
    let vEvent=makeVEvent(row,"\n");
    let eventsArr=[];
    eventsArr.push(vEvent);
    let vCal=makeVCalendar(eventsArr,"\n");
    let filename="vEvent"+row["Start Date"]+"_"+row["Start Time"].replace(/\:/g,"");
    copyAndSaveString(vCal,filename,".ical");
    

    if (index >= 0) { //an existing entry
        calendarDatabase["data"][index] = row;
    } else { // a new entry
        calendarDatabase["data"].push(row);
    }

    alert("Entry also updated in calendar.");
    clearCalendarFormEntries();
    //destructiveSort(calendarDatabase["data"], "sort value");
    calendarTable.innerHTML = buildCalendarTableElement(date);
    showPlannerDiv("planner-calendar-table");
}


function makeUID(startDate, startTime) {
    let rows = calendarDatabase["data"];
    let usedIDs = [];
    for (let i = 0; i < rows.length; i++) {
        usedIDs.push(rows[i]["UID"]);
    }

    let UID = "bitOffice." + ISOStringToICalString((htmlDateAndTimeToISOString(startDate, startTime))) + Math.random().toString();
    while (usedIDs.includes(UID)) {
        UID = "bitOffice." + ISOStringToICalString((htmlDateAndTimeToISOString(startDate, startTime))) + Math.random().toString();
    }

    return UID;

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



function createOutlookCSV() {
    let outlookCSV = JSONToCSV(calendarDatabase, true, "\r\n");
    console.log(outlookCSV);
    copyAndSaveString(outlookCSV, "plannerToOutlookExport" + getTodaysDate(), ".csv");
}

function loadOutlookCSV() {
    if (confirm("This will add entries to the existing current calendar.\n\nIf you want to over-write all contents, please clear the calendar first, then proceed with loading the data.")) {
        let fileContents = "";
        let inputTypeIsFile = document.createElement('input');
        inputTypeIsFile.type = "file";
        inputTypeIsFile.accept = ".csv";
        inputTypeIsFile.addEventListener("change", function () {
            let inputFile = inputTypeIsFile.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                fileContents = fileLoadedEvent.target.result;

                console.log(fileContents);

                let outlookCSVObject = csvToJSON(fileContents);
                console.log(outlookCSVObject);

                let outlookData = outlookCSVObject["data"];
                let headers = calendarDatabase["headers"];
                let outlookHeaders = outlookCSVObject["headers"];


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
                for (let i = 0; i < outlookData.length; i++) {
                    let row = {};
                    console.log(outlookData[i]);
                    //for any row, convert dates and times to html input type=date format
                    for (let j = 0; j < headers.length; j++) {
                        if ((headers[j] === "Start Date") || (headers[j] === "End Date")) {
                            row[headers[j]] = outlookDateToPlannerDate(outlookData[i][headers[j]]);
                        }
                        else if ((headers[j] === "Start Time") || (headers[j] === "End Time")) {
                            row[headers[j]] = outlookTimeToPlannerTime(outlookData[i][headers[j]]);
                        }
                        else {
                            row[headers[j]] = outlookData[i][headers[j]];
                        }
                    }
                    //any header that is in outlook csv data but not a planner heading is added to Description
                    let addOnString = "\nAdditional Information:\n_______________________";
                    for (let j = 0; j < outlookHeaders.length; j++) {
                        //console.log("XXXXXXXXXXXXXXXXXX "+outlookHeaders[j]+":"+outlookData[i][outlookHeaders[j]]);
                        if (row.hasOwnProperty(outlookHeaders[j])) {
                            //do nothing
                        }
                        else {
                            if ((outlookData[i][outlookHeaders[j]].trim() !== "") && (outlookData[i][outlookHeaders[j]].trim() !== "Normal")) {//check to make sure that field is not empty 
                                //row["Description"]+="\r\n"+outlookHeaders[j]+":"+outlookData[i][outlookHeaders[j]];
                                addOnString += "\n" + outlookHeaders[j] + ":" + outlookData[i][outlookHeaders[j]];
                            }
                        }
                    }

                    if (addOnString !== "\nAdditional Information:\n_______________________") {

                        row["Description"] += addOnString.trim();//
                        row["Description"] = row["Description"].trim();
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
function addSortValueToCalendarData() {
    for (let i = 0; i < calendarDatabase["data"].length; i++) {
        let row = calendarDatabase["data"][i];

        //insist start date exists
        if ((row["Start Date"] === "") || (row["Start Date"] === undefined)) {
            row["Start Date"] = "1970-01-01";
        }
        if ((row["Start Time"] === "") || (row["Start Time"] === undefined)) {
            row["Start Time"] = "00:00";
        }

        calendarDatabase["data"][i]["sort value"] = row["Start Date"] + row["Start Time"];
    }
}


function outlookDateToPlannerDate(outlookDate) {
    let outlookData = outlookDate.trim().split("/");

    if (outlookData.length !== 3) {
        return outlookDate;
    }
    let month = ("0" + outlookData[0]).slice(-2);
    let day = ("0" + outlookData[1]).slice(-2);
    let year = outlookData[2];

    console.log(outlookDate);
    console.log(outlookData);

    let plannerDate = year + "-" + month + "-" + day;
    console.log(plannerDate);
    return plannerDate;
}

function outlookTimeToPlannerTime(outlookTime) {

    //input format is "8:20:00 PM"
    //output format is "20:00"
    //	leading 0 must be added
    //	add 12 to PM hours
    //	only report hour and minutes

    let PM = false;
    if (outlookTime.indexOf("PM") != -1) {
        //alert("has PM!");
        PM = true;
    }

    let outlookData = outlookTime.split(":");

    if (!(outlookData.length >= 2)) { return outlookTime };//not parsing right for sure

    let strHour = outlookData[0];
    let intHour = parseInt(strHour);

    //add 12 hours if needed
    if ((PM === true) && (intHour !== 12)) {
        intHour += 12;
    }

    strHour = intHour.toString();//convert back to string
    strHour = ("0" + strHour).slice(-2);//add leading 0 if needed

    let minutes = outlookData[1];

    return strHour + ":" + minutes;

}


function clearCalendar() {
    if (confirm("Are you sure?  This will clear all calendar entries")) {
        calendarDatabase = {
            "name": "Calendar",
            "headers": ["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description","UID"],
            "inputTypes": {
                "Subject": "text",
                "Start Date": "date",
                "Start Time": "time",
                "End Date": "date",
                "End Time": "time",
                "Description": "textarea",
                "UID":"text"
            },
            "data": []
        }
    }
    makeCalendar();
}

////////////////////CONTACTS/////////////////////////

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
            if (inputTypes[headers[j]] === "textarea") {
                //handle text area
                editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><textarea id='contact-" + headers[j] + "' " + extraString + "></textarea></div>";
            } else {
                editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><input type='" + inputTypes[headers[j]] + "' id='contact-" + headers[j] + "' " + extraString + "></div>";
            }
        } else { //editing existing
            if (inputTypes[headers[j]] === "textarea") {
                //handle text area
                let textAreaContents = row[headers[j]].split("\"").join("&quot;").split("\'").join("&apos;");
                editForm += "<div><label for='contact-" + headers[j] + "'>" + headers[j] + "</label></div><div><textarea id='contact-" + headers[j] + "' " + extraString + ">" + textAreaContents + "</textarea></div>";
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

function exportSingleVCard() {
    let index = parseInt(document.getElementById("contacts-row-index").value);
    //console.log(index);
    let headers = contactsTable["headers"];
    let row = {};
    for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = document.getElementById("contact-" + headers[j]).value;
    }

    let vCard = makeSingleVCFString(row);

    copyAndSaveString(vCard, row["First Name"] + "-" + row["Last Name"] + "-" + "Contact" + "-" + getTodaysDate(), ".vcf");

    if (index >= 0) { //an existing entry
        contactsTable["data"][index] = row;
    } else { // a new entry
        contactsTable["data"].push(row);
    }
    alert("Entry also updated in contacts.");

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



function loadOutlookContactsCSV() {
    if (confirm("This will merge entries.\n\nIf you want to over-write all contents, please clear the contacts first, then proceed with loading the data.")) {
        let fileContents = "";
        let inputTypeIsFile = document.createElement('input');
        inputTypeIsFile.type = "file";
        inputTypeIsFile.accept = ".csv";
        inputTypeIsFile.addEventListener("change", function () {
            let inputFile = inputTypeIsFile.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                fileContents = fileLoadedEvent.target.result;

                console.log(fileContents);

                let outlookCSVObject = csvToJSON(fileContents);
                console.log(outlookCSVObject);

                let outlookData = outlookCSVObject["data"];
                let headers = contactsTable["headers"];
                let outlookHeaders = outlookCSVObject["headers"];

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
                for (let i = 0; i < outlookData.length; i++) {
                    let row = {};
                    console.log(outlookData[i]);
                    for (let j = 0; j < headers.length; j++) {
                        row[headers[j]] = outlookData[i][headers[j]];
                    }
                    let addOnString = "\r\nAdditional Information:\r\n_______________________";
                    for (let j = 0; j < outlookHeaders.length; j++) {
                        console.log(outlookHeaders[j]);
                        if (row.hasOwnProperty(outlookHeaders[j])) {
                            //alert("has own property"+outlookHeaders[i]);
                        }
                        else {
                            if ((outlookData[i][outlookHeaders[j]].trim() === "") || (outlookHeaders[j].trim() === "Categories")) {
                                //do nothing
                            } else {
                                addOnString += "\r\n" + outlookHeaders[j] + ":" + outlookData[i][outlookHeaders[j]];
                                console.log("extra: " + outlookHeaders[j] + "\n" + outlookData[i][outlookHeaders[j]]);
                            }

                        }
                    }
                    if (addOnString === "\r\nAdditional Information:\r\n_______________________") {//no changes made
                        //do nothing
                        row["Notes"] = row["Notes"].trim();
                    } else {//changes made, add on to description
                        row["Notes"] = row["Notes"].trim();
                        //now add all properties that are not under heading and concatenate to description in key val pairs
                        row["Notes"] += "\r\n" + addOnString;
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

function saveOutlookContactsCSV() {
    let thisCSV = makeCSV(contactsTable, true);
    copyAndSaveString(thisCSV, contactsTable["name"] + getTodaysDate(), ".csv");
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

function importICSCalendar() {
    if (confirm("This will merge entries.  Continue?")) {
        let fileContents = "";
        let inputTypeIsFile = document.createElement('input');
        inputTypeIsFile.type = "file";
        inputTypeIsFile.accept = ".ics";
        inputTypeIsFile.addEventListener("change", function () {
            let inputFile = inputTypeIsFile.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                fileContents = fileLoadedEvent.target.result;

                let events = getVEVENTSFromICS(fileContents);
                for (let i = 0; i < events.length; i++) {
                    let row = parseVEVENTToObject(events[i]);

                    if ((row["UID"] === "") || (row["UID"]) === undefined) {
                        row["UID"] = makeUID(row["Start Date"], row["Start Time"]);
                    }
                    calendarDatabase["data"].push(row);
                }
                showPlannerDiv('planner-calendar-start');
                makeCalendar();
                // readInAllVcards(fileContents);
                // contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
                // showPlannerDiv("planner-contacts-table");

            };
            fileReader.readAsText(inputFile, "UTF-8");
        });
        inputTypeIsFile.click();
    }

}

function getVEVENTSFromICS(contents) {
    contents.replace(/(\r\n|\r|\n)/g, "\\\n");
    contents = contents.trim();
    lines = contents.split("\n");
    let events = [];
    let str = "";
    let inside = false;
    for (let i = 0; i < lines.length; i++) {
        if (inside === true) {
            if (lines[i].slice(0, 10) === "END:VEVENT") {
                inside = false;
                events.push(str);
                str = "";
            }
            else {
                str += lines[i] += "\n";
            }
        }
        if ((lines[i].slice(0, 12)) === "BEGIN:VEVENT") {
            inside = true;
        }
    }
    return events;
}

function parseVEVENTToObject(vEvent) {
    let row = {}
    //Just in case
    vEvent=vEvent.replace(/(\r\n|\r|\n)/g, "\n");
    vEvent = vEvent.trim();
    let lines = vEvent.split("\n");
    row["Subject"] = "";
    row["Description"] = "";
    row["UID"] = "";
    row["Start Date"] = "";
    row["Start Time"] = "";
    row["End Date"] = "";
    row["End Time"] = "";
    let extraStuff = "\n-------Extra Stuff-------\n";
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.slice(0, 7) === "SUMMARY") {
            row["Subject"] = line.split(":")[1];
        }
        else if (line.slice(0, 11) === "DESCRIPTION") {
            row["Description"] = line.split(":")[1];
        }
        else if (line.slice(0, 3) === "UID") {
            row["UID"] = line.split(":")[1];
        }
        else if (line.slice(0, 7) === "DTSTART") {
            let iCalStartDate = line.split(":")[1];
            let ISOString = iCalDateToISOString(iCalStartDate);
            let startDateObject = new Date(ISOString);
            let year = startDateObject.getFullYear().toString();
            let month = ("0" + ((startDateObject.getMonth() + 1).toString())).slice(-2);
            let date = ("0" + (startDateObject.getDate().toString())).slice(-2);
            let hours = ("0" + ((startDateObject.getHours() + 1).toString())).slice(-2);
            let minutes = ("0" + (startDateObject.getMinutes().toString())).slice(-2);
            let seconds = ("0" + (startDateObject.getSeconds().toString())).slice(-2);
            row["Start Date"] = year + "-" + month + "-" + date;
            row["Start Time"] = hours + ":" + minutes + ":" + seconds;
        }
        else if (line.slice(0, 5) === "DTEND") {
            let iCalEndDate = line.split(":")[1];
            let ISOString = iCalDateToISOString(iCalEndDate);
            let endDateObject = new Date(ISOString);
            let year = endDateObject.getFullYear().toString();
            let month = ("0" + ((endDateObject.getMonth() + 1).toString())).slice(-2);
            let date = ("0" + (endDateObject.getDate().toString())).slice(-2);
            let hours = ("0" + ((endDateObject.getHours() + 1).toString())).slice(-2);
            let minutes = ("0" + (endDateObject.getMinutes().toString())).slice(-2);
            let seconds = ("0" + (endDateObject.getSeconds().toString())).slice(-2);
            row["End Date"] = year + "-" + month + "-" + date;
            row["End Time"] = hours + ":" + minutes + ":" + seconds;
        }
        else {
            extraStuff += line + "\n";
        }
    }

    row["Description"] += extraStuff;
    // need SUMMARY
    // need DTSTART
    // need DTEND
    // need DESCRIPTION
    // need UID
    return row;
}

function iCalDateToISOString(icalDate) {
    // 2023-06-11T14:05:25.003Z----->20230611T140525Z
    let year = icalDate.slice(0, 4);
    let month = parseInt(icalDate.slice(4, 6));
    let day = icalDate.slice(6, 8);
    let dateObject;
    if (icalDate.indexOf("T") !== -1) {//Long String
        hour = icalDate.slice(9, 11);
        min = icalDate.slice(11, 13);
        sec = icalDate.slice(13, 15);
        dateObject = new Date(year, month, day, hour, min, sec);
    }
    else {
        dateObject = new Date(year, month, day);
    }

    return dateObject.toISOString();
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
        str += makeSingleVCFString(rows[i]);
    }
    console.log(str);
    copyAndSaveString(str, "vcf" + contactsTable["name"] + getTodaysDate(), ".vcf");
}



function makeSingleVCFString(row) {
    let str = "";
    console.log(row);
    str += "BEGIN:VCARD\n";
    str += "VERSION:2.1\n";
    //let prefixes = ["ADR;HOME:", "EMAIL:", "FN:", "NOTE:", "TEL;CELL:", "TEL;HOME:", "TEL;WORK:", "N:"];
    //let contactObjectKeys = ["Home Address", "E-mail Address", "First Name", "Notes", "Mobile Phone", "Home Phone", "Business Phone", "Last Name", "Middle Name"];
    let familyName = "";
    let givenName = "";
    let middleName = "";
    if (row["Last Name"] !== undefined) {
        familyName = row["Last Name"];
        familyName = familyName.replace(/\;/g, " ");//remove ; because will throw off format, prevents user injection of ;
    }
    if (row["First Name"] !== undefined) {
        givenName = row["First Name"];
        givenName = givenName.replace(/\;/g, " ");
    }
    if (row["Middle Name"] !== undefined) {
        middleName = row["Middle Name"];
        middleName = middleName.replace(/\;/g, " ");
    }
    str += "N:" + familyName + ";" + givenName + ";" + middleName + ";;\n"
    //if (givenName.trim()!==""){
    str += "FN:" + givenName + " " + middleName + " " + familyName + "\n";
    //}

    if ((row["Mobile Phone"] !== undefined) && (row["Mobile Phone"] !== "")) {
        str += "TEL;CELL:" + row["Mobile Phone"] + "\n";
    }
    if ((row["Home Phone"] !== undefined) && (row["Home Phone"] !== "")) {
        str += "TEL;HOME:" + row["Home Phone"] + "\n";
    }
    if ((row["Business Phone"] !== undefined) && (row["Business Phone"] !== "")) {
        str += "TEL;WORK:" + row["Business Phone"] + "\n";
    }
    if ((row["E-mail Address"] !== undefined) && (row["E-mail Address"] !== "")) {
        str += "EMAIL:" + row["E-mail Address"] + "\n";
    }
    if ((row["Home Address"] !== undefined) && (row["Home Address"] !== "")) {
        str += "ADR;HOME:" + row["Home Address"] + "\n";
    }
    if ((row["Notes"] !== undefined) && (row["Notes"] !== "")) {
        str += "NOTE:" + row["Notes"] + "\n";
    }
    str += "END:VCARD\n";
    return str;
}


///////////////// PLANNER /////////////////////
function showPlannerDiv(id) {
    //console.log("show mains called with " + id);
    let divs = document.getElementsByClassName('planner-div');
    for (let div of divs) {
        div.style.display = "none";
    }
    document.getElementById(id).style.display = "unset";
}

function loadCombinedDatabase() {
    let fileContents = "";
    let inputTypeIsFile = document.createElement('input');
    inputTypeIsFile.type = "file";
    inputTypeIsFile.accept = ".bof";
    inputTypeIsFile.addEventListener("change", function () {
        let inputFile = inputTypeIsFile.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            fileContents = fileLoadedEvent.target.result;
            combinedDatabase = JSON.parse(fileContents);
            //compareCombinedDatabase = JSON.stringify(combinedDatabase);
            contactsTable = combinedDatabase["contacts"];
            calendarDatabase = combinedDatabase["calendar"];

            /////////////////////////////////////////////////
            // IF OLD DATABASE DOESN'T HAVE UIDS
            if (calendarDatabase["headers"].includes("UID")) {
                //do nothing
            }
            else {
                calendarDatabase["headers"].push("UID");
                calendarDatabase["inputTypes"]["UID"] = "text";
            }
            // IF OLD DATABASE ROWS don't all have UIDS, make them now
            let dataRows = calendarDatabase["data"];
            for (let i = 0; i < dataRows.length; i++) {
                if ((dataRows[i]["UID"] === "") || (dataRows[i]["UID"] === undefined)) {
                    dataRows[i]["UID"] = makeUID(dataRows["Start Date"], dataRows["Start Time"]);
                }
            }
            /////////////////////////////////////

            clearContactFormEntries(contactsTable);
            contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
            makeCalendar();
        };

        fileReader.readAsText(inputFile, "UTF-8");
    });
    inputTypeIsFile.click();
}

function saveCombinedDatabase() {
    purgeCalendar();
    let str = JSON.stringify(combinedDatabase);
    let baseFilename = "bitOfficePlanner" + getTodaysDate();
    copyAndSaveString(str, baseFilename, ".bof");
}


///////////////// ICal functionality //////////////////// 

function makeVEvent(row, lineTerminator = "\n") {
    let lt = lineTerminator;
    str = "";
    let subject = row["Subject"];
    let startDate = row["Start Date"];
    let UID = row["UID"];
    if ((startDate === "") || (startDate === undefined)) {
        return;
    }
    let startTime = row["Start Time"];
    if ((startTime === "") || (startTime === undefined)) {
        startTime = "00:00";
    }
    let endDate = row["End Date"];
    if ((endDate === "") || (endDate === undefined)) {
        endDate = startDate;
    }
    let endTime = row["End Time"];
    if ((endTime === "") || (endTime === undefined)) {
        endTime = startTime;
    }
    if ((UID === "") || (UID === undefined)) {
        UID = makeUID(startDate, startTime);
    }
    let description = row["Description"];
    let nowDate = new Date();
    let nowString = nowDate.toISOString();
    nowString = ISOStringToICalString(nowString);
    str += "BEGIN:VEVENT" + lt;
    str += "SUMMARY:" + subject.trim() + lt;
    str += "DTSTART:" + ISOStringToICalString(htmlDateAndTimeToISOString(startDate, startTime)).trim() + lt;
    str += "DTEND:" + ISOStringToICalString(htmlDateAndTimeToISOString(endDate, endTime)).trim() + lt;
    str += "DESCRIPTION:" + description.trim() + lt;
    str += "DTSTAMP:" + nowString.trim() + lt;
    str += "UID:" + UID.trim() + lt;
    str += "END:VEVENT";

    return str;
    // DTSTART;TZID=America/New_York:20130802T103400
    // DTEND;TZID=America/New_York:20130802T110400
    // DESCRIPTION: Access-A-Ride to 900 Jay St.\, Brooklyn
    // END:VEVENT
}


function htmlDateAndTimeToISOString(date = "2023-01-31", time) {
    if ((time === "") || (time === undefined)) {
        time = "00:00";
    }
    let year = parseInt(date.slice(0, 4));
    let month = parseInt(date.slice(5, 7)) - 1;
    let day = parseInt(date.slice(8));
    let hour = parseInt(time.slice(0, 2));
    let min = parseInt(time.slice(3));
    let d = new Date(year, month, day, hour, min);
    return (d.toISOString());
}

function ISOStringToICalString(ISOString) {
    // 2023-06-11T14:05:25.003Z----->20230611T140525Z
    return (ISOString.replace(/\.\d\d\dZ/, "Z").replace(/\-|\:|\./g, ""));
}

function makeVEventsArr(dataRows) {
    let arr = [];
    for (let i = 0; i < dataRows.length; i++) {
        arr.push(makeVEvent(dataRows[i]).trim());
    }
    return arr;
}


function makeVCalendar(vEventsArr, lineTerminator="\n"){
    let str="";
    let lt=lineTerminator;
    str+="BEGIN:VCALENDAR"+lt;
    str+="VERSION:2.0"+lt;
    str += "PRODID:bitOffice"+lt;
    str+="CALSCALE:GREGORIAN"+lt;
    for (let i=0;i<vEventsArr.length;i++){
        str+=vEventsArr[i].trim()+lt;
    }
    str+="END:VCALENDAR";
    return str;
}

function exportICSCalendar() {
    let eventsArr = makeVEventsArr(calendarDatabase["data"]);
    let cal = makeVCalendar(eventsArr);
    copyAndSaveString(cal, "ICSCalendar" + getTodaysDate(), ".ics");
}

