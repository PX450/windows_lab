<?php
session_start();

if (isset($_SESSION['name'])) {

    echo "Your name is: " . $_SESSION['name'];

} else {

    echo "Name not found";
}
?>
