function ToggleMenu()
{
	if($('.pause-menu').css('display') == 'none')
	{
		game.paused = true;
		$('.pause-menu').css('display', 'block');
	}
	else
	{
		game.paused = false;
		$('.pause-menu').css('display', 'none');
	}
}