let accessConfirm = {
    users  : JSON.parse(localStorage.getItem('users')),
    confirmed : false,

    getAccount : function () {
        let inputs = $('input');
        let email    = inputs.eq(0);
        let password = inputs.eq(1);

        if(accessConfirm.users) {
            $.each(accessConfirm.users, (key,value) => {
                if((value.email === email.val()) && (value.password === password.val())) {
                    accessConfirm.confirmed = true;
                    document.cookie = "id="+key;
                    window.location.href = 'index.html';
                }
            });

            if(!accessConfirm.confirmed) {
                $('.wrong').addClass('d-block');
                email.addClass('is-invalid');
                password.addClass('is-invalid');
            }

        }else {
            window.location.replace(`register.html`);
        }
    }
};

$(`input`).keyup((event) => {
    if(event.which === 13) accessConfirm.getAccount();
});

$('.btn').click(() => accessConfirm.getAccount());
