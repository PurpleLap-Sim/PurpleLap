const assert=require("node:assert/strict");
const test=require("node:test");
const configureBackNavigation=require("../back-navigation.js");

function createLink(href){
 const listeners={};
 return {
  href:href,
  target:"",
  addEventListener:function(type,listener){listeners[type]=listener},
  hasAttribute:function(){return false},
  click:function(event){listeners.click(event)},
  hasClickHandler:function(){return Boolean(listeners.click)}
 };
}

function setup(options){
 const link=createLink(options.fallback||"index.html");
 let backCount=0;
 const window={
  location:{search:options.search||"",href:options.current||"https://purplelap.test/current.html",origin:"https://purplelap.test"},
  history:{length:options.historyLength===undefined?2:options.historyLength,back:function(){backCount++}},
 };
 const document={referrer:options.referrer||"",querySelectorAll:function(){return [link]}};
 configureBackNavigation(document,window);
 return {link,backCount:function(){return backCount}};
}

test("uses browser history to return to the same-site previous page",function(){
 const result=setup({referrer:"https://purplelap.test/gear-guide.html?from=home#compare"});
 assert.equal(result.link.href,"https://purplelap.test/gear-guide.html?from=home#compare");
 let prevented=false;
 result.link.click({defaultPrevented:false,button:0,metaKey:false,ctrlKey:false,shiftKey:false,altKey:false,preventDefault:function(){prevented=true}});
 assert.equal(prevented,true);
 assert.equal(result.backCount(),1);
});

test("returns to the home page when it was the previous page",function(){
 const result=setup({referrer:"https://purplelap.test/index.html#page-footer"});
 assert.equal(result.link.href,"https://purplelap.test/index.html#page-footer");
 let prevented=false;
 result.link.click({defaultPrevented:false,button:0,metaKey:false,ctrlKey:false,shiftKey:false,altKey:false,preventDefault:function(){prevented=true}});
 assert.equal(prevented,true);
 assert.equal(result.backCount(),1);
});

test("returns from the next gear guide to the top of the gear guide",function(){
 const result=setup({search:"?from=gear-guide",referrer:"https://purplelap.test/gear-guide.html"});
 assert.equal(result.link.href,"gear-guide.html");
 assert.equal(result.link.hasClickHandler(),false);
});

test("preserves direct-entry fallbacks and returns to an external previous page",function(){
 const direct=setup({fallback:"all-guides.html"});
 const external=setup({fallback:"index.html",referrer:"https://other.example/previous.html"});
 assert.equal(direct.link.href,"all-guides.html");
 assert.equal(external.link.href,"https://other.example/previous.html");
 assert.equal(external.link.hasClickHandler(),true);
});

test("falls back to the previous URL when there is no usable history entry",function(){
 const result=setup({referrer:"https://purplelap.test/previous.html",historyLength:1});
 assert.equal(result.link.href,"https://purplelap.test/previous.html");
 let prevented=false;
 result.link.click({defaultPrevented:false,button:0,metaKey:false,ctrlKey:false,shiftKey:false,altKey:false,preventDefault:function(){prevented=true}});
 assert.equal(prevented,false);
 assert.equal(result.backCount(),0);
});
