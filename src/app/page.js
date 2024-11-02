"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleSongs, setVisibleSongs] = useState(50); // Number of songs to show initially
  const [showAll, setShowAll] = useState(false); // State to track if "Show All Songs" has been clicked

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/playlist');
        if (!response.ok) {
          throw new Error('Network response was not okay');
        }
        const data = await response.json();
        // Filter out songs that are deleted or private
        const validSongs = data.filter(song => song && song.snippet && song.snippet.title);
        setSongs(validSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Filtered songs based on search term
  const filteredSongs = songs.filter(song =>
    song.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load more songs function
  const loadMoreSongs = () => {
    setVisibleSongs(prevVisible => prevVisible + 50); // Increase the number of visible songs by 50
  };

  // Function to handle displaying all songs
  const showAllSongs = () => {
    setVisibleSongs(songs.length); // Set visible songs to total number of songs
    setShowAll(true); // Set showAll to true to hide the button
  };

  return (
    <div className="playlist-container">
      <h1>YouTube Playlist</h1>
      
      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="song-list">
          {filteredSongs.length > 0 ? (
            filteredSongs.slice(0, visibleSongs).map((song) => (
              <li key={song.id} className="song-item">
                <img 
                  src={song.snippet.thumbnails?.default?.url || '/default-thumbnail.png'} 
                  alt={song.snippet.title} 
                  className="song-thumbnail"
                />
                <p className="song-title">{song.snippet.title}</p>
              </li>
            ))
          ) : (
            <p>No songs found in this playlist.</p>
          )}
        </ul>
      )}

      {/* Load More Button */}
      {filteredSongs.length > visibleSongs && (
        <button onClick={loadMoreSongs} className="load-more-button">
          Load More Songs
        </button>
      )}

      {/* Show All Songs Button */}
      {!showAll && (
        <button onClick={showAllSongs} className="show-all-button">
          Show All Songs
        </button>
      )}
    </div>
  );
}
