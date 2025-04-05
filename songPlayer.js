console.log("let's write some javascript");
let currentSong = new Audio();
let songs;

async function getSongs() {
    const repoUrl = 'https://api.github.com/repos/Seemant-10/project/contents/songs';

    let response = await fetch(repoUrl);
    let data = await response.json();
    
    let songs = data
        .filter(file => file.name.endsWith('.mp3'))  // Filter for mp3 files
        .map(file => file.name);  // Get the file names

    return songs;
}

function secondsToMinutesSecondes(seconds){
    if (isNaN(seconds) || seconds < 0) {
        return "0:00";
    }
    const minutes = Math.floor(seconds/60)
    const remainingSeconds = Math.floor(seconds%60)

    const formattedMinutes = String(minutes).padStart(2,'0')
    const formattedSecondes = String(remainingSeconds).padStart(2,'0')
    return `${formattedMinutes}:${formattedSecondes}`
}

async function getSongDuration(songUrl) {
    return new Promise((resolve) => {
        const audio = new Audio(songUrl);
        audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration);
        });
    });
}
const playMusic = (track, pause = false) => {
    try {
        // Check if the track name already includes `.mp3`
        const trackName = track.endsWith('.mp3') ? track : `${track}.mp3`;
        const songUrl = `https://Seemant-10.github.io/project/songs/${encodeURIComponent(trackName)}`;
        console.log("Playing song URL:", songUrl);

        currentSong.src = songUrl;

        if (!pause) {
            currentSong.play();
            play.src = "svg/pause-icon.svg";
        }

        const songImage = document.querySelector(".song-image");
        const imageUrl = `https://Seemant-10.github.io/project/images/${encodeURIComponent(track.replace('.mp3', ''))}.jpeg`;
        songImage.src = imageUrl;

        document.querySelector(".song-name").innerHTML = track.replace('.mp3', '');
        document.querySelector(".song-time-start").innerHTML = "0:00";
        document.querySelector(".song-time-end").innerHTML = "0:00";
    } catch (error) {
        console.error("Error playing music:", error);
    }
};


async function main() {

    songs = await getSongs();
    let track = ["580,142,248","207,680,044","359,554,425","421,269,932","169,761,269"];
    let songUl = document.querySelector(".songs-media ul");
    playMusic(songs[0].replace(".mp3",""),true)

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i]
        const songUrl = `https://Seemant-10.github.io/project/songs/${song}`;
        const duration = await getSongDuration(songUrl);
        const formattedDuration = new Date(duration * 1000).toISOString().substr(14, 5); 
        const imageUrl = `https://Seemant-10.github.io/project/images/${song.split(".mp3")[0]}.jpeg`;
        const songName = song.replace(".mp3", "");
        const songItem = `
            <li>
                <div class="song-info flex">
                    <div class="song-info-inner flex">
                        <p>${i+1}</p>
                        <img src="${imageUrl}" alt="Song Image" width="50">
                        <div>${songName.replaceAll("%20", " ")}</div>
                    </div>
                    <div class="song-track">${track[i]}</div>
                    <div class="song-duration">${formattedDuration}</div>
                </div>
            </li>`;

        songUl.innerHTML += songItem;
    }
    
    // to display the song name and play song
    Array.from(document.querySelector(".songs-media").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector("div>.song-info-inner>div").innerHTML)
            playMusic(e.querySelector("div>.song-info-inner>div").innerHTML)
        })
    });

    // play and pause eventlistener
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "svg/pause-icon.svg"
        }
        else{
            currentSong.pause()
            play.src = "svg/play-icon.svg"
        }
    })

    // Add spacebar toggle functionality
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            event.preventDefault(); // Prevent page scrolling
            if (currentSong.paused) {
                currentSong.play();
                play.src = "svg/pause-icon.svg";
            } else {
                currentSong.pause();
                play.src = "svg/play-icon.svg";
            }
        }
    });

        // time update 
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".song-time-start").innerHTML = `${secondsToMinutesSecondes(currentSong.currentTime)}`
        document.querySelector(".song-time-end").innerHTML = `${secondsToMinutesSecondes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)* 100 + "%"
        document.querySelector(".progress").style.width = (currentSong.currentTime/ currentSong.duration)* 100 + "%"
    })

    // seekbar event listener
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent)/100
    })

   // Add event listener for the previous button
   previous.addEventListener("click", () => {
    console.log("previous click");
    console.log(songs);

    // Extract the current song name from the `src` attribute
    const currentSongName = decodeURIComponent(currentSong.src.split("/").pop());
    console.log("Current song name from URL:", currentSongName);

    // Find the index of the current song in the songs array
    let index = songs.indexOf(currentSongName);
    console.log("Current index:", index);

    // Handle the case where the index is -1 (e.g., malformed URL or mismatch)
    if (index === -1) {
        console.error("Current song not found in the songs array.");
        // Attempt to find the closest match
        index = songs.findIndex(song => currentSong.src.includes(song));
        console.log("Adjusted index after search:", index);
    }

    // Play the previous song or loop to the same first song if at the start
    if (index <= 0) {
        console.log("Already at the first song. Playing the first song again.");
        playMusic(songs[0]); // Play the first song
    } else {
        const prevIndex = index - 1;
        console.log("Previous song index:", prevIndex);

        // Play the previous song
        playMusic(songs[prevIndex]);
    }
});


    next.addEventListener("click", () => {
        console.log("next click");
    
        // Extract the current song name and decode it
        const currentSongName = decodeURIComponent(currentSong.src.split("/").pop());
        console.log("Current song name:", currentSongName);
    
        const index = songs.indexOf(currentSongName);
    
        if (index !== -1) {
            // If the current song is found, play the next song in sequence
            const nextIndex = (index + 1) % songs.length;
    
            playMusic(songs[nextIndex]);
        } else {
            // If the current song is not found, log an error and do nothing
            console.error("Current song not found in the songs array");
        }
    });
    
    //event listener for volume range
    document.querySelector(".song-volume input").addEventListener("change", (e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })
}

main();
