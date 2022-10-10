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






