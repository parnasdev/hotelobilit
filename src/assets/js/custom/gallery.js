Dropzone.autoDiscover = false;
$(function() {


  function initDropzones() {
    $('.dropzone').each(function () {

      let dropzoneControl = $(this)[0].dropzone;
      if (dropzoneControl) {
        dropzoneControl.destroy();
      }
    });
  }
  initDropzones();


  var photosGallery = []
 var myDropzone= new Dropzone("#drop",{

    addRemoveLinks: true,
    autoProcessQueue:false,
    clickable: false,
    dictDefaultMessage:'فایل های مورد نظر خود را انتخاب نمایید...',
    dictRemoveFile:'حذف فایل',
    url: "http://127.0.0.1:8000/",
    sending: function(file, xhr, formData){
      // formData.append("_token","{{csrf_token()}}")
    },
    success: function(file, response){
      // photosGallery.push(response.photo_id)
    },
   removedfile: function(file) {


     var fileId = file.previewElement.getAttribute('data-index');

         photosGallery.splice(fileId, 1);
         document.getElementById('gallery').value = JSON.stringify(photosGallery);
     var _ref;
     return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
   },
  });
  if (document.getElementById('gallery').value!=null && testJSON(document.getElementById('gallery').value)){
    let mockFile=null;
    let $files=JSON.parse(document.getElementById('gallery').value);

    photosGallery=$files;
    for(var index in $files) {

      mockFile = {name: $files[index].name, size: 12345};
      let callback = null; // Optional callback when it's done
      let crossOrigin = null; // Added to the `img` tag for crossOrigin handling
      let resizeThumbnail = false; // Tells Dropzone whether it should resize the image first
      // myDropzone.options.addedfile.call(myDropzone, mockFile);
      // myDropzone.options.thumbnail.call(myDropzone, mockFile,event.origin+'/source/'+$files[index], callback, crossOrigin, resizeThumbnail);
      myDropzone.displayExistingFile(mockFile, $files[index].path, callback, crossOrigin, resizeThumbnail);
      $(".dz-preview:last-child").attr('data-index',index);
    }
  }



  $('.iframe-btn').fancybox({
    'type'		: 'iframe',
    'autoScale'    	: false
  });
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
//
  // Handles message from ResponsiveFilemanager
  //
  function OnMessage(e){
    // debugger
    var event = e.originalEvent;
    // Make sure the sender of the event is trusted
    if(event.data.sender === 'responsivefilemanager'){
      if(event.data.field_id){
        let mockFile=null;
        if (testJSON(event.data.url)){
           $files=JSON.parse(event.data.url);

        }
        else{
          $files=[event.data.url];
        }
        for(var index in $files){

          mockFile = { name:$files[index], size: 12345 };
          let callback = null; // Optional callback when it's done
          let crossOrigin = null; // Added to the `img` tag for crossOrigin handling
          let resizeThumbnail = false; // Tells Dropzone whether it should resize the image first
          // myDropzone.options.addedfile.call(myDropzone, mockFile);
          // myDropzone.options.thumbnail.call(myDropzone, mockFile,event.origin+'/source/'+$files[index], callback, crossOrigin, resizeThumbnail);
          myDropzone.displayExistingFile(mockFile,event.origin+'/source/'+$files[index], callback, crossOrigin, resizeThumbnail);
          $(".dz-preview:last-child").attr('data-index',index);
          photosGallery.push({
            name:$files[index],
            path:event.origin+'/source/'+$files[index],
          })
          document.getElementById('gallery').value=JSON.stringify(photosGallery);

        }
        // $('#'+fieldID).val(url).trigger('change');
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


});


