function ToggleMenu()
{
	if($('.pause-menu').css('display') == 'none')
	{
		game.paused = true;
		$('.pause-menu').fadeIn();
	}
	else
	{
		game.paused = false;
		$('.pause-menu').fadeOut();
	}
}