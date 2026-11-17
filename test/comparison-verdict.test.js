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

test("balances lower price against drive capability and included pedals",function(){
 const products=[
  {id:"starter",name:"Starter Wheel",kind:"Gear-driven force feedback · 2.3 Nm",description:"An all-in-one wheel and pedal set.",fit:"Xbox and PC.",torque:{label:"2.3 Nm",value:2.3},price:250,pedals:3},
  {id:"direct",name:"Direct Wheel",kind:"Direct drive · 3.9 Nm",description:"A bundle with a base, wheel, pedals, and table clamp.",fit:"Xbox and PC.",torque:{label:"3.9 Nm",value:3.9},price:340,pedals:2}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Drive: Starter Wheel is Gear-driven force feedback \(2\.3 Nm\), while Direct Wheel is Direct drive \(3\.9 Nm\)/);
 assert.match(result,/Starter Wheel starts at \$250\.00, \$90\.00 less than Direct Wheel \(\$340\.00\), and includes 3 pedals versus 2 pedals/);
 assert.match(result,/Choose Starter Wheel if upfront cost is the priority, or Direct Wheel if direct drive and upgrade potential matter more/);
 assert.equal(sentenceCount(result),4);
});

test("explains the G920 versus R3 budget, age, and upgrade tradeoff",function(){
 const products=[
  {id:"g920",name:"G920 Driving Force",kind:"Gear-driven force feedback · 2.3 Nm",description:"A familiar all-in-one wheel and pedal set with dual-motor force feedback.",fit:"Xbox and PC.",torque:{label:"2.3 Nm",value:2.3},price:299.99,pedals:3,verdict:{capabilitySummary:"dual-motor force feedback",upgradeabilitySummary:"optional shifter; no modular rim/base path documented",lifecycleSummary:"announced in 2015"}},
  {id:"moza-r3-x",name:"R3 Racing Bundle — Xbox & PC",kind:"Direct drive · 3.9 Nm",description:"An Xbox-licensed bundle with the base, ESX wheel, SR-P Lite pedals, and table clamp.",fit:"Xbox and PC with the Xbox bundle.",torque:{label:"3.9 Nm",value:3.9},price:339,pedals:2,verdict:{capabilitySummary:"MOZA lists a 15-bit encoder and claims zero dead zone",upgradeabilitySummary:"quick-release wheel swaps; adjustable pedals with optional clutch and performance kit",lifecycleSummary:"launch date not listed"}}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/G920 Driving Force starts at \$299\.99, \$39\.01 less than R3 Racing Bundle — Xbox & PC \(\$339\.00\), and includes 3 pedals versus 2 pedals/);
 assert.match(result,/R3 Racing Bundle — Xbox & PC: MOZA lists a 15-bit encoder and claims zero dead zone/);
 assert.match(result,/G920 Driving Force — optional shifter; no modular rim\/base path documented, announced in 2015/);
 assert.match(result,/quick-release wheel swaps; adjustable pedals with optional clutch and performance kit, launch date not listed/);
 assert.match(result,/Choose G920 Driving Force if upfront cost is the priority, or R3 Racing Bundle — Xbox & PC if direct drive and upgrade potential matter more/);
 assert.equal(sentenceCount(result),4);
});

test("compares force feedback with non-motorized resistance and uses stated upgrade details",function(){
 const products=[
  {id:"spring",name:"Spring Wheel",kind:"Spring resistance · no true FFB",description:"A basic spring-resistance wheel. It does not offer motor-driven force feedback.",fit:"Xbox.",torque:null,price:80,pedals:2},
  {id:"ffb",name:"Feedback Wheel",kind:"Belt-driven force feedback",description:"A detachable-rim wheelbase with an optional clutch pedal and compatible add-on wheel.",fit:"Xbox and PC.",torque:null,price:150,pedals:3}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Spring Wheel is Spring resistance.*Feedback Wheel is Belt-driven force feedback/);
 assert.match(result,/Feedback Wheel if motor-driven force feedback and upgrade potential matter more/);
 assert.match(result,/a detachable rim/);
 assert.match(result,/includes 2 pedals versus 3 pedals/);
 assert.equal(sentenceCount(result),4);
});

test("uses only documented upgrade and lifecycle evidence",function(){
 const products=[
  {id:"modular",name:"Modular Wheel",kind:"Belt-driven force feedback · older model",description:"A discontinued detachable-rim wheelbase. Check the compatible wheel and pedals.",fit:"PC.",torque:null,price:null,pedals:0},
  {id:"bundle",name:"Bundle Wheel",kind:"Direct drive",description:"A starter bundle with wheel and pedals.",fit:"Xbox.",torque:null,price:null,pedals:"2-3"}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Modular Wheel — a detachable rim, discontinued/);
 assert.match(result,/Bundle Wheel — no upgrade path listed, launch date not listed/);
});

test("surfaces fixed-rim, separate-base, and newer-model details",function(){
 const products=[
  {id:"fixed",name:"Fixed Wheel",kind:"Hybrid-drive force feedback",description:"A newer fixed-wheel bundle with an optional shifter.",fit:"Xbox.",torque:null,price:null,pedals:2},
  {id:"base",name:"Standalone Base",kind:"Direct drive",description:"A standalone base sold as a base; wheel and pedals are separate components.",fit:"PC.",torque:null,price:null,pedals:0}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/Fixed Wheel — a fixed wheel with an optional shifter, newer model/);
 assert.match(result,/Standalone Base — a separate base and peripherals/);
 assert.equal(sentenceCount(result),4);
});

test("handles missing price and torque data without inventing a winner",function(){
 const products=[
  {id:"one",name:"Wheel One",kind:"Force feedback",description:"A basic wheel.",fit:"PC.",torque:null,price:null,pedals:null},
  {id:"two",name:"Wheel Two",kind:"Force feedback",description:"Another basic wheel.",fit:"PC.",torque:null,price:null,pedals:null}
 ];
 const result=comparisonVerdict(products.map(function(product){return {id:product.id,item:product}}),factsFor(products));
 assert.match(result,/torque not listed/);
 assert.match(result,/Current prices are not listed for both/);
 assert.match(result,/Neither is a universal winner/);
 assert.match(result,/platform compatibility/);
 assert.equal(sentenceCount(result),4);
});

test("removes the selected wheel from the other comparison menu",function(){
 const products=[{id:"wheel-a"},{id:"wheel-b"},{id:"wheel-c"}];
 const options=availableComparisonOptions(products,"wheel-b");
 assert.match(options.map(function(entry){return entry.id}).join(","),/^wheel-a,wheel-c$/);
});
