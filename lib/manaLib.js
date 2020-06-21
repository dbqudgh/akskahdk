const fs = require('fs');
const template = require('./template')
const filenamify = require('filenamify');
const cheerio = require("cheerio");
const request = require("request");


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
            
            
        })
    })
}



module.exports = {
    bodyinnerA: (body,title,testFolder)=>{//body and title and test folder directory
        
        //전체 만화 읽음
        const manaList = fs.readdirSync(testFolder);

        for(let i = 0; i < manaList.length; i++){
            body += `<a href="/mana${i}">${manaList[i]}<br/><br/>`;
        }

        const html = template.HTML(title,body)

        return {
            manaList:manaList,
            html:html
        }

    },
    downEpisode:(title,ep,path)=>{//다운받을경로

            //request 모듈 사용하여 최신화 나왔을때 기존만화 겟수 비교후 새로운만화가 나왔을때 ture 아니면 false
            //flase ture 반환받아서 title 사용하여 request 모듈사용하여 검색후 다운로드 받고 업데이트해주기

            //2020-06-21

            //주소 https://manamoa48.net/ // 만약 링크 오류가 난다면 여기 숫자를 하나 더해줌 ex) 48+1 mana49
            //number 증가될 숫자 title 제목  url = 검색 url

            let number = '48' // 변경될 url 숫자
            
            const searchTitle = encodeURI(title); // title 한글 url 인코딩해줌
            
            let url = `https://manamoa48.net/bbs/search.php?url=https%3A%2F%2Fmanamoa48.net%2Fbbs%2Fsearch.php&sfl=0&stx=${searchTitle}`; // url
            
            let options = { // user-Agent 우회하기
                uri: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                json:true 
            };

            request(options,(err,response,body)=>{
                //callback
                
                // cheerio 모듈 사용하여 만화에 a테그 href 추출 
                const $ = cheerio.load(body);
                
                const $subject = $('div.manga-subject > a');

                let infoObj = new Array(); //정보를 담을 객체
                    
                    $subject.each(function(){
                        infoObj.push(
                            {text:filenamify($(this).text().trim()),// 내 컴퓨터에 저장되어 있는건 filenamify(디렉토리이름변경) 가 적용될수도 있으니 적용
                             id:$(this).attr('href').split('id=')[2]});//href 에 id 값도 반환
                    });
                

                let id //반환받을 id값

                for(let b = 0; b < infoObj.length; b++){
                    if(title.length === infoObj[b].text.length){
                        id = infoObj[b].id
                    }
                }



                const url = `https://manamoa48.net/bbs/page.php?hid=manga_detail&manga_id=${id}`

                options.uri = url 

                //추출된 링크 받아서 또한번 request 모듈 사용하여 요청
                request(options,(err,response,body)=>{
                    
                    const $ = cheerio.load(body);

                    const $div = $('.slot > a');

                    const $titles = $('.slot > a >.title');

                    // 여기서 jquery는 속성 값을 가저오면 하나만준다 진짜 뭐같다 이거 왜안되는지 몰라서 찾아다녔다 

                    // 제이쿼리 배우는것도싫고 쓰기도 싫다 ㄹㅇ.. 하 이딴거 누가만들었어
                    
                    //href List
                    const list = new Array();
                    
                    //titleList
                    const titleList = new Array();
                    
                    //안되면 여기 text 를 순수 텍스트만 가저오자

                    $titles.each(function(){
                        titleList.push(filenamify(title+' '+$(this).contents().get(0).nodeValue.trim().split(title)[1].trim()))
                    })

                    titleList.reverse()//배열 역순으로 정렬시킴 그래야 ep속에있는 제목이랑 순서가 같음

                    //
                    $div.each(function(){
                        list.push({id:$(this).attr('href').split('id=')[1]//href
                                     });
                                     
                                    
                    });
                    
                    if(list.length ===  ep.length){
                        return //만약 없다면 종료
                    }

                    //titleList 에있는 텍스트들이 포함되어있다면 다운로드하지않고 포함되있다면 디렉토리 경로를 받아서 다운로드 받음
                    for(let i = 0; i < list.length; i++){
                        

                        if(!(titleList[i]===ep[i])){// 검사
                            //다운로드
                          const  url = `https://manamoa48.net/bbs/board.php?bo_table=manga&wr_id=${list[i].id}`
                          
                          options.uri = url

                          request(options,(err,response,body)=>{
                            
                                //이미지가 실제 dom에 업데이트 되지않고 var img_list 라는 변수에 담겨있었다 그리고 찾는데 시간이 걸렸다 
                                //body 에서 바로 문자열 제거하여 img src를 얻는데 성공하였다
                               //여기서 많이 삽질했다 split함수 다음 undefind반환하면 그다음 split이 먹히지 않는데 첫 링크가 undefind반환하여
                               //split두번째에서 막혔다
                            if(body.split('var img_list = ')[1]){

                                const savedirList = `${path}/${titleList[i]}`

                                if(!fs.existsSync(savedirList)){
                                    fs.mkdirSync(savedirList)
                                }

                                const a = body.split('var img_list = ')[1].split(';')[0]; // var img_list 추출
                                const b = a.split(',') // , 기준으로 나눔

                                const src = new Array();

                                for(let c = 0; c < b.length; c++){
                                    let ccc = b[c].split('"')[1]+'?quick'.replace('cdnmadmax','cdnalmost')
                                    ccc = ccc.replace(/\\/g, "")
                                    down(savedirList,ccc,titleList[i],c,url,5)
                                }
            
                            }
                          })

                        } //titleList[i] , ep[i]
                    }

                    //여기까지 새로운 작업
                })
              })
        
    }
    
}