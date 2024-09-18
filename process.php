<?php

$order_id = "1234";
$merchant_id = "1227731";
$name = $_POST["name"];
$price = $_POST["price"];
$currency = "LKR";
$merchant_secret = "MjE0OTk4NjIxODM5Nzc5NzMzMTMyMzAzMzUzMDY1MTcyNDU3OTg2MA==";
$hash = strtoupper(
    md5(
        $merchant_id .
        $order_id .
        number_format($price, 2, '.', '') .
        $currency .
        strtoupper(md5($merchant_secret))
    )
);

$obj = new stdClass();
$obj->order_id = $order_id;
$obj->merchant_id = $merchant_id;
$obj->name = $name;
$obj->price = $price;
$obj->currency = $currency;
$obj->hash = $hash;

echo json_encode($obj);