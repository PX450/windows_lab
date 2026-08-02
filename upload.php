<html>
<head>
    <title>File Upload</title>
</head>
<body>

<form action="" method="post" enctype="multipart/form-data">
    Select File:
    <input type="file" name="myfile" required>

    <input type="submit" name="submit" value="Upload">
</form>

<?php

if (isset($_POST['submit'])) {

    $file = $_FILES['myfile']['name'];
    $temp = $_FILES['myfile']['tmp_name'];

    move_uploaded_file($temp, "uploaded/" . $file);

    echo "File uploaded successfully!";
}

?>

</body>
</html>
