<html>
<head>
    <title>Search Student</title>
</head>

<body>

<form method="post" action="">
    Enter Student ID:
    <input type="number" name="sid" required><br><br>

    <input type="submit" name="submit" value="Search">
</form>

<?php

if (isset($_POST['submit']))
{
    $id = $_POST['sid'];

    $conn = mysqli_connect("localhost", "root", "", "college");

    $sql = "SELECT id, name, dob FROM student WHERE id='$id'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0)
    {
        echo "<table border='1' cellpadding='8'>";
        echo "<tr><th>ID</th><th>Name</th><th>Date of Birth</th></tr>";

        while ($row = mysqli_fetch_row($result))
        {
            echo "<tr>";
            echo "<td>".$row[0]."</td>";
            echo "<td>".$row[1]."</td>";
            echo "<td>".$row[2]."</td>";
            echo "</tr>";
        }

        echo "</table>";
    }
    else
    {
        echo "No student found with that ID.";
    }

    mysqli_close($conn);
}

?>

</body>
</html>
