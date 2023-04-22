const fs=require('fs');
let str="";
str+=fs.readFileSync("globalVariables.js","utf-8");
str+=fs.readFileSync("csvreaderwriter.js","utf-8");
str+=fs.readFileSync("commonFunctions.js","utf-8");
str+=fs.readFileSync("planner.js","utf-8");
str+=fs.readFileSync("nestedmenu.js","utf8");
fs.writeFileSync("javascript.js",str,"utf8");

