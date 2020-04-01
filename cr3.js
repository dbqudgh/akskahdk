const puppeteer = require( "puppeteer" );
const cheerio = require( "cheerio" );



puppeteer.launch( { headless : true } ).then(async browser => {



	const page = await browser.newPage();

	await page.goto( "https://www.youtube.com/user/RaOmMusiq/videos/", { waitUntil : "networkidle2" } );

	

        // YouTube 페이지의 <ytd-grid-renderer> 태그 안의 내용을 가져온다.

	const html = await page.$eval( "ytd-grid-renderer", e => e.outerHTML );



        // console.log(html);



	const data = cheerio.load( html );

		

	data( "a.ytd-grid-video-renderer" ).each( function( key, val ) {



               // substring을 사용하여 불필요한 값을 잘라낸다. 

		var videoId = data( val ).attr( "href" ).substring( 9, 20 );

		var videoTitle = data( val ).text();

		

		console.log( "VIDEO ID = ", videoId );

		console.log( "VIDEO TITLE = ", videoTitle );

	});	

});