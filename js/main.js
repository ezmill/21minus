$('#pixels').click(function(e){
	//e.preventDefault();
	$.get("pixels.html",function(data){
		$( "div" ).html( data );
	});
});