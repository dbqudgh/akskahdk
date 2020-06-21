//module require
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const template = require('./lib/template.js');
const Replace = require("./lib/replace.js");
const manaLib = require("./lib/manaLib");



//2020-06-21
const filenamify = require('filenamify');
const cheerio = require("cheerio");
const request = require("request");




app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//sever on
app.listen(3000,() =>{
    console.log('start! express server on port 3000');
});

//folder
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
    
    //비구조화 활당 html manaList return{html:html, manaList:manaList}
    const {html,manaList} = manaLib.bodyinnerA(body,title,testFolder);
    res.send(html);//html file send

    for(let i = 0; i < manaList.length; i++){
        app.get(`/mana${i}`,(req,res)=>{
            
        
            body = '';
            title = `${manaList[i]}`;

            const episodeFolder = `${testFolder}/${manaList[i]}`//경로
            
            let episode = fs.readdirSync(episodeFolder);//에피소드
            

            Replace.numberSort(episode)//정렬

            manaLib.downEpisode(title,episode,__dirname+'/'+episodeFolder);//최신화가 있다면 다운로드 해줌

            
            
            for(let h = 0; h < episode.length; h++){

                
                app.get(`/mana${i}-${h}`,(req,res)=>{//마나 episode 
                    

                    body = '';
                    title = `${episode[h]}`;


                    
                    
                    const imgsFolder =  `${episodeFolder}/${episode[h]}`//경로
                    
                    let imgs =  fs.readdirSync(imgsFolder);//이미지
                    
                    Replace.numberSort(imgs)//정렬
                    
                    for(let c = 0; c < imgs.length; c++){ //이미지 업로드
                        app.get(`/${i}-${h}${c}`,(req,res)=>{
                            fs.readFile(`D:/study/${imgsFolder}/${imgs[c]}`,(error,data)=>{
                                res.end(data)
                            })
                        })
                        body += `<img style = "text-align: center;" src="/${i}-${h}${c}"></br>`
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

