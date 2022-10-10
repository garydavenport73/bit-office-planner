initializeContactsApp();

function initializeContactsApp() {
    fillInEmptyPropertyValues(contactsTable);
    document.getElementById("contacts-table-name").innerHTML = contactsTable["name"];
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
    showMain("main-contacts-form")
}

function selectContactsEditForm(clickedRow) {
    //show what's being edited
    let index = parseInt(clickedRow.id.split("-")[3]);
    contactsEditFormMessage.innerHTML = contactsTable["name"] + ": Entry " + index.toString();
    contactsEditForm.innerHTML = buildContactsEditForm(contactsTable, index);
    showMain("main-contacts-form");
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
    showMain("main-contacts-table");
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
    showMain("main-contacts-table");
}

function cancelContactsEntry() {
    clearContactFormEntries(contactsTable);
    contactsTableElement.innerHTML = buildContactsTableElement(contactsTable);
    showMain("main-contacts-table");
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
			showMain("main-contacts-table");
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




