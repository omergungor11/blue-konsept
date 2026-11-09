(() => {


// Initialize the counter and loader duration variables
// let counter = {
//   value: 0
// };
// let loaderDuration = 9;

// Check if this is not the first time the user has visited this page
// if (sessionStorage.getItem("visited") !== null) {
  // If so, set the loader duration to 2 seconds and the counter value to 75
//   loaderDuration = 9;
//   counter = {
//     value: 75
//   };
// }

// Set the visited item in the session storage to "true"
// sessionStorage.setItem("visited", "true");

// Define a function to update the loader text
// function updateLoaderText() {
//   let progress = Math.round(counter.value);
//   $(".loader5_number")?.text(progress);
// }

// Define a function to end the loader animation
// function endLoaderAnimation() {
//   $(".loader5_ix-trigger").click();
// }

// Create a timeline animation using the GreenSock Animation Platform (GSAP)
// let tl = gsap.timeline({
//   onComplete: endLoaderAnimation
// });

// Animate the counter value from 0 to 100 with the defined custom ease animation
// tl.to(counter, {
//   value: 100,
//   onUpdate: updateLoaderText,
//   duration: loaderDuration,
//   ease: "easeInOut"
// });

// Animate the width of the loader progress bar to 100% with the defined custom ease animation
// tl.to(".loader5_progress-bar", {
//     width: "100%",
//     duration: loaderDuration,
//     ease: "easeInOut"
// }, 0);


})();
(() => {

window.Webflow = window.Webflow || [];

window.Webflow.push(function () {
  const component = document.querySelector('[fc-image-scrubbing="component"]');
  if (!component) return;
 

  const urlsAttr = component.getAttribute('fc-image-scrubbing-urls');
  if (!urlsAttr) return;

	const imageURLs = urlsAttr
  .split(';')
  .map(s => s.trim())
  .filter(Boolean)
  .sort((a, b) => {
    const getNum = url => {
      const match = url.match(/_(\d+)\.\w+$/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return getNum(a) - getNum(b);
  })
  .filter((_, i) => i % 5 === 0);

  if (!imageURLs.length) return;
  if (!window.gsap) return;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  

  imageSequence({
    imageURLs,
    canvas: '[fc-image-scrubbing="component"] canvas',
    fps: 24,
    scrollTrigger: window.ScrollTrigger
      ? {
          trigger: component,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      : undefined
  });

  function imageSequence(config) {
    const playhead = { frame: 0 };
    const canvas = gsap.utils.toArray(config.canvas)[0];
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let curFrame = -1;
    let images = [];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const updateImage = () => {
      const frame = Math.round(playhead.frame);
      const img = images[frame];
      if (!img) return;

      if (frame !== curFrame || !canvas._hasHighResSetup) {
        if (!canvas._hasHighResSetup) {
          resizeCanvas();
          canvas._hasHighResSetup = true;
        }

        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        if (!cw || !ch) return;

        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (!iw || !ih) return;

        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;

        const ox = (cw - dw) / 2;
        const oy = (ch - dh) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, ox, oy, dw, dh);

        curFrame = frame;
      }
    };

    images = config.imageURLs.map((url, i) => {
      const img = new Image();
      img.onload = () => {
        if (i === 0) updateImage();
      };
      img.src = url;
      return img;
    });

    new ResizeObserver(() => {
      canvas._hasHighResSetup = false;
      updateImage();
    }).observe(canvas);

    return gsap.to(playhead, {
      frame: images.length - 1,
      ease: 'none',
      onUpdate: updateImage,
      duration: images.length / config.fps,
      scrollTrigger: config.scrollTrigger
    });
  }
});

})();
(() => {


//On click
$('.layout423_card').on('click', function() {
  $('.active').removeClass('active');	
  $(this).addClass('active');
  $(this).find('.layout423_card-content-top').addClass('active')
  $(this).find('.layout423_card-title-preview').addClass('active')
  $(this).find('.layout423_card-content-bottom').addClass('active')
  $(this).find('.layout423_overlay').addClass('active');
});


document.querySelectorAll('.logobox').forEach(box => {
  const maskEl = box.querySelector('.mask');
  if (!maskEl) return;

  const grid = 5;
  const scale = 50;
  const totalTiles = grid * grid;
  const speed = 10;

  function findSolidBgColor(el) {
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const bg = getComputedStyle(cur).backgroundColor;
      if (bg && bg !== 'transparent' && !bg.includes('rgba(0, 0, 0, 0)')) {
        const m = bg.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const parts = m[1].split(',').map(s => s.trim());
          if (parts.length === 4 && Number(parts[3]) === 0) {
            cur = cur.parentElement;
            continue;
          }
        }
        return bg;
      }
      cur = cur.parentElement;
    }
    // fallback
    return '#fff';
  }

  const coverColor = findSolidBgColor(box);

  const canvas = document.createElement('canvas');
  canvas.width = grid * scale;
  canvas.height = grid * scale;

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '10';

  if (getComputedStyle(maskEl).position === 'static') {
    maskEl.style.position = 'relative';
  }
  maskEl.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = coverColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function getRandomOrder() {
    return [...Array(totalTiles).keys()].sort(() => Math.random() - 0.5);
  }

  let animationToken = 0;

  function animate(show) {
    animationToken++;
    const myToken = animationToken;

    const order = getRandomOrder();
    let step = 0;

    function frame() {
      if (myToken !== animationToken) return;

      if (step < totalTiles) {
        const index = order[step];
        const x = (index % grid) * scale;
        const y = Math.floor(index / grid) * scale;

        if (show) {
          ctx.clearRect(x, y, scale, scale);
        } else {
          ctx.fillStyle = coverColor;
          ctx.fillRect(x, y, scale, scale);
        }

        step++;
        setTimeout(() => requestAnimationFrame(frame), speed);
      }
    }

    requestAnimationFrame(frame);
  }

  box.addEventListener('mouseenter', () => animate(true));
  box.addEventListener('mouseleave', () => animate(false));
});






})();
