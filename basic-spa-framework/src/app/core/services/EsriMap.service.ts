import { Injectable } from '@angular/core';
import EsriMap from '@arcgis/core/Map';
import Map from '@arcgis/core/Map';
import Basemap from '@arcgis/core/Basemap';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point';
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol.js";
import { jsPDF } from "jspdf";


@Injectable({
  providedIn: 'root'
})
export class EsriMapService {
  public view: MapView | null = null;
  public map: Map;
  private graphicsLayer: GraphicsLayer; // Now it's not initialized here
  private initialCenter: Point;
  private initialZoom: number;

  private pendingPoints: Array<{ longitude: number, latitude: number }> = [];

  constructor() {
    this.graphicsLayer = new GraphicsLayer(); // Initialize in the constructor
    this.initialCenter = new Point({ // Establece el centro inicial aquí
      longitude: -73.1198,
      latitude: 7.11392
    });
    this.initialZoom = 17;
  }

  public captureAndViewMapImage(): void {
    if (!this.view) {
      console.error('La vista del mapa no está inicializada.');
      return;
    }

    // Captura la vista actual del mapa
    this.view.takeScreenshot({ format: "png" }).then((screenshot) => {
      // Crea un elemento de enlace para descargar
      const link = document.createElement("a");
      link.download = "mapa_capturado.png";
      link.href = screenshot.dataUrl;
      link.click();
      link.remove();
    }).catch(err => {
      console.error('Error al capturar la imagen del mapa:', err);
    });
  }

  public captureMapAsPDF(): void {
    if (!this.view) {
      console.error('La vista del mapa no está inicializada.');
      return;
    }

    this.view.takeScreenshot({ format: "png" }).then((screenshot) => {
      // Crear una instancia de jsPDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [screenshot.data.width, screenshot.data.height]
      });

      // Añadir la imagen al PDF
      pdf.addImage(screenshot.dataUrl, 'PNG', 0, 0, screenshot.data.width, screenshot.data.height);

      // Guardar el PDF
      pdf.save("mapa_capturado.pdf");
    }).catch(err => {
      console.error('Error al capturar la imagen del mapa:', err);
    });
  }

  async initializeMap(containerId: string): Promise<MapView> {
    this.map = new EsriMap({
      basemap: 'satellite'
    });

    const mapView = new MapView({
      container: containerId,
      map: this.map,
      zoom: this.initialZoom,
      center: this.initialCenter
    });

    this.view = mapView;

    await mapView.when();

    this.view.map.add(this.graphicsLayer); // Add the graphics layer to the map

    this.view.watch('extent', () => {
      this.loadPendingPoints();
    });

    return mapView; // Make sure to return the mapView here
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

    // console.log(longitude,latitude )
      // Center the view at the point and zoom to an appropriate level
       this.view.goTo({
         center: point,
         zoom: 14 // or any other zoom level you find appropriate
       }).catch((error: any) => {
         console.error('Error al centrar el mapa en el punto:', error);
       });

    if (this.isPointInView(point)) {
      this.createAndAddGraphic2(point);
    } else {
      this.pendingPoints.push({ longitude, latitude });
    }
  }

  private createAndAddGraphic(point: Point): void {
    // Define a symbol
    const simpleMarkerSymbol = {
      type: 'simple-marker',
      style: 'circle',
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

  private createAndAddGraphic2(point: Point): void {
    // Define a symbol for the circle
    const circleSymbol = {
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      style: 'circle',
      color: [0, 0, 0, 0], // RGBA color format, here it's transparent
      size: "20px", // size of the circle
      outline: { // outline/stroke of the circle
        color: [0, 0, 0], // black outline
        width: 1
      }
    };

    // Define a symbol for the center point
    const centerPointSymbol = {
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      style: 'circle',
      color: [0, 0, 0], // black color for the center point
      size: "5px" // smaller size for the center point
    };

    // Create a graphic for the circle
    const circleGraphic = new Graphic({
      geometry: point,
      symbol: circleSymbol
    });

    // Create a graphic for the center point
    const centerPointGraphic = new Graphic({
      geometry: point,
      symbol: centerPointSymbol
    });

    // Add the graphics to the layer
    this.graphicsLayer.add(circleGraphic);
    this.graphicsLayer.add(centerPointGraphic);
  }


  private isPointInView(point: Point): boolean {
    return this.view.extent.contains(point);
  }

  public addSinglePoint(longitude: number, latitude: number): void {
    if (!this.view || longitude == undefined || latitude == undefined) {
      console.error('La vista del mapa no está inicializada o las coordenadas no están definidas.');
      return;
    }

    // Create a point
    const point = new Point({
      longitude: longitude,
      latitude: latitude
    });

    this.view.center = point;

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

    // Create a graphic
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });

    this.graphicsLayer.removeAll();
    // Add the graphic to the layer
    this.graphicsLayer.add(pointGraphic);

    // Center the view at the point and zoom to an appropriate level
    this.view.goTo({
      center: point,
      zoom: 18 // or any other zoom level you find appropriate
    }).catch((error: any) => {
      console.error('Error al centrar el mapa en el punto:', error);
    });
  }

  public resetMapView(): void {
    if (!this.view) {
      console.error('La vista del mapa no está inicializada.');
      return;
    }

    // Restablece la vista del mapa a los valores iniciales
    this.graphicsLayer.removeAll();
    this.view.goTo({
      center: this.initialCenter,
      zoom: this.initialZoom
    }).catch((error: any) => {
      console.error('Error al restablecer la vista del mapa:', error);
    });
  }

  private loadPendingPoints(): void {
    this.pendingPoints = this.pendingPoints.filter(pendingPoint => {
      const point = new Point({
        longitude: pendingPoint.longitude,
        latitude: pendingPoint.latitude
      });

      if (this.isPointInView(point)) {
        this.createAndAddGraphic2(point);
        return false;
      }

      return true;
    });
  }

  changeBasemap(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const basemap = selectElement.value;
    if (this.map) {
      this.map.basemap = Basemap.fromId(basemap); // This converts a string ID to a Basemap instance.
    }
  }

}



