( function($) {
	
	$(document).ready(
	function() {
		
			//console.log("test");
			//console.log($("#display-button"));
			$("#display-button").click(menuDisplayToggle);
			
			
			});	


	/**
	Fonction qui permet de switcher entre les differents affichages du menu #accordion
	(juste une classe par etat, le css fait le reste)
	cf. .popup-menu .normal-menu .hide-menu
	**/
	function menuDisplayToggle ()
	{
		//console.log("menuDisplayToggle");

		var menu=$("#accordion");
		if(menu.hasClass( "popup-menu" ))
		{
			menu.removeClass( "popup-menu" ).addClass("normal-menu");
		}
		else if (menu.hasClass( "normal-menu" ))
		{
			menu.removeClass( "normal-menu" ).addClass("hide-menu");
		}
		else
		{
			menu.removeClass( "hide-menu" ).addClass("popup-menu");
		}
	}








} ) ( jQuery );