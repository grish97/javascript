let createPost  = {
    inputVal : function () {
        let fields    = $('input');
        let category  = fields.eq(0).val();
        let title     = fields.eq(1).val();
        let desc      = $('textarea').val();
        let imgElem   = fields.eq(2);
        let imgPath;
        if(imgElem.val()) {
            let reader = new FileReader();
            reader.readAsDataURL(imgElem[0].files[0]);
            reader.onload = function() {
                imgPath = reader.result;
                createPost.pushData(category,title,desc,imgPath);
            };
        }else {
            imgPath = 'images/300x200.png';
            createPost.pushData(category,title,desc,imgPath,imgElem);
        }
    },

    pushData : function (category,title,desc,imgPath,imgElem) {
        let patt = /[0-9]+/g;
        let id = document.cookie;
        let userId = id.match(patt)[0];
        let userName = JSON.parse(localStorage.getItem('users'))[userId]['name'];
        let posts = JSON.parse(localStorage.getItem(`posts`));

        //TEST
        // let images = JSON.parse(localStorage.getItem('images'));
        // if(!images) {
        //     images = [];
        // }
        //
        // let reader = new FileReader();
        // reader.onload = function () {
        //     console.log(reader.result)
        //     images.push({
        //         id  : String(images.length),
        //         imagePath : reader.result,
        //     });
        // };
        // console.log(imgElem[0].files);
        // // reader.readAsDataURL(imgElem[0].files[0]);
        // localStorage.setItem('images',JSON.stringify(images));
        //TEST END*/
        if(!posts) {
            posts = [];
        }

        posts.push({
         postId   : String(posts.length),
         category : category,
         title    : title,
         desk     : desc,
         imgPath  : imgPath,
         owner_id : userId,
        });

        localStorage.setItem(('posts'), JSON.stringify(posts));
        window.location.href = 'myPost.html';
    },

};

$('.access').click(function() {
    createPost.inputVal();
});

