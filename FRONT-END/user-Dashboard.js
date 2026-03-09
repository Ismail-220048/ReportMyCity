/* Section switching */

function showSection(section){

document.getElementById("dashboard").style.display="none"
document.getElementById("submit").style.display="none"
document.getElementById("complaints").style.display="none"

document.getElementById(section).style.display="block"

}


/* Search Complaint */

function searchComplaint(){

let input=document.getElementById("searchInput").value.toUpperCase()
let cards=document.querySelectorAll(".complaint-card")

cards.forEach(card=>{

let text=card.innerText.toUpperCase()

if(text.includes(input)){
card.style.display="block"
}
else{
card.style.display="none"
}

})

}


/* Animated Counters */

let counters=document.querySelectorAll(".card h2")

counters.forEach(counter=>{

let target=+counter.innerText
let count=0

function updateCounter(){

let speed=target/40

count+=speed

if(count<target){
counter.innerText=Math.ceil(count)
setTimeout(updateCounter,40)
}
else{
counter.innerText=target
}

}

updateCounter()

})


/* Image preview */

document.getElementById("imageUpload").addEventListener("change",function(e){

let file=e.target.files[0]
let preview=document.getElementById("preview")

if(file){
preview.src=URL.createObjectURL(file)
preview.style.display="block"
}

})


/* Map */

var map=L.map('map').setView([16.5062,80.6480],12)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'OpenStreetMap'
}).addTo(map)

var marker

map.on('click',function(e){

if(marker){
map.removeLayer(marker)
}

marker=L.marker(e.latlng).addTo(map)

document.getElementById("latitude").value=e.latlng.lat
document.getElementById("longitude").value=e.latlng.lng

})