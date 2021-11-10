const fs = require("fs");
const http = require("http");
const url = require("url");
//3rd Party
const slugify = require("slugify");
//My own module
const replaceTemplate = require("./modules/replaceTemplate");

///////////////////////////////////////
//Files

//Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// // console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

//Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data1) => {
//     console.log(data1);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data1}\n${data3}`, "utf-8", (err) => {
//         console.log("File has been written!");
//       });
//     });
//   });
// });

// console.log("Will read file!");

///////////////////////////////////////
//SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const server = http.createServer((request, response) => {
  ///////////////////////////////////////
  //ROUTING
  const { query, pathname } = url.parse(request.url, true);
  const pathName = request.url;
  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

    response.end(output);

    //Product page
  } else if (pathname === "/product") {
    response.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.end(output);
    //API
  } else if (pathname === "/api") {
    response.writeHead(200, {
      "Content-type": "application/json",
    });
    response.end(data);
    //Not Found
  } else {
    response.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    response.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});