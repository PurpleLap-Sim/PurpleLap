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
   return null;
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
  const pedalText=function(entry){
   const count=facts.getPedalCount(entry);
   if(count===0)return "pedals sold separately";
   if(count==="2-3")return "2–3 pedals (bundle varies)";
   return typeof count==="number"?count+" pedals":"pedal count not listed";
  };
  const upgradeSummary=function(entry){
   const verdict=entry.item.verdict||{},description=entry.item.description;
   if(verdict.upgradeabilitySummary)return verdict.upgradeabilitySummary;
   if(/fixed[- ](?:rim|wheel)/i.test(description))return /optional [^.!?]*shifter/i.test(description)?"a fixed wheel with an optional shifter":"a fixed wheel";
   if(/optional [^.!?]*shifter/i.test(description))return "an optional shifter";
   if(/detachable[- ]rim|detachable (?:wheel|rim)/i.test(description))return "a detachable rim";
   if(/standalone base|wheelbase only|sold as a base|separate base|base[^.!?]*sold separately/i.test(description))return "a separate base and peripherals";
   if(/upgrad(?:e|es|ed|ing|able)|optional (?:add-on|accessory|clutch|pedal|shifter|wheel)|modular|quick[- ]release/i.test(description))return "documented upgrades or add-ons";
   return "no upgrade path listed";
  };
  const lifecycleSummary=function(entry){
   const verdict=entry.item.verdict||{},text=entry.item.kind+" "+entry.item.description;
   if(verdict.lifecycleSummary)return verdict.lifecycleSummary;
   if(/discontinued/i.test(text))return "discontinued";
   if(/legacy/i.test(text))return "legacy";
   if(/older|previous-generation/i.test(text))return "older model";
   if(/upcoming/i.test(text))return "upcoming model";
   if(/newer|current-generation/i.test(text))return "newer model";
   return "launch date not listed";
  };
  const firstPrice=facts.getPrice(first),secondPrice=facts.getPrice(second);
  const firstTorque=facts.getTorque(first),secondTorque=facts.getTorque(second);
  const capabilityNotes=[first,second].filter(function(entry){return entry.item.verdict&&entry.item.verdict.capabilitySummary}).map(function(entry){return entry.item.name+": "+entry.item.verdict.capabilitySummary}).join("; ");
  const capabilitySentence="Drive: "+first.item.name+" is "+driveType(first)+" ("+torqueText(first)+"), while "+second.item.name+" is "+driveType(second)+" ("+torqueText(second)+")"+(capabilityNotes?"; "+capabilityNotes:"")+".";
  let valueSentence;
  if(firstPrice!==null&&secondPrice!==null){
   const firstPedals=pedalText(first),secondPedals=pedalText(second);
   if(firstPrice===secondPrice)valueSentence="Value: Both start at "+facts.formatPrice(firstPrice)+"; "+first.item.name+" has "+firstPedals+" and "+second.item.name+" has "+secondPedals+".";
   else{
    const cheaper=firstPrice<secondPrice?first:second,pricier=cheaper===first?second:first;
    const cheaperPrice=Math.min(firstPrice,secondPrice),pricierPrice=Math.max(firstPrice,secondPrice);
    valueSentence="Value: "+cheaper.item.name+" starts at "+facts.formatPrice(cheaperPrice)+", "+facts.formatPrice(Math.abs(firstPrice-secondPrice))+" less than "+pricier.item.name+" ("+facts.formatPrice(pricierPrice)+"), and includes "+pedalText(cheaper)+" versus "+pedalText(pricier)+".";
   }
  }else valueSentence="Value: Current prices are not listed for both; compare complete bundle costs and included pedals ("+first.item.name+": "+pedalText(first)+"; "+second.item.name+": "+pedalText(second)+").";
  const upgradeSentence="Upgrades/age: "+first.item.name+" — "+upgradeSummary(first)+", "+lifecycleSummary(first)+"; "+second.item.name+" — "+upgradeSummary(second)+", "+lifecycleSummary(second)+".";
  const directFirst=/direct drive/i.test(driveType(first)),directSecond=/direct drive/i.test(driveType(second));
  const higherTorque=firstTorque&&secondTorque&&firstTorque.value!==null&&secondTorque.value!==null&&firstTorque.value!==secondTorque.value
   ?firstTorque.value>secondTorque.value?first:second:null;
  let capabilityPick=null,capabilityReason="";
  if(directFirst!==directSecond){
   capabilityPick=directFirst?first:second;
   capabilityReason="direct drive";
  }else if(hasMotorFeedback(first)!==null&&hasMotorFeedback(second)!==null&&hasMotorFeedback(first)!==hasMotorFeedback(second)){
   capabilityPick=hasMotorFeedback(first)?first:second;
   capabilityReason="motor-driven force feedback";
  }else if(higherTorque){
   capabilityPick=higherTorque;
   capabilityReason="higher listed torque";
  }
  let recommendation;
  if(firstPrice!==null&&secondPrice!==null&&firstPrice!==secondPrice&&capabilityPick){
   const cheaper=firstPrice<secondPrice?first:second;
   recommendation="Best fit: Choose "+cheaper.item.name+" if upfront cost is the priority, or "+capabilityPick.item.name+" if "+capabilityReason+" and upgrade potential matter more; verify the exact platform version.";
  }else if(capabilityPick){
   recommendation="Best fit: Choose "+capabilityPick.item.name+" if "+capabilityReason+" matters most; compare complete bundle cost and verify the exact platform version.";
  }else{
   recommendation="Best fit: Neither is a universal winner; decide by budget, feedback preference, bundle contents, and platform compatibility.";
  }
  return [capabilitySentence,valueSentence,upgradeSentence,recommendation].join("\n");
 }
 return comparisonVerdict;
});
