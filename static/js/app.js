// Global Settings
let edit = false;

//var taskResult = document.querySelector('#task-result');
var divMensaje = document.getElementById('mensaje');

var btnInicio = document.getElementById('btnIniciar');
btnInicio.addEventListener("click", e => {
  e.preventDefault(); 

  const data = new FormData();
  data.append('correo', document.getElementById('CorreoI').value);
  data.append('contraseña', document.getElementById('ContraseñaI').value);
  

  fetch('inicio', {
    method: 'POST',
    body: data
  })
  .then((response) => {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
      mensaje = 'La respuesta no es un JSON \n' + response.text(); 
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
    mensaje = JSON.stringify(data);
    if(mensaje == '"si"'){
      //divMensaje.innerHTML = mensaje;
      document.getElementById('ContraseñaI').value =""
      document.getElementById('CorreoI').value = ""
      location.href= "datos";
    } else{
      document.write = alert(mensaje);
    }
    console.log(mensaje);
    //fetchTasks();  
  })
  .catch((error) => {
    mensaje = 'Hubo un problema con la petición Fetch en DATOS:' + error.message; 
    divMensaje.innerHTML = mensaje;
    console.log(mensaje);   
  });
})



var btnResgistrarse = document.getElementById('btnRegistrar');
btnResgistrarse.addEventListener("click", e => {
  
  e.preventDefault(); //Impedir que el enlace abra una URL refrescando la página
  if(document.getElementById('nombreR').value == "" || document.getElementById('correoR').value == "" || document.getElementById('contraseñaR').value == "")
  {
    alert("No se pueden dejar campos vacios.")
  }else{

  
  const data = new FormData();
  data.append('nombre', document.getElementById('nombreR').value);
  data.append('correo', document.getElementById('correoR').value);
  data.append('contraseña', document.getElementById('contraseñaR').value);
  
  

  fetch('registro', {
    method: 'POST',
    body: data
  })
  .then((response) => {    
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
      mensaje = 'La respuesta no es un JSON \n' + response.text(); 
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
    mensaje = JSON.stringify(data);
    if(mensaje == '"si"'){
        location.href= "#openModal"
        document.getElementById('nombreR').value=""
        document.getElementById('correoR').value=""
        document.getElementById('contraseñaR').value =""
    }
    //fetchTasks();  
  })
  .catch((error) => {
    mensaje = 'Hubo un problema con la petición Fetch en DATOS:' + error.message; 
    divMensaje.innerHTML = mensaje;
    console.log(mensaje);   
  });
  }
})

