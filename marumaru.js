const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');



//설치경로,url,몇화ㅏ,몇번째이미지,에러 카운트
const down = (path, url,i,h,href,retry)=>{
    request({url: url, headers:{'referer': href}
    ,encoding: null},(error,Response,body)=>{
        // console.log('body',body)
//에러 5번 반복
        if(error && --retry>= 0){
            console.log('retry!:'+i+h)
            down(path, url,i,h,href,retryCount)
        }
//설치경로 , 이름 확장자 받고 다운로드
        fs.writeFile(path + '\\' + String(i+1)+'화'+ String(h+1)+'.jpg', body,null,(err)=>{
            if (err) throw err;//에러출력
            console.log('the file has been saved!')
        })
    })
}

(async() =>{
    
    const baseUrl = '원하는링크';//<링크입력

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36')
    //user agent 우회
    await page.goto(baseUrl,{waitUntil: "networkidle2"});

    const hrefData = await page.evaluate(()=>{
        
        const href = document.querySelectorAll('.list-subject > a')
        const title =  document.querySelector('h1[class="text-left"]').innerText
        
        let arrayHref = []//배열형태 링크 저장

        for(let i = href.length-1; i >= 0 ; i--){
            arrayHref.push(href[i].href) //push link
        }
        return {
            arrayHref:arrayHref,
            title:title//title 및 링크 리턴
        }

    })


    const aHref = hrefData.arrayHref; // 총링크 
    const title = hrefData.title; // 제목


    const savedir = __dirname + `/${title}`;//타이틀로 디렉토리 생성
    if(!fs.existsSync(savedir)){
        fs.mkdirSync(savedir);
    }

    
    for(let i = 0; i<aHref.length; i++){//총횟수 링크만큼 반복
        await page.goto(aHref[i],{waitUntil: "networkidle2"})

        const data = await page.evaluate(()=>{

            const img = document.querySelectorAll('div[class="view-img"] > img')
            
            let array = []//img 링크 set

            for(let j = 0 ; j < img.length; j++){
                array.push(img[j].src) //img 링크 push
            }
            return array; //img link 리턴
            })

            const imgSrc = data;
            
            for(let h = 0; h < imgSrc.length; h++){
                down(`${title}`,imgSrc[h],i,h,aHref[i],5)
            }

    }

    await browser.close();
})();