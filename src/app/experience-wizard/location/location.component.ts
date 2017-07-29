import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  @Input()
  location: FormGroup;

  constructor() { }
  lat: string;
  lng: string;

  m: any;

  zoomLevel = 2;

  panning = true;

  ngOnInit() {
    this.m = {};
  }

  autoCompleteCallback1(selectedData: any) {
    console.log(selectedData);
    this.lat = selectedData.geometry.location.lat;
    this.lng = selectedData.geometry.location.lng;
    this.zoomLevel = 18;
    this.m['lat'] = selectedData.geometry.location.lat;
    this.m['lng'] = selectedData.geometry.location.lng;
    this.location.controls.location_name.setValue(selectedData.name);
    this.setLatLng();
  }

  // google maps zoom level
  zoom: number = 8;

  setLatLng() {
    this.location.controls.map_lat.setValue(this.m.lat);
    this.location.controls.map_lng.setValue(this.m.lng);
  }

  mapClicked(event) {
    console.log(event.coords.lat + " " + event.coords.lng);
    this.m.lat = event.coords.lat;
    this.m.lng = event.coords.lng;
    this.setLatLng();
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
    this.setLatLng();
  }
}
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

