import {OptimizedResize} from './optimized-resize';

function iframeResize(){
    let allVideos;
    let fluidEl;

    document.addEventListener('DOMContentLoaded', (event) => {  
        fluidEl = document.querySelector('.main-block__center');
        allVideos = document.querySelectorAll('iframe');
        if(allVideos.length > 0){
          allVideos.forEach(function(video) 
          {
            const bounding = video.getBoundingClientRect;
            video.dataset.aspectRatio = video.getAttribute('height') / video.getAttribute('width');
            video.removeAttribute('height');
            video.removeAttribute('width');
          });
          OptimizedResize.add(onResize);
          onResize();
        }
      });
    
      
    function onResize(){
        let newWidth = fluidEl.getBoundingClientRect().width;
        allVideos.forEach(function(video)
        {
          video.style.width = newWidth+"px";
          const newHeight = newWidth * video.dataset.aspectRatio;
          video.style.height = newHeight+"px";
        });
      }    
}
iframeResize();
