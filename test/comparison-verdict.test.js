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

function sentenceCount(text){
 return (text.match(/[.!?](?=\s|$)/g)||[]).length;
}

test("names the better performance pick and the cheaper alternative",function(){
 const products=[
  {id:"starter",name:"Starter Wheel",kind:"Gear-driven force feedback · 2.3 Nm",description:"An all-in-one wheel and pedal set.",fit:"Xbox and PC.",torque:{label:"2.3 Nm",value:2.3},price:250,pedals:3},
  {id:"direct",name:"Direct Wheel",kind:"Direct drive · 3.9 Nm",description:"A bundle with a base, wheel, pedals, and table clamp.",fit:"Xbox and PC.",torque:{label:"3.9 Nm",value:3.9},price:340,pedals:2}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Overall, Direct Wheel is the better choice for performance because it offers direct-drive feedback and higher listed torque \(3\.9 Nm versus 2\.3 Nm\)/);
 assert.match(result,/Starter Wheel is \$90\.00 cheaper and includes 3 pedals versus 2 pedals/);
 assert.match(result,/so choose it if upfront cost matters most/);
 assert.ok(sentenceCount(result)<=4);
});

test("explains the G920 versus R3 budget, age, and upgrade tradeoff",function(){
 const products=[
  {id:"g920",name:"G920 Driving Force",kind:"Gear-driven force feedback · 2.3 Nm",description:"A familiar all-in-one wheel and pedal set with dual-motor force feedback.",fit:"Xbox and PC.",torque:{label:"2.3 Nm",value:2.3},price:299.99,pedals:3,verdict:{capabilitySummary:"dual-motor force feedback",upgradeabilitySummary:"optional shifter; no modular rim/base path documented",lifecycleSummary:"announced in 2015"}},
  {id:"moza-r3-x",name:"R3 Racing Bundle — Xbox & PC",kind:"Direct drive · 3.9 Nm",description:"An Xbox-licensed bundle with the base, ESX wheel, SR-P Lite pedals, and table clamp.",fit:"Xbox and PC with the Xbox bundle.",torque:{label:"3.9 Nm",value:3.9},price:339,pedals:2,verdict:{capabilitySummary:"MOZA lists a 15-bit encoder and claims zero dead zone",upgradeabilitySummary:"quick-release wheel swaps; adjustable pedals with optional clutch and performance kit",lifecycleSummary:"launch date not listed"}}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Overall, R3 Racing Bundle — Xbox & PC is the better choice for performance and future upgrades/);
 assert.match(result,/higher listed torque \(3\.9 Nm versus 2\.3 Nm\)/);
 assert.match(result,/quick-release wheel swaps and pedal add-ons/);
 assert.match(result,/MOZA lists a 15-bit encoder and claims zero dead zone/);
 assert.match(result,/G920 Driving Force is \$39\.01 cheaper and includes 3 pedals versus 2 pedals/);
 assert.match(result,/it was announced in 2015, so choose it if upfront cost matters most/);
 assert.match(result,/so choose it if upfront cost matters most/);
 assert.ok(sentenceCount(result)<=4);
});

test("compares force feedback with non-motorized resistance and uses stated upgrade details",function(){
 const products=[
  {id:"spring",name:"Spring Wheel",kind:"Spring resistance · no true FFB",description:"A basic spring-resistance wheel. It does not offer motor-driven force feedback.",fit:"Xbox.",torque:null,price:80,pedals:2},
  {id:"ffb",name:"Feedback Wheel",kind:"Belt-driven force feedback",description:"A detachable-rim wheelbase with an optional clutch pedal and compatible add-on wheel.",fit:"Xbox and PC.",torque:null,price:150,pedals:3}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Overall, Feedback Wheel is the better choice for performance and future upgrades/);
 assert.match(result,/motor-driven force feedback/);
 assert.match(result,/Spring Wheel is \$70\.00 cheaper and includes 2 pedals versus 3 pedals/);
 assert.ok(sentenceCount(result)<=4);
});

test("prefers documented modular upgrades without inventing an advantage",function(){
 const products=[
  {id:"modular",name:"Modular Wheel",kind:"Belt-driven force feedback · older model",description:"A discontinued detachable-rim wheelbase. Check the compatible wheel and pedals.",fit:"PC.",torque:null,price:null,pedals:0},
  {id:"fixed",name:"Fixed Wheel",kind:"Belt-driven force feedback",description:"A fixed wheel with no documented modular upgrades.",fit:"Xbox.",torque:null,price:null,pedals:0}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Overall, Modular Wheel is the better choice for future upgrades because it offers a detachable-rim upgrade path/);
 assert.match(result,/It is discontinued; verify condition and parts availability/);
 assert.ok(sentenceCount(result)<=4);
});

test("surfaces fixed-rim, separate-base, and newer-model details",function(){
 const products=[
  {id:"fixed",name:"Fixed Wheel",kind:"Hybrid-drive force feedback",description:"A newer fixed-wheel bundle with an optional shifter.",fit:"Xbox.",torque:null,price:null,pedals:2},
  {id:"base",name:"Standalone Base",kind:"Direct drive",description:"A standalone base sold as a base; wheel and pedals are separate components.",fit:"PC.",torque:null,price:null,pedals:0}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Overall, Standalone Base is the better choice for performance because it offers direct-drive feedback/);
 assert.ok(sentenceCount(result)<=4);
});

test("handles missing price and torque data without inventing a winner",function(){
 const products=[
  {id:"one",name:"Wheel One",kind:"Force feedback",description:"A basic wheel.",fit:"PC.",torque:null,price:null,pedals:null},
  {id:"two",name:"Wheel Two",kind:"Force feedback",description:"Another basic wheel.",fit:"PC.",torque:null,price:null,pedals:null}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Neither wheel is clearly better from the documented comparison data/);
 assert.ok(sentenceCount(result)<=4);
});

test("removes the selected wheel from the other comparison menu",function(){
 const products=[{id:"wheel-a"},{id:"wheel-b"},{id:"wheel-c"}];
 const options=availableComparisonOptions(products,"wheel-b");
 assert.match(options.map(function(entry){return entry.id}).join(","),/^wheel-a,wheel-c$/);
});
