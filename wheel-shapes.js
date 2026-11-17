(function(root) {
 const shapes={
  "g920":"round","g29":"round","g923-x":"round","g923-ps":"round",
  "pro-x":"round","pro-ps":"round",
  "t128-x":"round","t128-ps":"round","t248-x":"flat-bottom","t248-ps":"flat-bottom",
  "tmx":"round","t150":"round","tx":"varies","tsxw":"formula-style",
  "t300":"round","t500":"round","tgt":"round","t248r":"flat-bottom",
  "t598-x":"flat-bottom","t598-ps":"flat-bottom","t818":"no-wheel",
  "t98-x":"round","t98-ps":"round","t80":"round","ferrari458":"round",
  "moza-r3-x":"round","moza-r3-pc":"round","moza-r5":"round",
  "moza-r9":"no-wheel","moza-r12-x":"round","moza-r12":"no-wheel",
  "fanatec-csl":"no-wheel","fanatec-gtdd":"no-wheel","fanatec-csl-elite":"no-wheel",
  "fanatec-csdd":"no-wheel","fanatec-csddplus":"no-wheel","fanatec-podium":"no-wheel",
  "fanatec-dd1":"no-wheel","fanatec-dd2":"no-wheel",
  "hori-overdrive":"round","hori-apex":"round","hori-wireless":"round",
  "hori-ffb":"round","hori-wireless-overdrive":"round","hori-apex-formula":"formula-style",
  "pc-g29":"round","pc-g923":"round","pc-pro":"round",
  "pc-t128":"round","pc-t248":"flat-bottom","pc-t300":"round","pc-t598":"flat-bottom",
  "pc-tmx-t150":"round",
  "simucube-2-sport":"no-wheel","simucube-2-pro":"no-wheel",
  "simagic-alpha-mini":"no-wheel","simagic-alpha":"no-wheel","simagic-alpha-u":"no-wheel"
 };
 const labels={
  "round":"Round wheel included",
  "flat-bottom":"Flat-bottom wheel included",
  "formula-style":"Formula-style wheel included",
  "no-wheel":"No wheel included — wheelbase only",
  "varies":"Wheel shape varies by bundle — check the exact rim"
 };
 function wheelShapeLabel(id) {
  return labels[shapes[id]]||"Included wheel shape not confirmed — check the exact bundle";
 }
 const api={shapes:shapes,wheelShapeLabel:wheelShapeLabel};
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 root.PurpleLapWheelShapes=api;
})(typeof globalThis!=="undefined"?globalThis:this);
