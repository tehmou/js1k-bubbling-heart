var fs = require("fs");
var spawn = require('child_process').spawn;

function changed () {
    var index = ""+fs.readFileSync("index.html.tmpl");
    var js = ""+fs.readFileSync("js1k.js");
    var outputJS = ""+fs.readFileSync("out.js");

    fs.writeFileSync("index_test.html", index.replace("${CONTENT}", js));
    //fs.writeFileSync("index_out.html", index.replace("${CONTENT}", outputJS));
    //spawn('open', ['index.html']);
}

fs.watchFile("js1k.js", changed);

changed();