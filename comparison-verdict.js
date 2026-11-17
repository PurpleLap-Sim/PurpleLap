(function(root,factory){
 const verdict=factory();
 if(typeof module==="object"&&module.exports)module.exports=verdict;
 else root.comparisonVerdict=verdict;
})(typeof globalThis==="object"?globalThis:this,function(){
 function comparisonVerdict(entries,facts){
  const first=entries[0],second=entries[1];
  const driveType=function(entry){return entry.item.kind.split("·")[0].trim()};
  const feedbackType=function(entry){
   const kind=entry.item.kind,text=kind+" "+entry.item.description;
   if(/direct drive/i.test(kind))return "direct-drive feedback";
   if(/no true FFB|spring resistance|bungee resistance/i.test(kind)||/does not (?:offer|provide|list) motor-driven force feedback|no (?:motor-driven )?force feedback|without motor-driven force feedback/i.test(text))return "no motor-driven force feedback";
   if(/force[- ]feedback|\bFFB\b/i.test(kind))return "motor-driven force feedback";
   return "feedback type not fully listed";
  };
  const hasMotorFeedback=function(entry){
   const type=feedbackType(entry);
   if(type==="direct-drive feedback"||type==="motor-driven force feedback")return true;
   if(type==="no motor-driven force feedback")return false;
   return null;
  };
  const torqueText=function(entry){
   const torque=facts.getTorque(entry);
   return torque?torque.label:"torque not listed";
  };
  const includedPedals=function(entry){
   const count=facts.getPedalCount(entry);
   if(count===0)return "pedals sold separately";
   if(count==="2-3")return "2–3 pedals, depending on bundle";
   return typeof count==="number"?count+" included":"pedal count not listed";
  };
  const upgradeNote=function(entry){
   if(entry.item.verdict&&entry.item.verdict.upgradeability)return entry.item.verdict.upgradeability;
   const matches=entry.item.description.match(/[^.!?]*(?:detachable[- ]rim|detachable (?:wheel|rim)|fixed[- ](?:rim|wheel)|standalone base|wheelbase only|sold as a base|base[^.!?]*(?:sold separately|sold as a separate)|sold separately[^.!?]*(?:wheel|rim|pedal|base)|separately purchased|separate (?:base|wheel|rim|pedal|component|part|peripheral)|upgrad(?:e|es|ed|ing|able)|optional (?:add-on|accessory|clutch|pedal|shifter|wheel)|modular|quick[- ]release|compatible [^.!?]*wheel)[^.!?]*[.!?]?/gi);
   return matches&&matches.length?matches.join(" ").trim():"No reusable-component or upgrade path is documented in the available description.";
  };
  const lifecycleNote=function(entry){
   if(entry.item.verdict&&entry.item.verdict.lifecycle)return entry.item.verdict.lifecycle;
   const pattern=/[^.!?]*(?:older|previous-generation|legacy|discontinued|upcoming|newer|current-generation)[^.!?]*[.!?]?/gi;
   const matches=entry.item.description.match(pattern);
   if(matches&&matches.length)return matches.join(" ").trim();
   return /older|previous-generation|legacy|discontinued|upcoming|newer|current-generation/i.test(entry.item.kind)?entry.item.kind:"Release date or lifecycle status is not listed.";
  };
  const firstPrice=facts.getPrice(first),secondPrice=facts.getPrice(second);
  const firstTorque=facts.getTorque(first),secondTorque=facts.getTorque(second);
  const manufacturerNotes=[first,second].filter(function(entry){return entry.item.verdict&&entry.item.verdict.capability}).map(function(entry){return entry.item.name+": "+entry.item.verdict.capability}).join(" ");
  const capability="Capability: "+first.item.name+" is "+driveType(first)+" ("+torqueText(first)+"), while "+second.item.name+" is "+driveType(second)+" ("+torqueText(second)+"). Feedback: "+first.item.name+" — "+feedbackType(first)+"; "+second.item.name+" — "+feedbackType(second)+". Listed details: "+first.item.name+" — "+first.item.description+" "+second.item.name+" — "+second.item.description+" These are listed specifications, not independent comparative testing or a lap-time prediction. "+manufacturerNotes;
  let value;
  if(firstPrice!==null&&secondPrice!==null){
   if(firstPrice===secondPrice)value="Value: Both have the same listed starting price ("+facts.formatPrice(firstPrice)+").";
   else{
    const cheaper=firstPrice<secondPrice?first:second,cheaperPrice=Math.min(firstPrice,secondPrice),pricierPrice=Math.max(firstPrice,secondPrice);
    value="Value: "+cheaper.item.name+" has the lower listed starting price ("+facts.formatPrice(cheaperPrice)+" vs "+facts.formatPrice(pricierPrice)+"; "+facts.formatPrice(Math.abs(firstPrice-secondPrice))+" less); confirm the exact bundle and total setup cost.";
   }
  }else value="Value: Current starting prices are not listed for both models, so compare the exact bundles and total setup cost.";
  value+=" Included pedals: "+first.item.name+" has "+includedPedals(first)+"; "+second.item.name+" has "+includedPedals(second)+".";
  const upgrades="Upgrade path: "+first.item.name+": "+upgradeNote(first)+" "+second.item.name+": "+upgradeNote(second);
  const age="Age/status: "+first.item.name+": "+lifecycleNote(first)+" "+second.item.name+": "+lifecycleNote(second);
  let recommendation;
  const directFirst=/direct drive/i.test(driveType(first)),directSecond=/direct drive/i.test(driveType(second));
  const higherTorque=firstTorque&&secondTorque&&firstTorque.value!==null&&secondTorque.value!==null&&firstTorque.value!==secondTorque.value
   ?firstTorque.value>secondTorque.value?first:second:null;
  let capabilityPick=null,capabilityReason="";
  if(directFirst!==directSecond){
   capabilityPick=directFirst?first:second;
   capabilityReason="a direct-drive base";
  }else if(hasMotorFeedback(first)!==null&&hasMotorFeedback(second)!==null&&hasMotorFeedback(first)!==hasMotorFeedback(second)){
   capabilityPick=hasMotorFeedback(first)?first:second;
   capabilityReason="motor-driven force feedback";
  }else if(higherTorque){
   capabilityPick=higherTorque;
   capabilityReason="the higher listed torque rating";
  }
  if(firstPrice!==null&&secondPrice!==null&&firstPrice!==secondPrice&&capabilityPick){
   const cheaper=firstPrice<secondPrice?first:second;
   recommendation="Best fit: If upfront cost is the priority, "+cheaper.item.name+" is the lower-priced option; choose "+capabilityPick.item.name+" if "+capabilityReason+" matters more. Check that the selected version fits your platform: "+first.item.name+" — "+first.item.fit+" "+second.item.name+" — "+second.item.fit;
  }else if(capabilityPick){
   recommendation="Best fit: "+capabilityPick.item.name+" suits buyers prioritizing "+capabilityReason+"; compare its price and bundle against "+(capabilityPick===first?second.item.name:first.item.name)+". Check platform fit before buying: "+first.item.name+" — "+first.item.fit+" "+second.item.name+" — "+second.item.fit;
  }else{
   recommendation="Best fit: Use the listed drive type, included pedals, and bundle cost to choose; neither product is a universal winner. Check platform fit before buying: "+first.item.name+" — "+first.item.fit+" "+second.item.name+" — "+second.item.fit;
  }
  return [capability,value,upgrades+" "+age,recommendation].join("\n\n");
 }
 return comparisonVerdict;
});
