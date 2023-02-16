const express = require("express");
const multer = require("multer");
const app = express();
const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
const { shutdown } = require("live-server");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
const maxSize = 1024 * 1024 * 50;

// home
app.get("/", (req, res) => {
  res.send("here 3030");
  // res.sendStatus(200);
});

//multi for both normal and ajax 

function randomString() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = "";
  for (let i = 1; i <= 5; i++) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return str;
}

// app.use("/listm", express.static(path.join(__dirname, "filem")));
const filem = multer({
  storage: multer.diskStorage({
    destination: (req, file, cd) => {
      cd(null, "./file");
    },
    filename: (req, file, cd) => {
      cd(null, Date.now() + randomString() + "multi" + path.extname(file.originalname));
    },
    // storage:upload
  }),
  // filesize:
  limits: { fileSize: maxSize },
}).array("filem", 10);


//single

app.use("/list", express.static(path.join(__dirname, "file")));

const file = multer({
  storage: multer.diskStorage({
    destination: (req, file, cd) => {
      cd(null, "./file");
    },
    filename: (req, file, cd) => {
      cd(null, Date.now() + randomString() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: maxSize },
}).single("file");

app.post("/fileupload1", file, (req, res) => {
  res.redirect("/list2");
});

// }).single("file");

// app.get("/done", (reeq, res) => {
//   res.send("done");
//   res.redirect("/list2");
// });


//api for noraml ejs 
const directoryPath = path.join(__dirname, "/file");
app.get("/list", (req, res) => {
  let patharr = [];
  fs.readdir(directoryPath, (err, file) => {
    file.forEach((file) => {
      let p = file;
      let pathex = file.split(".");
      let exten1 = pathex[1];
      patharr.push({ path: p, exten: exten1 });
      // console.log(patharr)
      // res.json(patharr);
    });
    res.render("list", {
      patharr: patharr,
      // f: filem,
    });
  });
});

app.get("/list/delete/:name", (req, res) => {
  // console.log(req.params.name)
  const filename = req.params.name;
  const deletepath = path.join(directoryPath, filename);
  // console.log(deletepath);
  fs.unlink(deletepath, (err) => {
    if (err) {
      throw err;
    }
    console.log("Delete File successfully.");
  });
  res.redirect("/list2");
});

app.get("/list/show/:name", (req, res) => {
  const filename = req.params.name;
  const showpath = path.join(directoryPath, filename);
  rs = fs.createReadStream(showpath);
  rs.pipe(res);
});

app.post("/fileupload", file, (req, res) => {
  res.redirect("/list");
});

app.get("/fileupload", (req, res) => {
  res.render("fum");
});

app.post("/fileuploadm", filem, (req, res) => {
  res.redirect("/list");
});

app.get("/fileuploadm", (req, res) => {
  res.render("fum");
});


//api for ajax 

app.get("/list1", (req, res) => {
  let patharr = [];
  fs.readdir(directoryPath, (err, file) => {
    file.forEach((file) => {
      let p = file;
      let pathex = file.split(".");
      let exten1 = pathex[1];
      patharr.push({ path: p, exten: exten1 });
      // console.log(patharr)
    });
    res.json(patharr);
  });
});

app.get("/list/delete1/", (req, res) => {
  // console.log(req.params.name)
  const filename = req.query.name;
  console.log(filename);
  const deletepath = path.join(directoryPath, filename);
  // console.log(deletepath);
  fs.unlink(deletepath, (err) => {
    if (err) {
      throw err;
    }
    console.log("Delete File successfully.");
  });
  // res.redirect("/list2");
});
app.get("/list/show1", (req, res) => {
  // 1676450619852multi.jpg
  let a = path.join("list/", `${req.query.name}`);
  res.json(a);
});

app.get("/list2", (reeq, res) => {
  res.render("ajaxlist");
});

app.post("/fileupload2", filem, (req, res) => {
  res.redirect("/list2");
});

app.listen(3030);
