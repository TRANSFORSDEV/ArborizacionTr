import { Component, OnInit, OnDestroy, ElementRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { EsriMapService } from 'src/app/core/services/EsriMap.service';

@Component({
  selector: 'app-esri-map',
  template: '',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `],
  host: { id: 'mapViewNode' }
})
export class EsriMapComponent implements OnInit, OnDestroy {

  constructor(private esriMapService: EsriMapService, private elRef: ElementRef) {}

  async ngOnInit() {
    await this.esriMapService.initializeMap(this.elRef.nativeElement.id);
  }

  ngOnDestroy() {
    if (this.esriMapService.view) {
      this.esriMapService.view.container = null;
    }
  }
}
