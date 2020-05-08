const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/*
//Blocking Synchronous way
const inText = fs.readFileSync('./txt/input.txt','utf-8');
console.log(inText);
const outText= `Raavan is the Demon King of Lanka\nThe rest of the string form input text file is :\n ${inText} \ncreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',outText);
console.log('file written successfully');
*/

/*
//NonBlocking Asynchronous way
fs.readFile('./txt/starte.txt','utf-8',(err,data)=>{   if(err) return console.log("Error! in reading file");
    fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data1)=>{
        fs.readFile('./txt/append.txt','utf-8',(err,text)=>{
            console.log(data1 + text);
            fs.writeFile('./txt/final.txt',data1+text,'utf-8',err => {
                console.log('successfully written');
            })
        });
    });
});
console.log("reading file asynchronously");
*/
//////////////////////////////////////////////////
// Creating Web Server

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const productObj = JSON.parse(data);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');


const server = http.createServer((req,res)=>{
    //console.log(req);
    // console.log(req.url);
    // console.log(url.parse(req.url,true))
    const {query,pathname} = url.parse(req.url,true);

    //overview
    if(pathname === '/overview' || pathname === '/'){
        res.writeHead(200,{
            'Content-type':'text/html'
        });
        const cardsHtml = productObj.map(el=> replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        

        res.end(output);
    }

    //product
    else if(pathname==='/product'){
        res.writeHead(200,{
            'Content-type':'text/html'
        });
        const prod = productObj[query.id];
        output = replaceTemplate(tempProduct,prod)
        res.end(output);
    }

    //api
    else if(pathname === '/api'){
        
            res.writeHead(200,{
                'Content-type':'application/json'
            });
            res.end(data);
        
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        });
        res.end("<h1>Page not found</h1>");
    }
});
server.listen(8000,'localhost',()=>{
    console.log("server is listening to requests on 8000");
});
