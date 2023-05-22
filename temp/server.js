
import { songdetails } from "./data.js";
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://atharvanagmoti:Atharva20@machine-learner.rfrlve0.mongodb.net/Song?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("DataBase Connected");
  });

const songSchema = new mongoose.Schema({
  Song: String,
  Film: String,
  Music_Director: String,
  Singer: String,
  Actor: String,
  Actress: String,
});

const Song = mongoose.model("Song", songSchema);

app.get("/", async (req, res) => {
  try {
    res.send("Server running on the port");
  } catch {
    return "Failure";
  }
});

app.get("/adddata", async (req, res) => {
    try{    
        const song = await Song.insertMany(songdetails);
        if (song){
            res.send("Data added")
        }
        else
        {
            res.send("Data not added")
        }
    }
    catch(err){
        res.send(err)
    }
})

app.get("/count", async (req, res) => {
    try{    
        const song = await Song.countDocuments(songdetails);
        res.send(`Total Count: ${song}`)
    }
    catch(err){
        res.send(err)
    }
})

app.get("/music_director", async (req, res) => {
    try{    
        const song = await Song.find({Music_Director: "Pritam"});
        const songname =  song.map((songs) => songs.Song)
        res.send(songname)
    }
    catch(err){
        res.send(err)
    }
})

app.get("/musicdir_singer", async (req, res) => {
    try{    
        // const musicdirec = res.params.Music_Director
        // const singer = res.paramas.Singer
        const song = await Song.find({Music_Director: "Pritam", Singer: "Manas"});
        const songname =  song.map((songs) => songs.Song)
        console.log(songname)
        res.send(songname)
    }
    catch(err){
        res.send(err)
    }
})

app.get("/film_singer", async (req, res) => {
    try{    
        
        const song = await Song.find({Film: "Tamasha", Singer: "Adi"});
        console.log(song)
        const songname =  song.map((songs) => songs.Song)
        res.send(songname)
    }
    catch(err){
        res.send(err)
    }
})

app.delete("/delete", async (req, res) => 
{
    try{
        const songname = res.params.Song
        const song = await Song.deleteOne({Song: songname})
        if(song)
        {
            res.send("deleted")
        }
        else{
            res.send("Cannot delete")
        }
    }
    catch(err)
    {
        res.send(err)
    }
})

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
