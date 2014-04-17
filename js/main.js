$('#pwys').click(function(e){
	e.preventDefault();
	$.get("pwys.html",function(data){
		$.getScript("js/pixel-grid.js")
		$( "div" ).html( data );
		
	});
});

$('#bbSort').click(function(e){
	e.preventDefault();
	//	$.get("bbSort.html",function(data){
		$.getScript("js/bbSort.js")
		//$("#bbSortCanvas").appendTo("body");
		
});
