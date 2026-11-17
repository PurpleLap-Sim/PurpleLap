(function(root,factory){
 const availableComparisonOptions=factory();
 if(typeof module==="object"&&module.exports)module.exports=availableComparisonOptions;
 else root.availableComparisonOptions=availableComparisonOptions;
})(typeof globalThis==="object"?globalThis:this,function(){
 return function(products,excludedId){
  return products.filter(function(entry){return entry.id!==excludedId});
 };
});
