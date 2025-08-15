import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Basemap from '@arcgis/core/Basemap';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer';
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils';
import { RequestStatus } from 'src/app/core/models/request-status.model';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol.js";
import { CensoArboreoService } from 'src/app/core/services/censoarboreo.service';
import { CoordenadaDto } from 'src/app/core/models/censoarboreo-dto.model';


@Component({
  selector: 'app-esri-map-selector',
  template: `
    <div style="height: 300px; position: relative;">
      <div id="viewDiv" style="height: 100%; width: 100%;"></div>
      <select (change)="changeBasemap($event)" style="position: absolute; top: 10px; left: 10px; z-index: 10;">
        <option value="satellite">Satellite</option>
        <option value="hybrid">Hybrid</option>
        <option value="streets">Streets</option>
        <option value="topo">Topographic</option>
        <option value="gray">Gray</option>
      </select>
    </div>
  `,
  styleUrls: []
})
export class EsriMapSelectorComponent implements OnInit, OnDestroy {

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number, elevation:number }>();
  view: MapView;
  map: Map;
  statusDetail: RequestStatus = 'init';
  listaCoordenadas:CoordenadaDto[]=[];

  private pendingPoints: Array<{ longitude: number, latitude: number }> = [];
  private graphicsLayer: GraphicsLayer;

  constructor(private censoService: CensoArboreoService) {
    this.graphicsLayer = new GraphicsLayer();
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.initializeMap(position.coords);
      },
      (error) => {
        console.error('Error al obtener la geolocalización:', error);
        // Inicializar el mapa con una ubicación por defecto
        this.initializeMap({ latitude: 7.1139, longitude: -73.1198 });
      }
    );
  }

  async getElevation(lat: number, lng: number): Promise<number> {
    const elevationLayer = new ElevationLayer({
      url: "https://elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain3D/ImageServer"
    });

    const point = new Point({
      latitude: lat,
      longitude: lng
    });

    // Convertir a Web Mercator para el servicio de elevación
    const webMercatorPoint = webMercatorUtils.geographicToWebMercator(point);

    try {

      const result = await elevationLayer.queryElevation(webMercatorPoint as __esri.Point);
      const pointGeometry = result.geometry as __esri.Point; // Hacer un casting a Point
      const elevation = pointGeometry.z; // Ahora puedes acceder a la propiedad z
      return elevation;
    } catch (error) {
      console.error('Error al obtener la elevación:', error);
      return null;
    }
  }

  async ngAfterViewInit() {
    this.getArbolesCiudad();
  }


  initializeMap(coords: { latitude: number; longitude: number }) {
    this.map = new Map({
      basemap: 'satellite'
    });

    this.view = new MapView({
      container: 'viewDiv',
      map: this.map,
      center: [coords.longitude, coords.latitude], // Usa la geolocalización para centrar el mapa
      zoom: 17
    });

    this.view.when(() => {

      this.addMarker(coords.latitude, coords.longitude);

      this.view.on('click', async (event) => {
        const lat = event.mapPoint.latitude;
        const lng = event.mapPoint.longitude;
        this.addMarker(lat, lng);
        const elevation = await this.getElevation(lat, lng);

        console.log(`Elevación en el punto seleccionado: ${elevation} metros`);

        this.locationSelected.emit({
          lat: lat,
          lng: lng,
          elevation: elevation
        });
      });
    });

    this.view.map.add(this.graphicsLayer);

    this.view.watch('extent', () => {
      this.loadPendingPoints();
    });

  }

  getArbolesCiudad() {
    this.statusDetail = 'loading';
    this.censoService.getAllCoordenadas(null,null,null).subscribe(
      result => {
        this.listaCoordenadas = result.data
        this.listaCoordenadas.forEach(coord => {
          this.addPoint(coord.longitud, coord.latitud);
        });
        this.statusDetail = 'init';
      }
    );
  }

  public addPoint(longitude: number, latitude: number): void {
    if (!this.view || longitude == undefined || latitude == undefined) {
      console.error('La vista del mapa no está inicializada o las coordenadas no están definidas.');
      return;
    }

    // Create a point
    const point = new Point({
      longitude: longitude,
      latitude: latitude
    });

    if (this.isPointInView(point)) {
      this.createAndAddGraphic(point);
    } else {
      this.pendingPoints.push({ longitude, latitude });
    }
  }

  addMarker(latitude: number, longitude: number) {
    const point = new Point({
      longitude: longitude,
      latitude: latitude
    });

    const marker = new Graphic({
      geometry: point,
      symbol: new SimpleMarkerSymbol({
        color: 'blue',
        size: '12px',
        outline: { color: 'white', width: 2 }
      })
    });

    this.view.graphics.removeAll();
    this.view.graphics.add(marker);
  }

  changeBasemap(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const basemap = selectElement.value;
    if (this.map) {
      this.map.basemap = Basemap.fromId(basemap); // This converts a string ID to a Basemap instance.
    }
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.destroy();
    }
  }

  private loadPendingPoints(): void {
    this.pendingPoints = this.pendingPoints.filter(pendingPoint => {
      const point = new Point({
        longitude: pendingPoint.longitude,
        latitude: pendingPoint.latitude
      });

      if (this.isPointInView(point)) {
        this.createAndAddGraphic(point);
        return false;
      }

      return true;
    });
  }

  private isPointInView(point: Point): boolean {
    return this.view.extent.contains(point);
  }

  private createAndAddGraphic(point: Point): void {
    // Define a symbol
    const simpleMarkerSymbol = {
      type: 'simple-marker',
      style: 'triangle',
      color: [0, 128, 0], // green
      outline: {
        color: [0, 0, 0], // black
        width: 1
      }
    };

    // Define a picture marker symbol
    const pictureMarkerSymbol = new PictureMarkerSymbol({
      url: "./assets/img/arbol2.png",  // URL de la imagen PNG
      width: "24px",  // Ancho del ícono
      height: "24px"  // Altura del ícono
    });

    // Create a graphic
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });

    // Add the graphic to the layer
    this.graphicsLayer.add(pointGraphic);
  }

}
