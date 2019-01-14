let editPost = {
    users   : JSON.parse(localStorage.getItem('users')),
    posts   : JSON.parse(localStorage.getItem('posts')),
    userId  : (document.cookie.split(';')[0]).split('=')[1],
    postId : (document.cookie.split(';')[1]).split('=')[1],


    getPost : function() {
        $.each(this.posts,function() {
            if(this.owner_id === editPost.userId && this.postId === editPost.postId) {
                editPost.inputVal(this);
            }
        });
    },

    inputVal  : function (data) {
        let fields    = $('input');
        fields.eq(0).attr('value',data.category);
        fields.eq(1).attr('value',data.title);
        $('textarea').text(data.desk);
        $('.access').click(function() {
            editPost.update();
        });
    },

    update : function() {
        let date = new Date();
        let fields    = $('input');
        let category  = fields.eq(0).val();
        let title     = fields.eq(1).val();
        let desc      = $('textarea').val();
        let imgElem   = fields.eq(2);

        //TEST
        /*if(imgElem.val()) {
            let imgStorage = getLocalStorage('imgStorage');
            let reader = new FileReader();
            reader.onload = function() {

            };
            reader.readAsDataURL(imgElem[0].files[0]);
        }*/
        //TEST END

        $(this.posts).each(function(key) {
            if(this.postId === editPost.postId) {
                editPost.posts.splice(key,1,{
                    postId   : editPost.postId,
                    category : category,
                    title    : title,
                    desk     : desc,
                    imgPath  : 'images/300x200.png',
                    owner_id : editPost.userId,
                    updated_at : (date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear())
                });
                localStorage.setItem('posts', JSON.stringify(editPost.posts));
                return true;
            }
        });

        this.deleteCookie();
        window.location.href = `myPost.html`;
    },

    deleteCookie   : function () {
        document.cookie = "postId='"+ editPost.postId  +"'; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },

};

editPost.getPost();

