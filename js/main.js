let userObject = {
    users : JSON.parse(localStorage.getItem('users')),
    userId  : (document.cookie.split(';')[0]).split('=')[1],

    getUser : function () {
        if(this.userId) {
            let user = this.users[this.userId];
            this.profile(user)
        }
    },

    profile : function (data) {
        if(data) {
            $('.nav-item').addClass('d-none');
            $('.dropdown').addClass('d-inline');
            $('#guest').addClass('d-none');
            $('#content').removeClass('d-none');
            $('.user_name').text(data['name']);
            $('.logout').click(function () {
                document.cookie = "id='"+ userObject.userId +"'; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = 'login.html';
            });
        }
    }
};
userObject.getUser();