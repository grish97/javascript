<?php

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    saveData();
}else if($_SERVER['REQUEST_METHOD'] === 'GET') {
    getData();
}


function saveData () {
    $file = file_get_contents('images.json');
    $file_data = json_decode($file, true);
    if(is_null($file_data)) {
        $file_data = [];
    }
    $key = count($file_data);
    $file_data[$key]  =  [
        'name' => $_POST['name'],
        'imgSrc' => $_POST['imgSrc']
    ];
    file_put_contents('images.json',json_encode($file_data));
    echo json_encode($file_data[$key]);
}

function getData() {
    var_dump($_GET);
}


