$(document).ready(function() {
    let createPost  = {
        users     : JSON.parse(localStorage.getItem(`users`)),
        posts     : JSON.parse(localStorage.getItem(`posts`)),
        userId    : (document.cookie.split(';')[0]).split('=')[1],
        fileArray : [],
        imagesArray: [],
        filesLoad  : 0,

        readFile : (fileList) => {
            if(fileList.length !== 0) {
                $.each(fileList, (key,value) => {
                    let reader = new FileReader();
                    createPost.fileArray.push(value);
                    createPost.showImage(reader,value,key);
                });
            }
        },

        saveImageData : () => {
            let postId = createPost.posts ? createPost.posts.length : '0';
            let images = createPost.imagesArray ? createPost.imagesArray : null;
            $.ajax({
                url: '../imageWorker.php',
                method: 'post',
                data: {
                    postId        : postId,
                    owner_id      : createPost.userId,
                    images        : images
                },
                success: function(id){
                    console.log(JSON.parse(id)['1']);
                    // createPost.inputVal(id);
                },
                error: function(err){
                    console.error(err)
                }
            });

        },

        inputVal : (imgId) => {
            let fields    = $('input');
            let category  = fields.eq(0).val();
            let title     = fields.eq(1).val();
            let desc      = $('textarea').val();
            createPost.pushData(category,title,desc,imgId);
        },

        pushData : (category,title,desc,imgId) => {
            let date = new Date();
            let time = ((date.getHours() < 10 ? '0' : '') + date.getHours()) + ':' +
                (((date.getMinutes) < 10 ? '0' : '') + date.getMinutes()) + ':' +
                ((date.getSeconds() < 10 ? '0' : '') + date.getSeconds());
            if(!createPost.posts) createPost.posts = [];

            createPost.posts.push({
             id         : String(createPost.posts.length),
             category   : category,
             title      : title,
             desk       : desc,
             imgId      : imgId,
             owner_id   : createPost.userId,
             created_at : time,
            });

            localStorage.setItem('posts', JSON.stringify(createPost.posts));
            // window.location.href = document.referrer;
        },

        showImage : (reader,imgData,id) => {
            let input = $(`#thumb`);
            reader.onload = () => {
                let imgElem = `<div class="_image d-inline-block" data-id='${id}'>
                            <img src="${reader.result}" class="mt-3 mr-2" alt="Photo" width="100px" height="100px"> 
                            <i class="far fa-trash-alt deleteImg"></i>  
                        </div>`;
                $(input).after(imgElem);
                createPost.imagesArray.push(reader.result);
            };
            reader.readAsDataURL(imgData);
        },

    };

    $('.access').on('click', () => {
        createPost.saveImageData();
    });

    let fileInput = document.getElementById('thumb');
    fileInput.addEventListener('change', function () {
        createPost.readFile(event.target.files);
    });

    $(document).on('click', '.deleteImg', (event) => {
        let modalWin = $(`#access`);
        let icon = $(event.target);
        let imgBlock = icon.closest(`._image`);
        let imgBlockId = imgBlock.attr('data-id');
        modalWin.modal('show');
        $(`.conf_no`).click(() => {
            modalWin.modal(`hide`);
        });

        $(`.conf_yes`).click(() => {
            modalWin.modal(`hide`);
            createPost.fileArray.splice(imgBlockId,1);
            imgBlock.remove();
            if(createPost.fileArray.length === 0) {
                $(`input[type='file']`).val('');
            }
        });
    });
});
