
'use strict';

const fs = require('fs');
const args = require('yargs').argv;
try{
if( fs.existsSync(args.envFile)) {
    let templateFile = fs.readFileSync(args.envFile);
    let environmentTemplate = JSON.parse(templateFile);

    for(var i = 0; i < environmentTemplate.values.length; i++ ){
      var template_key = environmentTemplate.values[i].key
      var template_value = environmentTemplate.values[i].value
      if(template_key.toLowerCase().includes("password")){
        environmentTemplate.values[i].value="******"
      }
    }
    let jStr=JSON.stringify(environmentTemplate)
    let output = args.envFile
    fs.writeFile(output, jStr, function (err) {
        if (err) return console.log(err);
        console.log('Scrubbed passwords of the file:  -->'+ output);
    });
} else {
    console.log("File:"+args.envFile+" does not exist -- skipping password scrubbing")
}
} catch(err){
    console.error(err)
}