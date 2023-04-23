
// WRITE
let textarea = document.getElementById("text-editor");
let documentDiv = document.getElementById('document-result');
let remSize = 1;
let marginSize = 2;
let writeUndos = [];
let writeUndosCursor = 0;
let compareWriteData = "";

initializeWriteApp();

let lastTextAreaText = textarea.value;

function initializeWriteApp() {
    documentDiv.style.fontSize = remSize + "rem";
    documentDiv.style.marginLeft = marginSize + "rem";
    documentDiv.style.marginRight = marginSize + "rem";
    writeUndos.push(textarea.value);
    writeUpdateResult();
    textarea.spellcheck = false;
    textarea.focus(); //ensures spellcheck update

    document.getElementById('text-editor').addEventListener('keydown', function(e) {
        //https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
        //https://stackoverflow.com/users/819732/kasdega
        //console.log(this);
        if (e.key == 'Tab') {
            e.preventDefault();
            insertTab(this);
            updateUndosIfTextChanges();
        }
    });

    document.getElementById('text-editor').addEventListener('input', updateUndosIfTextChanges); //catching key inputs
    compareWriteData = makeCompareWriteData();
}

function updateUndosIfTextChanges() {
    console.log("called");
    console.log(writeUndos);
    if (lastTextAreaText != textarea.value) {
        addUndo();
        lastTextAreaText = textarea.value;
    }
    console.log(writeUndos);

}

function insertTab(aTextarea) {
    let start = aTextarea.selectionStart;
    let end = aTextarea.selectionEnd;
    // set textarea value to: text before caret + tab + text after caret
    aTextarea.value = aTextarea.value.substring(0, start) +
        //"    " + this.value.substring(end); using 4 spaces
        "\t" + aTextarea.value.substring(end);
    // put caret at right position again
    aTextarea.selectionStart =
        //aTextarea.selectionEnd = start + 4; using 4 spaces
        aTextarea.selectionEnd = start + 1;
    writeUpdateResult();
}

//Script to print the content of a div
function exportToHTML() {
    let contents = serializeElementToPage("document-parent", "html,#document-result,#document-parent{background-color:white;}");
    copyToClipBoard(contents);
    if (confirm("HTML document exported to clipboard.\n\nWould you like to export to HTML file?")) {
        saveStringToTextFile(contents, 'write' + getTodaysDate(), '.html');
    }
}

function newDocument() {
    if (confirm("This will overwrite current document.")) {
        writeResetAll();
    }
}

function writeResetAll() {
    //reset global variables;
    writeBaseFilename = "";
    remSize = 1;
    marginSize = 2;

    //reset text area value
    textarea.value = "";

    //reapply base styles to the div
    documentDiv.style.textAlign = "left";
    documentDiv.style.fontFamily = "Georgia, 'Times New Roman', Garamond, Times, serif";
    documentDiv.style.fontSize = "1rem";
    documentDiv.style.marginLeft = "2rem";
    textarea.spellcheck = false;

    //reset undo array
    writeUndos = [];
    writeUndos.push(textarea.value);

    //redisplay new result
    writeUpdateResult();

    //set focus to textarea
    textarea.focus(); //ensures spell check is refreshed

}

function makeCompareWriteData() {
    writeUpdateResult();
    let data = {}
    data["text"] = textarea.value;
    data["textAlign"] = documentDiv.style.textAlign;
    data["fontFamily"] = documentDiv.style.fontFamily;
    data["fontSize"] = documentDiv.style.fontSize;
    data["marginSize"] = documentDiv.style.marginLeft;
    data["spellCheck"] = textarea.spellcheck;
    return JSON.stringify(data);;
}

function writeDataToJSON() {
    writeUpdateResult();
    let data = {}
    data["text"] = textarea.value;
    data["textAlign"] = documentDiv.style.textAlign;
    data["fontFamily"] = documentDiv.style.fontFamily;
    data["fontSize"] = documentDiv.style.fontSize;
    data["marginSize"] = documentDiv.style.marginLeft;
    data["spellCheck"] = textarea.spellcheck;
    //if (writeBaseFilename === "") {
    writeBaseFilename = "write" + getTodaysDate();
    //};
    let saveContents = JSON.stringify(data);
    saveStringToTextFile(saveContents, writeBaseFilename, ".json");
    compareWriteData = makeCompareWriteData();
}

function writeLoad() {
    console.log("writeLoad() called");
    console.log(textarea.value);
    console.log(textarea.value.length);
    let proceed = true;
    if (textarea.value.length != 0) {
        proceed = confirm("This will overwrite current document");
    }
    if (proceed) {
        let fileContents = "";
        let inputTypeIsFile = document.createElement('input');
        inputTypeIsFile.type = "file";
        inputTypeIsFile.accept = ".json";
        inputTypeIsFile.addEventListener("change", function() {
            let inputFile = inputTypeIsFile.files[0];
            let fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) {
                fileContents = fileLoadedEvent.target.result;
                let loadedData = JSON.parse(fileContents);
                textarea.value = loadedData["text"];
                documentDiv.style.textAlign = loadedData["textAlign"];
                documentDiv.style.fontFamily = loadedData["fontFamily"];
                documentDiv.style.fontSize = loadedData["fontSize"];
                documentDiv.style.marginLeft = loadedData["marginSize"];
                textarea.spellcheck = loadedData["spellCheck"];
                writeUpdateResult();
                remSize = parseFloat(loadedData["fontSize"].split("rem")[0]);
                marginSize = parseFloat(loadedData["marginSize"].split("rem")[0]);
                writeUndos = [];
                console.log("writeUndos length", writeUndos.length);
                writeUndos.push(textarea.value);
                textarea.focus(); //ensures spell check is refreshed

            };

            fileReader.readAsText(inputFile, "UTF-8");
        });
        inputTypeIsFile.click();
    }
    //}

}


function addUndo() { //moving "foward", check to see if cursor is at end or not

    console.log(writeUndos.length, writeUndosCursor);
    console.log(writeUndos);
    if (writeUndos.length - 1 === writeUndosCursor) {
        console.log("we are at end");
        if (writeUndos.length >= 316) { //316 levels of undo
            writeUndos.shift();
            writeUndos.push(textarea.value);
        } else {
            writeUndos.push(textarea.value);
            writeUndosCursor += 1;

            //  a   b   c   d   e
            //  0   1   2   3   4
            //          ^
            //  ---keep---  xxxxx
            //  
            //use slice(0,-2)
            //
            //  -2 is the length - (cursor + 1)
            //               5   -    3

        }
        console.log(writeUndos);
    } else {
        console.log("we are not at end");
        console.log(writeUndos);
        let removeNumberOfElements = writeUndos.length - (writeUndosCursor + 1);
        writeUndos = writeUndos.slice(0, -removeNumberOfElements);
        console.log(writeUndos);
        //remove everything past the cursor
        //then push new value

        writeUndos.push(textarea.value);
        writeUndosCursor += 1;

        console.log(writeUndos);
    }
}

function backUndo() { //this is just undo
    console.log("back Undo called");
    console.log(writeUndos);
    console.log(writeUndosCursor);
    //if (writeUndos.length > 1) {
    if (writeUndosCursor > 0) {
        //let thisText = writeUndos.pop();
        let thisText = writeUndos[writeUndosCursor - 1];
        textarea.value = thisText;
        writeUpdateResult();
        writeUndosCursor = writeUndosCursor - 1;
    }
    console.log(writeUndos);
    console.log(writeUndosCursor);
}

function writeRedo() {
    console.log("redo called");
    // if we are at end do nothing, otherwise advance
    if (writeUndos.length - 1 === writeUndosCursor) {
        console.log("we are at end");
    } else {
        console.log("we are not at end");
        writeUndosCursor += 1;

        let thisText = writeUndos[writeUndosCursor];
        textarea.value = thisText;
        writeUpdateResult();

    }
}

function processSelectedText(clickedElement) {
    let action = clickedElement.innerHTML;
    console.log(action);
    // if (action != "⟲") {
    //     addUndo();
    // }

    if (action === "⇚") { //align left
        documentDiv.style.textAlign = "left";
    } else if (action === "⇛⇚") { //align center
        documentDiv.style.textAlign = "center";
    } else if (action === "⇛") { //align right
        documentDiv.style.textAlign = "right";
    } else if (action === "Mono") {
        documentDiv.style.fontFamily = "'Courier New', Courier, monospace";
    } else if (action === "Serif") {
        documentDiv.style.fontFamily = "Georgia, 'Times New Roman', Garamond, Times, serif";
    } else if (action === "Sans") {
        documentDiv.style.fontFamily = "Arial, Verdana, Helvetica, Tahoma, sans-serif";
    } else if (action === "<sub>A</sub>A") {
        remSize = remSize + .2;
        documentDiv.style.fontSize = remSize.toString() + "rem";
    } else if (action === "<sup>A</sup>A") {
        remSize = remSize - .2;
        documentDiv.style.fontSize = remSize.toString() + "rem";
    } else if (action === "⇥⇤") { //increase margins
        marginSize = marginSize + 1;
        if (marginSize > 20) {
            marginSize = 20;
        }
        documentDiv.style.marginLeft = marginSize.toString() + "rem";
        documentDiv.style.marginRight = marginSize.toString() + "rem";

    } else if (action === "⇤⇥") { //decrease margins
        marginSize = marginSize - 1;
        if (marginSize < 0) {
            marginSize = 0;
        }
        documentDiv.style.marginLeft = marginSize.toString() + "rem";
        documentDiv.style.marginRight = marginSize.toString() + "rem";
    } else if (action === "⟲") {

        backUndo();
        //console.log("undo called");


    } else if (action === "✓") {
        console.log(textarea.spellcheck);
        textarea.spellcheck = !(textarea.spellcheck);
        console.log(textarea.spellcheck);
        textarea.focus();
        //textarea.blur();
    }
    // else if (action === "↹") {
    //     //alert("tab called");
    //     insertTab(textarea);
    //     return;
    // }

    let len = textarea.value.length;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let sel = textarea.value.substring(start, end);

    // This is the selected text and alert it
    //alert(sel);

    let replace = sel;

    if (action === "<b>B</b>") {
        replace = '<b>' + sel + '</b>';
    } else if (action === "<u>U</u>") {
        replace = '<u>' + sel + '</u>';
    } else if (action === "<em>I</em>") {
        replace = '<em>' + sel + '</em>';
    } else if (action === "H1") {
        replace = '<h1>' + sel + '</h1>';
    } else if (action === "H2") {
        replace = '<h2>' + sel + '</h2>';
    } else if (action === "H3") {
        replace = '<h3>' + sel + '</h3>';
    } else if (action === "¶") {
        replace = '<p>' + sel + '</p>';
    } else if (action === "―") {
        replace = '<hr>' + sel;
    } else if (action === "•") {
        replace = '&bullet; ' + sel;
    } else if (action === "↹") {
        replace = "\t" + sel;
    }
    // Here we are replacing the selected text with this one
    textarea.value = textarea.value.substring(0, start) + replace + textarea.value.substring(end, len);
    writeUpdateResult();
    textarea.selectionStart = start + replace.length;
    textarea.selectionEnd = start + replace.length;
    textarea.focus();
    if (action != "⟲") {
        //addUndo();
        updateUndosIfTextChanges();
    }
}

function writeUpdateResult() {
    let currentContents = document.getElementById('text-editor').value;
    //console.dir(document.getElementById('text-editor'));
    //console.log(currentContents);
    document.getElementById('document-result').innerHTML = currentContents.split('\n').join('<br>');
    if (textarea.spellcheck === true) {
        document.getElementById("spell-check").style.color = "green";
    } else {
        document.getElementById("spell-check").style.color = "red";
    }
}

function printDiv(id){
    let mySerializer= new XMLSerializer(id);
    let s = new XMLSerializer();
    let d = document;
    let str = s.serializeToString(d.getElementById(id));
    //var divContents = document.getElementById("GFG").innerHTML;
    var a = window.open('', '');
    a.document.write('<html>');
    a.document.write("<style> #document-result {overflow-wrap: break-word;width: auto;white-space: pre-wrap;} </style>");
    //a.document.write('<body > <h1>Div contents are <br>');
    a.document.write(str);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
}