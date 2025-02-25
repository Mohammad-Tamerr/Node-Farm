const fs = require('fs'); //File system module
const http = require('http'); //HTTP module
const url = require('url'); //URL module
const slugify = require('slugify');//
const replaceProduct = require('./modules/replaceTemplate');//Custom module

//Server
const tempOverview = fs.readFileSync(
    `${__dirname}/templates/overview.html`,
    'utf-8'
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/card.html`,
    'utf-8'
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/product.html`,
    'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const data_obj = JSON.parse(data);

const slugs = data_obj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

//Route handlers
const server = http.createServer((req, res) => {
const { query, pathname } = url.parse(req.url, true);    
//Overview page
if(pathname === '/' || pathname === '/overview'){ 
    res.writeHead(200, {
        'Content-type': 'text/html'
    });
    const cardsHtml = data_obj.map(product => replaceProduct(tempCard, product)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
} 
//Product page
else if(pathname === '/product'){         
   res.writeHead(200, {
    'Content-type': 'text/html'
});
const product = data_obj[query.id];
const output = replaceProduct(tempProduct, product); 
res.end(output); 
} else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
}else {
    res.writeHead(404, {
        'Content-type': 'text/html',
        'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found</h1>');
} 
});
//Start the server
server.listen(8000, `127.0.0.1`, () => {
    console.log('Server is listening on port 8000');
});