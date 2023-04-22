//  ------------notes --------------------
let noteFontSize = 2.5 / 3.0;
let note = document.getElementById('note');
note.value = "";
let compareNoteValue = "";

initializeNotesApp();

function initializeNotesApp() {
    note.style.fontSize = noteFontSize.toString() + "rem";
    note.spellcheck = false;
    note.focus();
}


function changeFontSize(fontButton) {
    let doThis = fontButton.innerHTML;
    if (doThis === "-") {
        if (noteFontSize > 0.2) {
            noteFontSize -= 0.2; //no need to go less than 0.2rem
        }
    } else {
        noteFontSize += 0.2;
    }
    note.style.fontSize = noteFontSize.toString() + "rem";
}

function newNotesEntry() {
    if (note.value != '') {
        if (confirm("This will erase current contents.")) {
            note.value = '';
            compareNoteValue = '';
        }
    }
}

function notesLoad() {
    let fileContents = "";
    let inputTypeIsFile = document.createElement('input');
    inputTypeIsFile.type = "file";
    inputTypeIsFile.accept = ".txt";
    inputTypeIsFile.addEventListener("change", function() {
        let inputFile = inputTypeIsFile.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            fileContents = fileLoadedEvent.target.result;
            note.value = fileContents;
        };
        fileReader.readAsText(inputFile, "UTF-8");
    });
    inputTypeIsFile.click();
}

function notesSave() {
    basename = "notes" + getTodaysDate();
    copyAndSaveString(note.value, basename, ".txt");
}

function printNotesDiv(id) {
    let a = window.open();
    a.document.write(serializeNotesElementToPage(id, "html{background-color:white;}#note{font-size:" + noteFontSize + "rem}"));
    a.document.close();
    a.print();
}

function serializeNotesElementToPage(id, extraStyle = "") {
    let boilerPlate1 = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title></title><style>";

    let allStyleTags = document.getElementsByTagName('style');

    let styleElementContent = "";
    for (let i = 0; i < allStyleTags.length; i++) {
        styleElementContent = allStyleTags[i].innerHTML;
    }

    styleElementContent += "pre{white-space: pre-wrap;overflow-wrap: break-word;margin: 0;padding: 0;}"
    let boilerPlate2 = "</style></head><body>";
    let boilerPlate3 = "</body></html>";
    let str = "<pre id='note'>" + document.getElementById(id).value + "</pre>";
    let htmlPage = boilerPlate1 + styleElementContent + extraStyle + boilerPlate2 + str + boilerPlate3;
    console.log(htmlPage);
    return htmlPage;
}