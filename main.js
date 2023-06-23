const inputAvatar = document.querySelector('#avatar-input');
const canvasAvatar = document.querySelector('#avatar-canvas');
const context = canvasAvatar.getContext('2d');
const resizable = document.querySelector('#resizable');

const resizableParams = {
    file : '',
    resizableTop    : 100,
    resizableLeft   : 100,
    resizableWidth  : 100,
    resizableHeight : 100,
}

const previewCanvas = document.querySelector('#preview-avatar-canvas');

inputAvatar.addEventListener('change', (event) => {
    const file = event.target.files[0];
    console.log(file)
    resizableParams.file = file;
    console.log(resizableParams.file)
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            canvasAvatar.width = img.width;
            canvasAvatar.height = img.height;
            context.drawImage(img, 0, 0);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
    cropImage(resizableParams.file, resizableParams.resizableLeft, resizableParams.resizableTop, resizableParams.resizableWidth, resizableParams.resizableHeight);
});

//Resizable div

makeResizableDiv('#resizable');

function makeResizableDiv(div) {
    const element = document.querySelector(div);

    const resizers = document.querySelectorAll(div + ' .resizer');

    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', function(e) {
            e.preventDefault()
            window.addEventListener('mousemove', resize)
            window.addEventListener('mouseup', stopResize)
        })
        
        function resize(e) {
            if (currentResizer.classList.contains('bottom-right')) {
                let canvasWidth = parseInt(window.getComputedStyle(canvasAvatar).getPropertyValue('width'));
                let width = parseInt(e.pageX - element.getBoundingClientRect().left + 'px');

                //equation
                let result = width * canvasWidth;
                let finalResult = parseInt(result / canvasAvatar.width);

                resizableParams.resizableWidth = finalResult;
                resizableParams.resizableHeight = finalResult;

                element.style.width = finalResult + 'px';
                element.style.height = finalResult + 'px';

                console.log(`makeResizableDiv File: ${resizableParams.file}`);
                console.log(`makeResizableDiv resizableTop: ${resizableParams.resizableTop}`);
                console.log(`makeResizableDiv resizableLeft: ${resizableParams.resizableLeft}`);
                console.log(`makeResizableDiv resizableWidth: ${resizableParams.resizableWidth}`);
                console.log(`makeResizableDiv resizableHeight: ${resizableParams.resizableHeight}`);
                cropImage(resizableParams.file, resizableParams.resizableLeft, resizableParams.resizableTop, resizableParams.resizableWidth, resizableParams.resizableHeight);
            }
        }
        
        function stopResize() {
            window.removeEventListener('mousemove', resize)
        }
    }
}


//Draggable div

dragSquare(resizable);

function dragSquare(square) {
    let position1 = 0, position2 = 0, position3 = 0, position4 = 0;

    if (document.getElementById(square.id + 'Circle')){
        document.getElementById(square.id + 'Circle').onmousedown = dragMouseDown;
    }else{
        square.onmousedown = dragMouseDown;
    }


    function dragMouseDown(e){
        e = e || window.event;
        e.preventDefault();

        position3 = e.clientX;
        position4 = e.clientY;

        console.log(`position 3 - fora: ${position3}`)
        console.log(`position 4 - fora: ${position4}`)

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        console.log(`position 3 - dentro: ${position3}`)
        console.log(`position 4 - dentro: ${position4}`)
        console.log(`clientX - dentro: ${e.clientX}`)
        console.log(`clientY - dentro: ${e.clientY}`)

        position1 = position3 - e.clientX;
        position2 = position4 - e.clientY;
        position3 = e.clientX;
        position4 = e.clientY;

        square.style.top = (square.offsetTop - position2) + 'px';
        square.style.left = (square.offsetLeft - position1) + 'px';

        resizableParams.resizableTop    = parseInt(resizable.style.top);
        resizableParams.resizableLeft   = parseInt(resizable.style.left);

        // console.log(`position 3 - dentro: ${position3}`)
        // console.log(`position 4 - dentro: ${position4}`)

        // console.log(`makeResizableDiv File: ${resizableParams.file}`);
        // console.log(`dragSquare resizableTop: ${resizableParams.resizableTop}`);
        // console.log(`dragSquare resizableLeft: ${resizableParams.resizableLeft}`);
        // console.log(`dragSquare resizableWidth: ${resizableParams.resizableWidth}`);
        // console.log(`dragSquare resizableHeight: ${resizableParams.resizableHeight}`);
        cropImage(resizableParams.file, resizableParams.resizableLeft, resizableParams.resizableTop, resizableParams.resizableWidth, resizableParams.resizableHeight);
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const previewAvatarCanvas = document.querySelector('#preview-avatar-canvas');


function cropImage(imagePath, newX, newY, newWidth, newHeight) {
    const canvas = document.getElementById('preview-avatar-canvas'); 
    const ctx = canvas.getContext('2d');
        
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(imagePath);
}


// Download

const downloadButton = document.querySelector("#download");

downloadButton.addEventListener('click', function() {
    let tempLink = document.createElement('a');

    let fileName = 'Avatar-Cropped.jpg';

    tempLink.download = fileName;
    tempLink.href = document.querySelector('#preview-avatar-canvas').toDataURL('image/jpeg', 0.9);

    tempLink.click();
})

// usefull links
// https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
// https://www.jqueryscript.net/blog/best-image-croppers.html
// https://cloudinary.com/guides/automatic-image-cropping/cropping-images-in-javascript
// https://github.com/fengyuanchen/cropperjs
// https://code.tutsplus.com/tutorials/how-to-crop-or-resize-an-image-with-javascript--cms-40446
// https://www.codehim.com/vanilla-javascript/javascript-crop-image-and-save/
// https://jamesooi.design/Croppr.js/
// https://www.abstractapi.com/guides/crop-image-javascript
// https://avatarcropper.com/