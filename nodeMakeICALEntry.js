

const fs= require("fs");

let calendar = {
    "name": "Calendar",
    "headers": ["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description"],
    "inputTypes": { "Subject": "text", "Start Date": "date", "Start Time": "time", "End Date": "date", "End Time": "time", "Description": "textarea" },
    "data": [
        { "Subject": "hello", "Start Date": "2023-05-11", "Start Time": "05:00", "End Date": "2023-05-11", "End Time": "", "Description": "hi" },
        { "Subject": "yoyo", "Start Date": "2023-04-01", "Start Time": "00:00", "End Date": "2023-04-01", "End Time": "", "Description": "" }
    ]
}

let row = calendar["data"][0];
console.log(row);

function makeVEvent(row, lineTerminator = "\n") {
    let lt = lineTerminator;
    str = "";
    let subject = row["Subject"];
    let startDate = row["Start Date"];
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
    let description = row["Description"];
    let nowDate=new Date();
    let nowString = nowDate.toISOString();
    nowString = ISOStringToICalString(nowString);
    str += "BEGIN:VEVENT" + lt;
    str += "SUMMARY:" + subject + lt;
    str += "DTSTART:" + ISOStringToICalString(htmlDateAndTimeToISOString(startDate, startTime)) + lt;
    str += "DTEND:" + ISOStringToICalString(htmlDateAndTimeToISOString(endDate, endTime)) + lt;
    str += "DESCRIPTION:" + description + lt;
    str += "DTSTAMP:" + nowString + lt;
    str += "UID:" + nowString+Math.random()+lt;
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
    let month = parseInt(date.slice(5, 7));
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

function makeVEventsArr(dataRows){
    let arr=[];
    for (let i=0;i<dataRows.length;i++){
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

console.log(makeVEvent(row));
console.log("");

let eventArrays=makeVEventsArr(calendar["data"]);
console.log(eventArrays);
console.log(makeVCalendar(eventArrays));