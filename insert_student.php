<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "colleges";

$conn = new mysqli($servername, $username, $password, $dbname);

if (isset($_POST['submit'])) {
    $id = $_POST['id'];
    $name = $_POST['sname'];
    $dob = $_POST['dob'];

    $sql = "INSERT INTO STUDENT (id, name, dob) VALUES ('$id', '$name', '$dob')";

    if (mysqli_query($conn, $sql)) {
        echo "Record Inserted Successfully";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}

$conn->close();
?>

<html>
<head>
    <title>Student Entry</title>
</head>
<body>
    <h2>Enter Student Details</h2>
    <form method="POST" action="">
        ID: <input type="text" name="id" required><br>
        Name: <input type="text" name="sname" required><br>
        Date of Birth: <input type="date" name="dob" required><br>
        <input type="submit" name="submit" value="Insert">
    </form>
</body>
</html>
