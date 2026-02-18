import React, { useRef, useState } from "react";
import "./Moodsongs.css";

const Moodsongs = ({ Songs }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const audioRef = useRef(null);

  const handlePlayPause = (index, audioUrl) => {
    if (currentIndex === index) {
      audioRef.current.pause();
      setCurrentIndex(null);
      return;
    }

    // Play new song
    audioRef.current.src = audioUrl;
    audioRef.current.play();
    setCurrentIndex(index);
  };

  return (
    <div className="mood-songs">
      <h2>Recommended Songs For You</h2>

      {/* ONE global audio player */}
      <audio ref={audioRef} />

      {Songs.map((song, index) => (
        <div className="song" key={index}>
          <div className="title">
            <h2>{song.mood}</h2>
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
          

          <div className="play-pause-button">
            <button onClick={() => handlePlayPause(index, song.audio)}>
              {currentIndex === index ? (
                <i className="ri-pause-fill"></i>
              ) : (
                <i className="ri-play-circle-fill"></i>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Moodsongs;
