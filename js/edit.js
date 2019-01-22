$(document).ready(function() {
    let edit = {
        users    : JSON.parse(localStorage.getItem('users')),
        posts    : JSON.parse(localStorage.getItem('posts')),
        userId   : (document.cookie.split(';')[0]).split('=')[1],
        postId   : (document.cookie.split(';')[1]).split('=')[1],
        imgArray : [],
        imgId    : '',

        readFile : (fileList) => {
                $.each(fileList, (key,value) => {
                    let reader = new FileReader();
                    reader.onload = () => {
                        edit.imgArray.push(reader.result);
                        edit.showImg(reader.result,(edit.imgArray.length - 1));
                    };
                    reader.readAsDataURL(value);
                });
        },

        getImageData : () => {
            $.ajax({
                url    : '../imageWorker.php',
                method  : 'get',
                async : false,
                data : {id : edit.imgId},
                success : (data) => {
                    data = JSON.parse(data);
                    for (let i = 0; i < (data.images.length); i++) {
                        (edit.imgArray).push(data.images[i]);
                    }
                },
                error : (err) => {
                    console.log(err)
                }
            });
        },

        getPost : function () {
            $.each(edit.posts, (key,value) => {
                if(value.owner_id === edit.userId && value.id === edit.postId) {
                    edit.imgId = value.imgId;
                    edit.inputVal(value);
                }
            });

        },

        inputVal  :  (data) => {
            edit.getImageData();
            let fields    = $('input');
            fields.eq(0).attr('value',data.category);
            fields.eq(1).attr('value',data.title);
            $('textarea').text(data.desk);
            for (let i = 0; i < (edit.imgArray.length);i++) {
                edit.showImg(edit.imgArray[i],i);
            }
        },

        showImg : (src, id) => {
            let imgBlock = `<div class="_image d-inline-block" data-id='${id}'>
                                <img src='${src}' class="mt-3 mr-2" alt="Photo" width="100px" height="100px">
                                <i class="far fa-trash-alt deleteImg"></i>
                            </div>`;
            $(`#thumb`).after(imgBlock);
        },

        update :  () => {
            let date = new Date();
            let time = ((date.getHours() < 10 ? '0' : '') + date.getHours()) + ':' +
                (((date.getMinutes) < 10 ? '0' : '') + date.getMinutes()) + ':' +
                ((date.getSeconds() < 10 ? '0' : '') + date.getSeconds());
            let fields    = $('input');
            let category  = fields.eq(0).val();
            let title     = fields.eq(1).val();
            let desc      = $('textarea').val();

            $.ajax({
                url : `../imageWorker.php`,
                method :   `post`,
                async : false,
                data : {
                    id       : edit.imgId,
                    images   : edit.imgArray.filter((el)=> el) ? edit.imgArray.filter((el)=> el) : 'images/300x200.png',
                    postId   : edit.postId,
                    owner_id : edit.userId,
                    edit     : `edit`,
                },
                success  : (data) => {
                    // console.log(data);
                },
                error   : (err) => {
                    console.log(err)
                }
            });

            $.each(edit.posts,(key,value) => {
                if(value.postId === edit.postId) {
                    edit.posts.splice(key,1,{
                        postId     : edit.postId,
                        category   : category,
                        title      : title,
                        desk       : desc,
                        imgId      : edit.imgId,
                        owner_id   : edit.userId,
                        updated_at : time
                    });
                    localStorage.setItem('posts', JSON.stringify(edit.posts));
                    return true;
                }
            });

            edit.deleteCookie();
            window.location.href = `myPost.html`;
        },

        deleteCookie   :  () => {
            document.cookie = "postId='"+ edit.postId  +"'; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        },

    };

    edit.getPost();
    $(document).on( 'click','.access',() =>  {
        console.log(edit.imgArray);
        edit.update();
    });

    let fileInput = document.getElementById('thumb');
    fileInput.addEventListener('change', function () {
        edit.readFile(event.target.files);
    });

    $(document).on('click','.deleteImg', (event) => {
       let imgBlock = $(event.target).closest(`._image`);
       let imgBlockId = $(event.target).closest(`._image`).attr(`data-id`);
       delete edit.imgArray[imgBlockId];
       imgBlock.remove();
    });

    window.addEventListener('beforeunload', function () {
        document.cookie = `postId=${edit.postId};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });

});
