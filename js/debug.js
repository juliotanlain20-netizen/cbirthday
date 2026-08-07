"use strict";


window.addEventListener(
"error",
(e)=>{


console.error(
"🔥 AURORA ERROR",
{

message:e.message,

file:e.filename,

line:e.lineno

}

);


});



window.addEventListener(
"unhandledrejection",
(e)=>{


console.error(
"🔥 PROMISE ERROR",
e.reason
);


});



console.log(
"✓ Debug Monitor Active"
);