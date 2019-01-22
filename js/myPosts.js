$(document).ready(function () {
    let object = {
        users : JSON.parse(localStorage.getItem('users')),
        posts : JSON.parse(localStorage.getItem('posts')),
        comments : JSON.parse(localStorage.getItem('comments')),
        userId  : (document.cookie.split(';')[0]).split('=')[1],
        post    : false,


        userPost : function () {
            $.each(this.posts, (key,post) => {
                if(object.userId === post.owner_id) {
                    object.post = true;
                    let images;
                        $.ajax({
                            url    : '../imageWorker.php',
                            method : 'get',
                            async : false,
                            data: {id : post.imgId},
                            success : (data) => {
                                data = JSON.parse(data) ? JSON.parse(data).images : 'images/300x200.png';
                                images = data;
                            },
                            error : (err) => {
                                console.log(err);
                            }
                        });
                    object.generateCard(post,key,images);
                }
            });

            if(!this.post || !object.post) {
                $('.card-group').append('<p class="card-text text-danger text-center mt -5">No Post</p>');
            }
        },

        generateCard : (post,key,img) => {
            let divCard = '<div class="item mr-lg-4 mb-lg-4" data-attribute="' + post.id + '">' +
                '   <div class="card">' +
                '       <div class="card-body"> ' +
                ` <img src="${img ? img[0] : 'images/300x200.png'}" alt="Photo" width="300" height="200">`+
                '           <h5 class="card-title mt-4 show">' + post.title + '</h5>' +
                '           <p class="card-text">' + post.desk + '</p>' +
                '           <p class="card-text"><span class="small text-muted">Author: ' + (object.users[post.owner_id].name.slice(0, 1)) + ". " + (object.users[post.owner_id].last_name) + '</p>' +
                '           <a class="btn edit mr-3"><i class="far fa-edit"></i></a> <a class="btn delete" role="button"><i class="fas fa-trash-alt"></i></a>' +
                '       </div>' +
                '   </div>' +
                '</div>';
            $('.card-group').append(divCard);
        },

         delete : function (event) {
            let target = $(event.target);
            let card = target.closest('.item');
            let cardId = card.attr('data-attribute');


            $.each(object.posts, (key,post) => {
                if(post['id'] === cardId) {
                    // DELETE POST
                    object.posts.splice(key,1);
                    localStorage.setItem('posts', JSON.stringify(object.posts));
                    card.remove();
                    // DELETE COMMENT
                    $.each(object.comments,(index, comment) => {
                        if (comment.postId === post.id) {
                            object.comments.splice(index,1);
                            localStorage.setItem('comments', JSON.stringify(object.comments));
                            console.log(comment);
                        }
                    });
                    // DELETE IMAGE
                    $.ajax({
                        url: `../imageWorker.php`,
                        method: `post`,
                        async: false,
                        data: {
                            id: (post.imgId),
                            delete: `delete`,
                        },
                        success: (data) => {
                            console.log(data);
                        },
                        error: (err) => {
                            console.log(err);
                        }
                    });
                }
            });
        },
    };

    object.userPost();

    $(document).on('click','.edit',function(event) {
        let postId = +$(event.target).closest('.item').attr('data-attribute');
        document.cookie = `postId=${postId}`;
        window.location.href = 'edit.html';
    });

    $(document).on('click','.delete',function(event) {
        object.delete(event);
    });

    $(document).on('click','.show',function(event) {
        let postId = +$(event.target).closest('.item').attr('data-attribute');
        document.cookie = `postId=${postId}`;
        window.location.href = 'show.html'
    });
});
