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

    const doc = new PDFDoc();
    const fileName = `output_${Date.now()}.pdf`;
    const filePath = path.join(pdfDir , fileName);

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.fontSize(40).text(title , {align: 'center'});
    doc.moveDown();
    doc.fontSize(20).text(name) ;
    doc.moveDown();
    doc.fontSize(100).fillColor('#cadcad').text(amount);
    doc.end();
    writeStream.on("finish" , () => {
        res.status(200).json({
            message: "PDF is generated",
            donloadLink: `http://localhost:3000/download?file=${fileName}`
        })
    });

    writeStream.on("error" , () => {
        res.status(500).json({message: "Failed to generate PDF file"})
    })
    

})


// API for donload the PDF 
app.get("/download" , (req,res) => {
    const filename = req.query.file;
    if(!filename){
       return  res.status(400).json({error: "File name must be present"});
    }
    const filepath = path.join(pdfDir , filename);
    if(!fs.existsSync(filepath)){
        return  res.status(404).json({error: "File does not exist !! "});
    }

    res.download(filepath , filename , (err) => {
        if(err){
            res.status(500).json({ error :'Failed to download file'})
        }
    });

})