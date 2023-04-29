import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router"

@Component({
    selector: 'prs-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  loadAPI:Promise<any>;
  galleryFC = new FormControl();
  @Output() fileDTO = new EventEmitter<any>();
  constructor(private http: HttpClient,private router: Router){
    this.loadAPI=new Promise((resoleve)=>{
      this.loadScript();
      resoleve(true);
    });
  }
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  ngOnInit(): void {
    // @ts-ignore
    document.getElementById('gallery').onchange(event => {
      console.log('gggggggggggggggggggggggg')
    })
  }
  onSubmit(form: NgForm){
    var  self=this;

    form.value.gallery=(document.getElementById('gallery') as HTMLInputElement).value;
    return this.http.post('http://tour-api.parnasweb.com/api/galleries', JSON.stringify(form.value), {headers: this.headers})
      .toPromise()
      .then(function (res) {
        console.log(res)
        self.router.navigate(['/galleries']);
      })
      .catch(this.handleError);
  }

  public loadScript(){
    var dynamicScripts=[
      'assets/js/custom/gallery.js',
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
    for (var i=0;i<dynamicScripts.length;i++){
      let node=document.createElement('script');
      node.src=dynamicScripts[i];
      node.async=false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  changeInput():void {
    // @ts-ignore
    const val = document.getElementById("gallery").value;
    this.fileDTO.emit(JSON.parse(val))
  }
}
