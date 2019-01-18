let accessConfirm = {
    users  : JSON.parse(localStorage.getItem('users')),

    getAccount : function () {
        let inputs = $('input');
        let email    = inputs.eq(0);
        let password = inputs.eq(1);

        $.each(this.users, (key,value) => {
            console.log(email.val() , value.email, password.val(), value.password, accessConfirm.users);
            if(email.val() === value.email && password.val() === value.password && accessConfirm.users) {

                document.cookie = "id="+key;
                window.location.href = 'index.html';
            }else if ((email.val() !== value.email) || (password.val() !== value.password || !accessConfirm.users)) {
                $('.wrong').addClass('d-block');
                email.addClass('is-invalid');
                password.addClass('is-invalid');
            }
        });
    }
};

$(`input`).keyup((event) => {
    if(event.which === 13) accessConfirm.getAccount();
});

$('.btn').click(() => accessConfirm.getAccount());

