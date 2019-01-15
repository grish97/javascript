let createPost  = {
    inputVal : function () {
        let fields    = $('input');
        let category  = fields.eq(0).val();
        let title     = fields.eq(1).val();
        let desc      = $('textarea').val();
        let imgElem   = fields.eq(2);
        let imgPath;
        if(imgElem.val()) {
            let reader = new FileReader();
            reader.readAsDataURL(imgElem[0].files[0]);
            reader.onload = function() {
                imgPath = reader.result;
                createPost.pushData(category,title,desc,imgPath);
            };
        }else {
            imgPath = 'images/300x200.png';
            createPost.pushData(category,title,desc,imgPath,imgElem);
        }
    },

    pushData : function (category,title,desc,imgPath,imgElem) {
        let patt = /[0-9]+/g;
        let id = document.cookie;
        let userId = id.match(patt)[0];
        let userName = JSON.parse(localStorage.getItem('users'))[userId]['name'];
        let posts = JSON.parse(localStorage.getItem(`posts`));

        //TEST
        // let images = JSON.parse(localStorage.getItem('images'));
        // if(!images) {
        //     images = [];
        // }
        //
        // let reader = new FileReader();
        // reader.onload = function () {
        //     console.log(reader.result)
        //     images.push({
        //         id  : String(images.length),
        //         imagePath : reader.result,
        //     });
        // };
        // console.log(imgElem[0].files);
        // // reader.readAsDataURL(imgElem[0].files[0]);
        // localStorage.setItem('images',JSON.stringify(images));
        //TEST END*/
        if(!posts) {
            posts = [];
        }

        posts.push({
         postId   : String(posts.length),
         category : category,
         title    : title,
         desk     : desc,
         imgPath  : imgPath,
         owner_id : userId,
        });

        localStorage.setItem(('posts'), JSON.stringify(posts));
        window.location.href = 'myPost.html';
    },

    showImage : (img,input) => {
        let imgElem = `<img src="${img}" class="mt-3 mr-2 _image" alt="Photo" width="100px" height="100px">`;
        $(input).after(imgElem);
    },

};

$('.access').click(function() {
    createPost.inputVal();
});

$(`#thumb`).on(`change`, (e) => {
    // let zip = new JSZip();
    // let img = zip.folder(`images`);
    let input = event.target;
    let reader = new FileReader();

    reader.onload = () => {
        // img.file('horst.png',reader.result,{base64:true});
        createPost.showImage(reader.result,input);
    };

    reader.readAsDataURL(input.files[0]);
});

$(document).on('dblclick', (event) => {
    let modalWin = $(`#access`);
    let input = $(event.target);
    modalWin.modal('show');
    $(`.conf_no`).click(() => {
        modalWin.modal(`hide`);
    });

    $(`.conf_yes`).click(() => {
        modalWin.modal(`hide`);
        input.remove();
    });
});