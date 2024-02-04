console.log('Let us write js')
let currfolder;
let currentsong= new Audio();
let songs;
async function getsongs(folder){
    currfolder= folder;
    let a= await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response= await a.text();
    console.log(response);
    let div= document.createElement("div")
    div.innerHTML= response;
    let as= div.getElementsByTagName("a")
    //console.log(as);
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }


    
    let songUL= document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML= " ";
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`
        <li>
          <img src="spotify.png" alt="">
          <div class="info">
            <div>${song.replace("_64-(PagalWorld).mp3"," ")}</div>
          </div>
          <img src="play.png" alt="">
        </li>`
        console.log(song);
    }

Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
    
})

    
}

function secondsToMinutesAndSeconds(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) {
      return 'Invalid input';
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  
    return formattedTime;
}

const playMusic=(track)=>{
    //let audio = new Audio("/songs/"+track+"_64-(PagalWorld).mp3")
    currentsong.src= `/${currfolder}/`+track+"_64-(PagalWorld).mp3"
    currentsong.play();
    document.querySelector(".songinfo").innerHTML= track;
    document.querySelector(".songtime").innerHTML= "00:00 / 00:00";
}
async function displayAllalbums(){
    let a= await fetch(`http://127.0.0.1:5500/songs/`)
    let response= await a.text();
    console.log(response);
    let div= document.createElement("div")
    div.innerHTML= response;
    let cards= document.querySelector(".songs")
    let anchors= div.getElementsByTagName("a");
    let folders= []
    Array.from(anchors).forEach(async e=>{
        if(e.href.includes("/songs")){
            folders=(e.href.split("/").slice(-2)[1])
            console.log(folders)
            //meta data of folders
            let a= await fetch(`http://127.0.0.1:5500/songs/${folders}/info.json`)
            let response= await a.json();
            console.log(response)
            cards.innerHTML= cards.innerHTML+ `<div data-folder= songs/${folders}
             class="cards">
            <img src="/songs/${folders}/cover.jpg" alt="" />
            <div class="cardheading">
              <h4>${response.title}</h4>
            </div>
            <div class="cardcontent">
            <p>${response.description}</p>
            </div>
          </div>`
        }
    })
}

async function main(){
    

    await getsongs("songs/ncs")
    console.log(songs);
    document.querySelector(".songinfo").innerHTML= songs[0].split("_")[0];
    playMusic(songs[0].split("_")[0])

    //Display all the albums on the page
    displayAllalbums();

    // Attach an event listener to play, next, pervious
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src= "pause.svg";

        }
        else{
            currentsong.pause();
            play.src= "play.png";
        }
    })

    //listen for time update function
     currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML= `${secondsToMinutesAndSeconds(currentsong.currentTime)}/${secondsToMinutesAndSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left= (currentsong.currentTime/currentsong.duration)*100 + "%";
    })

        // listen seekbar
        document.querySelector(".seekbar").addEventListener("click",e=>{
            let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100;
           document.querySelector(".circle").style.left= percent + "%";
           currentsong.currentTime= ((currentsong.duration)* percent)/100;
        })

        // hamburger listener
        document.querySelector(".hamburger").addEventListener("click",()=>{
            document.querySelector(".leftcontainer").style.display="block"
        })

        document.querySelector(".closeimg").addEventListener("click",()=>{
            document.querySelector(".leftcontainer").style.display="none"
        })

        // previous event listener
        previous.addEventListener("click",()=>{
            console.log("Previous clicked");
            console.log(currentsong)
            let index= songs.indexOf(currentsong);
            console.log(index);
                playMusic(songs[index+1].split("_")[0]);
        })

        // next event listener
        next.addEventListener("click",()=>{
            console.log("Next clicked");
            console.log(currentsong)
            let index= songs.indexOf(currentsong);
                playMusic(songs[index+2].split("_")[0]);
        })

        // add an event to volume seekbar

        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
            console.log(e,e.target,e.target.value);
            currentsong.volume= parseInt(e.target.value)/100;
        })

        //load the playlist whenever the card is clicked
        Array.from(document.getElementsByClassName("cards")).forEach(e=>{
            e.addEventListener("click",async item=>{
                console.log(item,item.currentTarget.dataset);
                songs=await
                getsongs(`songs/${item.currentTarget.dataset.folder}`)
            })
        })
}

main()

