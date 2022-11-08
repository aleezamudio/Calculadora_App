import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'calculadoraApp';

  screen="";
  a:any;
  b:any;
  c:any;
  d:string="";
  e:string="";

  //variables para el historial
  contenedor:any;
  arrayOperaciones:any=[];
  arrayResultados:any=[];
  verOperaciones:any=[];
  mostrarStorage:any;
  buttonHistory:any;
  btnActive="text-rigth";
  calculadoraPos:any;
  historyPos:any;
  estiloPos1?:string;
  estiloPos2?:string;

  @ViewChild('mostrarOperaciones',{static:true}) mostrarOperaciones!:ElementRef;
  constructor(private renderer:Renderer2){
  }
  ngOnInit(): void {
    /* Verificacion de las variables del localstorage */
    this.verOperaciones=localStorage.getItem('operaciones') || [];
    /* Se crea el elemento del historial con las variables del storage */
    this.crearHtmlStorage();
  }
  //Operaciones de la calculadora
  enterValue(value:string){
    if( this.b == '+' || this.b == '-' || this.b == '*' || this.b == '/' ){
      this.d=this.d + value;
      this.screen=this.screen + value;
      this.c=this.d;
    }else{
      this.screen=this.screen + value;
      this.a=this.screen;
    }
  }
  condition(value:string){
    this.screen = this.screen + value;
    this.b=value;
  }
  clear(){
    this.screen="";
    this.a="";
    this.b="";
    this.c="";
    this.d="";
    this.e="";
  }
  result(){
    if(this.b=='+'){
      this.screen = `${this.screen} = ${(parseInt(this.a)+parseInt(this.c)).toString()}`;
      this.screen=(parseInt(this.screen)+parseInt(this.c)).toString();

      /* cargar al historial */
      const operacion = `${this.a}${this.b}${this.c}`;
      const resultado = this.screen;
      this.crearHtml(operacion,resultado);
    }
    if(this.b=='-'){
      this.screen = `${this.screen} = ${(parseInt(this.a)-parseInt(this.c)).toString()}`;
      this.screen=(parseInt(this.screen)-parseInt(this.c)).toString();
   
      /* cargar al historial */
      const operacion = `${this.a}${this.b}${this.c}`;
      const resultado = this.screen;
      this.crearHtml(operacion,resultado);
    }
    if(this.b=='*'){
      this.screen = `${this.screen} = ${(parseInt(this.a)*parseInt(this.c)).toString()}`;
      this.screen=(parseInt(this.screen)*parseInt(this.c)).toString();
    
      /* cargar al historial */
      const operacion = `${this.a}${this.b}${this.c}`;
      const resultado = this.screen;
      this.crearHtml(operacion,resultado);
    }
    if(this.b=='/'){
      this.screen = `${this.screen} = ${(parseInt(this.a)/parseInt(this.c)).toString()}`;
      this.screen=(parseInt(this.screen)/parseInt(this.c)).toString();
    
      /* cargar al historial */
      const operacion = `${this.a}${this.b}${this.c}`;
      const resultado = this.screen;
      this.crearHtml(operacion,resultado);
    }
    this.clear();
  }

  //creacion del historial mediante el DOM

  crearHtml(operacion:string,resultado:string){
    const mostrar ={
      operacion,
      resultado
    }
    const containerCard=document.createElement('div');
    const verOperacion=document.createElement('p');
    const verResultado=document.createElement('p');

    containerCard.classList.add('containerCard');
    verOperacion.classList.add('operation');
    verResultado.classList.add('resultOperation');

    containerCard.appendChild(verOperacion);
    containerCard.appendChild(verResultado);

    this.renderer.appendChild(this.mostrarOperaciones.nativeElement, containerCard);

    this.contenedor = containerCard;

    this.arrayOperaciones= [...this.arrayOperaciones, mostrar];
     
    this.arrayOperaciones.forEach((element:any)=>{
      
      this.contenedor.querySelector('.operation').innerText=element.operacion  ;
      this.contenedor.querySelector('.resultOperation').innerText = element.resultado;
     })
     this.sincronizarLocalStorage();
  } 
  sincronizarLocalStorage(){
    localStorage.setItem('operaciones', JSON.stringify(this.arrayOperaciones));
  }

  crearHtmlStorage(){
    if(this.verOperaciones.length > 0){
      const containerCard=document.createElement('div');
      const verOperacion=document.createElement('p');
      const verResultado=document.createElement('p');

    containerCard.classList.add('containerCard');
    verOperacion.classList.add('operation');
    verResultado.classList.add('resultOperation');

    containerCard.appendChild(verOperacion);
    containerCard.appendChild(verResultado);

    this.renderer.appendChild(this.mostrarOperaciones.nativeElement, containerCard);

    this.contenedor = containerCard;

    this.arrayResultados=JSON.parse(this.verOperaciones);

    this.arrayResultados.forEach((element:any)=> {
      this.crearHtml(element.operacion,element.resultado)
    })
    }
  }
  limpiar(){
    if(this.arrayOperaciones.length > 0){
      Swal.fire({

        icon:'question',
        title:'¿Desea limpiar el historial?',
        showCancelButton:true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Aceptar',
        allowOutsideClick:false
      }).then((result)=>{
        localStorage.removeItem('operaciones');
        Swal.fire({
          icon:'success',
          title:'El historial se limpio correctamente',
          confirmButtonText:'Aceptar'
        }).then((result)=>{
          if(result.value){
            location.reload();
          }
        })
      })
    }else{
      Swal.fire({
        icon:'info',
        title:'EL historial esta limpio'
      })
    }
  }
}
