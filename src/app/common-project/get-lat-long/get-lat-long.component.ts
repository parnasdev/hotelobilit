import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

declare let L:any;
// import 'leaflet/dist/images/marker-shadow.png';
// import 'leaflet/dist/images/marker-icon.png';

@Component({
  selector: 'app-get-lat-long',
  templateUrl: './get-lat-long.component.html',
  styleUrls: ['./get-lat-long.component.sass']
})
export class GetLatLongComponent implements OnInit {
  @Output() latlng = new EventEmitter();
  @Input() textMarker = 'موقعیت گیرنده';
  @Input() inCommingLatLng: number[] = [35.724153, 51.425910];
  icon: any;
  map: any;
  marker: any;

  constructor() {
  }

  ngOnInit() {
    this.icon = L.icon({
      iconUrl: 'assets/img/location.png',
      iconSize: [35, 45], // size of the icon
// point from which the popup should open relative to the iconAnchor
    });
    this.map = L.map('map').setView([this.inCommingLatLng[0], this.inCommingLatLng[1]], 30);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.marker = new L.marker([this.inCommingLatLng[0], this.inCommingLatLng[1]], {icon: this.icon}, {draggable: true}).addTo(this.map)
      .bindPopup(this.textMarker)

      .openPopup();

    const onClick = (e: any) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = new L.marker([e.latlng.lat, e.latlng.lng], {icon: this.icon}).addTo(this.map)
        .bindPopup(this.textMarker)
        .openPopup();
      this.latlng.emit(e.latlng);
    };

    this.map.on('click', onClick);
  }
}
