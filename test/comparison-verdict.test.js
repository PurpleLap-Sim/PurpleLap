const assert=require("node:assert/strict");
const test=require("node:test");
const comparisonVerdict=require("../comparison-verdict.js");
const availableComparisonOptions=require("../comparison-options.js");

function factsFor(products){
 const byId=Object.fromEntries(products.map(function(product){return [product.id,product]}));
 return {
  getTorque:function(entry){return byId[entry.id].torque},
  getPrice:function(entry){return byId[entry.id].price},
  getPedalCount:function(entry){return byId[entry.id].pedals},
  formatPrice:function(value){return "$"+value.toFixed(2)}
 };
}

test("balances lower price against drive capability and included pedals",function(){
 const products=[
  {id:"starter",name:"Starter Wheel",kind:"Gear-driven force feedback · 2.3 Nm",description:"An all-in-one wheel and pedal set.",fit:"Xbox and PC.",torque:{label:"2.3 Nm",value:2.3},price:250,pedals:3},
  {id:"direct",name:"Direct Wheel",kind:"Direct drive · 3.9 Nm",description:"A bundle with a base, wheel, pedals, and table clamp.",fit:"Xbox and PC.",torque:{label:"3.9 Nm",value:3.9},price:340,pedals:2}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Gear-driven force feedback \(2\.3 Nm\).*Direct drive \(3\.9 Nm\)/);
 assert.match(result,/Starter Wheel has the lower listed starting price/);
 assert.match(result,/3 included.*2 included/);
 assert.match(result,/choose Direct Wheel if a direct-drive base matters more/);
 assert.match(result,/not independent comparative testing or a lap-time prediction/);
 assert.match(result,/table clamp/);
 assert.match(result,/direct-drive feedback/);
});

test("explains the G920 versus R3 budget, age, and upgrade tradeoff",function(){
 const products=[
  {id:"g920",name:"G920 Driving Force",kind:"Gear-driven force feedback · 2.3 Nm",description:"A familiar all-in-one wheel and pedal set with dual-motor force feedback.",fit:"Xbox and PC.",torque:{label:"2.3 Nm",value:2.3},price:299.99,pedals:3,verdict:{capability:"Logitech describes dual-motor force feedback with helical anti-backlash gearing.",upgradeability:"Logitech lists an optional Driving Force Shifter, but no interchangeable rim or modular wheelbase and pedal upgrade route.",lifecycle:"Announced by Logitech in June 2015, with retail availability expected in October 2015."}},
  {id:"moza-r3-x",name:"R3 Racing Bundle — Xbox & PC",kind:"Direct drive · 3.9 Nm",description:"An Xbox-licensed bundle with the base, ESX wheel, SR-P Lite pedals, and table clamp.",fit:"Xbox and PC with the Xbox bundle.",torque:{label:"3.9 Nm",value:3.9},price:339,pedals:2,verdict:{capability:"MOZA lists a 15-bit encoder and claims its direct-drive feedback provides zero dead zone.",upgradeability:"MOZA quick release supports swapping MOZA wheels; SR-P Lite pedals have adjustable spacing and height, with an optional clutch and performance kit. Verify Xbox licensing before changing rims.",lifecycle:"MOZA's support page documents the current bundle but does not state its launch date."}}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/G920 Driving Force has the lower listed starting price \(\$299\.99 vs \$339\.00; \$39\.01 less\)/);
 assert.match(result,/G920 Driving Force has 3 included; R3 Racing Bundle — Xbox & PC has 2 included/);
 assert.match(result,/R3 Racing Bundle — Xbox & PC if a direct-drive base matters more/);
 assert.match(result,/claims its direct-drive feedback provides zero dead zone/);
 assert.match(result,/June 2015/);
 assert.match(result,/swapping MOZA wheels.*adjustable spacing and height.*optional clutch and performance kit/);
 assert.match(result,/Verify Xbox licensing before changing rims/);
});

test("compares force feedback with non-motorized resistance and uses stated upgrade details",function(){
 const products=[
  {id:"spring",name:"Spring Wheel",kind:"Spring resistance · no true FFB",description:"A basic spring-resistance wheel. It does not offer motor-driven force feedback.",fit:"Xbox.",torque:null,price:80,pedals:2},
  {id:"ffb",name:"Feedback Wheel",kind:"Belt-driven force feedback",description:"A detachable-rim wheelbase with an optional clutch pedal and compatible add-on wheel.",fit:"Xbox and PC.",torque:null,price:150,pedals:3}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Spring Wheel — no motor-driven force feedback; Feedback Wheel — motor-driven force feedback/);
 assert.match(result,/choose Feedback Wheel if motor-driven force feedback matters more/);
 assert.match(result,/detachable-rim wheelbase with an optional clutch pedal and compatible add-on wheel/);
 assert.match(result,/Spring Wheel has 2 included; Feedback Wheel has 3 included/);
});

test("uses only documented upgrade and lifecycle evidence",function(){
 const products=[
  {id:"modular",name:"Modular Wheel",kind:"Belt-driven force feedback · older model",description:"A discontinued detachable-rim wheelbase. Check the compatible wheel and pedals.",fit:"PC.",torque:null,price:null,pedals:0},
  {id:"bundle",name:"Bundle Wheel",kind:"Direct drive",description:"A starter bundle with wheel and pedals.",fit:"Xbox.",torque:null,price:null,pedals:"2-3"}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/detachable-rim wheelbase/);
 assert.match(result,/No reusable-component or upgrade path is documented/);
 assert.match(result,/discontinued detachable-rim wheelbase/);
 assert.match(result,/Release date or lifecycle status is not listed/);
});

test("surfaces fixed-rim, separate-base, and newer-model details",function(){
 const products=[
  {id:"fixed",name:"Fixed Wheel",kind:"Hybrid-drive force feedback",description:"A newer fixed-wheel bundle with an optional shifter.",fit:"Xbox.",torque:null,price:null,pedals:2},
  {id:"base",name:"Standalone Base",kind:"Direct drive",description:"A standalone base sold as a base; wheel and pedals are separate components.",fit:"PC.",torque:null,price:null,pedals:0}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/newer fixed-wheel bundle with an optional shifter/);
 assert.match(result,/sold as a base; wheel and pedals are separate components/);
 assert.match(result,/Age\/status: Fixed Wheel: A newer fixed-wheel bundle/);
});

test("handles missing price and torque data without inventing a winner",function(){
 const products=[
  {id:"one",name:"Wheel One",kind:"Force feedback",description:"A basic wheel.",fit:"PC.",torque:null,price:null,pedals:null},
  {id:"two",name:"Wheel Two",kind:"Force feedback",description:"Another basic wheel.",fit:"PC.",torque:null,price:null,pedals:null}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/torque not listed/);
 assert.match(result,/Current starting prices are not listed for both models/);
 assert.match(result,/neither product is a universal winner/);
 assert.match(result,/Check platform fit before buying/);
});

test("removes the selected wheel from the other comparison menu",function(){
 const products=[{id:"wheel-a"},{id:"wheel-b"},{id:"wheel-c"}];
 const options=availableComparisonOptions(products,"wheel-b");
 assert.match(options.map(function(entry){return entry.id}).join(","),/^wheel-a,wheel-c$/);
});
