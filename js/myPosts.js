$(document).ready(function () {
    let object = {
        users : JSON.parse(localStorage.getItem('users')),
        posts : JSON.parse(localStorage.getItem('posts')),
        comments : JSON.parse(localStorage.getItem('comments')),
        userId  : (document.cookie.split(';')[0]).split('=')[1],

        userPost : function () {
            if(!this.posts || this.posts.length === 0) {
                $('.card-group').append('<p class="card-text text-danger">No Post</p>');
            }

            $.each(this.posts, (key,post) => {
                if(object.userId === post.owner_id) {
                    let divCard = '<div class="item mr-lg-4 mb-lg-4" data-attribute="' + post.id + '">' +
                        '   <div class="card">' +
                        '       <div class="card-body"> ' +
                        '           <h5 class="card-title mt-4 show">' + post.title + '</h5>' +
                        '           <p class="card-text">' + post.desk + '</p>' +
                        '           <p class="card-text"><span class="small text-muted">Author: ' + (object.users[post.owner_id].name.slice(0, 1)) + ". " + (object.users[post.owner_id].last_name) + '</p>' +
                        '           <a class="btn edit mr-3"><i class="far fa-edit"></i></a> <a class="btn delete" role="button"><i class="fas fa-trash-alt"></i></a>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>';
                    $('.card-group').append(divCard);

                        $.ajax({
                            url    : '../imageWorker.php',
                            method : 'get',
                            data: {id : post.id},
                            success : (data) => {
                                data = JSON.parse(data);
                                let imgElem = `<img src="${data.images ? data.images[0] : 'images/300x200.png'}" alt="Photo" width="300" height="200">`;
                                $(`.item[data-attribute='${post.id}']`).find(`.card-body`).prepend(imgElem);
                            },
                            error : (err) => {
                                console.log(err);
                            }
                        });
                }
            });

            $('.edit').on('click',function(event) {
                let postId = +$(event.target).closest('.item').attr('data-attribute');
                document.cookie = `postId=${postId}`;
                window.location.href = 'edit.html';
            });

            $('.delete').on('click',function(event) {
                let postId = $(event.target).closest('.item').attr('data-attribute');
                object.delete(event);
            });

            $('.show').click(function(event) {
                let postId = +$(event.target).closest('.item').attr('data-attribute');
                document.cookie = `postId=${postId}`;
                window.location.href = 'show.html'
            });
        },

         delete : function (event) {
            let target = $(event.target);
            let card = target.closest('.item');
            let cardId = card.attr('data-attribute');

            // DELETE POST
            $.each(object.posts, (key,post) => {
                if(post['id'] === cardId) {
                    object.posts.splice(key,1);
                    // localStorage.setItem('posts', JSON.stringify(object.posts));
                    card.remove();
                }
                // DELETE COMMENT
                // $.each(object.comments,(index, comment) => {
                //     if (comment.postId === post.id) {
                //         object.comments.splice(index,1);
                //         localStorage.setItem('comments', JSON.stringify(object.comments));
                //         console.log(comment);
                //     }
                // });
                // DELETE IMAGE
                $.ajax({
                    url : `../imageWorker.php`,
                    method : `post`,
                    async  : false,
                    data  : {
                        id     : post.id,
                        delete : `delete`,
                    },
                    success : (data) => {
                        console.log(data);
                    },
                    error : (err) => {
                        console.log(err);
                    }
                });
            });


        },
    };

    object.userPost();
});
