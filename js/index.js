//Zmienne
const header = document.querySelector("#header");
const crosshair = document.querySelector(".crosshair");
const btnStart = document.querySelector(".btn__start");
const start = document.querySelector(".start");
const canvas = document.querySelector("#space-box");
const c = canvas.getContext("2d");
const earth = document.querySelector(".earth");
const score = document.querySelector(".score");
const level1 = document.querySelector(".level1");
const btnLevel1 = document.querySelector(".btn__level1");
const metLevel1Top = document.createElement("div");
const metLevel1Bottom = document.createElement("div");
const metLevel1Center = document.createElement("div");
const metLevel2Top = document.createElement("div");
const metLevel2Bottom = document.createElement("div");
const metLevel2Center = document.createElement("div");
const metLevel3Center = document.createElement("div");
const metLevel4Center = document.createElement("div");
let meteoriteLevel1;
let meteoriteLevel2;
let points = 0;
const restart = document.querySelector(".restart");
const level3 = document.querySelector(".level3");
const btn2 = document.querySelector(".btn__level2");
const btn3 = document.querySelector(".btn__level3");

//Kursor
header.addEventListener("mousemove", function(e) {
    crosshair.style.left = e.pageX + "px"
    crosshair.style.top = e.pageY + "px"
});

//Canvas
let innerWidth = window.innerWidth - 20,
    innerHeight = window.innerHeight -20,
    radius = 0.8,
    starsIndex = 0,
    stars = [],
    TWO_PI = Math.PI*2,
    centerX = innerWidth/2,
    centerY = innerHeight/2,
    focalLength = 800,
    starRadius = null,
    starX = null,
    starY = null,
    numStars = 1000;
    //ruchomy kosmos
    mouse = {},
	starX_dir = 0,
	starY_dir = 0;

canvas.width = innerWidth;
canvas.height = innerHeight;

//Function for create new start
function star(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.color = "#FFE490";
    starsIndex++;
    stars[starsIndex] = this;
    this.id = starsIndex;
    //Animate Stars
    this.update = function() {
        starX = (this.x - centerX) * (focalLength / this.z);
        starX += centerX;

        starY = (this.y -centerY) * (focalLength / this.z);
        starY += centerY;

        starRadius = radius * (focalLength / this.z);

        starX += starX_dir;
	    starY += starY_dir;

        this.z += -10;

        if(this.z <= 0) {
            this.z = parseInt(innerWidth);
        }
        this.draw();
    }
    //Function for draw star
    this.draw = function() {
       c.beginPath();
        c.arc(starX,starY,starRadius, TWO_PI,false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath(); 
    }
}

//x,y,z values
let s;
for (s=0; s<numStars; s++) {
    x = Math.random() * innerWidth;
    y = Math.random() * innerHeight;
    z = Math.random() * innerWidth;
    new star(x,y,z);
}

//Function for animate canvas object
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "#010205";
    c.fillRect(0,0,innerWidth,innerHeight);

    for( var  i in stars) {
        stars[i].update();
    }
}
animate();

// Move the stars with mouse pointer
window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
    
    if(mouse.x < centerX){
      starX_dir += 0.5;
    }else{
      starX_dir += -0.5;
    }
    
    if(mouse.y < centerY){
      starY_dir += 0.5;
    }else{
      starY_dir += -0.5;
    }
});

//Event na przycisku - start gry
btnStart.addEventListener("click", function(e) {
    e.preventDefault();
    playAudio("level.mp3");
    start.style.display = "none";
    earth.style.display = "block";
    score.style.display = "block";
    level1.style.display = "block";
})

//Punktacja
function setPoints(nr) {
    points += nr;
    score.innerHTML = String(points).padStart(4, "0");
}

//Level1
//Rozpoczęcie gry po kliknieciu Go!
btnLevel1.addEventListener("click", function(e) {
    e.preventDefault();
    level1.style.display =  "none";
    clickButton();
    setup();
    playAudioAll("all1.mp3");
})
 
//Zmiana wartości zmiennych
function random(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function clickButton() {
    meteoriteLevel1 = setInterval(function() {
        //Meteoryty pozycja Top
        metLevel1Top.classList.add("metLevel1Top")
        header.appendChild(metLevel1Top); 

        const scale = 2.5 + random(1, 3) / 10; //wielkość meteorytóœ
        metLevel1Top.style.transform = `scale(${scale})`;

        const postop1 = random(2, 20); //pozycja
        metLevel1Top.style.top = postop1 + "%";

        //Meteoryty pozycja Bottom
        metLevel1Bottom.classList.add("metLevel1Bottom")
        header.appendChild(metLevel1Bottom); 

        metLevel1Bottom.style.transform = `scale(${scale})`;

        const postop2 = random(80, 90);
        metLevel1Bottom.style.top = postop2 + "%";

        //Meteoryty pozycja Center
        metLevel1Center.classList.add("metLevel1Center")
        header.appendChild(metLevel1Center); 

        metLevel1Center.style.transform = `scale(${scale})`;

        const postop3 = random(40, 65);
        metLevel1Center.style.top = postop3 + "%";

        //Jeśli meteoryt wleci w ziemię następuje wybuch
        metLevel1Center.addEventListener("animationend", function(e) {
            this.remove();
            metLevel1Center.style.animationPlayState = "paused";
            const allCenter = document.querySelectorAll(".metLevel1Center")
            for(let el of allCenter) {
                el.remove();
            }
            restart.style.display = "block";
            earth.classList.add("fireball");
            playAudioEksplozja("eksplozja.mp3");

            metLevel1Top.addEventListener("animationend", function(e) {
                this.remove();
                metLevel1Top.style.animationPlayState = "paused";
                const allTop = document.querySelectorAll(".metLevel1Top")
                for(let el of allTop) {
                    el.remove();
                }
            })
            metLevel1Bottom.addEventListener("animationend", function(e) {
                this.remove();
                metLevel1Bottom.style.animationPlayState = "paused";
                const allBottom = document.querySelectorAll(".metLevel1Bottom")
                for(let el of allBottom) {
                    el.remove();
                }
            })
            
            function stopInterval() {
                clearInterval(meteoriteLevel1); 
            }
            stopInterval();

            //Zatrzymanie zegara
            function stopClock() {
                clearInterval(clock); 
            }
            stopClock();
        });


    },3000)
}

//Eventy - klikniecie na meteoryt
metLevel1Top.addEventListener("click", function() {
    this.remove();
    setPoints(1);
    playAudioShot2("shot.mp3");
});
metLevel1Bottom.addEventListener("click", function() {
    this.remove();
    setPoints(1);
    playAudioShot2("shot.mp3");
})

metLevel1Center.addEventListener("click", function() {
    this.remove();
    setPoints(1);
    playAudioShot2("shot.mp3");
}) 
 
//Zegar Level1
const ONE_SECOND = 1000;
let $clock = null;
let clock;
const level2 = document.querySelector(".level2");
class Clock {
    constructor() {
        this.limiteTime = null;
        this.currentTime = 0;
        this.$clock = document.querySelector(".clock");
        this.clock = null;
    }
    render(string) {
        this.$clock.textContent = string;
        
    }
    start(formattedTime) {
        this.limiteTime = Clock.parseSeconds(formattedTime);
        this.update();
        clock = setInterval(()=> {
            this.currentTime += ONE_SECOND;
            this.update();
            if(this.isFinished()) {
            this.stop();
            }
        }, ONE_SECOND);
    }
    update() {
        let remain = this.getRemainingTime();
        let time = Clock.formattedTime(remain);
        this.render(time);
    }
    getRemainingTime() {
        return this.limiteTime - this.currentTime;
    }
    //Zatrzymanie zegara i wykonanie funkcji
    stop() {
        //Zatrzymanie intervału
        clearInterval(clock);
        level2.style.display = "block";
        function stopInterval() {
            clearInterval(meteoriteLevel1); 
        }
        stopInterval();

        //Dźwięk kolejna runda
        playAudio("level.mp3");

        //Usunięcie meteorytów, które utworzyły się zanim zatrzymano interwał
        const allCenter = document.querySelectorAll(".metLevel1Center, .metLevel1Top, .metLevel1Bottom")
            for(let el of allCenter) {
                el.remove();
            }
    }
    isFinished() {
        return this.currentTime === this.limiteTime;
    }
    static parseSeconds(time) {
        let [minutes, seconds] = time.split(":").map(Number);
        return minutes * 60 * ONE_SECOND + seconds * ONE_SECOND;
    }
    static formattedTime(milliseconds) {
        let minutes = Math.floor(milliseconds / ONE_SECOND / 60);
        let seconds = milliseconds / ONE_SECOND % 60;
        minutes = String(minutes).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0")
        return `${minutes} : ${seconds} `
    }
}

function setup() {
    let clock1 = new Clock();
    clock1.start("00:10");
}

//Level 2
//Rozpoczęcie gry po kliknieciu Go!
btn2.addEventListener("click", function(e) {
    e.preventDefault();
    metLevel1Center.style.transform = 
    playAudioAll("all2.mp3");
    level2.style.display = "none";
    clickButton();
    clickButton2();
    setup2();
    earth.style.transform = `scale(0.69)`;
})

//Meteoryty z lewej strony
function clickButton2() {
    meteoriteLevel2 = setInterval(function() {
        //Meteoryty pozycja Top
        metLevel2Top.classList.add("metLevel2Top")
        header.appendChild(metLevel2Top); 

        const scale = 1.9 + random(1, 3) / 10; //wielkość meteorytóœ
        metLevel1Top.style.transform = `scale(${scale})`;

        const postop1 = random(2, 20); //pozycja
        metLevel2Top.style.top = postop1 + "%";

        //Meteoryty pozycja Bottom
        metLevel2Bottom.classList.add("metLevel2Bottom")
        header.appendChild(metLevel2Bottom); 

        metLevel2Bottom.style.transform = `scale(${scale})`;

        const postop2 = random(80, 90);
        metLevel2Bottom.style.top = postop2 + "%";

        //Meteoryty pozycja Center
        metLevel2Center.classList.add("metLevel2Center")
        header.appendChild(metLevel2Center); 

        metLevel2Center.style.transform = `scale(${scale})`;

        const postop3 = random(40, 65);
        metLevel2Center.style.top = postop3 + "%";

        //Jeśli meteoryt wleci w ziemię następuje wybuch
        metLevel2Center.addEventListener("animationend", function(e) {
            this.remove();
            metLevel2Center.style.animationPlayState = "paused";
            const allCenter = document.querySelectorAll(".metLevel1Center")
            for(let el of allCenter) {
                el.remove();
            }
            restart.style.display = "block";
            earth.classList.add("fireball");
            playAudioEksplozja("eksplozja.mp3");

            metLevel2Top.addEventListener("animationend", function(e) {
                this.remove();
                metLevel2Top.style.animationPlayState = "paused";
                const allTop = document.querySelectorAll(".metLevel1Top")
                for(let el of allTop) {
                    el.remove();
                }
            })
            metLevel2Bottom.addEventListener("animationend", function(e) {
                this.remove();
                metLevel2Bottom.style.animationPlayState = "paused";
                const allBottom = document.querySelectorAll(".metLevel1Bottom")
                for(let el of allBottom) {
                    el.remove();
                }
            })
            function stopInterval2() {
                clearInterval(meteoriteLevel2); 
            }
            stopInterval2();
            //Zatrzymanie zegara
            function stopClock2() {
                clearInterval(clock2); 
            }
            stopClock2();
        });
    },3000)
}

metLevel2Top.addEventListener("click", function() {
    this.remove();
    setPoints(1);
    playAudioShot2("shot.mp3");
});
metLevel2Bottom.addEventListener("click", function() {
    this.remove();
    setPoints(1);
    playAudioShot2("shot.mp3");
})
metLevel2Center.addEventListener("click", function() {
    this.remove();
    setPoints(1);
    playAudioShot2("shot.mp3");
})  

// Zagar Level2
let clock2;
class Clock2 {
    constructor() {
        this.limiteTime = null;
        this.currentTime = 0;
        this.$clock = document.querySelector(".clock");
        this.clock2 = null;
    }
    render(string) {
        this.$clock.textContent = string;
    }
    start(formattedTime) {
        this.limiteTime = Clock2.parseSeconds(formattedTime);
        this.update();
        clock2 = setInterval(()=> {
            this.currentTime += ONE_SECOND;
            this.update();
            if(this.isFinished()) {
            this.stop();
            }
        }, ONE_SECOND);
    }
    update() {
        let remain = this.getRemainingTime();
        let time = Clock2.formattedTime(remain);
        this.render(time);
    }
    getRemainingTime() {
        return this.limiteTime - this.currentTime;
    }
    stop() {
        clearInterval(clock2);
        level3.style.display = "block";
        
        function stopInterval() {
            clearInterval(meteoriteLevel1); 
        }
        stopInterval();

        function stopInterval2() {
            clearInterval(meteoriteLevel2); 
        }
        stopInterval2();

        playAudio("level.mp3");

        //Usuwa meteoryty, żeby po czasie nie wybuchała ziemia
        const allCenter = document.querySelectorAll(".metLevel1Center, .metLevel1Top, .metLevel1Bottom, .metLevel2Center, .metLevel2Top, .metLevel2Bottom")
            for(let el of allCenter) {
                el.remove();
        } 
    }
    isFinished() {
        return this.currentTime === this.limiteTime;
    }
    static parseSeconds(time) {
        let [minutes, seconds] = time.split(":").map(Number);
        return minutes * 60 * ONE_SECOND + seconds * ONE_SECOND;
    }
    static formattedTime(milliseconds) {
        let minutes = Math.floor(milliseconds / ONE_SECOND / 60);
        let seconds = milliseconds / ONE_SECOND % 60;
        minutes = String(minutes).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0")
        return `${minutes} : ${seconds} `
    }
}

function setup2() {
    let clock2 = new Clock2();
    clock2.start("00:10");
}

//Level3
//Rozpoczęcie gry po kliknieciu Go!
btn3.addEventListener("click", function(e) {
    e.preventDefault();
    playAudioAll("all3.mp3");
    level3.style.display = "none";
    clickButton();
    clickButton2();
    clickButton3();
    clickButton4();
    setup3();
    earth.style.transform = `scale(0.85)`;
})

//Meteoryty z prawej strony
function clickButton3() {
    meteoriteLevel3 = setInterval(function() {
        //Meteoryty pozycja Center
        metLevel3Center.classList.add("metLevel3Center")
        header.appendChild(metLevel3Center); 

        const scale = 2.5 + random(1, 3) / 10;
        metLevel3Center.style.transform = `scale(${scale})`;

        const postop3 = random(27, 68);
        metLevel3Center.style.top = postop3 + "%";

        //Jeśli meteoryt wleci w ziemię następuje wybuch
        metLevel3Center.addEventListener("animationend", function(e) {
            this.remove();
            metLevel3Center.style.animationPlayState = "paused";
            const allCenter = document.querySelectorAll(".metLevel3Center")
            for(let el of allCenter) {
                el.remove();
            }
            restart.style.display = "block";
            earth.classList.add("fireball");
            playAudioEksplozja("eksplozja.mp3");

            function stopInterval3() {
                clearInterval(meteoriteLevel3); 
            }
            stopInterval3();
            //Zatrzymanie zegara
            function stopClock() {
                clearInterval(clock3); 
            }
            stopClock();
        });   
    },2000)
}

metLevel3Center.addEventListener("click", function() {
    this.remove();
    setPoints(1);
    playAudioShot2("shot.mp3");
})

//Meteoryty z lewej strony
function clickButton4() {
    meteoriteLevel4 = setInterval(function() {
        //Meteoryty pozycja Center
        metLevel4Center.classList.add("metLevel4Center")
        header.appendChild(metLevel4Center); 

        const scale = 2 + random(1, 3) / 10;
        metLevel4Center.style.transform = `scale(${scale})`;

        const postop3 = random(27, 68);
        metLevel4Center.style.top = postop3 + "%";

        //Jeśli meteoryt wleci w ziemię następuje wybuch
        metLevel4Center.addEventListener("animationend", function(e) {
            this.remove();
            metLevel4Center.style.animationPlayState = "paused";
            const allCenter = document.querySelectorAll(".metLevel4Center")
            for(let el of allCenter) {
                el.remove();
            }
            restart.style.display = "block";
            earth.classList.add("fireball");

            function stopInterval4() {
                clearInterval(meteoriteLevel4); 
            }
            stopInterval4();
            //Zatrzymanie zegara
            function stopClock() {
                clearInterval(clock3); 
            }
            stopClock();
        }); 
    },4000)
}

metLevel4Center.addEventListener("click", function() {
    this.remove();
    setPoints(1);
    playAudioShot2("shot.mp3");
})

// Zegar Level 3
const clockOff = document.querySelector(".clock");
const winner = document.querySelector(".winner");
let clock3;
class Clock3 {
    constructor() {
        this.limiteTime = null;
        this.currentTime = 0;
        this.$clock = document.querySelector(".clock");
        this.clock3 = null;
    }
    render(string) {
        this.$clock.textContent = string;
    }
    start(formattedTime) {
        this.limiteTime = Clock3.parseSeconds(formattedTime);
        this.update();
        clock3 = setInterval(()=> {
            this.currentTime += ONE_SECOND;
            this.update();
            if(this.isFinished()) {
            this.stop();
            }
        }, ONE_SECOND);
    }
    update() {
        let remain = this.getRemainingTime();
        let time = Clock3.formattedTime(remain);
        this.render(time);
    }
    getRemainingTime() {
        return this.limiteTime - this.currentTime;
    }
    stop() {
        //Uruchomienie localStorage
        scoreText();
         
        clearInterval(clock3);
        winner.style.display = "block";
        restart.style.left = "51%";
        restart.style.top = "90%";
        restart.style.display = "block";

        playAudioAplauz("aplauz.mp3");

        function stopInterval() {
            clearInterval(meteoriteLevel1); 
        }
        stopInterval();

        function stopInterval2() {
            clearInterval(meteoriteLevel2); 
        }
        stopInterval2();

        function stopInterval3() {
            clearInterval(meteoriteLevel3); 
        }
        stopInterval3();

        function stopInterval4() {
            clearInterval(meteoriteLevel4); 
        }
        stopInterval4();

        //Usunięcie widoku licznika
        clockOff.style.display = "none";

        //Usuwa meteoryty, żeby po czasie nie wybuchała ziemia
        const allCenter4 = document.querySelectorAll(".metLevel1Center, .metLevel1Top, .metLevel1Bottom, .metLevel2Center, .metLevel2Top, .metLevel2Bottom, .metLevel3Center, .metLevel4Center");
            for(let el of allCenter4) {
                el.remove();
        }
    }
    isFinished() {
        return this.currentTime === this.limiteTime;
    }
    static parseSeconds(time) {
        let [minutes, seconds] = time.split(":").map(Number);
        return minutes * 60 * ONE_SECOND + seconds * ONE_SECOND;
    }
    static formattedTime(milliseconds) {
        let minutes = Math.floor(milliseconds / ONE_SECOND / 60);
        let seconds = milliseconds / ONE_SECOND % 60;
        minutes = String(minutes).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0")
        return `${minutes} : ${seconds} `
    }
}

function setup3() {
    let clock3 = new Clock3();
    clock3.start("00:10");
}

//Dźwięki
function playAudio(src) {
    let audio = new Audio(src);
    audio.load();
    audio.play();
}

function playAudioEksplozja(src) {
    let audio = new Audio(src);
    audio.load();
    audio.play();
}

function playAudioShot2(src) {
    let audio = new Audio(src);
    audio.load();
    audio.play();
}

function playAudioAplauz(src) {
    let audio = new Audio(src);
    audio.load();
    audio.play();
}

function playAudioAll(src) {
    let audio = new Audio(src);
    audio.load();
    audio.play();
}

//localStorage
const recordText = document.querySelector(".record__text");
function scoreText() {
    //Score
        const scoreGame = score.textContent;
        if(localStorage.getItem("score") < scoreGame) {
            localStorage.setItem("score", scoreGame)
            recordText.innerHTML = `New Record ${scoreGame}`;
            recordText.style.display = "block";
        }
}
