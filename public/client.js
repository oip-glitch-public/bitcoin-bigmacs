$(function() {

  $(document).ready(function(){
    
    // draw some burgers!
    if ($('.loadsa-burgers').length) {
      //.loadsa-burgers(data-amount=bigmacs)
      var burger_icons = [
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/96/hamburger_1f354.png', 
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/google/110/hamburger_1f354.png', 
        //'https://emojipedia-us.s3.amazonaws.com/thumbs/120/microsoft/94/hamburger_1f354.png', /* the hideous microsoft icon */
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/samsung/100/hamburger_1f354.png', 
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/lg/57/hamburger_1f354.png', 
        //'https://emojipedia-us.s3.amazonaws.com/thumbs/120/htc/37/hamburger_1f354.png', /* nasty HTC icon */
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/facebook/111/hamburger_1f354.png', 
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/facebook/65/hamburger_1f354.png', 
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/twitter/103/hamburger_1f354.png', 
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/mozilla/36/hamburger_1f354.png', 
        'https://emojipedia-us.s3.amazonaws.com/thumbs/120/emoji-one/104/hamburger_1f354.png'
        ]
        //'https://emojipedia-us.s3.amazonaws.com/thumbs/120/emojidex/112/hamburger_1f354.png']; /* weird emojidex icon */
      var burger_amount = $('.loadsa-burgers').data('amount');
      //alert(burger_amount);
      if (burger_amount < 1) {
        location.reload(true);
      }
      else {
        for (var i = 0; i < burger_amount; ++i) {
          var random_icon = burger_icons[Math.floor(Math.random() * burger_icons.length)];
          var burger_image = $('<img class="burger" src="' + random_icon + '" alt="🍔" />');
          $('.loadsa-burgers').append(burger_image);
        }
        $('.loadsa-burgers').append(' <small>nom nom nom</small> ლ(´ڡ`ლ)');
      }
    }
    
  });

});
