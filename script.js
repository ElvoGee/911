const tracks = [
  {
    title: 'Sunny Days',
    artist: 'Demo Artist',
    src: 'assets/sunny-days.mp3',
    cover: 'assets/cover1.jpg',
    duration: '2:34'
  },
  {
    title: 'Night Drive',
    artist: 'Demo Artist',
    src: 'assets/night-drive.mp3',
    cover: 'assets/cover2.jpg',
    duration: '3:12'
  }
]

const audio = document.getElementById('audio')
const playBtn = document.getElementById('play')
const prevBtn = document.getElementById('prev')
const nextBtn = document.getElementById('next')
const coverImg = document.getElementById('cover-img')
const trackTitle = document.getElementById('track-title')
const trackArtist = document.getElementById('track-artist')
const playlistEl = document.getElementById('playlist')
const upnextEl = document.getElementById('upnext')
const seek = document.getElementById('seek')
const currentTimeEl = document.getElementById('current')
const durationEl = document.getElementById('duration')
const darkToggle = document.getElementById('darkToggle')

let current = 0
let isPlaying = false

function loadTrack(index){
  const t = tracks[index]
  audio.src = t.src
  coverImg.src = t.cover
  trackTitle.textContent = t.title
  trackArtist.textContent = t.artist
  durationEl.textContent = t.duration
  // update playlist active
  document.querySelectorAll('.playlist .item').forEach((el,i)=>{
    el.classList.toggle('active', i===index)
  })
  // up next
  renderUpNext(index)
}

function renderPlaylist(){
  playlistEl.innerHTML = ''
  tracks.forEach((t, i)=>{
    const item = document.createElement('div')
    item.className = 'item'
    item.innerHTML = `
      <div class="meta">
        <h4>${t.title}</h4>
        <p>${t.artist}</p>
      </div>
      <div class="dur">${t.duration}</div>
    `
    item.addEventListener('click', ()=>{
      current = i
      loadTrack(current)
      playAudio()
    })
    playlistEl.appendChild(item)
  })
}

function renderUpNext(index){
  upnextEl.innerHTML = ''
  for(let i=index+1;i<tracks.length;i++){
    const li = document.createElement('li')
    li.textContent = tracks[i].title + ' — ' + tracks[i].artist
    upnextEl.appendChild(li)
  }
}

function playAudio(){
  audio.play()
  isPlaying = true
  playBtn.textContent = '❚❚'
}
function pauseAudio(){
  audio.pause()
  isPlaying = false
  playBtn.textContent = '▶'
}

playBtn.addEventListener('click', ()=>{
  if(!isPlaying) playAudio(); else pauseAudio()
})
prevBtn.addEventListener('click', ()=>{
  current = (current-1+tracks.length)%tracks.length
  loadTrack(current)
  playAudio()
})
nextBtn.addEventListener('click', ()=>{
  current = (current+1)%tracks.length
  loadTrack(current)
  playAudio()
})

// progress handling
audio.addEventListener('timeupdate', ()=>{
  if(audio.duration){
    const pct = (audio.currentTime/audio.duration)*100
    seek.value = pct
    currentTimeEl.textContent = formatTime(audio.currentTime)
  }
})

seek.addEventListener('input', ()=>{
  if(audio.duration){
    const t = (seek.value/100)*audio.duration
    audio.currentTime = t
  }
})

audio.addEventListener('ended', ()=>{
  nextBtn.click()
})

function formatTime(s){
  const m = Math.floor(s/60)
  const sec = Math.floor(s%60).toString().padStart(2,'0')
  return `${m}:${sec}`
}

// theme toggle
darkToggle.addEventListener('change', ()=>{
  document.body.classList.toggle('dark', darkToggle.checked)
})

// init
renderPlaylist()
loadTrack(0)