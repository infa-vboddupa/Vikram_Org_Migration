'use strict';

const fs = require('fs');
const args = require('yargs').argv;

let optionsFile; // = fs.readFileSync('options.txt');
//console.log(optionsFile)

console.log('orgid: ' + args.orgid);
console.log('service_name: ' + args.service_name);
console.log('key_value file: '+args.options)
console.log('template file: '+args.template)
console.log('output file: '+args.output)
console.log('include Suborg Flag file: '+args.includeSubOrgs)
console.log('parentMigrationId: '+args.parentMigrationId)


try {
    //options.txt
     optionsFile = fs.readFileSync(args.options, 'utf8');
  //  console.log(optionsFile);    
    console.log("---we log---")
} catch(e) {
    console.log('Error:', e.stack);
}

let out=optionsFile.split(/\r?\n/)
let myMap = new Map()
for( let i=0; i< out.length;i++){
    console.log(out[i]);
    var line = out[i]
    var keyVal = line.split("=")
    if(keyVal.length > 1) {
        console.log("processing line:"+line+" key="+keyVal[0]+" val="+keyVal[1])
        myMap.set(keyVal[0],keyVal[1]);
    }
}
if(args.orgid !== undefined){
    myMap.set("orgid",args.orgid)
}
if(args.orgId !== undefined){
    myMap.set("orgid",args.orgId)
}
if( args.service_name !== undefined) {
    myMap.set("service_name",args.service_name)
}
if( args.requestSqn !== undefined) {
    myMap.set("requestSqn",args.requestSqn)
}
if( args.includeSubOrgs !==undefined) {
    if( args.includeSubOrgs === 'true'){
        myMap.set("includeSubOrgs",true)
    }
}
if( args.parentMigrationId !==undefined) {
    myMap.set("parentMigrationId",args.parentMigrationId)
}

//'org-readiness-v2.postman_environment.json.template'
let templateFile = fs.readFileSync(args.template);
let environmentTemplate = JSON.parse(templateFile);
console.log(environmentTemplate);

for(var i = 0; i < environmentTemplate.values.length; i++ ){
      var template_key = environmentTemplate.values[i].key
      var template_value = environmentTemplate.values[i].value
      console.log("template_key="+template_key+" template_value="+template_value+" map_get:"+myMap.get(template_key))
      if( myMap.get(template_key) !== undefined) {
          var mapValue = myMap.get(template_key)
          environmentTemplate.values[i].value = mapValue
      } else {
          console.log("undefined --- skipping ---")
      }
}


let jStr=JSON.stringify(environmentTemplate)

//let output="org-readiness-v2.postman_environment.json"
let output = args.output
fs.writeFile(output, jStr, function (err) {
    if (err) return console.log(err);
    console.log('Generated environment  -->'+ output);
  });