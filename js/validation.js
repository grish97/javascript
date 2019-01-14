class Validator {
    constructor(){
        this.errors = [];
    }

    validate (event) {
        let target = $(event.target);
        let data;
        let rules = $(event.target).attr('data-validate').split('|');
        rules.forEach((rule) => {
            let args = rule.split(':');
            if(this[args[0]]) {
                this[args[0]]({name : target.attr('name'), value : target.val(), args : +args[1]});
            }
        });
        this.drawErrors();
    }

    addErrors(params) {
        let {name, msg, type} = params;
        let index = this.errors.findIndex((item) => (item.name === name && item.type === type));
        if(index === -1) this.errors.push({name : name, msg: msg, type : type});
    }

    removeErrors(name, type) {
        let index = this.errors.findIndex((item) => (item.name === name && item.type === type));
        if(index > -1) this.errors.splice(index, 1);
    }

    required(params) {
        let {name, value, args} = params;
        let type = 'required';
        if(!value.trim())this.addErrors({name : name, msg : `The ${name} field is required.`, type : type});
        else this.removeErrors(name, type)
    }

    min(params) {
        let {name, value, args} = params;
        let type = 'min';
        if(value.length < args && value.length > 0) this.addErrors({name : name, msg : `The min length is ${args}.`, type : type});
        else this.removeErrors(name, type)
    }

    max (params) {
        let {name, value, args} = params;
        let type = 'max';
        if(value.length > args) this.addErrors({name : name, msg : `The max length is ${args}.`, type : type});
        else this.removeErrors(name, type)
    }

    email (params) {
        let {name, value} = params;
        let type = "email";
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!value.match(pattern)) this.addErrors({name: name, msg: `Incorrect ${name} address.`, type: type});
        else this.removeErrors(name, type);
    }

    drawErrors() {
        $('[data-validate]').closest('.form-group').find('.error-msg').text('');
        this.errors.forEach((item) => {
            $(`[name=${item.name}]`).closest('.form-group').find('.error-msg').text(item.msg);
        })
    }
}

let validator = new Validator();
$('[data-validate]').keyup(function (event) {
    validator.validate.call(validator, event);
    $(this).removeClass('is-invalid');
});
