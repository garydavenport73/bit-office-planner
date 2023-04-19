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



	
	
