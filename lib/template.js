module.exports ={
    HTML:function(title,body){
        return`<!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta http-equiv='X-UA-Compatible' content='IE=edge'>
            <title>${title}</title>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <link rel='stylesheet' type='text/css' media='screen' href='../css/main.css'>
        </head>
        <body>

            <div class="list">
                ${body}
            </div>
        </body>
        </html>`
    },
    HTML2:function(title,body){
        return`<!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta http-equiv='X-UA-Compatible' content='IE=edge'>
            <title>${title}</title>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <link rel='stylesheet' type='text/css' media='screen' href='../css/main.css'>
        </head>
        <body>
        <a href="http://localhost:3000/mana">>마나리스트 돌아가기<</a>
        </br>
        </br>
            <div class="list">
                ${body}
            </div>
        </br>
        <a href="http://localhost:3000/mana">>마나리스트 돌아가기<</a>
        </body>
        </html>`
    },
    HTML3:(title,body,P,L,N)=>{
        return`<!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta http-equiv='X-UA-Compatible' content='IE=edge'>
            <title>${title}</title>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <link rel='stylesheet' type='text/css' media='screen' href='../css/main.css'>
        </head>
        <body>
        <div class="Enext1">
            <button class="previous" value="${P}">이전화</button><button class="list"value="${L}">총목록</button><button class="next" value ="${N}">다음화</button>
        </div>

            <div class="list">
                <center>
                ${body}
                </br>
                </center>
            </div>

        <div class="Enext2">
            <button class="previous" value="${P}">이전화</button><button class="list"value="${L}">총목록</button><button class="next" value ="${N}">다음화</button>
        </div>
        <script src="../js/main.js"></script>
        <script src="../js/Enext.js"></script>
        </body>
        </html>`
    }
}