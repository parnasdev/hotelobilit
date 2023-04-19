//
// // wysiwyg editors
// altair_wysiwyg = {
//   _ckeditor: function() {
//     let editor = CKEDITOR.instances.wysiwyg_ckeditor;
//     if (editor) {
//       editor.destroy(true);
//     }
//     var $ckEditor = $('#wysiwyg_ckeditor');
//     if($ckEditor.length) {
//       $ckEditor
//         .ckeditor(function(el) {
//
//         }, {
//           customConfig: '../../js/ckeditor/ckeditor_config.js'
//         });
//       CKEDITOR.instances.wysiwyg_ckeditor.on('change',function () {
//         $('#context').attr('value', CKEDITOR.instances.wysiwyg_ckeditor.getData())
//       })
//     }
//
//   },
//   _ckeditor_inline: function() {
//     let editor = CKEDITOR.instances.wysiwyg_ckeditor_inline;
//     if (editor) {
//       editor.destroy(true);
//     }
//     var $ckEditor_inline = $('#wysiwyg_ckeditor_inline');
//     if($ckEditor_inline.length) {
//       $ckEditor_inline
//         .ckeditor(function() {
//           /* Callback function code. */
//         }, {
//           customConfig: '../../js/ckeditor/ckeditor_config.js',
//           allowedContent: true
//         });
//       CKEDITOR.instances.wysiwyg_ckeditor_inline.on('change',function () {
//         $('#context').attr('value', CKEDITOR.instances.wysiwyg_ckeditor_inline.getData())
//
//       })
//     }
//   },
//
// };

$(function() {

  // // ckeditor
  // altair_wysiwyg._ckeditor();
  // // ckeditor inline
  // altair_wysiwyg._ckeditor_inline();

  //tinymce
  $(function () {
    tinymce.remove('.editor');
    var editor=tinymce.init({
      selector: '.editor',
      width: '100%',
      height: 500,
      theme:'silver',
      menubar: true,
      branding: false,
      skin: 'oxide',
      toolbar1: 'undo redo | formatSelect | bold italic blockquote strikethrough underline forecolor backcolor | numlist bullist | alignright aligncenter alignleft alignjustify | rtl ltr | link unlink | removeformat',
      toolbar2: 'fontselect | fontsizeselect | indent outdent | cut copy paste pastetext | charmap image media responsivefilemanager table emoticons hr | searchreplace preview code fullscreen help editormode',
      plugins: 'lists,advlist,directionality,link,paste,charmap,table,emoticons,codesample,preview,code,fullscreen,help,hr,nonbreaking,searchreplace,visualblocks,visualchars,autolink,image,media,responsivefilemanager',
      advlist_bullet_styles: 'square,circle,disc',
      advlist_number_styles: 'lower-alpha,lower-roman,upper-alpha,upper-roman',
      help_tabs: ['shortcuts'],
      fontsize_formats: "6pt 7pt 8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt 29pt 30pt 32pt 34pt 36pt 40pt",
      lineheight_formats: "1pt 2pt 3pt 4pt 5pt 6pt 7pt 8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 36pt 38pt 40pt 42pt 44pt 46pt 48pt 50pt 60pt 70pt 80pt 100pt",
      directionality :'rtl',
      language: 'fa_IR',
      external_filemanager_path:"https://api.hotelobilit.com/filemanager/",
      filemanager_title:"مدیریت فایل ها" ,
      external_plugins: { "filemanager" : "https://api.hotelobilit.com/filemanager/plugin.min.js"},
      filemanager_crossdomain:true,
      setup: function(editor) {
        editor.on('change', function (e) {
          $('#context').attr('value', editor.getContent());
        });
      }

    });

  });

});

