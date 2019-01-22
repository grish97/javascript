$(document).ready(function () {
    let show = {
        users    : JSON.parse(localStorage.getItem('users')),
        posts    : JSON.parse(localStorage.getItem('posts')),
        comments : JSON.parse(localStorage.getItem('comments')),
        userId   : (document.cookie.split(';')[0]).split('=')[1],
        postId   : (document.cookie.split(';')[1]).split('=')[1],
        image    : null,

        viewPost : () => {
            let imgId = show.posts[show.postId - 1]['imgId'];
            $.ajax({
                url : `imageWorker.php`,
                method : `get`,
                async : false,
                data : {id : imgId},
                success : (data) => {
                    data = JSON.parse(data) ? JSON.parse(data).images : `images/300x200.png`;
                    show.image = data;
                },
                error : (err) => {
                    console.log(err);
                },
            });

            $.each(show.posts, (key,post) => {
                if(show.postId === post.id) {
                    let divCard =
                        `<div class="item text-center" data-attribute="${post.id}"> 
                       <div class="">
                             <div class="card-body">
                                  <h5 class="mt-4 mb-5">${post.title}</h5>
                                 <p class="card-text">${post.desk}</p>
                                 <p class="card-text"><span class="small text-muted"></span></p>
                                 <!--<a class="btn edit mr-3"><i class="far fa-edit"></i></a> <a class="btn delete" role="button"><i class="fas fa-trash-alt"></i></a>-->
                             </div>
                       </div>
                    </div>`;
                    $('.cardBlock').append(divCard);

                    if(show.image) {
                        for (let i = 0; i < (show.image.length);i++) {
                            let imgElem =
                                `<div class="imageBlock d-inline-block mt-2 mr-3 mb-3" data-id="${i}">
                            <img src="${show.image[i]}" alt="Post Photo" width="180" height="150">
                         </div>`;
                            $(`.card-body`).prepend(imgElem);
                            $('.card-body h5').addClass(`title`);
                        }
                    }
                }
            });

            $(`.imageBlock[data-id='${show.image.length - 1}']`).addClass(`active`).removeClass(`d-inline-block`);
            show.viewComment();
        },

        viewComment : function() {
            if (this.comments) {
                $.each(this.comments, function(index, comment) {
                    if(show.postId === comment.postId) {
                        let showCommentElem =
                            `<div class="item" data-comment="${comment.id}">
							<div class="d-inline-block col-lg-11 ">
								<p class="">
									<span class="small text-muted">${comment.created_at}</span>
									<span class="font-weight-bold ml-4">${comment.author}</span>
									<span>${comment.content}</span>
								</p>
							</div>
                        	<a class="reply col-1 reply_show"><i class="fas fa-reply"></i></a>
                        	<div class="commentReplyBlock  mb-4 pt-4 d-flex flex-column col-6"></div>
                    	</div>`;
                        $('.commentBlock').append(showCommentElem);
                        // IF THERE IS REPLY
                        if(!(comment.reply.length === 0)) {
                            $.each(comment.reply, (key,value) => {
                                let showCommentReplElem = `<p class="">
							        <span class="small text-muted">${value.created_at}</span>
							        <span class="font-weight-bold ml-4">${value.author}</span>
							        <span>${value.content}</span>
								 </p>`;

                                $(`.commentReplyBlock`).append(showCommentReplElem);
                            });
                        }
                    }
                });
            }
        },

        newComment  : function(input)  {
            let date = new Date();
            let time = ((date.getHours() < 10 ? '0' : '') + date.getHours()) + ':' +
                (((date.getMinutes) < 10 ? '0' : '') + date.getMinutes()) + ':' +
                ((date.getSeconds() < 10 ? '0' : '') + date.getSeconds());
            let commentBlockId = +input.closest('.item').attr(`data-comment`);
            let replyInputVal = '';
            let commentInputVal = '';

            if (input.val()) {
                // COMMENT INPUT COND
                if(input.attr('id') === 'comment_input') {
                    if(!this.comments) this.comments = [];

                    commentInputVal = input.val();
                    let showCommentElem =
                        '<div class="item" data-comment="'+ this.comments.length +'">' +
                        '<div class="d-inline-block col-lg-11 ">\n' +
                        '        <p class="">\n' +
                        '            <span class="small text-muted">'+ time +'</span>\n' +
                        '            <span class="font-weight-bold ml-4">'+ show.users[show.userId].name +':</span>\n' +
                        '            <span>'+ commentInputVal +'</span>\n' +
                        '        </p>\n' +
                        '</div>\n' +
                        '<a class="reply col-1 reply_show"><i class="fas fa-reply"></i></a>'+
                        '<div class="commentReplyBlock  mb-4 pt-4 d-flex flex-column col-6">'+
                        '</div>';
                    $('.commentBlock').append(showCommentElem);

                    this.comments.push({
                        id         : String(show.comments.length),
                        author     : show.users[show.userId].name,
                        content    : commentInputVal,
                        reply      : [],
                        postId     : show.postId,
                        userId     : show.userId,
                        created_at : time
                    });

                    localStorage.setItem('comments',JSON.stringify(show.comments));
                }
                // REPLY INPUT COND
                else {
                    replyInputVal = input.val();
                    input.closest(`.item`).find(`.reply_show`).addClass('reply');
                    let showCommentReplElem =
                        `<p class="">
						<span class="small text-muted">${time}</span>
						<span class="font-weight-bold ml-4">${show.users[show.userId].name}</span>
						<span>${replyInputVal}</span>
					</p>`;

                    $(`.item[data-comment=${commentBlockId}]`).find(`.commentReplyBlock`).append(showCommentReplElem);

                    $.each(this.comments, (key,value) => {
                        if(key === commentBlockId) {
                            value.reply.push({
                                id       : String(value.reply.length),
                                author    : show.users[show.userId].name,
                                content     : replyInputVal,
                                commentId : String(commentBlockId),
                                userId    : show.userId,
                                created_at: time
                            });
                        }
                        return true;
                    });

                    localStorage.setItem('comments',JSON.stringify(show.comments));
                    input.remove()
                }
                input.val('');
            }
        },

        deleteCookie   :  () => {
            document.cookie = "postId='"+ show.postId  +"'; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        },
    };

    show.viewPost();

    $(`.send`).on(`click`, (event) => {
        let input =  $(event.target).closest(`.commentInput`).find(`._comment`);
        show.newComment(input);
    });

    $(document).on('keyup', '._comment', function(event) {
        if(event.which === 13) {
            show.newComment($(event.target));
        }
    });

    $(document).on('click', '.reply', function() {
        let input = '<input type="text" class="form-control _comment mb-3 col-12 float-right d-block" id="reply" name="reply">';
        let searchBlock = $(this).closest('.item');
        searchBlock.find('.commentReplyBlock').append(input);
        searchBlock.find(`#reply`).trigger('select');
        $(this).removeClass('reply');
    });

    $('.edit').on('click',function(event) {
        let postId = +$(event.target).closest('.item').attr('data-attribute');
        window.location.href = 'edit.html';
    });

    $(`.delete`).click((event) =>  {
        let target = $(event.target);
        let card = target.closest('.item');
        $(show.posts).each(function(key,post) {
            if(this.postId === show.postId) {
                show.posts.splice(key,1);
                localStorage.setItem('posts', JSON.stringify(show.posts));
                card.remove();
            }
            $.each(show.comments,(index, comment) => {
                if (post.postId === comment.postId) {
                    console.log(this);
                    show.comments.splice(index,1);
                    localStorage.setItem('comments', JSON.stringify(show.comments));
                }
            });
        });

        window.location.href = document.referrer;
    });

    window.addEventListener('beforeunload', function (e) {
        document.cookie = `postId=${show.postId};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
});
