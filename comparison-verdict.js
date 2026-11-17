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
  const hasModularUpgrades=function(entry){
   const verdict=entry.item.verdict||{},text=verdict.upgradeabilitySummary||entry.item.description;
   if(/\bno\b[^;,.]*\b(?:modular|upgrade|upgrades|interchangeable|detachable|quick[- ]release)\b[^;,.]*\b(?:path|upgrade|upgrades|rim|wheelbase|components?)\b/i.test(text))return false;
   return /quick[- ]release|wheel swaps|detachable[- ]rim|detachable (?:wheel|rim)|interchangeable|modular|component-by-component|optional (?:clutch|pedal)[^;,.]*(?:kit|upgrade|add-on)/i.test(text);
  };
  const lifecycleNote=function(entry){
   const status=lifecycleSummary(entry);
   if(/^announced in \d{4}$/.test(status))return "it was "+status;
   if(/^(?:discontinued|legacy|older model|upcoming model|newer model)$/.test(status))return "it is "+status;
   return null;
  };
  const upgradeReason=function(entry){
   const verdict=entry.item.verdict||{},text=verdict.upgradeabilitySummary||entry.item.description;
   const wheel=/quick[- ]release|wheel swaps|detachable[- ]rim|detachable (?:wheel|rim)|interchangeable/i.test(text);
   const pedals=/pedal[^;,.]*(?:optional|upgrade|add-on|kit)|(?:optional|upgrade|add-on|kit)[^;,.]*pedal|clutch|performance kit/i.test(text);
   if(wheel&&pedals&&/quick[- ]release|wheel swaps/i.test(text))return "quick-release wheel swaps and pedal add-ons";
   if(wheel&&pedals)return "documented wheel and pedal upgrades";
   if(wheel)return "a detachable-rim upgrade path";
   if(pedals)return "documented pedal upgrades";
   return "documented component-upgrade options";
  };
  const firstPrice=facts.getPrice(first),secondPrice=facts.getPrice(second);
  const firstTorque=facts.getTorque(first),secondTorque=facts.getTorque(second);
  const directFirst=/direct drive/i.test(driveType(first)),directSecond=/direct drive/i.test(driveType(second));
  const higherTorque=firstTorque&&secondTorque&&firstTorque.value!==null&&secondTorque.value!==null&&firstTorque.value!==secondTorque.value
   ?firstTorque.value>secondTorque.value?first:second:null;
  let capabilityPick=null;
  if(directFirst!==directSecond){
   capabilityPick=directFirst?first:second;
  }else if(hasMotorFeedback(first)!==null&&hasMotorFeedback(second)!==null&&hasMotorFeedback(first)!==hasMotorFeedback(second)){
   capabilityPick=hasMotorFeedback(first)?first:second;
  }else if(higherTorque){
   capabilityPick=higherTorque;
  }
  const firstUpgrade=hasModularUpgrades(first),secondUpgrade=hasModularUpgrades(second);
  const upgradePick=firstUpgrade!==secondUpgrade?(firstUpgrade?first:second):null;
  const firstPedals=facts.getPedalCount(first),secondPedals=facts.getPedalCount(second);
  let winner=capabilityPick||upgradePick,winnerType=capabilityPick?"performance":"upgrade";
  if(!winner&&firstPrice!==null&&secondPrice!==null&&firstPrice!==secondPrice){
   winner=firstPrice<secondPrice?first:second;
   winnerType="value";
  }else if(!winner&&typeof firstPedals==="number"&&typeof secondPedals==="number"&&firstPedals!==secondPedals){
   winner=firstPedals>secondPedals?first:second;
   winnerType="bundle value";
  }
  if(!winner)return "Neither wheel is clearly better from the documented comparison data; choose based on your budget, platform, and preferred feedback.";
  const other=winner===first?second:first;
  const winnerTorque=winner===first?firstTorque:secondTorque,otherTorque=winner===first?secondTorque:firstTorque;
  const winnerDirect=winner===first?directFirst:directSecond,otherDirect=winner===first?directSecond:directFirst;
  const winnerFeedback=hasMotorFeedback(winner),otherFeedback=hasMotorFeedback(other);
  const reasons=[];
  if(winnerDirect!==otherDirect&&winnerDirect)reasons.push("direct-drive feedback");
  else if(winnerFeedback!==null&&otherFeedback!==null&&winnerFeedback!==otherFeedback&&winnerFeedback)reasons.push("motor-driven force feedback");
  if(higherTorque===winner&&winnerTorque&&otherTorque)reasons.push("higher listed torque ("+winnerTorque.label+" versus "+otherTorque.label+")");
  if(upgradePick===winner)reasons.push(upgradeReason(winner));
  if(winnerType==="value")reasons.push("the lower listed price");
  if(winnerType==="bundle value")reasons.push("more included pedals");
  const capabilitySummary=winner.item.verdict&&winner.item.verdict.capabilitySummary;
  const additionalEvidence=[];
  if(capabilitySummary&&/encoder|dead zone|trueforce/i.test(capabilitySummary))additionalEvidence.push(capabilitySummary);
  const isCheaper=firstPrice!==null&&secondPrice!==null&&firstPrice!==secondPrice
   ?(firstPrice<secondPrice?first:second):null;
  let firstSentence;
  if(winnerType==="value"){
   firstSentence="Overall, "+winner.item.name+" is the better value at "+facts.formatPrice(facts.getPrice(winner))+" because no stronger documented performance advantage separates the two.";
  }else{
   const pickLabel=winnerType==="upgrade"?"for future upgrades":winnerType==="bundle value"?"for bundle value":upgradePick===winner?"for performance and future upgrades":"for performance";
   const joinedReasons=reasons.length>2?reasons.slice(0,-1).join(", ")+", and "+reasons[reasons.length-1]:reasons.length===2?reasons.join(" and "):reasons[0];
   firstSentence="Overall, "+winner.item.name+" is the better choice "+pickLabel+" because it offers "+joinedReasons+".";
  }
  if(additionalEvidence.length)firstSentence=firstSentence.slice(0,-1)+"; "+additionalEvidence.join("; ")+".";
  const sentences=[firstSentence];
  if(isCheaper){
   const saving=facts.formatPrice(Math.abs(firstPrice-secondPrice));
   const cheaperPedals=facts.getPedalCount(isCheaper),pricier=facts.getPedalCount(isCheaper===first?second:first);
   const pedalDifference=typeof cheaperPedals==="number"&&typeof pricier==="number"&&cheaperPedals!==pricier
    ?" and includes "+pedalText(isCheaper)+" versus "+pedalText(isCheaper===first?second:first):"";
   if(isCheaper===winner){
    if(winnerType!=="value"||pedalDifference)sentences.push("It is also "+saving+" cheaper"+pedalDifference+".");
   }
   else{
    const note=lifecycleNote(isCheaper);
    const cheaperSentence=isCheaper.item.name+" is "+saving+" cheaper"+pedalDifference;
    if(note&&/discontinued|legacy/.test(lifecycleSummary(isCheaper)))sentences.push(cheaperSentence+"; "+note+", so verify condition and parts availability before considering it.");
    else sentences.push(cheaperSentence+(note?"; "+note:"")+", so choose it if upfront cost matters most.");
   }
  }else if(typeof firstPedals==="number"&&typeof secondPedals==="number"&&firstPedals!==secondPedals){
   const pedalWinner=firstPedals>secondPedals?first:second;
   if(pedalWinner!==winner)sentences.push(pedalWinner.item.name+" includes "+pedalText(pedalWinner)+" versus "+pedalText(winner)+".");
  }
  const winnerLifecycle=lifecycleSummary(winner);
  if(/^(?:discontinued|legacy)$/.test(winnerLifecycle)){
   const note=lifecycleNote(winner);
   sentences.push(note.charAt(0).toUpperCase()+note.slice(1)+"; verify condition and parts availability.");
  }
  return sentences.join(" ");
 }
 return comparisonVerdict;
});
