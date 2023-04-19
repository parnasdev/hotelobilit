$(function() {
  function testJSON(text) {
    if (typeof text !== "string") {
      return false;
    }
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }
  $('.iframe-btn').fancybox({
    'type'		: 'iframe',
    'autoScale'    	: false
  });
  //
  // Handles message from ResponsiveFilemanager
  //
  var photo=null;
  function OnMessage(e){
    // debugger
    var event = e.originalEvent;
    // Make sure the sender of the event is trusted
    if(event.data.sender === 'responsivefilemanager'){
      if(event.data.field_id){
      photo={
        name:event.data.url,
        path:event.origin+'/source/'+event.data.url,
      };
          $('#photo').val(JSON.stringify(photo));
          $('#photoImage').attr('src',photo.path);
          $('#remove-btn').removeClass('d-none');
        $.fancybox.close();
        // Delete handler of the message from ResponsiveFilemanager
        $(window).off('message', OnMessage);
      }
    }
  }

  // Handler for a message from ResponsiveFilemanager
  $('.iframe-btn').on('click',function(){
    $(window).on('message', OnMessage);
  });
  if (testJSON($('#photo').val())){
    $('#remove-btn').removeClass('d-none');

  }
  $('#remove-btn').click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('d-none')){
      $('#photo').val(null);
      $('#photoImage').attr('src','/assets/image/empty_650X350.png');
      $(this).addClass('d-none');
    }

  });
});
