const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const test=require("node:test");
const {shapes,wheelShapeLabel}=require("../wheel-shapes.js");
const guide=fs.readFileSync(path.join(__dirname,"..","gear-guide.html"),"utf8");

function catalogModelIds(){
 const modelData=guide.slice(guide.indexOf("const MODEL_DATA = {"),guide.indexOf("const CATALOG ="));
 const inlineIds=Array.from(modelData.matchAll(/^"([^"]+)":\{/gm),function(match){return match[1]});
 const catalogEnd=guide.indexOf("const PEDAL_COUNTS =");
 const additionalData=guide.slice(guide.indexOf("const CATALOG ="),catalogEnd);
 const additionalIds=Array.from(additionalData.matchAll(/MODEL_DATA\["([^"]+)"\]=/g),function(match){return match[1]});
 return new Set(inlineIds.concat(additionalIds));
}

test("every gear-guide catalog model has a known wheel-shape classification",function(){
 const ids=catalogModelIds();
 assert.equal(ids.size,58);
 assert.deepEqual(Array.from(ids).filter(function(id){return !shapes[id]}),[]);
 assert.ok(Object.values(shapes).every(function(shape){
  return ["round","flat-bottom","formula-style","no-wheel","varies"].includes(shape);
 }));
});

test("labels rim shape, standalone bases, and bundle-dependent rims clearly",function(){
 assert.equal(wheelShapeLabel("g920"),"Round wheel included");
 assert.equal(wheelShapeLabel("t248-x"),"Flat-bottom wheel included");
 assert.equal(wheelShapeLabel("hori-apex-formula"),"Formula-style wheel included");
 assert.equal(wheelShapeLabel("fanatec-gtdd"),"No wheel included — wheelbase only");
 assert.match(wheelShapeLabel("tx"),/varies by bundle/i);
 assert.match(wheelShapeLabel("unknown"),/not confirmed/i);
});

test("wheel shape is shown on product cards and in comparison specifications",function(){
 assert.match(guide,/<script src="wheel-shapes\.js"><\/script>/);
 assert.match(guide,/<strong>Included wheel:<\/strong>/);
 assert.match(guide,/\{label:"Included wheel shape",values:entries\.map/);
});
