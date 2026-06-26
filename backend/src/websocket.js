const WebSocket = require("ws");

const wss = new WebSocket.Server({
 port:8080
});

let drones = [

 {
   id:"ALPHA",
   lat:-2.5337,
   lng:140.7181,
   heading:25
 },

 {
   id:"BRAVO",
   lat:-2.5537,
   lng:140.7381,
   heading:120
 },

 {
   id:"CHARLIE",
   lat:-2.5737,
   lng:140.7581,
   heading:240
 }

];

let threats = [

 {
   id:"ENEMY-01",
   lat:-2.5200,
   lng:140.7200,
   level:"HIGH"
 }

];

function simulate(){

 drones = drones.map((d)=>({

   ...d,

   lat:d.lat + (Math.random()*0.001),

   lng:d.lng + (Math.random()*0.001),

   heading:d.heading + 5

 }));

 return {

   drones,

   threats

 };

}

wss.on("connection",(ws)=>{

 console.log("Telemetry connected");

 setInterval(()=>{

   ws.send(
     JSON.stringify(
       simulate()
     )
   );

 },1000);

});

console.log("WebSocket running 8080");
