<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Time Table</title>
    <link rel="stylesheet" href="css/frontend.css">
</head>

<body>

</body>
<?php
if (isset($_GET["start"]) && !empty($_GET["start"])) {
    $start = $_GET["start"];
    $date = date('d-m-Y', strtotime($start));
} else {
    $date = date('d-m-Y', strtotime("now"));
}
?>

<script>
    const showTimeTable = <?php echo isset($_GET["start"]) && !empty($_GET["start"]) ? "true" : "false"; ?>;
    const startFrom = "<?php echo $date; ?>";
</script>

<div id="timeTableDates"></div>

<script src="js/frontend.js"></script>

</html>