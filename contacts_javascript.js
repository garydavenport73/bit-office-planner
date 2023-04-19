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


