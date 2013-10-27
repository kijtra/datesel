<!doctype html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<input type="text" class="date" value=""><br>
	<input type="text" class="date" value="<?php echo time(); ?>" data-min="2012-02-06" data-time="true">

	<script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
	<script src="jquery.datesel.js"></script>
	<script>
	$(function(){
		$('.date').datesel();
	});
	</script>
</body>
</html>