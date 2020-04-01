const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


const downloadImage = (path, url,titleId,no, retryCount) =>{
    request({url:url,
            headers:{'referer': `https://comic.naver.com/webtoon/detail.nhn?titleId=${titleId}&no=${no}&weekday=thu`}
            ,encoding: null},(error,response,body)=>{
            if(error && --retryCount >= 0){
                console.log(`재시도${titleId}_${no}_${retryCount}`);
                downloadImage(path, url,titleId,no, retryCount);
                return;
            }
            fs.writeFile(path + '\\' + `${titleId}_${no}_${(url.split('_IMAG01')[1])}`, body,null,(err)=>{
                if (err) throw err;
                console.log('The file has been saved!')
            })
    })
}

const getImageUrls = (titleId, no) =>{
    request(`https://comic.naver.com/webtoon/detail.nhn?titleId=${titleId}&no=${no}&weekday=thu`,(error, response,body)=>{
        const $ = cheerio.load(body);
        for(let i = 0; i < $('.wt_viewer img').length; i++)
            downloadImage("img",$('.wt_viewer img')[i].attribs.src, titleId,no,5)
})
}

for(let i = 1,j = 0; i <20; i++,j++){
    setTimeout(()=>{
        getImageUrls(570503,i);
    },j*1000);
}
