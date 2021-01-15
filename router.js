require("dotenv").config();

const express = require("express");
const router = express.Router();

const api = require("./apiClient");

// middleware that is specific to this router
router.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
  });
});

router.get("/search", (req, res) => {
  api.spotifyApi.searchArtists(req.query.artist).then(
    (data) => {
      res.render("search", {
        title: "Artist",
        searchParam: req.query.artist,
        artistList: data.body.artists.items,
      });
    },
    (err) => {
      console.error(err);
    }
  );
});

router.get("/artist/:id", (req, res) => {
  api.spotifyApi.getArtistAlbums(req.params.id, { limit: 50 }).then(
    (data) => {
      const albums = data.body.items.filter(
        (item) => item.album_type === "album"
      );
      const singles = data.body.items.filter(
        (item) => item.album_type === "single"
      );
      const others = data.body.items.filter(
        (item) => item.album_type !== "single" && item.album_type !== "album"
      );

      res.render("artist", {
        title: "Albums and Singles",
        artistName: req.query.artist,
        albums,
        singles,
        others,
      });
    },
    (err) => {
      console.error(err);
    }
  );
});

router.get("/player/:id", (req, res) => {
  api.spotifyApi.getAlbumTracks(req.params.id, { limit: 50 }).then(
    function (data) {
      res.render("player", {
        title: "Tracks",
        tracks: data.body.items,
        artistName: req.query.artist,
      });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

module.exports = router;
