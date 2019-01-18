<?php

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    saveData();
}else if($_SERVER['REQUEST_METHOD'] === 'GET') {
    getData($_GET['id']);
}


function saveData () {
    $file = file_get_contents('images.json');
    $file_data = json_decode($file,true);
    if(is_null($file_data)) {
        $file_data = [];
    }
    $key = count($file_data) + 1;

    $file_data["$key"] = [
        'name'      => $_POST['name'],
        'postId'    => $_POST['postId'],
        'owner_id'  => $_POST['owner_id'],
        'images'    => $_POST['images']
    ];

    file_put_contents('images.json',json_encode($file_data,true));
    echo $key;

}

function getData($id) {
    $file = file_get_contents('images.json');
    $file_data = json_decode($file, true);

    echo json_encode($file_data[$id]);
}



