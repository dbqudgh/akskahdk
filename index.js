const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const template = require('./lib/template.js');

app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.listen(3000,() =>{
    console.log('start! express server on port 3000');
});


app.use(express.static('public'));
app.use(express.static('만화'));
const testFolder = '만화';


// 비동기로 홧수 이미지 갯수 가저오기

// fs.readdir(testFolder,(error,fileList)=>{ //만화 폴더 가저와서
//     for(let i = 0; i < fileList.length; i++){ //for문으로 만화 폴더의 만화 갯수만큼 반복해줌
//         const chapterListDir = `${testFolder}/${fileList[i]}`; //만화 폴더안에 있는 만화중 하나를 골라
//         fs.readdir(chapterListDir,(error,fileList)=>{//그 만화를 읽어낸후
//             for(let h = 0; h < fileList.length; h++){ //그만화에 화 수만큼 반복
//                 const imgList = `${chapterListDir}/${fileList[h]}`//이미지 리스트 에 경로저장
//                 fs.readdir(imgList,(error,fileList)=>{//그 해당 화수에 이미지를 전부 가저옴
//                     console.log(fileList) 
//                 })
//             }
//         })
//     }
// })


//동기적으로 만화이미지 갯수 가저오기
// fs.readdir(testFolder,(error,fileList)=>{ //만화 폴더 가저와서 비동기적으로
//     for(let i = 0; i < fileList.length; i++){ //for문으로 만화 폴더의 만화 갯수만큼 반복해줌
        
//         const chapterListDir = `${testFolder}/${fileList[i]}`; //만화 폴더안에 있는 만화중 하나를 골라
//         const list = fs.readdirSync(chapterListDir);
        
//         for(let h = 0; h < list.length; h++){

//             const dir = `${testFolder}/${fileList[i]}/${list[list.indexOf(`${fileList[i]}${h+1}화`)]}`        
//             const imgs = fs.readdirSync(dir)
            
//             for(let c = 0; c < imgs.length; c++){
//                 const last = imgs[imgs.indexOf(`${h+1}화${c}.jpg`)]
//                 // console.log(`${(`D:/study/${dir}/${last}`)}`)
    
//                 app.get(`/mana/${i}${h}${c}`,(req,res)=>{
//                     fs.readFile(`D:/study/${dir}/${last}`,(error,data)=>{
//                         res.end(data)
//                     })
//                 })
//             }
//             //D:/study/만화/인고시마/인고시마1화/1화0.jpg
//             // app.get('/imgs',(req,res)=>{
//             //     fs.readFile('D:/study/만화/인고시마/인고시마44화/44화0.jpg', (error,data)=>{
//             //         res.end(data)
//             //     })
//             // })

//         }
//     }
// })




app.get('/clock',(req,res) => {
    res.sendFile(__dirname+'/public/html/clock.html');
})
app.get('/',(req,res) => {
    res.sendFile(__dirname+'/public/html/main.html');
})

app.get('/mana',(req,res)=>{
    fs.readdir(testFolder,(error,fileList)=>{ // 마나링크 들어올때 파일 읽어서
    let body = ''; //바디 초기화
    let title = '만화모음' //타이틀 초기화
        for(let i = 0; i < fileList.length; i++){ //만화개수 만큼 반복
                body += `<a href="/mana${i}">${fileList[i]}<br/><br/>`; //모든만화 바디에 저장
        }
        const html = template.HTML(title,body) //기본 html 에 body추가
        res.send(html) //이걸 /mana링크에 업로드

        for(let i = 0; i< fileList.length; i++){ // 총만화갯수만큼 반복한다
            app.get(`/mana${i}`,(req,res)=>{  //mana/만화제목 링크

                manaE = fs.readdirSync(`${testFolder}/${fileList[i]}`) //링크 클릭시 리드디렉토리싱크로 총 만화에피소드수만큼 받아옴
                body = ''; //바디초기화
                title =`${fileList[i]}`;//타이틀 초기화

               for(let h = 0; h < manaE.length; h++){ //만화 에피소드만큼 반복

                    app.get(`/mana${i}${h}`,(req,res)=>{

                        const imgs = fs.readdirSync(`${testFolder}/${fileList[i]}/${fileList[i]}${h+1}화`)
                        body = '';
                        title = `${fileList[i]}${h+1}화`;

                        for(let c = 0; c < imgs.length; c++){

                            app.get(`/${i}${h}${c}`,(req,res)=>{
                                fs.readFile(`D:/study/${testFolder}/${fileList[i]}/${fileList[i]}${h+1}화/${h+1}화${c}.jpg`,(error,data)=>{
                                    res.end(data)
                                })
                            })

                            body += `<img style = "text-align: center;" src="/${i}${h}${c}">`
                        }

                        const P = `/mana${i}${h-1}`;//이전화
                        const L = `/mana${i}`;//총리스트
                        const N = `${manaE.length}/mana${i}-${h+1}`;//다음화 다음화 넘어가기전에 총홧수 몇개있는지 가저와 비교해줌

                        const imgsHtml = template.HTML3(title,body,P,L,N)
                        res.send(imgsHtml)
                    })

                   body += `<a href="/mana${i}${h}"> ${manaE[manaE.indexOf(`${fileList[i]}${h+1}화`)]} <br/><br/>` //총만화 에피소드 바디에 추가
               }
               const manaEList = template.HTML2(title,body) //타이틀과 바디 초기화및 업로드
               res.send(manaEList)
           })
        }
    })
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

