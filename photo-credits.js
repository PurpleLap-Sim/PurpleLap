(function(root) {
 const photographs=[
  {file:"images/home-racing-simulator.jpg",title:"Homepage racing simulator",credit:"Source attribution not recorded in the repository."},
  {file:"images/home-race-circuit.jpg",title:"Homepage race circuit",credit:"Source attribution not recorded in the repository."},
  {file:"images/home-sim-setup.jpg",title:"Homepage sim-racing setup",credit:"Source attribution not recorded in the repository."},
  {file:"images/wheel-setup.jpg",title:"Sim-racing wheel setup",credit:"Source attribution not recorded in the repository."},
  {file:"images/first-laps.jpg",title:"First-laps simulator photo",credit:"Source attribution not recorded in the repository."},
  {file:"images/racecraft.jpg",title:"Racecraft cars photo",credit:"Source attribution not recorded in the repository."},
  {file:"images/guerrieri-sim-racing.jpg",title:"Guerrieri sim-racing setup",credit:"Krémer Krisztián via Wikimedia Commons · Public domain.",source:"https://commons.wikimedia.org/wiki/File:Guerrieri_sim_racing_(33887224883).jpg"},
  {file:"images/xbox-series-carbon-black-controller.jpg",title:"Xbox Series controller",credit:"uKER via Wikimedia Commons · CC BY-SA 4.0.",source:"https://commons.wikimedia.org/wiki/File:Xbox_Series_Controller_Carbon_Black.jpg",license:"https://creativecommons.org/licenses/by-sa/4.0/"},
  {file:"images/bmw-drift-open-2023.jpg",title:"BMW Drift Open 2023",credit:"Alex Eddit via Wikimedia Commons · CC BY-SA 4.0.",source:"https://commons.wikimedia.org/wiki/File:Huragan_racing_team%E2%80%99s_BMW_e92_at_the_2nd_round_of_the_2023_Drift_Open_Championship.jpg",license:"https://creativecommons.org/licenses/by-sa/4.0/"},
  {file:"images/buenos-aires-rain-race.jpg",title:"Buenos Aires rain race",credit:"Just a Man via Wikimedia Commons · CC BY 4.0.",source:"https://commons.wikimedia.org/wiki/File:200km_de_Buenos_Aires_2025._S%C3%A1bado,_Parte_Inicial_-_16.jpg",license:"https://creativecommons.org/licenses/by/4.0/"},
  {file:"images/days-of-thunder.jpg",title:"Days of Thunder race cars",credit:"BWard 1997 via Wikimedia Commons · CC BY-SA 4.0.",source:"https://commons.wikimedia.org/wiki/File:Days_of_Thunder_Race_Cars_on_Track_Rockingham_2004.jpg",license:"https://creativecommons.org/licenses/by-sa/4.0/"},
  {file:"images/racing-tire-management.jpg",title:"Racing tire at Sonoma",credit:"TaurusEmerald via Wikimedia Commons · CC BY-SA 4.0.",source:"https://commons.wikimedia.org/wiki/File:Goodyear_Slick_Racing_Tire_Sonoma_2025.jpg",license:"https://creativecommons.org/licenses/by-sa/4.0/"},
  {file:"images/racing-dashboard-analysis.jpg",title:"Historic Honda dashboard",credit:"Zytonits via Wikimedia Commons · CC BY-SA 2.0.",source:"https://commons.wikimedia.org/wiki/File:1964_Honda_Race_Car_dashboard_(20849400968).jpg",license:"https://creativecommons.org/licenses/by-sa/2.0/"},
  {file:"images/race-strategy-pit-stop.jpg",title:"Stock-car pit stop",credit:"Brandon Zeman via Wikimedia Commons · CC BY-SA 2.0.",source:"https://commons.wikimedia.org/wiki/File:Pit_Stop_Action_(3711847632).jpg",license:"https://creativecommons.org/licenses/by-sa/2.0/"},
  {file:"images/vincenzo-imola-1990.jpg",title:"Vincenzo Sospiri at Imola, 1990",credit:"Carlom1961 via Wikimedia Commons · CC BY-SA 4.0.",source:"https://commons.wikimedia.org/wiki/File:Vincenzo_Sospiri_David_Sears_Racing_Imola_1990.jpg",license:"https://creativecommons.org/licenses/by-sa/4.0/"},
 ];
 const productPhotoFiles=[
  "assets/wheels/fanatec-csdd-0.png","assets/wheels/fanatec-csddplus-0.png","assets/wheels/fanatec-csl-0.png","assets/wheels/fanatec-csl-elite-0.png","assets/wheels/fanatec-dd1-0.png","assets/wheels/fanatec-dd2-0.png","assets/wheels/fanatec-gtdd-0.png","assets/wheels/fanatec-podium-0.png",
  "assets/wheels/ferrari458-0.png","assets/wheels/g29-0.png","assets/wheels/g920-0.png","assets/wheels/g923-ps-0.png","assets/wheels/g923-x-0.png",
  "assets/wheels/hori-apex-0.png","assets/wheels/hori-apex-formula-0.png","assets/wheels/hori-ffb-0.png","assets/wheels/hori-overdrive-0.png","assets/wheels/hori-wireless-0.png","assets/wheels/hori-wireless-overdrive-0.png",
  "assets/wheels/moza-r12-0.png","assets/wheels/moza-r12-x-0.png","assets/wheels/moza-r3-pc-0.png","assets/wheels/moza-r3-x-0.png","assets/wheels/moza-r5-0.png","assets/wheels/moza-r9-0.png",
  "assets/wheels/pc-g29-0.png","assets/wheels/pc-g29-1.png","assets/wheels/pc-g923-0.png","assets/wheels/pc-g923-1.png","assets/wheels/pc-pro-0.png",
  "assets/wheels/pc-t128-0.png","assets/wheels/pc-t128-1.png","assets/wheels/pc-t248-0.png","assets/wheels/pc-t248-1.png","assets/wheels/pc-t300-0.png","assets/wheels/pc-t598-0.png","assets/wheels/pc-t598-1.png","assets/wheels/pc-tmx-t150-0.png","assets/wheels/pc-tmx-t150-1.png",
  "assets/wheels/pro-ps-0.png","assets/wheels/pro-x-0.png","assets/wheels/simagic-alpha-mini.png","assets/wheels/simagic-alpha-u.png","assets/wheels/simagic-alpha.png","assets/wheels/simucube-2-pro.png","assets/wheels/simucube-2-sport.png",
  "assets/wheels/t128-ps-0.png","assets/wheels/t128-x-0.png","assets/wheels/t150-0.png","assets/wheels/t248-ps-0.png","assets/wheels/t248-x-0.png","assets/wheels/t248r-0.png","assets/wheels/t300-0.png","assets/wheels/t500-0.png","assets/wheels/t598-ps-0.png","assets/wheels/t598-x-0.png","assets/wheels/t80-0.png","assets/wheels/t818-0.png","assets/wheels/t98-ps-0.png","assets/wheels/t98-x-0.png","assets/wheels/tgt-0.png","assets/wheels/tmx-0.png","assets/wheels/tsxw-0.png","assets/wheels/tx-0.png"
 ];
 const siteArtwork=[
  {file:"purplelap-logo.png",title:"PurpleLap logo",credit:"PurpleLap-Sim."},
  {file:"purplelap-favicon.svg",title:"PurpleLap favicon",credit:"PurpleLap-Sim."}
 ];
 function productPhotoCredit(file) {
  const filename=file.split("/").pop();
  let brand="Thrustmaster";
  if(filename.startsWith("fanatec-"))brand="Fanatec";
  else if(filename.startsWith("hori-"))brand="HORI";
  else if(filename.startsWith("moza-"))brand="MOZA";
  else if(filename.startsWith("simagic-"))brand="Simagic";
  else if(filename.startsWith("simucube-"))brand="Simucube";
  else if(filename.startsWith("g")||filename.startsWith("pro-")||filename.startsWith("pc-g")||filename.startsWith("pc-pro"))brand="Logitech";
  let base=filename.replace(/\.png$/,"").replace(/-\d+$/,"").replace(/^pc-/,"").replace(/^(fanatec|hori|moza|simagic|simucube)-/,"").replace(/-/g," ").toUpperCase();
  if(filename.startsWith("pc-"))base="PC "+base;
  if(filename.startsWith("ferrari458"))base="FERRARI 458";
  const variant=filename.match(/-(\d+)\.png$/);
  return {file:file,title:brand+" "+base+" product photo"+(variant?" · image "+(Number(variant[1])+1):""),credit:brand+" manufacturer product image."};
 }
 const productPhotos=productPhotoFiles.map(productPhotoCredit);
 function appendLink(parent,href,text) {
  const link=document.createElement("a");
  link.href=href;
  link.target="_blank";
  link.rel="noopener noreferrer";
  link.textContent=text;
  parent.append(link);
 }
 function renderList(id,items) {
  const list=document.getElementById(id);
  if(!list)return;
  items.forEach(function(item) {
   const row=document.createElement("li");
   appendLink(row,item.file,item.title);
   row.append(document.createTextNode(" — "+item.credit));
   if(item.source) {
    row.append(document.createTextNode(" "));
    appendLink(row,item.source,"Source");
   }
   if(item.license) {
    row.append(document.createTextNode(" · "));
    appendLink(row,item.license,"License");
   }
   list.append(row);
  });
 }
 const api={photographs:photographs,productPhotos:productPhotos,siteArtwork:siteArtwork};
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 root.PurpleLapPhotoCredits=api;
 if(typeof document!=="undefined") {
  renderList("photograph-credits",photographs);
  renderList("product-photo-credits",productPhotos);
  renderList("site-artwork-credits",siteArtwork);
 }
})(typeof globalThis!=="undefined"?globalThis:this);
