const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const filenamify = require('filenamify');
const validFilename = require('valid-filename');

function delay(timeout){
    return new Promise((resolve)=>{
        setTimeout(resolve,timeout);
    });
}

//설치경로,url,몇화ㅏ,몇번째이미지,에러 카운트
const down = (path, url,title,h,href,retry)=>{
    request({url: url, headers:{'referer': href}
    ,encoding: null},(error,Response,body)=>{
        // console.log('body',body)
//에러 5번 반복
        if(error && --retry>= 0){
            console.log('retry!:'+title+h)
            down(path, url,title,h,href,retry)
        }
//설치경로 , 이름 확장자 받고 다운로드
        fs.writeFile(path + '\\' + title + String(h)+'.jpg',body,null,(err)=>{
            if (err) throw err;//에러출력
            console.log(title + String(h+1))
        })
    })
}


(async() =>{
    
    async function autoScroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
    
                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }
    
    const favoritMana ={
        a:'https://manamoa32.net/bbs/page.php?hid=manga_detail&manga_id=13218',
        b:'https://manamoa32.net/bbs/page.php?hid=manga_detail&manga_id=5357',
        c:'',
        d:'',

    }
    const baseUrl = 'https://manamoa32.net/bbs/page.php?hid=manga_detail&manga_id=10866';

    const browser = await puppeteer.launch();//haadless:false
    const page = await browser.newPage();

    await  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36')
    await  page.goto(baseUrl,{waitUntil: "networkidle2"});
    await delay(5500);
    await delay(1500);
    await autoScroll(page);
    await delay(1500);

    const listData = await page.evaluate(()=>{

        const list = document.querySelectorAll('.slot > a')
        const title = document.querySelector('.red.title').innerText
        const titles = document.querySelectorAll('.chapter-list > .slot > a > .title')
        let listArray = [];
        let titleTexts = [];

        for(let i = list.length -1; i >= 0; i--){
           listArray.push(list[i].href);
           titleTexts.push(titles[i].firstChild.textContent.trim())
        }
        
            return {
                listArray:listArray,
                titleTexts:titleTexts,
                title:title
            }
        
    })  


    const title = listData.title; //제목
    const linkList = listData.listArray;//총링크 리스트
    const titleList = listData.titleTexts; //제목 리스트

    const path = `만화/${filenamify(title)}`//윈도우 특수문자 불가 문자 변환
    const savedir = __dirname + `/${path}`;//타이틀로 디렉토리 생성
    let totallmana = 0;

    if(!fs.existsSync(savedir)){
            fs.mkdirSync(savedir)
    }else{
        fs.readdir(savedir,(error,fileList)=>{
            totallmana = fileList.length;
        })
    }

    for(let i = totallmana; i < linkList.length; i++){


        await page.goto(linkList[i],{waitUntil: "networkidle2"})
        
        const data = await page.evaluate(()=>{
            const imgs = document.querySelectorAll('.view-content.scroll-viewer > img')
            let imgSrcs = []
            for(let j = 0; j < imgs.length; j++){
                if(imgs[j].attributes[0].nodeName.length > 5){
                    imgSrcs.push(imgs[j].attributes[0].value)
                }else{
                    imgSrcs.push(imgs[j].src)
                }
            }
            return imgSrcs;
        })

        await delay(3000);

        imgLinks = data;

        const savedirList =   __dirname + `/${path}/${filenamify(title)}${i+1}화`

        if(!fs.existsSync(savedirList)){
            fs.mkdirSync(savedirList)
        }

        for(let h = 0; h < imgLinks.length; h++){
            down(`${path}/${filenamify(title)}${i+1}화`,imgLinks[h],i+1+'화',h,linkList[i],5)
        }
    }

    await page.close()
    await browser.close()

})();


