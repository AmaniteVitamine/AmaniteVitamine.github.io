var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");


const height = document.getElementById("height");
const width = document.getElementById("width");
const myButton = document.getElementById("Creer");

function MyMap() {
    if (isNaN(width.value) || isNaN(height.value) || width.value <= 0 || height.value <= 0 || width.value > 1000 || height.value > 450) {
      alert("Erreur : veuillez rentrer des dimensions correctes.");  
      return;
    }
    
    c.setAttribute('width', width.value);
    c.setAttribute('height', height.value);
    c.setAttribute('style', 'display: flex; border:1px solid #000000;');
}

myButton.addEventListener("click", () => {
  MyMap();
});

