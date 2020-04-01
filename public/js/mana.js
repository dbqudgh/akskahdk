// @include      *://manamoa*.net/
// @include      *://manamoa*.net/bbs/board.php?bo_table=manga&wr_id=*
// @run-at       document-start
// @grant        none
document.location.href = "https://manamoa32.net/"

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function isViewerOpened() {
  return $('div.manga-viewer-modal').style.display === 'flex';
}

function toggleViewer() {
  if (isViewerOpened()) {
    window.on_close_viewer();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  } else {
    window.on_open_viewer();
    window.on_fullscreen();
  }
}

function scrollClick(btn) {
  btn.scrollIntoViewIfNeeded();
  btn.click();
}

const domContentLoaded =
  document.readyState === 'loading'
    ? new Promise(r => document.addEventListener('readystatechange', r, { once: true }))
    : true;

function getAlternativeUrl(url) {
  if (url.length > 0 && url.includes('img.')) {
    return url.replace('img', 's3');
  }
  return url;
}

async function timeout(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const loadVv = (async () => {
  await domContentLoaded;
  const vv = window.vv;
  if (!vv) {
    throw new Error("vv won't be loaded");
  }
  while (!vv.load_callback) {
    await timeout(10);
  }
  return vv;
})();

async function preventCanvasFailureRetry() {
  const vv = await loadVv;
  const next = vv.load_callback.bind(vv);
  const altImgs = window.img_list.map(getAlternativeUrl);
  vv.load_callback = l => {
    let idx = window.img_list.indexOf(l);
    if (idx === -1) {
      idx = altImgs.indexOf(l);
    }
    if (idx !== -1) {
      window.img_list1[idx] = l;
    }
    next(l);
  };
}

async function preventImgFailureRetry() {
  await loadVv;
  useCanvasSuccessImage();
  preventInvalidImageInfiniteRetry();

  function useCanvasSuccessImage() {
    const imgs = $$('div.view-content > img');
    for (const [idx, img] of imgs.entries()) {
      const setLoadedUrl = () => {
        window.img_list1[idx] = img.src;
      };
      if (img.src) {
        setLoadedUrl();
      }
      img.addEventListener('load', setLoadedUrl);
    }
  }

  function preventInvalidImageInfiniteRetry() {
    const onViewerLeft = window.on_viewer_left;
    window.on_viewer_left = () => {
      onViewerLeft();
      overrideOnError();
    };
    const onViewerRight = window.on_viewer_right;
    window.on_viewer_right = () => {
      onViewerRight();
      overrideOnError();
    };
  }

  function overrideOnError() {
    if (!window.wait_paging) {
      return;
    }
    const original = window.wait_paging.onerror.bind(window.wait_paging);
    window.wait_paging.onerror = function() {
      original();
      window.wait_paging.onerror = undefined;
      window.wait_paging = null;
    };
  }
}

async function preventFailureRetry() {
  return Promise.all([preventCanvasFailureRetry(), preventImgFailureRetry()]);
}

function getGoodButton() {
  return $('a[onclick^=apms_good]');
}

async function keydownHandler(e) {
  if (e.target.tagName === 'INPUT') {
    return;
  }
  switch (e.key) {
    case 'i':
      if (await domContentLoaded) {
        toggleViewer();
      }
      break;
    case 'h':
      $('.chapter_prev').click();
      break;
    case 'j':
      window.on_viewer_right();
      break;
    case 'k':
      window.on_viewer_left();
      break;
    case 'l':
      $('.chapter_next').click();
      break;
    case 'm':
      getGoodButton().scrollIntoViewIfNeeded();
      break;
    case ';':
      scrollClick($('a[onclick^=win_scrap]'));
      break;
    case 'o':
      scrollClick(getGoodButton());
      break;
    case 'u':
      scrollClick($('a[href^="javascript:on_toggle_favorit"'));
      break;
  }
}

async function getNextChapterUrl() {
  await domContentLoaded;
  const wrId = new URLSearchParams(location.search).get('wr_id');
  if (!wrId) {
    return null;
  }
  const chapters = window.only_chapter || [];
  const chapterIdx = chapters.findIndex(x => x[1] === wrId);
  const isLastChapter = chapterIdx === 0;
  if (chapterIdx == -1 || isLastChapter) {
    return null;
  }
  const nextWrId = chapters[chapterIdx - 1][1];
  return `/bbs/board.php?bo_table=manga&wr_id=${nextWrId}`;
}

/**
 * js context handling by dom replacement is too tricky so just prefetch next page
 */
function prefetchUrl(url) {
  const preloader = document.createElement('link');
  preloader.rel = 'prefetch';
  preloader.href = url;
  document.head.append(preloader);
}

async function preloadUrl(url) {
  const iframe = getPreloadIframeForChrome();
  document.body.append(iframe);
  while (iframe.contentDocument.head.childElementCount === 0) {
    await timeout(100);
  }
  prefetchUrl(url);

  // chrome doesn't allow link=preload so create iframe
  function getPreloadIframeForChrome() {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    iframe.id = 'preloaded-chapter';
    return iframe;
  }
}

function intercept(globalPropName, listener) {
  let internal = window[globalPropName];
  Object.defineProperty(window, globalPropName, {
    configurable: true,
    get: () => internal,
    set(value) {
      internal = value;
      listener && listener(value);
    },
  });
  return () => {
    Object.defineProperty(window, globalPropName, {
      configurable: true,
      writable: true,
      value: internal,
    });
  };
}

const isOverHalfRead = new Promise(async resolve => {
  intercept('cur_page', () => {});
  await domContentLoaded;

  const isNotViewerLoaded = window.cur_page === undefined;
  if (isNotViewerLoaded) {
    return;
  }

  const unlistenPage = intercept('cur_page', pageListener);
  window.addEventListener('scroll', scrollListener);
  return;

  function isScrollOverHalf() {
    const half = getGoodButton().offsetTop / 2;
    return window.scrollY > half;
  }

  function scrollListener() {
    if (isScrollOverHalf()) {
      resolveAndDestroy();
    }
  }

  function isPageOverHalf() {
    const totalPageCount = window.img_list1.length || window.img_list.length;
    return window.cur_page > (totalPageCount - 1) / 2;
  }

  function pageListener() {
    if (isPageOverHalf()) {
      resolveAndDestroy();
    }
  }

  function resolveAndDestroy() {
    window.removeEventListener('scroll', scrollListener);
    unlistenPage();
    resolve();
  }
});

async function enablePreload() {
  const isTopFrame = window.self === window.top;
  if (isTopFrame) {
    await preloadNextChapter();
  } else {
    await preventAlarm();
  }

  async function preloadNextChapter() {
    const url = await getNextChapterUrl();
    if (!url) {
      return;
    }
    prefetchUrl(url);
    await isOverHalfRead;
    await preloadUrl(url);
  }

  async function preventAlarm() {
    await domContentLoaded;
    const lastTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i <= lastTimeoutId; i++) {
      clearTimeout(i);
    }
  }
}

async function enablePageFacing() {
  await domContentLoaded;
  $('.fa-square').click();
}

function hookViewPage() {
  preventFailureRetry();
  enablePreload();
  enablePageFacing();
  window.addEventListener('keydown', keydownHandler);
}

function expandRankedTitleEllipsis() {
  const style = document.createElement('style');
  style.innerHTML = `
.rank-manga-widget ul .subject {
  text-overflow: initial;
  white-space: normal;
}
.rank-manga-widget ul a div {
  vertical-align: top;
}`;
  document.head.append(style);
}

function initialize() {
  if (location.pathname === '/') {
    expandRankedTitleEllipsis();
  } else {
    hookViewPage();
  }
}

initialize();