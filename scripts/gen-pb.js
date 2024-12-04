const fs = require("fs");
const pbjs = require("protobufjs-cli/pbjs");

const path = require("path");


function isProto(obj) {
  return obj.indexOf(".proto") > -1;
}

function getEntry() {
  const entry = "./src/pb";
  console.log(`当前指定项目环境: ${entry} \n`);
  return entry;
}

function generatePBJson() {
  const entryPath = getEntry(),
    files = fs.readdirSync(`${entryPath}`),
    entryAry = files.filter(isProto).map((item) => entryPath + "/" + item);

  pbjs.main(
    ["--target", "json", "--out", entryPath + "/index.json"].concat(entryAry),
    function (err, output) {
      console.log(err);
      console.log(output);
      if (err) throw err;
    }
  );
}

generatePBJson();