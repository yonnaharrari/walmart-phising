<?php
$userIP = $_SERVER['REMOTE_ADDR'];
echo json_encode(array('userIP' => $userIP));
?>
