<html>
<head>
    <title>Session Example - Page 1</title>
</head>
<body>

<form method="post" action="">
    Enter your name:
    <input type="text" name="username" required>
    <input type="submit" name="submit" value="Submit">
</form>

</body>
</html>

<?php
session_start();

if (isset($_POST['submit'])) {

    $_SESSION['name'] = $_POST['username'];

    header("Location: page2.php");
}
?>
