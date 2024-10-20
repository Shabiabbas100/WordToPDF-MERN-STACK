
const express = require("express");
const multer = require("multer");
const cors = require("cors"); // cors -> to run frontend and backend on same port
const docxToPDF = require("docx-pdf"); // Keep this for direct conversion
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const app = express();
const Port = process.env.PORT||3000;

app.use(cors());
app.get('/', (req, res) => {
    res.send('hey there im shabi abbas');
});

// Setting up the file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {   // cb callback function
        return cb(null, "uploads"); // single statement can make return statement omit
    },
    filename: function(req, file, cb) {
        return cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
app.post("/convertFile", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        // Defining output file path
        let outputPath = path.join(
            __dirname,
            "files",
            `${req.file.originalname}.pdf`
        );

        // Use docxToPDF for conversion
        docxToPDF(req.file.path, outputPath, async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error converting docx to pdf",
                });
            }

            // Optionally use Puppeteer for further processing, if needed
            const browser = await puppeteer.launch({
                headless: true, // Run in headless mode
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Options for cloud environments
            });
            const page = await browser.newPage();
            await page.goto(`file://${outputPath}`); // Navigate to the PDF
            await page.pdf({ path: outputPath, format: 'A4' }); // This can be customized
            await browser.close();

            // Send the PDF file back to the client
            res.download(outputPath, () => {
                console.log("file downloaded");
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

app.listen(Port, () => {
    console.log(`Server is listening on port ${Port}`);
});

// Placeholder function for converting DOCX to HTML (if you need it)
async function convertDocxToHtml(filePath) {
    // Implement your conversion logic here
    return '<h1>Converted Content</h1>'; // Example HTML
}



// const express = require("express");
// const multer = require("multer");
// const cors =require('cors'); //cors ->to run frontend and backend on same port
// const docxToPDF = require("docx-pdf");
// const path = require("path");
// const app = express();
// const Port = process.env.PORT||3000;
// app.use(cors());
// app.get('/', (req, res) => {
//   res.send('hey there im shabi abbas')
 
//  })
// // settting up the file storage
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {   //cb callback function
//        return cb(null, "uploads");      //single statement can make return statement omit
//     },
//     filename: function(req, file, cb) {
//        return cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage: storage });
// app.post("/convertFile", upload.single("file"), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 message: "No file  uploaded",
//             });
//         }
//         // Defining outout file path
//         let outoutPath = path.join(
//             __dirname,
//             "files",
//             `${req.file.originalname}.pdf`
//         );
//         docxToPDF(req.file.path, outoutPath, (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).json({
//                     message: "Error converting docx to pdf",
//                 });
//             }
//             res.download(outoutPath, () => {
//                 console.log("file downloaded");
//             });
//             console.log("shaktiman")
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Internal server error",
//         });
//     }
// });

// app.listen(Port, () => {
//     console.log(`Server is listening on port ${Port}`);
// });
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "uploads"); // folder name
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname);
//     },
// });
// const upload = multer({ storage: storage });  // upload ->it will help to upload the file
// // app.post('/profile', upload.single('avatar'), function (req, res, next) {
// //   // req.file is the `avatar` file
// //   // req.body will hold the text fields, if there were any
// // })

// app.post("/convertFile", upload.array("file"), (req, res, next) => {
//      //upload function will give uploaded file as output in the form of req 
//     //file -> variable name from element

        
//         let downloadPath = path.join(
//             __dirname,
//             "downloaded", // this folder wil automatically be created when pdf is created

//             `${req.file.originalname}.pdf`
//         );
//        