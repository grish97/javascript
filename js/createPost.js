let createPost  = {
    users  : JSON.parse(localStorage.getItem(`users`)),
    posts  : JSON.parse(localStorage.getItem(`posts`)),
    userId  : (document.cookie.split(';')[0]).split('=')[1],

    inputVal : function (imgName) {
        let fields    = $('input');
        let category  = fields.eq(0).val();
        let title     = fields.eq(1).val();
        let desc      = $('textarea').val();
        imgName       = imgName.split('.')[0];
        createPost.pushData(category,title,desc,imgName);
    },

    pushData : function (category,title,desc,imgName) {
        if(!this.posts) this.posts = [];

        this.posts.push({
         postId   : String(createPost.posts.length),
         category : category,
         title    : title,
         desk     : desc,
         imgName  : imgName,
         owner_id : createPost.userId,
        });

        localStorage.setItem('posts', JSON.stringify(this.posts));
        // window.location.href = document.referrer;
    },

    showImage : (img,input) => {
        let imgElem = `<div class="_image d-inline-block">
                            <img src="${img}" class="mt-3 mr-2" alt="Photo" width="100px" height="100px"> 
                            <i class="far fa-trash-alt deleteImg"></i>  
                        </div>`;
        $(input).after(imgElem);
    },

    saveImages : (data,name) => {
        $.ajax({
            url: '../imageWorker.php',
            method: 'post',
            data: {
                name   : name,
                imgSrc : data
            },
            success: function(data){
                data  = JSON.parse(data);
                createPost.inputVal(data.name)

            },
            error: function(err){
                console.error(err)
            }
    });
    }

};

$('.access').click(function() {
    createPost.inputVal();
});

$(document).on('click', '.deleteImg', (event) => {
    let modalWin = $(`#access`);
    let input = $(event.target);
    let imgBlock = $(`._image`);
    modalWin.modal('show');
    $(`.conf_no`).click(() => {
        modalWin.modal(`hide`);
    });

    $(`.conf_yes`).click(() => {
        modalWin.modal(`hide`);
        imgBlock.remove();
        if(!imgBlock[0]) {
            $(`input[type='file']`).val('');
        }
    });
});

$(`#thumb`).on(`change`, (event) => {
    let input = event.target;
    let fileName = input.files[0].name;
    let reader = new FileReader();
    reader.onload = () => {
        createPost.showImage(reader.result,input);
        createPost.saveImages(reader.result,fileName);
    };

    reader.readAsDataURL(input.files[0]);
});
