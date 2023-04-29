import {Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges} from '@angular/core';

declare let $: any;
declare let tinymce: any;

@Component({
  selector: 'prs-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnChanges {
  loadAPI: Promise<any>;
  @Output() body = new EventEmitter();
  @Input() inCommingBody = '';
  editor: any;

  constructor() {
    this.loadAPI = new Promise((resoleve) => {
      this.loadScript();
      resoleve(true);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    (document.getElementById('context') as HTMLInputElement).value = this.inCommingBody;
    tinymce.activeEditor.setContent(this.inCommingBody);

  }

  ngOnInit(): void {
    tinymce.remove('.editor');
    this.editor = tinymce.init({
      selector: '.editor',
      width: '100%',
      height: 500,
      theme: 'silver',
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
      directionality: 'rtl',
      language: 'fa_IR',
      external_filemanager_path: "https://api.snapptour.com/filemanager/",
      filemanager_title: "مدیریت فایل ها",
      external_plugins: {"filemanager": "https://api.snapptour.com/filemanager/plugin.min.js"},
      filemanager_crossdomain: true,
      setup: function (editor: any) {
        editor.on('change', (e: any) => {
          $('#context').attr('value', editor.getContent());
        });
        editor.on('init', function (e: any) {
          editor.setContent($('#context').val());
        });
      }

    });
    tinymce.activeEditor.on('change', (e: any) => {
      console.log((document.getElementById('context') as HTMLInputElement).value)
      this.body.emit((document.getElementById('context') as HTMLInputElement).value)
    });
  }

  submit(): void {
  }

  getBody(): void {
    this.body.emit((document.getElementById('context') as HTMLInputElement).value)
  }

  public loadScript() {
    var dynamicScripts = [
      // 'assets/js/custom/editor.js',
      'assets/js/custom/single-select.js',
    ];

    for (var index in dynamicScripts) {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        // @ts-ignore
        if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes(dynamicScripts[index])) {
          scripts[i].remove();
        }
      }
    }

    for (var i = 0; i < dynamicScripts.length; i++) {
      let node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }

  }

  public testJSON(text: string) {
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

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
