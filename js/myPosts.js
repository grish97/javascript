$(document).ready(function () {
    let object = {
        users : JSON.parse(localStorage.getItem('users')),
        posts : JSON.parse(localStorage.getItem('posts')),
        comments : JSON.parse(localStorage.getItem('comments')),
        userId  : (document.cookie.split(';')[0]).split('=')[1],


        getImage : (id) => {
            $.ajax({
                url    : '../images.json',
                method : 'get',
                data: {id: id},
                success : (data) => {
                    // object.userPost(data);
                    console.log(data);
                },
                error : (err) => {
                    console.log(err);
                }
            });
        },

        userPost : function (imgData) {
            if(!this.posts || this.posts.length === 0) {
                $('.card-group').append('<p class="card-text text-danger">No Post</p>');
            }

            $.each(this.posts, (key,value) => {
                if(object.userId === value.owner_id) {
                    let divCard = '<div class="item mr-lg-4 mb-lg-4" data-attribute="' + value.id + '">' +
                        '   <div class="card">' +
                        '       <div class="card-body"> ' +
                        '           <h5 class="card-title show">' + value.title + '</h5>' +
                        '           <p class="card-text">' + value.desk + '</p>' +
                        '           <p class="card-text"><span class="small text-muted">Author: ' + (object.users[value.owner_id].name.slice(0, 1)) + ". " + (object.users[value.owner_id].last_name) + '</p>' +
                        '           <a class="btn edit mr-3"><i class="far fa-edit"></i></a> <a class="btn delete" role="button"><i class="fas fa-trash-alt"></i></a>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>';
                    $('.card-group').append(divCard);

                    // $.each(imgData, (index,obj) => {
                    //     if(value.id === obj.postId) {
                    //         console.log(obj);
                    //     }
                    // });
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
            $(object.posts).each(function(key,post) {
                if(this.postId === id) {
                    object.posts.splice(key,1);
                    localStorage.setItem('posts', JSON.stringify(object.posts));
                    card.remove();
                    return true;
                }
                $.each(object.comments,(index, comment) => {
                    if (comment.postId === post.postId) {
                        object.comments.splice(index,1);
                        localStorage.setItem('comments', JSON.stringify(object.comments));
                    }
                });
            });
            card.remove();

        }
    };

    $.each(object.posts, (key,value) => {
       if(object.userId === value.owner_id) {
           object.getImage(value.imgId);
       }
    });
});
