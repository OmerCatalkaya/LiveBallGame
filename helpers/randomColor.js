const colors = ["blue","green","yellow","red","blueViolet","cyan"];

const randomColor = ()=>{
    return colors[Math.floor(Math.random()*colors.length)];
}

module.exports = randomColor;
