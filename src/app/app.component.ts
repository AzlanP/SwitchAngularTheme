import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {Component, ElementRef, HostBinding, ViewChild} from '@angular/core'
import {OverlayContainer} from '@angular/cdk/overlay'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import { ColorHTML } from './enum'
import tinycolor from "tinycolor2";

const THEME_DARKNESS_SUFFIX = `-dark`;
export class Color {
  name: string;
  hex: string;
  fontColor: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'BIZUIT Dashboard'
  colors : Color[]= [];
  selectedColor: Color;
  @HostBinding('class') activeThemeCssClass: string


  isThemeDark = false
  activeTheme: string
  themes: string[] = [
    'bizuit',
    'deeppurple-amber',
    'indigo-pink',
    'pink-bluegrey',
    'purple-green',
    'blue-red'
  ]
  
  // For navigation (sidenav/toolbar). Isn't related to dynamic-theme-switching:
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  )
  
  // `breakpointObserver` is for navigation (sidenav/toolbar). Isn't related to dynamic-theme-switching:
  constructor(
    private breakpointObserver: BreakpointObserver,
    private overlayContainer: OverlayContainer,
  ) {
    this.getColors();
    // Set default theme here:
    this.setActiveTheme('bizuit', false)
  }
  
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol']
  dataSource = ELEMENT_DATA
  
  setActiveTheme(theme: string, darkness: boolean = null) {
    
    if (darkness === null)
      darkness = this.isThemeDark
    else if (this.isThemeDark === darkness) {
      if (this.activeTheme === theme) return
    } else
      this.isThemeDark = darkness
    
    this.activeTheme = theme
    
    const cssClass = darkness === true ? theme + THEME_DARKNESS_SUFFIX : theme
    
    const classList = this.overlayContainer.getContainerElement().classList
    if (classList.contains(this.activeThemeCssClass))
      classList.replace(this.activeThemeCssClass, cssClass)
    else
      classList.add(cssClass)
    
    this.activeThemeCssClass = cssClass
    
    
  }

  changeSidebarColor(color: Color){
    document.documentElement.style.setProperty('--theme--sidebar', color.hex);
  }
  getColors(){
 
    this.colors.push({ name: "default", hex: '#1e2a40', fontColor: 'white' });
    for (let prop in ColorHTML) {
      if(this.colors.findIndex(x=> x.name == prop || x.hex == ColorHTML[prop]) == -1){

        let aux = getColorObject(tinycolor(ColorHTML[prop]), "500");
        this.colors.push({ name: prop, hex: ColorHTML[prop], fontColor: aux.fontColor });
      }
    }
    this.changeSidebarColor(this.colors[0]);
  }
  
  toggleDarkness() {
    this.setActiveTheme(this.activeTheme, !this.isThemeDark)
  }
}

export interface PeriodicElement {
  name: string
  position: number
  weight: number
  symbol: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
]



function computeColors(hex: string): Color[] {

  return [
    getColorObject(tinycolor(hex), "500"),
    getColorObject(
      tinycolor(hex)
        .lighten(50)
        .saturate(30),
      "A100"
    ),
    getColorObject(
      tinycolor(hex)
        .lighten(30)
        .saturate(30),
      "A200"
    ),
    getColorObject(
      tinycolor(hex)
        .lighten(10)
        .saturate(15),
      "A400"
    ),
    getColorObject(
      tinycolor(hex)
        .lighten(5)
        .saturate(5),
      "A700"
    )
  ];
}

function getColorObject(value, name): Color {

  const c = tinycolor(value);
  return {
    name: name,
    hex: c.toHexString(),
    fontColor: c.isLight() ? 'black': 'white'
  };
}
