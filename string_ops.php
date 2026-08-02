<html>
<head>
<title> String Operations </title>
</head>
<body>
<?php
$str1 = "Hello";
$str2 = "World";
echo "Original String : <br>";
echo "string 1 :". $str1."<br>";
echo "string 2 :". $str2."<br><br>";
echo "string length of str1:". strlen($str1)."<br>";
echo "String to Uppercase :". strtoupper($str1)."<br>";
echo "string to Lowercase :". strtolower($str1)."<br>";
echo "string to reverse :". strrev($str1)."<br>";
echo "Concatenation :". $str1." ". $str2."<br>";
?>
</body>
</html>
