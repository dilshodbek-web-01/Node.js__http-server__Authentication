const fs = require("fs");
const path = require("path");

const read = (fileName) => {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), `/store/${fileName}.json`), "utf8")
  );
};

const write = (fileName, data) => {
  fs.writeFileSync(
    path.join(process.cwd(), `/store/${fileName}.json`),
    JSON.stringify(data, null, 4)
  );
};

module.exports = {
  read,
  write,
};
