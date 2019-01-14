function registerValidation(data) {
    let name = $('input[name="name"]'),
        last_name = $('input[name="last_name"]'),
        email = $('input[name="email"]'),
        password = $('input[name="password"]');

    let errors = true;

    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!name.val() || name.val().length < 3 || name.val().length > 30) {
        name.addClass('is-invalid');
        errors = false;
    } else name.removeClass("is-invalid");

    if (!last_name.val() || last_name.val().length < 3 || last_name.val().length > 30) {
        last_name.addClass('is-invalid');
        errors = false;
    }else last_name.removeClass("is-invalid");


    if(!email.val() || email.val().length < 15 || email.val().length > 40 || (email.val().match(pattern)) === null) {
        email.addClass('is-invalid');
        errors = false;
    }else email.removeClass("is-invalid");

    if(!password.val() || password.val().length < 6 || password.val().length > 40) {
        password.addClass('is-invalid');
        errors = false;
    }else password.removeClass("is-invalid");

    return errors;

}

function createUser () {
    let fields = $('input');
    let users = JSON.parse(getLocalStorage('users'));
    if(!users) {
        users = [];
    }
    let email = fields.eq(2).val();
    if(!uniqueEmail(users, email, fields)) {
        return false;
    }

    users.push({
        name      : fields.eq(0).val(),
        last_name : fields.eq(1).val(),
        email     : fields.eq(2).val(),
        password  : fields.eq(3).val()
    });
    saveLocalStorage(users);
    window.location.href = "login.html";
}

function uniqueEmail(data,email,fields) {
    for(let i = 0; i < data.length; i++) {
        if(email === data[i]['email']){
            fields.eq(2).addClass('is-invalid');
            fields.eq(2).closest('.form-group').find('.error-msg').text('The mail already exists');
            return false;
        }
    }
    return true;
}

function saveLocalStorage(data) {
    return localStorage.setItem("users", JSON.stringify(data));
}

function getLocalStorage(data) {
    return localStorage.getItem(data);
}


$('#submitButton').click(function () {
   if(registerValidation()) createUser();
});
