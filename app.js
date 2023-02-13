const express = require("express");
const multer = require("multer");
const app = express();
const fs = require("fs");
const path = require("path");
var bodyParser = require('body-parser'); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
const maxSize = 500 * 1024 * 1024;

// home
app.get("/", (req, res) => {
  console.log("here 3030");
  // res.sendStatus(200);
});

//multi
// app.use("/listm", express.static(path.join(__dirname, "filem")));
const filem = multer({
  storage: multer.diskStorage({
    destination: (req, file, cd) => {
      cd(null, "./file");
    },
    filename: (req, file, cd) => {
      cd(null,Date.now() +'multi'+ path.extname(file.originalname));
    },
    // storage:upload
  }),
  // filesize:
  limits: { fileSize: maxSize },
}).array("filem", 10);

app.post("/fileuploadm", filem, (req, res) => {
  res.redirect("/list");
});

app.get("/fileuploadm", (req, res) => {
  res.render("fum");
});
// const directoryPathm = path.join(__dirname, "/filem");
// app.get("/listm", (req, res) => {
//   const patharr = []; //for file name
//   fs.readdir(directoryPathm, (err, file) => {
//     file.forEach((file) => {
//       const p = file
//       patharr.push(p);
//     });
//     console.log(patharr);
//     res.render("listm",{ patharr: patharr });
//   });
// });
// var dir = __dirname;

//single

app.use("/list", express.static(path.join(__dirname, "file")));
const file = multer({
  storage: multer.diskStorage({
    destination: (req, file, cd) => {
      cd(null, "./file");
    },
    filename: (req, file, cd) => {
      cd(null, Date.now() + path.extname(file.originalname));
      req.file = file;
    },
    // storage:upload
  }),
  // filesize:
  limits: { fileSize: maxSize },
}).single("file")

// app.post("/fileupload", file, (req, res) => {
//   res.redirect("/list");
// });

// app.use("/fileupload",file,(req,res,next)=>{
//       next();  
// })
app.get("/fileupload", (req, res) => {
  res.render("fu");
});

app.get("/done", (reeq, res) => {
  res.send("done");
});

const directoryPath = path.join(__dirname, "/file");
app.get("/list", (req, res) => {
  let patharr = [];
  fs.readdir(directoryPath, (err, file) => {
    file.forEach((file) => {
      let p = file;
      let pathex = (file.split('.'))
      let exten1= pathex[1];
      patharr.push({path:p,exten:exten1})
      // console.log(patharr)
    });
    res.render("list", { 
      patharr : patharr,
      f : filem 
    });
  });
 
});

app.get("/list/delete/:name", (req, res) => {
  // console.log(req.params.name)
  const filename = req.params.name;
  const deletepath = path.join(directoryPath,filename);
  // console.log(deletepath);
  fs.unlink(deletepath, (err) => {
    if (err) {
      throw err;
    }
    console.log("Delete File successfully.");
  });
  res.redirect("/list");
});

app.get("/list/show/:name", (req, res) => {
  const filename = req.params.name;
  const showpath = path.join(directoryPath,filename);
  rs = fs.createReadStream(showpath);
  rs.pipe(res);
});
app.listen(3030);
