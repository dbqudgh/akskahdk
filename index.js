const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const template = require('./lib/template.js');


//function
//정규표현식
function fn(str){
    let res;
    res = str.replace(/[^0-9]/g,"");
    return res
  }
  
  //숫자순 정렬
  function numberSort(array){
    array.sort((a,b)=>{
      return fn(a) - fn(b)
    })
  }


app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.listen(3000,() =>{
    console.log('start! express server on port 3000');
});


app.use(express.static('public'));
app.use(express.static('만화'));
const testFolder = '만화';






app.get('/clock',(req,res) => {
    res.sendFile(__dirname+'/public/html/clock.html');
})
app.get('/',(req,res) => {
    res.sendFile(__dirname+'/public/html/main.html');
})

app.get('/mana',(req,res)=>{
    
    let body = '';
    let title = '만화모음'

    //전체 만화 읽음
    const manaList = fs.readdirSync(testFolder);

    for(let i = 0; i < manaList.length; i++){
        body += `<a href="/mana${i}">${manaList[i]}<br/><br/>`;
    }

    const html = template.HTML(title,body)
    res.send(html)


    for(let i = 0; i < manaList.length; i++){

        app.get(`/mana${i}`,(req,res)=>{

            body = '';
            title = `${manaList[i]}`;
            
            const episodeFolder = `${testFolder}/${manaList[i]}`//경로
            
            let episode = fs.readdirSync(episodeFolder);//에피소드
            
            numberSort(episode)//정렬
            
            for(let h = 0; h < episode.length; h++){

                
                app.get(`/mana${i}-${h}`,(req,res)=>{//마나 episode
                    
                    body = '';
                    title = `${manaList[i]}${episode[h]}`;
                    
                    
                    const imgsFolder =  `${episodeFolder}/${episode[h]}`//경로
                    
                    let imgs =  fs.readdirSync(imgsFolder);//이미지
                    
                    numberSort(imgs)//정렬
                    
                    for(let c = 0; c < imgs.length; c++){ //이미지 업로드
                        app.get(`/${i}-${h}${c}`,(req,res)=>{
                            fs.readFile(`D:/study/${imgsFolder}/${imgs[c]}`,(error,data)=>{
                                res.end(data)
                            })
                        })
                        body += `<img style = "text-align: center;" src="/${i}-${h}${c}">`
                    }
                    const P = `/mana${i}-${h-1}`;//이전화
                    const L = `/mana${i}`;//총리스트
                    const N = `${episode.length}/mana${i}>${h+1}`;//다음화 다음화 넘어가기전에 총홧수 몇개있는지 가저와 비교해줌
                    
                    const imgsHtml = template.HTML3(title,body,P,L,N)
                    res.send(imgsHtml)
                })
                
                body += `<a href="/mana${i}-${h}"> ${episode[h]} <br/><br/>`
                
            }
            
            const manaEpisode = template.HTML2(title,body)
            res.send(manaEpisode)
            
            
        })
        
    }
    
})



app.get('/memo',(req,res)=>{
    res.sendFile(__dirname+'/public/html/memo.html')
})

////이미지 업로드 형식 example
// app.get('/imgs',(req,res)=>{
//     fs.readFile('D:/study/만화/인고시마/인고시마44화/44화0.jpg', (error,data)=>{
//         res.end(data)
//     })
// })

