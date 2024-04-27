const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');


const server = http.createServer(async (req, res) => {
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    const uri = "mongodb+srv://sreya12:jhansisreya12@cluster1.4a2kwdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
    
    console.log(req.url);

    if(req.url == '/'){
        
    fs.readFile(path.join(__dirname,'/public','index.html'),'utf-8', (err,content) => {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(content);
        })
    }else if (req.url.startsWith('/images/')) {
        const imagePath = path.join(__dirname, '/public', req.url);
        fs.readFile(imagePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>Not Found</h1>');
            } else {
                const extension = path.extname(imagePath).toLowerCase();
                let contentType = 'image/jpeg';
                if (extension === '.png') {
                    contentType = 'image/png';
                } else if (extension === '.jpeg' || extension === '.jpg') {
                    contentType = 'image/jpeg';
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    } else if(req.url === '/style.css'){
        fs.readFile(path.join(__dirname,'/public','style.css'),'utf-8', (err,content) => {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.end(content);
        })
    }else if(req.url === '/script.js'){
        fs.readFile(path.join(__dirname,'/public','script.js'),'utf-8', (err,content) => {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'application/javascript'})
            res.end(content);
        }) 
    } else if (req.url === '/api') {
        const client = new MongoClient(uri);
        try {
            await client.connect();
            console.log('Connected to MongoDB');
            const weathercast = client.db('weatherdata').collection('weathercollection');
            const weatherReport = await weathercast.find().toArray();
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({ weatherReport: weatherReport }));
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Server Error');
        } finally {
            if (client) await client.close();
            console.log('Connection Closed');
        }
    } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end("<h1> 404 Data Not Found</h1>");
    }
})
server.listen(6274, () => console.log('Server running...'));