const moogose = require('mongoose');

const songSchema = new moogose.Schema({
    title: String,
    artist: String,
    audio : String,
    mood : String,
})

const Song = moogose.model('Song', songSchema)

module.exports =  Song

