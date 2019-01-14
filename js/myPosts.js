let object = {

    userId : function () {
        let id   = document.cookie.split('=')[1];
        let user = JSON.parse(localStorage.getItem('users'))[id];
        let post = JSON.parse(localStorage.getItem('posts'));
        if(!post || post.length === 0) {
            $('.card-group').append('<p class="card-text text-danger">No Post</p>');
        }

        this.userPost(id,user,post)
    },

    userPost : function (id,user,data) {
        $(data).each(function(){
            if(id === this.owner_id) {
                let divCard = '<div class="item mr-lg-4 mb-lg-4" data-attribute="' + this.postId + '">' +
                    '   <div class="card">' +
                    '       <img src="' + this.imgPath + '" alt="photo" width="300" height="200">' +
                    '       <div class="card-body"> ' +
                    '           <h5 class="card-title show">' + this.title + '</h5>' +
                    '           <p class="card-text">' + this.desk + '</p>' +
                    '           <p class="card-text"><span class="small text-muted">Author: ' + (user['name'].slice(0, 1)) + ". " + (user['last_name']) + '</p>' +
                    '           <a class="btn edit mr-3"><i class="far fa-edit"></i></a> <a class="btn delete" role="button"><i class="fas fa-trash-alt"></i></a>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>';
                $('.card-group').append(divCard);
            }
        });

        $('.edit').on('click',function(event) {
            let postId = +$(event.target).closest('.item').attr('data-attribute');
            document.cookie = `postId=${postId}`;
            window.location.href = 'edit.html';
        });

        $('.delete').on('click',function(event) {
            let postId = $(event.target).closest('.item').attr('data-attribute');
            object.delete(event,postId);
        });

        $('.show').click(function(event) {
            let postId = +$(event.target).closest('.item').attr('data-attribute');
            document.cookie = `postId=${postId}`;
            window.location.href = 'show.html'
        });
    },

    delete : function (event,id) {
        let target = $(event.target);
        let card = target.closest('.item');
        let posts = JSON.parse(localStorage.getItem('posts'));
        $(posts).each(function(key) {
            if(this.postId === id) {
                posts.splice(key,1);
                localStorage.setItem('posts', JSON.stringify(posts));
                card.remove();
                return true;
            }
        });
    }
};

object.userId();

