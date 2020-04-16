const input = document.querySelector('.search');
const searchList = document.querySelector('.searchList');
const list = document.querySelectorAll('.list > a');
input.addEventListener('change',()=>{
    while(searchList.hasChildNodes())searchList.removeChild(searchList.firstChild)
    for(let i = 0; i < list.length; i++){
        if(list[i].textContent.includes(input.value) && input.value !== ""){
            const clone = list[i].cloneNode(true)
            searchList.appendChild(clone);
        }
    }
})
