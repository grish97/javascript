let editPost = {

    getPost : function() {
        let cookie = document.cookie.split(';');
        let userId = cookie[0].split('=')[1];
        let postId = cookie[1].split('=')[1];
        let posts = JSON.parse(localStorage.getItem('posts'));
        $(posts).each(function() {
            if(this.owner_id === userId && this.postId === postId) {
                editPost.inputVal(this,posts,postId,userId);
            }
        });
    },

    inputVal  : function (data,posts,postId,userId) {
        let fields    = $('input');
        fields.eq(0).attr('value',data.category);
        fields.eq(1).attr('value',data.title);
        $('textarea').text(data.desk);
        $('.access').click(function() {
            editPost.update(posts,postId,userId);
        });
    },

    update : function(posts,postId,userId) {
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

        $(posts).each(function(key) {
            if(this.postId === postId) {
                posts.splice(key,1,{
                    postId   : postId,
                    category : category,
                    title    : title,
                    desk     : desc,
                    imgPath  : 'images/300x200.png',
                    owner_id : userId,
                    updated_at : (date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear())
                });
                localStorage.setItem('posts', JSON.stringify(posts));
                return true;
            }
        });

        this.deleteCookie(postId);
        window.location.href = 'myPost.html';
    },

    deleteCookie   : function (postId) {
        document.cookie = "postId='"+ postId  +"'; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },

};

editPost.getPost();


