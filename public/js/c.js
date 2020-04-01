// const puppeteer = require('puppeteer')
// const request = require('request')
// const fs = require('fs')

// const button  = document.querySelector('.button')

// function init(){
//     button.addEventListener('click',handleClick)
// }
// init();

// function handleClick(event){

// const down = (path, url,i)=>{
//     request({url: url, headers:{'referer':'https://marumaru.today/bbs/cmoic/21668/133234'}
//     ,encoding: null},(error,Response,body)=>{
//         // console.log('body',body)
//         fs.writeFile(path + '\\' + String(i)+'.jpg', body,null,(err)=>{
//             if (err) throw err;
//             console.log('the file has been saved!')
//         })
//     })
// }

// (async() =>{
    
//     const baseUrl = 'https://marumaru.today/bbs/cmoic/21668/133234';

//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36')
    
//     await page.goto(baseUrl,{waitUntil: "networkidle2"});


//     const data = await page.evaluate(()=>{

//         const img = document.querySelectorAll('div[class="view-img"] > img')
//         let array = []
//         for(let i = 0 ; i < img.length; i++){
//             array.push(img[i].src)
//         }
//         return array;
//     })
//     const imgSrc = data;
    
//     for(let i = 0; i < imgSrc.length; i++){
//         down('img',imgSrc[i],i)
//     }

//     await browser.close();
// })();
// }