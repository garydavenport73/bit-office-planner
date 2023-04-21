const fs=require('fs');
let str="";
str+=fs.readFileSync("globalVariables.js","utf-8");
str+=fs.readFileSync("csvreaderwriter.js","utf-8");
str+=fs.readFileSync("commonFunctions.js","utf-8");
str+=fs.readFileSync("calendar_javascript.js","utf-8");
str+=fs.readFileSync("contacts_javascript.js","utf-8");
fs.writeFileSync("javascript.js",str,"utf8");

