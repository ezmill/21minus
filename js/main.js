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

$('#lewitt').click(function(e){
	e.preventDefault();
	$.get("lewitt.html",function(data){
		$.getScript("js/lewitt.js")
		$( "div" ).html( data );
		
	});
});

$("nav a").click(function(){
	$("a").removeClass("active");
	$(this).addClass("active");
})
