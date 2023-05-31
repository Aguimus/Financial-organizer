console.log('Activado');
// Global Settings
let edit = false;
var codigo;
var matriz = new Array();
var btnRegistrar = document.getElementById('registrar');
var btnSalir = document.getElementById('btnSalir');

document.getElementById('grafico').style.opacity = 1;

filtro();

btnSalir.addEventListener("click", e => {
    const data = new FormData();
    a = "0";
    history.go(-1);
    data.append('codigo', a);
    fetch('cerrarSesion', {
        method: 'POST',
        body: data
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch(err => console.log(err))
})

btnRegistrar.addEventListener("click", e => {
    e.preventDefault();
    const data = new FormData();
    data.append('tipo', document.getElementById('tipo').value);
    data.append('origen', document.getElementById('origen').value);
    data.append('descripcion', document.getElementById('descripcion').value);
    data.append('valor', document.getElementById('valor').value);

    fetch('finanzas', {
        method: 'POST',
        body: data
    })
        .then((response) => {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                mensaje = 'La respuesta no es un JSON \n' + response.text();
                divMensaje.innerHTML = mensaje;
                //console.log(mensaje);
            }
        })
        .catch((error) => {
            mensaje = 'Hubo un problema con la petición Fetch en RESPONSE:' + error.message;
            //divMensaje.innerHTML = mensaje;
            console.log(mensaje);
        })
        .then((data) => {
            mensaje = JSON.stringify(data);
            //inserte codigo para recibir todos los datos de la tabla
            console.log(mensaje);

        })
        .catch((error) => {
            mensaje = 'Hubo un problema con la petición Fetch en DATOS:' + error.message;
            divMensaje.innerHTML = mensaje;
            console.log(mensaje);
        });
    document.getElementById('descripcion').value = "";
    document.getElementById('valor').value = "";
    filtro()
    location.reload();
})


function llegada(orden) {
    fetch('tabla/' + orden)
        .then((response) => {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                mensaje = 'La respouesta no es un JSON \n' + response.text();
                divMensaje.innerHTML = mensaje;
                console.log(mensaje);
            }
        })
        .catch((error) => {
            mensaje = 'Hubo un problema con la petición Fetch en RESPONSE:' + error.message;
            divMensaje.innerHTML = mensaje;
            console.log(mensaje);
        })
        .then((data) => {
            visualizarData(data);
        })
        .catch((error) => {
            mensaje = 'Hubo un problema con la petición Fetch en DATOS:' + error.message;
            console.log(mensaje);
        });
}

function porcentajes() {
    fetch('porcentajes')
        .then((response) => {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                mensaje = 'La respouesta no es un JSON \n' + response.text();
                divMensaje.innerHTML = mensaje;
                console.log(mensaje);
            }
        })
        .catch((error) => {
            mensaje = 'Hubo un problema con la petición Fetch en RESPONSE:' + error.message;
            divMensaje.innerHTML = mensaje;
            console.log(mensaje);
        })
        .then((data) => {
            mostrarP(data);
        })
        .catch((error) => {
            mensaje = 'Hubo un problema con la petición Fetch en DATOS:' + error.message;
            console.log(mensaje);
        });
}

function cambio() {
    var seleccion = document.getElementById('origen');
    if (document.getElementById('tipo').value == "gasto") {
        seleccion.innerHTML = `<option value="diversion">diversion</option>
    <option value="transporte">transporte</option>
    <option value="comida">comida</option>
    <option value="otros">otros</option>`;
    } else {
        seleccion.innerHTML = `<option value="sueldo">Sueldo</option>
    <option value="intereses">Intereses</option>
    <option value="otros">otros</option>`;
    }
}

function mostrarP(data) {
    const tasks = data.records;
    var ing
    var gas
    tasks.forEach(tasks => {
        ing = tasks.ingresos
        gas = tasks.gastos
    });

    var total = ing + gas;
    var ingresosP = (ing / total)*100
    var gastosP = (gas / total)*100
    var por = (gas / total) * 180;
    document.head.innerHTML = `
    <meta charset="UTF-8">
    <title>Gestor Financiero</title>
    <!-- BOOTSTRAP 4  -->
    <link rel="stylesheet" href="https://bootswatch.com/4/lux/bootstrap.min.css">  
    <style>
      .chart-skills {
          margin: 0 auto;
          padding: 0;
          list-style-type: none;
          opacity: 0;
      }
      
      .chart-skills *,
      .chart-skills::before {
          box-sizing: border-box;
      }

      .chart-skills {
          position: relative;
          width: 350px;
          height: 175px;
          overflow: hidden;
          opacity: 0;
      }
      
      .chart-skills::before,
      .chart-skills::after {
          position: absolute;
      }
      
      .chart-skills::before {
          content: '';
          width: inherit;
          height: inherit;
          border: 45px solid rgba(211, 211, 211, .3);
          border-bottom: none;
          border-top-left-radius: 175px;
          border-top-right-radius: 175px;
      }
      
      .chart-skills:target {
          opacity: 1;
          pointer-events: auto;
      }
      
      .chart-skills::after {
          content: 'Gastos/Ingresos';
          left: 50%;
          bottom: 10px;
          transform: translateX(-50%);
          font-size: 1.1rem;
          font-weight: bold;
          color: cadetblue;
      }
      
      .chart-skills li {
          position: absolute;
          top: 100%;
          left: 0;
          width: inherit;
          height: inherit;
          border: 45px solid;
          border-top: none;
          border-bottom-left-radius: 175px;
          border-bottom-right-radius: 175px;
          transform-origin: 50% 0;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          animation-fill-mode: forwards;
          animation-duration: .4s;
          animation-timing-function: linear;
      }
      
      .chart-skills li:nth-child(1) {
          z-index: 4;
          border-color: orange;
          animation-name: rotate-one;
      }
      
      .chart-skills li:nth-child(2) {
          z-index: 3;
          border-color: steelblue;
          animation-name: rotate-two;
          animation-delay: .4s;
      }
      
      .chart-skills span {
          position: absolute;
          font-size: .85rem;
          backface-visibility: hidden;
          animation: fade-in .4s linear forwards;
      }
      
      .chart-skills li:nth-child(1) span {
          top: 5px;
          left: 10px;
      }
      
      

      @keyframes rotate-one {
          100% {
              transform: rotate(` + por + `deg);
              /**
          * 12% => 21.6deg
          */
          }
      }
      
      @keyframes rotate-two {
          100% {
              transform: rotate(180deg);
              /**
              * 32% => 57.6deg 
              * 57.6 + 21.6 => 79.2deg
              */
          }
      }
      
      @keyframes fade-in {
          0%,
          90% {
              opacity: 0;
          }
          100% {
              opacity: 1;
          }
      }
      
      .chart-skills li:nth-child(2) span {
        top: 20px;
        left: 10px;
        transform: rotate(180deg);
        animation-delay: .4s;
    }
      
      </style>`

    document.getElementById("grafico").innerHTML = `
                                <li>
                                    <span>`+gastosP.toFixed(2)+`%</span>
                                </li>
                                <li>
                                    <span>`+ingresosP.toFixed(2)+`%</span>
                                </li>`
}

function visualizarData(data) {
    const tasks = data.records;
    let template = '';
    var i = 0;
    tasks.forEach(tasks => {
        matriz[i] = new Array(4);
        matriz[i][0] = tasks.fecha;
        matriz[i][1] = tasks.tipo;
        matriz[i][2] = tasks.origen;
        matriz[i][3] = tasks.descripcion;
        matriz[i][4] = tasks.valor;
        i++;
        template +=
            `<tr taskId ="${tasks.codigo}">
            <td> ${tasks.fecha} </td>
            <td> ${tasks.tipo} </td>
            <td> ${tasks.origen} </td>
            <td>${tasks.descripcion}</td>
            <td> ${tasks.valor} </td>
            </tr>`;
        codigo = tasks.codigo;
    });
    document.getElementById('tabla').innerHTML = template;
}

function filtro() {
    switch (document.getElementById('filtro').value) {
        case ('fecha'):
            llegada('fecha')
            porcentajes()
            break;
        case ('valor'):
            llegada('valor')
            porcentajes()
            break;
        case ('tipo'):
            llegada('tipo')
            porcentajes()
            break;
        case ('origen'):
            llegada('origen')
            porcentajes()
            break;
    }
}