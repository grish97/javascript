let userObject = {
    getUser : function () {
        let pattern = /[0-9]+/g;
        let id = document.cookie.match(pattern);
        if(id) {
            let user = JSON.parse(localStorage.getItem('users'))[id];
            this.profile(user,id)
        }
    },

    profile : function (data,id) {
        if(data) {
            $('.nav-item').addClass('d-none');
            $('.dropdown').addClass('d-inline');
            $('#guest').addClass('d-none');
            $('#content').removeClass('d-none');
            $('.user_name').text(data['name']);
            $('.logout').click(function () {
                document.cookie = "id='"+ id +"'; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = 'login.html';
            });
        }
    }
};

userObject.getUser();