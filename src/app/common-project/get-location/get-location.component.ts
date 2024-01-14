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
  @Input() inCommingLatLng: number[] = [35.715731, 51.384159];
  constructor() {
  }

  ngOnInit(): void {
    // this.createMap()
    if (this.map) {
      this.map.on('click', (e: any) => {
        this.result.emit({ lat: e.latlng.lat, lng: e.latlng.lng })
        this.addMarker(e.latlng.lat, e.latlng.lng,);
      });
    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.createMap()
    if (this.inCommingLatLng[0] !== 0) {
      this.addMarker(this.inCommingLatLng[0], this.inCommingLatLng[1])
    }
    this.map.setView([this.inCommingLatLng[0], this.inCommingLatLng[1]], 13);
  }


  createMap(): void {
    if (!this.map) {
      this.map = new L.Map("map", {
        key: "web.8acf2dc512944e00ad5baa92079420f5",
        maptype: "neshan",
        poi: false,

        traffic: false,
        center: [35.715731, 51.384159],
        zoom: 14,
      })

    }

  }

  addMarker(lat: any, lng: any): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng])
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

}
