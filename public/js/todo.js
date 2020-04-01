
const toDoForm = document.querySelector('.js-toDoForm'),
toDoInput = toDoForm.querySelector('input'),
toDoList = document.querySelector('.js-toDoList');
const allDelete = document.querySelector('.js-alldelete');


const TODOS_LS = 'toDos';
const ToDOS_CK = 'toDosCheck';

let toDos =[];
let toDosCheck = [];


/////////////////////////deleteToDo/////////////////////////////

function deleteToDo(event){
    const btn = event.target;
    const li = btn.parentNode;
    
        toDoList.removeChild(li);

        const cleanToDos = toDos.filter((toDo)=>{
            return toDo.id !== parseInt(li.id);
        });
        toDos = cleanToDos;
        saveToDos();
    }


///////////////////////////-save-///////////////////////////////
    function saveToDos(){
        localStorage.setItem(TODOS_LS,JSON.stringify(toDos));
    }
    function saveToDosChek(){
        localStorage.setItem(ToDOS_CK,JSON.stringify(toDosCheck));
    }
//////////////////////-paint-//////////////////////
    function paintToDoCheck(objId){
        const lis = toDoList.querySelectorAll('li');
        lis[objId-1].childNodes[1].classList.add('span-style');

        const toDoObj = {
            id:objId
        };
        toDosCheck.push(toDoObj);
        saveToDosChek();
    }
    function paintToDo(text){
        if(!(text === '')){

        const li = document.createElement('li');
        const delBtn = document.createElement('button');
        const span = document.createElement('span');
        const newId = toDos.length+1;
        
        
        span.innerText = `    ${text}`;
        li.appendChild(delBtn);
        li.appendChild(span);
        

       //////////////// //appendChild br////////////////////////////
        for(let i = 0; i < 1; i++){
            li.appendChild(document.createElement('br'));
        }
        /////////////////////////////////////////////////////////
        li.id = newId;
        toDoList.appendChild(li);

        const toDoObj ={
            text: text,
            id: newId
        };


        toDos.push(toDoObj);
        saveToDos();

        delBtn.addEventListener('click',deleteToDo);
        span.addEventListener('click',handleSpan);                                                                                                           

        }else alert('!input text!');
    }
    ///////////////////-handle////////////////////////
function handleAllDel(event){
    event.preventDefault();
    
    const lis = toDoList.querySelectorAll('li');
    toDoList.innerHTML ='';
    toDos =[];
    toDosCheck = [];
    saveToDos();
    saveToDosChek();


}


//////////////////////////////-spanClick/////////////////////////////////
    function handleSpan(event){
        event.preventDefault();
        const id = event.target.parentNode.id;
        const lodadSpan = event.target;
        let span = event.target;

        if(span.classList.value === ""){
            span.classList.add('span-style');

            //////////////localStroge////////////////////
            const toDoObj = {
                id:id
            };
            toDosCheck.push(toDoObj);
            saveToDosChek();
        }else {
            span.classList.remove('span-style');
            
            console.log(id);
            
            const idx = toDosCheck.findIndex(function(item){
                return item.id === id;
            });
            console.log(idx);
            if(idx > -1)toDosCheck.splice(idx,1);
            saveToDosChek();
        }
    }
    function handleSubmit(event){
        event.preventDefault();
        const currentValue = toDoInput.value;
        paintToDo(currentValue);
        toDoInput.value = '';
        
    }
/////////////////////////////load/////////////////////////////
    function loadToDosCheck(){
        const loadedToDosCheck = localStorage.getItem(ToDOS_CK);
        const parsedToDosCheck = JSON.parse(loadedToDosCheck);
        const id = parsedToDosCheck.id;
        if(loadedToDosCheck !== null){
            parsedToDosCheck.forEach(element => paintToDoCheck(element.id));
        }
    }

    function loadToDos(){
        const loadedToDos = localStorage.getItem(TODOS_LS);
        if(loadedToDos !== null){
            const parsedToDos = JSON.parse(loadedToDos);
            parsedToDos.forEach((toDo)=>{
                paintToDo(toDo.text);
            })
        }
    }
    ////////////////////////////////////-init/////////////////////////////
    function init(){
        toDoForm.addEventListener('submit',handleSubmit);
        allDelete.addEventListener('dblclick',handleAllDel);
        loadToDos();
        loadToDosCheck();
    }
    init();


//setAttribute//

