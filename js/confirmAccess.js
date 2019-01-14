let accessConfirm = {
    getAccount : function () {
        let data  = JSON.parse(localStorage.getItem('users'));
        let inputs = $('input');
        let email    = inputs.eq(0);
        let password = inputs.eq(1);

        $(data).each(function(key) {
            if(email.val() === this.email && password.val() === this.password && data) {
                document.cookie = "id="+key;
                window.location.href = 'index.html';
                return false
            }else if (email.val() !== this.email || password.val() !== this.password) {
                $('.wrong').addClass('d-block');
                email.addClass('is-invalid');
                password.addClass('is-invalid');
            }
        });
    }
};

$('.btn').click(function () {
    accessConfirm.getAccount();
});

