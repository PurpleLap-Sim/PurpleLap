(function(root,factory){
 const configureBackNavigation=factory();
 if(typeof module==="object"&&module.exports)module.exports=configureBackNavigation;
 else configureBackNavigation(document,window);
})(typeof globalThis==="object"?globalThis:this,function(){
 return function configureBackNavigation(document,window){
  const links=Array.from(document.querySelectorAll("a.back-link, a.setup-return-link, a.return-link"));
  const source=new URLSearchParams(window.location.search).get("from");
  if(source==="gear-guide"){
   links.forEach(function(link){link.href="gear-guide.html"});
   return;
  }
  if(!document.referrer)return;
  const previousPage=new URL(document.referrer,window.location.href);
  if(previousPage.href===window.location.href)return;
  links.forEach(function(link){
   link.href=previousPage.href;
   link.addEventListener("click",function(event){
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute("download"))return;
    if(window.history.length<2)return;
    event.preventDefault();
    window.history.back();
   });
  });
 };
});
