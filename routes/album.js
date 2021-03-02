const express = require("express");
const router = new express.Router();
const AlbumModel = require("./../model/Album");
const ArtistModel = require("./../model/Artist");
const LabelModel = require("./../model/Label");
const uploader = require("./../config/cloudinary");

// router.use(protectAdminRoute);

// GET - all albums
router.get("/", async (req, res, next) => {
  try {
    res.render("dashboard/albums", {
      albums: await AlbumModel.find().populate("artist label"),
    });
  } catch (err) {
    next(err);
  }
});

// GET - create one album (form)
router.get("/create", async (req, res, next) => {
  const artists = await ArtistModel.find();
  const labels = await LabelModel.find();
  res.render("dashboard/albumCreate", { artists, labels });
});

router.get("/update/:id", async (req, res, next) => {
  const artist = await ArtistModel.find();
  const label = await LabelModel.find();
  const album = await  AlbumModel.findById(req.params.id).populate("artist label");
  console.log(album.artist.name)
  
  res.render("dashboard/albumUpdate", {album, artist, label });
});

// GET - delete one album

// POST - create one album
router.post("/create", uploader.single("cover"), async (req, res, next) => {
  const newAlbum = { ...req.body };
  if (!req.file) newAlbum.cover = undefined;
  else newAlbum.cover = req.file.path;
  console.log(newAlbum);
  try {
    await AlbumModel.create(newAlbum);
    res.redirect("/dashboard/album");
  } catch (err) {
    next(err);
  }
});

// POST - update one album

module.exports = router;
