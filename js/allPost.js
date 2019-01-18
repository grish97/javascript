$(document).ready(function () {
    let allPost =  {
        users    : JSON.parse(localStorage.getItem('users')),
        posts    : JSON.parse(localStorage.getItem('posts')),
        comments : JSON.parse(localStorage.getItem('comments')),
        userId   : (document.cookie.split(';')[0]).split('=')[1],

        view : function() {
            let id = document.cookie.split('=')[1];
            let posts = JSON.parse(localStorage.getItem('posts'));
            let user = JSON.parse(localStorage.getItem('users'));
            if(!posts || posts.lenght === 0)  $('.card-group').append('<p class="card-text text-danger">No Post</p>');

            $.each(posts, (key,post) => {
                let divCard = '<div class="item mr-lg-4 mb-lg-4" data-id="'+ post.id +'">' +
                    '   <div class="card">' +
                    '       <div class="card-body"> ' +
                    '           <h5 class="card-title mt-4 show">' + post.title + '</h5>' +
                    '           <p class="card-text">'+ post.desk +'</p>' +
                    '           <p class="card-text"><span class="small text-muted">Author: '+ (user[post.owner_id]['name'].slice(0,1)) + ". " + (user[post.owner_id]['last_name']) +'</p>' +
                    '           <a class="btn edit mr-3"><i class="far fa-edit"></i></a> <a class="btn delete" role="button"><i class="fas fa-trash-alt"></i></a>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>';
                $('.card-group').append(divCard);

                $.ajax({
                    url     : `../imageWorker.php`,
                    methode : 'post',
                    data    : {id : post.id},
                    success : (data) => {
                        data = JSON.parse(data);
                        let imgElem = `<img src="${data.images ? data.images[0] : 'images/300x200.png'}" alt="Photo" width="300" height="200">`;
                        $(`.item[data-id='${post.id}']`).find(`.card-body`).prepend(imgElem);
                    },
                    error   : (err) => {
                        console.log(err);
                    }
                });
                if(post.owner_id !== allPost.userId) {
                    let card = $('.item[data-id='+ post.id +']');
                    card.find('.edit').remove();
                    card.find('.delete').remove();
                }
                return true;
            });
        }
    };

    allPost.view();
    // EDIT POST
    $(document).on('click','.edit', function(e) {
        let postId = $(e.target).closest('.item').attr('data-id');
        document.cookie = "postId=" + postId;
        window.location.href = 'edit.html';
    });
    // SHOW POST
    $(document).on('click','.show',function(event) {
        let postId = +$(event.target).closest('.item').attr('data-id');
        document.cookie = `postId=${postId}`;
        window.location.href = 'show.html'
    });
    // DELETE POST
    $(document).on('click','.delete', function(e){
        let postId = $(e.target).closest('.item').attr('data-id');
        let card = $(e.target).closest('.item');
        $.each(allPost.posts, (key,post) => {
            if(post.id === postId){
                allPost.posts.splice(key,1);
                localStorage.setItem('posts',JSON.stringify(allPost.posts));
                card.remove();
            }
            $.each(allPost.comments,(index, comment) => {
                if (comment.postId === post.id) {
                    allPost.comments.splice(index,1);
                    localStorage.setItem('comments', JSON.stringify(allPost.comments));
                }
            });
        });
    });
});
