const clockDiv = document.querySelector('.js-clock');
const showAm = document.querySelector('.js-showAm');

let chack = false;


function innerZero(a){
    return a < 10 ? `0${a}`:`${a}`;
}

function delectHours(number){
    if(number - 12 >= 0){
        chack = true;
        return number - 12;
    }else{
        chack = false;
        return number;
    }

}

function innerAm(){
    if(chack === false){
        showAm.innerText = 'am'
    }else if(chack === true){
        showAm.innerText = 'pm';
    }else console.log('error');
}

function showClock(){
    const clockdate = new Date();
    const hours =  clockdate.getHours();
    const minutes = clockdate.getMinutes();
    const seconds = clockdate.getSeconds();

    clockDiv.innerText = `${delectHours(innerZero(hours))}:${innerZero(minutes)}:${innerZero(seconds)}`;
    innerAm();

}

function init(){
    setInterval(showClock,1000);
}

init();




