import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

declare let Mapp: any;
declare let L: any;

@Component({
  selector: 'prs-get-location',
  templateUrl: './get-location.component.html',
  styleUrls: ['./get-location.component.scss']
})
export class GetLocationComponent implements OnInit, OnChanges {
  map: any = null;
  icon: any;
  marker: any;
  @Output() result = new EventEmitter();
  @Input() textMarker = 'موقعیت گیرنده';
  @Input() inCommingLatLng: number[] = [35.688052, 51.382296];
  apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY2NzA4MjQwMTJhMTc4MDg1MDVhYjIzOWY1ZjNhNDczZTM3Zjk1MDUxZjg5MTM2ZDg0MGUxMDZiOTdmMWU4Y2UwMzM3MmU1MzY1MGUxNjdhIn0.eyJhdWQiOiIxNTkxOCIsImp0aSI6IjY2NzA4MjQwMTJhMTc4MDg1MDVhYjIzOWY1ZjNhNDczZTM3Zjk1MDUxZjg5MTM2ZDg0MGUxMDZiOTdmMWU4Y2UwMzM3MmU1MzY1MGUxNjdhIiwiaWF0IjoxNjM1MzM3OTE5LCJuYmYiOjE2MzUzMzc5MTksImV4cCI6MTYzNzg0MzUxOSwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.sS7i2ux4fJPt1lOrhSj14Ppxo8JPcaqoC81V_0EhUfdkW6pZrVQRskM1Q0HuUwfAYrAn-62gBByuaUXaPg9s6dAQ70tJyDWUgSyviAGdRnhMYZtEojHvqebmHX6we7c0L2aOYkrcpzqOcAXTL1yLZHe6_mM6ZEBSmaJcwHy2HsdDvT3TvD23SPR0sTITbVhvGwRX2WdKRVOcTOph-ZgxM0oCFKIDv2XNvCoyMc5cUcQEOvyTAeYJwXd9893oleFQYBvVH9VcoWKlRSAFCOtBbPFexoXmwPWRsw-PViQ_4aI_Vkr2qlHj0hKjJgYTpiLvwMPeE0wM3N2FYVDTFqQJ2Q'

  constructor() {
  }

  ngOnInit(): void {
    // this.createMap()
    this.map.map.on('click', (e: any) => {
      this.result.emit({lat: e.latlng.lat, lng: e.latlng.lng, token: this.apiKey})
      this.addMarker(e.latlng.lat, e.latlng.lng,);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createMap()
    if (this.inCommingLatLng[0] !== 0) {
      this.addMarker(this.inCommingLatLng[0], this.inCommingLatLng[1])
    }
  }


  createMap(): void {
    if (!this.map) {
      this.map = new Mapp({
        element: '#app',
        presets: {
          latlng: {
            lat: this.inCommingLatLng[0] === 0 ? 35.688052 : this.inCommingLatLng[0],
            lng: this.inCommingLatLng[1] === 0 ? 51.382296 : this.inCommingLatLng[1],
          },
          zoom: 15,
          i18n: {
            fa: {
              'custom-baselayer-1': 'لایه یک',
              'custom-baselayer-2': 'لایه دو',
            },
            en: {
              'custom-baselayer-1': 'Baselayer one',
              'custom-baselayer-2': 'Baselayer two',
            }
        },
        },
        apiKey: this.apiKey
      });
      this.map.addLayers();
    }
  }

  addMarker(lat: any, lng: any): void {
    var marker = this.map.addMarker({
      name: 'advanced-marker',
      latlng: {
        lat: lat,
        lng: lng,
      },
      icon: this.map.icons.red,
      popup: false,
      pan: false,
      draggable: false,
      history: false,
      on: {
        click: function () {
          console.log('Click callback');
        },
        contextmenu: function () {
          console.log('Contextmenu callback');
        },
      },
    });
  }

}
