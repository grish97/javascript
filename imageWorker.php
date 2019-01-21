<?php

if($_SERVER['REQUEST_METHOD'] === 'POST'  &&  isset($_POST['create'])) createImg();

else if($_SERVER['REQUEST_METHOD'] === 'POST'  &&  isset($_POST['edit'])) editImg($_POST['id']);

else if($_SERVER['REQUEST_METHOD'] === 'POST'  &&  isset($_POST['delete'])) deleteImg( $_POST['id']);

else if($_SERVER['REQUEST_METHOD'] === 'GET') getImg($_GET['id']);

function createImg () {
    $file = file_get_contents('images.json');
    $file_data = json_decode($file,true);
    if(is_null($file_data)) {
        $file_data = [];
    }
    $key = (count($file_data) + 1);

    $file_data["$key"] = [
        'postId'    => $_POST['postId'],
        'owner_id'  => $_POST['owner_id'],
        'images'    => $_POST['images']
    ];

    file_put_contents('images.json',json_encode($file_data,true));
    echo $key;

}

function getImg($id) {
    $file = file_get_contents('images.json');
    $file_data = json_decode($file, true);
    echo json_encode($file_data[$id]);
}

function editImg($id) {
    $file = file_get_contents('images.json');
    $file_data = json_decode($file,true);
    $post["$id"] = [
            'postId'    => $_POST['postId'],
            'owner_id'  => $_POST['owner_id'],
            'images'    => $_POST['images']
    ];
    array_splice($file_data,($id),1,$post);
    file_put_contents('images.json',json_encode($file_data));

}

function deleteImg($id) {
    $file = file_get_contents('images.json');
    $file_data = json_decode($file, true);
    array_splice($file_data,$id,1);
    file_put_contents('images.json',json_encode($file_data));
    var_dump($file_data[$id]);
}



