const form = document.querySelector('.js-exercise');
const input = form.querySelector('.js-exerciseInput');
let goalValue = 0;

//////////////////finished/////////////////
function finished(){

    goalValue = 0;
    input.classList.remove('dontshow');


    const upDiv = form.querySelector('.Upd');
    const nDiv = form.querySelector('.Nd');
    const dB = form.querySelector('.Db');
    const Ub = form.querySelector('.Ub');

    form.removeChild(upDiv);
    form.removeChild(nDiv);
    form.removeChild(dB);
    form.removeChild(Ub);

    input.value = "";

    alert('finished!!');

}
////////////////////////////////////////goalUp////////////////////////////
function goalUp(){
        goalValue++;
        const upDiv = form.querySelector('.Upd');
        upDiv.innerText = goalValue;
}
//////////////////////////////////////goalDn///////////////////////////////
function goalDn(){
    goalValue--;
    const upDiv = form.querySelector('.Db');
    upDiv.innerText = goalValue;
}


////////////////isNaN true///////////////////////
function isnanTrue(){
        input.classList.add('dontshow');

        const createDiv = document.createElement('div');
        const createUpdiv = document.createElement('div');
        const createUpButton = document.createElement('button');
        const createDownButton = document.createElement('button');

        createDiv.innerText = input.value;
        createUpdiv.innerText = goalValue;
        createDownButton.innerText = '';
        createUpButton.innerText = '';

        createUpdiv.classList.add('Upd');
        createDiv.classList.add('Nd');
        createDownButton.classList.add('Db');
        createUpButton.classList.add('Ub');

        form.appendChild(createDiv);
        form.appendChild(createUpdiv);
        form.appendChild(createUpButton);
        form.appendChild(createDownButton);

        createUpButton.addEventListener('click',handleUp);
        createDownButton.addEventListener('click',handleDn);

        input.classList.add('dontshow');
}
/////////////////////handle////////////////////


//////////////handleUp//////////////
function handleUp(event){
    event.preventDefault();
    goalUp();
    if(parseInt(input.value) === goalValue){
        finished();
    }
}

//////////////handleDn//////////////
function handleDn(event){
    event.preventDefault();
    if(parseInt(goalValue) > 0){
        goalDn();
    }else{
        alert('min!');
    }
}

//////////////handleSubmit//////////////
function handleSubmit(event){
    event.preventDefault();
    const inputvalue = parseInt(input.value);
    const ec = !(isNaN(inputvalue));
    console.log(inputvalue);
    if(ec && inputvalue > 0){
        isnanTrue();
    }else {
        alert('exactly input');
        input.value = "";
    }
}
///////////////////////init///////////////////////
function init(){
    form.addEventListener('submit',handleSubmit);
}   
init();