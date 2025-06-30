var c = document.getElementById("myCanvas");
c.setAttribute('style', 'display: none');
var ctx = c.getContext("2d");
/*ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();*/

const height = document.getElementById("height");
const width = document.getElementById("width");
const myButton = document.getElementById("Creer");

function MyMap() {
    if (width.value == NaN || height.value == NaN || width.value <= 0 || height.value <= 0) {
        return;
    }
    
    c.setAttribute('width', width.value);
    c.setAttribute('height', height.value);
    c.setAttribute('style', 'display: flex; border:1px solid #000000;');
}

myButton.addEventListener("click", () => {
  MyMap();
});

