const express = require('express');
const bodyParser = require('body-parser');
const PDFDoc = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const pdfDir = path.join(__dirname , "repo-generated-pdf-files");
if(!fs.existsSync(pdfDir)){
    fs.mkdirSync(pdfDir);
}

const PORT = 3000 ;
app.listen(PORT , () => {
   console.log('||||||| PDF app running ===================>') 
});


// API for generating pdf

app.post('/generate-pdf' , (req,res) => {
    const { title , name , amount } = req.body ;
    if( !title || !name || !amount ){
        return res.status(400).json({success: false , message: "Data is missing"});
    }

    const doc = new PDFDoc()

})
