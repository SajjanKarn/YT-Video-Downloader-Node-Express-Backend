const express = require("express");
const cors = require("cors");
const fs = require("fs");
const ytdl = require("ytdl-core");
const path = require("path");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("downloads"));
app.use(express.json());
// ! CORS support
app.use(cors());

const directory = "downloads";

setTimeout(() => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}, 60000);

// endpoints
app.get("/download/:id", async (req, res) => {
  const { id } = req.params;
  ytdl(`http://www.youtube.com/watch?v=${id}`).pipe(
    fs.createWriteStream(__dirname + `/downloads/${id}.flv`)
  );

  let info = await ytdl.getInfo(id);
  res.json({
    msg: id,
    info: info.videoDetails.title,
    downloadLink: `http://localhost:5500/${id}.flv`,
  });
});

// server configurations are here...
app.listen(5500, () => {
  console.log(`Server started listening on port: 5500`);
});
