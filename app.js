

	
app.get('/', function (req, res) {
	var html = 
	res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
