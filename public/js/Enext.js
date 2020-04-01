const div1 = document.querySelector('.Enext1');
const div2 = document.querySelector('.Enext2');

const buttons1 = div1.querySelectorAll('button');
const buttons2 = div2.querySelectorAll('button');

const link = document.location.href.split('/mana')[0];

const previous1 = buttons1[0];
const list1 = buttons1[1];
const next1 = buttons1[2];

const previous2 = buttons2[0];
const list2 = buttons2[1];
const next2 = buttons2[2];


// console.log(buttons1);
// console.log(buttons2);

function init(){

    previous1.addEventListener('click',(event)=>{

        event.preventDefault();

        if(previous1.value.split('-')[1] === undefined){

            document.location.href = link+previous1.value

        }else alert('첫화입니다')

    })

    previous2.addEventListener('click',(event)=>{

        event.preventDefault();

        if(previous1.value.split('-')[1] === undefined){

            document.location.href = link+previous1.value

        }else alert('첫화입니다')

    })

    list1.addEventListener('click',(event)=>{

        event.preventDefault();

        document.location.href = link+list1.value

    })

    list2.addEventListener('click',(event)=>{

        event.preventDefault();

        document.location.href = link+list1.value

    })

    next1.addEventListener('click',(event)=>{

        event.preventDefault();

        totallE = parseInt(next1.value.split('/mana')[0]);
        currentE = parseInt(next1.value.split('-')[1]);

        const nextUrl = link+next1.value.split('-')[0].split(totallE)[1]+currentE;

        console.log(totallE)//총홧수
        console.log(currentE)//현재 홧수

        if(totallE > currentE){
            document.location.href = nextUrl
        }else alert('마지막화입니다')


    })


    next2.addEventListener('click',(event)=>{

        event.preventDefault();

        totallE = parseInt(next1.value.split('/mana')[0]);
        currentE = parseInt(next1.value.split('-')[1]);

        const nextUrl = link+next1.value.split('-')[0].split(totallE)[1]+currentE;

        console.log(totallE)//총홧수
        console.log(currentE)//현재 홧수

        if(totallE > currentE){
            document.location.href = nextUrl
        }else alert('마지막화입니다')


    })

}
init()







