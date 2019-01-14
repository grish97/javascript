id = document.cookie.split('=')[1];
if(!id && (id!=='id')) {
    window.location.replace('index.html');
}