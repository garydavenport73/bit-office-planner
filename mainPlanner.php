<main id="main-planner">
    <h2>Planner</h2>
    <nav id="planner-ribbon">
        <!-- <button onclick="showPlannerDiv('planner-startup');">&#128194;</button>
            <button onclick="showPlannerDiv('planner-contacts-table');">&#9742;</button>
            <button onclick="showPlannerDiv('planner-calendar-start');makeCalendar();">&#128197;</button>
            <button onclick="showPlannerDiv('planner-planner-help');">?</button> -->
        <button onclick="showPlannerDiv('planner-startup');">&#128194;</button>
        <button onclick="showPlannerDiv('planner-contacts-table');">Contacts</button>
        <button onclick="showPlannerDiv('planner-calendar-start');makeCalendar();">Calendar</button>
        <button onclick="showPlannerDiv('planner-planner-help');">?</button>
    </nav>
    <div class="planner-div" id="planner-startup">
        <h3>Load/Save</h3>
        <nav>
            <button id="startup-load-button" onclick="loadCombinedDatabase()">&#128194; Load</button>
            <button id="saveButton" onclick="saveCombinedDatabase()">&#128193; Save</button>
        </nav>
    </div>
    <div class="planner-div" id="planner-planner-help">
        <h3>Planner-Help</h3>
        <p>You can:
        <ul>
            <li>Load/Save your data to its native format. This will save both the Contacts and Calendar in one file.
            </li>
            <li>You can export all contacts to a file containing vCards</li>
            <li>You can a single vCard</li>
            <li>You can export your entire calendar in vCalendar format (.ics format)</li>
            <li>You can export a single event in vCalendar format (.ics format)</li>
        </ul>
        </p>
        <p>
            Most programs like Google Calendar or Microsoft Outlook can import or export these files.
        </p>
        <hr>
        <p>
            <i>Notes on importing:</i>
        </p>

        <p>
            The program only supports a limited number of fields. When importing from a
            different program, any fields not supported will be read into the "Notes" area on Contacts and the
            "Description" area on Calendar entries. Also, photos, audio, and video are not supported.
        </p>
    </div>
    <div class="planner-div" id="planner-contacts-table">
        <h3>Planner-Contacts</h3>
        <nav>
            <!--<button onclick="processCSVClick(contactsTable);">CSV</button>-->

            <button onclick='newContactsEntry();'>+ New Contact</button>
            <nav>
                <!-- <button onclick="loadOutlookContactsCSV();">&#128194; Import CSV</button>
                    <button onclick="saveOutlookContactsCSV();">&#128193; Export CSV</button> -->
                <button onclick="importVCF();">&#128193; Import vCards</button>
                <button onclick="exportVCF();">&#128193; Export vCards</button>
                <span class="nested-menu">&lrarr;</span>
            </nav>
        </nav>

        <div id="contacts-table" class="table-container"></div>
    </div>
    <div class="planner-div" id="planner-contacts-form">
        <h3>Planner-Contacts Form</h3>
        <div id="contacts-edit-form-message"></div>
        <div id="contacts-edit-form"></div>
        <nav>
            <button onclick='saveContactsEntry();'>Save</button>
            <button onclick='deleteContactsEntry();'>Delete</button>
            <button onclick='cancelContactsEntry();'>Cancel</button>
            <button onclick='exportSingleVCard()'>Export vCard</button>
        </nav>
    </div>
    <div class="planner-div" id="planner-calendar-start">
        <h3>Planner-Calendar</h3>
        <nav>
            <!-- <button onclick="loadOutlookCSV();">&#128194; Import CSV</button>
                <button onclick="createOutlookCSV();">&#128193; Export CSV</button> -->
            <button onclick="importICSCalendar()">&#128194; Import vCalendar</button>
            <button onclick="exportICSCalendar()">&#128193; Export vCalendar</button>
            <button onclick="clearCalendar();">Clear Calendar</button>
            <span class="nested-menu">&lrarr;</span>
        </nav>
        <div id="calendar-container">
            <div><input type='date' id="calendar-date"></div>
            <input id="month-chooser" type="month">
            <div id="special-calendar"></div>
        </div>
    </div>
    <div class="planner-div" id="planner-calendar-table">
        <h3 id="calendar-table-name"></h3>
        <nav>
            <button onclick='newCalendarEntry();'>+ New Entry</button>
            <button onclick="processCalendarHome();">Back to Main Calendar</button>
            <!-- <button onclick="processCalendarCSVClick();">CSV</button> -->
        </nav>
        <div id="calendar-table" class="table-container"></div>
    </div>
    <div class="planner-div" id="planner-calendar-form">
        <h3 id="calendar-edit-form-message"></h3>
        <div id="calendar-edit-form"></div>
        <nav>
            <button onclick='saveCalendarEntry();'>Save</button>
            <button onclick='deleteCalendarEntry();'>Delete</button>
            <button onclick='cancelCalendarEntry();'>Cancel</button>
            <button onclick="exportSingleICalEvent()">Export Event</button>
        </nav>
    </div>
</main>