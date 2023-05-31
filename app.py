from sqlite3.dbapi2 import DatabaseError
from typing import Container
from flask import Flask, render_template, request, redirect, url_for, flash
from flask import jsonify
import datetime
import json
import sqlite3

from flask.sessions import NullSession

class Mensaje:
    mensaje = ''

#bases de datos
# SQLite 
codigo = 0
entra = False
rutaDb = 'data/tareas.db'

#Tabla de usuarios
conexion= sqlite3.connect(rutaDb)
try: 
    conexion.execute("""
                create table usuarios(
                    codigo integer primary key autoIncrement,
                    correo text unique not null,
                    contraseña text not null,
                    nombre text not null
                )
    """)
    conexion.execute("""
                create table datos(
                    codigo integer not null,
                    fecha timestamp not null,
                    tipo text not null, 
                    origen text, 
                    descripcion text,
                    valor integer not null
                )
    """)
    print("se creo las tablas")
except sqlite3.OperationalError:
    print("La tabla ya existe")
conexion.close()

# inicializacion
app = Flask(__name__)

@app.route('/')
def Index():      
    
    
    return render_template('index.html')

@app.route('/inicio', methods=['POST'])
def iniciarSesion():
    if request.method == 'POST':
        correo = request.form['correo']
        contraseña = request.form['contraseña']

        database = sqlite3.connect(rutaDb)
        cur = database.cursor()
        cur.execute("select codigo, correo, contraseña from usuarios where correo=?",(correo,))
        fila = cur.fetchone()
        if fila != None:
            if fila[1]==correo:
                if fila[2]==contraseña:
                    global codigo
                    codigo = fila[0]
                    database.commit()
                    cur.close() 
                    global entra
                    entra = True
                    return jsonify("si")
                else:
                    database.commit()
                    cur.close() 
                    return jsonify("la contraseña es incorrecta")
        database.commit()
        cur.close() 
        return jsonify("El correo no existe")   
    return jsonify(message = 'Error en add')
    
@app.route('/registro', methods=['POST'])
def agregarRegistro():
    if request.method == 'POST':
        correo = request.form['correo']
        contraseña = request.form['contraseña']
        nombre = request.form['nombre']

        database = sqlite3.connect(rutaDb)
        cur = database.cursor()
        cur.execute("select correo from usuarios where correo=?",(correo,))
        fila = cur.fetchone()
        if fila!=None:
            database.commit()
            cur.close() 
            return jsonify("el correo ya existe")
        else:
            cur.execute("INSERT INTO "+ "usuarios" +" (correo, contraseña, nombre ) VALUES (?,?,?)", (correo, contraseña, nombre))
            
        database.commit()
        cur.close()      
        print("entra")
        return jsonify("si")
    return jsonify(message = 'Error en add')

@app.route('/finanzas', methods=['POST'])
def agregarFinanza():
    if request.method == 'POST':
        fecha=datetime.datetime.now()
        tipo = request.form['tipo']
        origen = request.form['origen']
        descripcion = request.form['descripcion']
        valor=request.form['valor']
        database = sqlite3.connect(rutaDb)
        cur = database.cursor()
        cur.execute("INSERT INTO "+ "datos" +" (codigo, fecha, tipo, origen, descripcion, valor ) VALUES (?,?,?,?,?,?)", (int(codigo), fecha, tipo, origen, descripcion,int(valor)))
        database.commit()
        cur.close()
        return jsonify(message = 'Datos añadidos satiscaftoriamente')
    return jsonify(message = 'Error al añadir')
    
@app.route('/tabla/<orden>')
def readTasks(orden):
    database = sqlite3.connect(rutaDb)
    cur = database.cursor()
    cur.execute("SELECT * FROM datos where codigo=? ORDER BY "+orden,(codigo,))
    data = cur.fetchall()
    cur.close()
    listado = []
    for registro in data:
        t = {"codigo":registro[0], "fecha":registro[1], "tipo":registro[2], "origen": registro[3], "descripcion": registro[4], "valor": registro[5]}
        listado.append(t)
    mensaje = {"records":listado}
    return jsonify(mensaje)

@app.route('/porcentajes')
def porcentaje():
    database = sqlite3.connect(rutaDb)
    cur = database.cursor()
    cur.execute("select tipo, valor from datos where codigo=?",(codigo,))
    data = cur.fetchall()
    cur.close()
    listado = []
    gastos = 0
    ingresos = 0
    for registro in data:
        if registro[0] == 'gasto':
            gastos = gastos+registro[1]
        else : 
            ingresos = ingresos+registro[1]
    t = {"ingresos":ingresos, "gastos":gastos}
    listado.append(t)
    mensaje = {"records":listado}
    return jsonify(mensaje)
    
@app.route('/cerrarSesion', methods=['POST'])
def cerrarSesion():
        if request.method == 'POST':
            global codigo
            global entra
            entra = False
            codigo = int(request.form['codigo'])
            return jsonify("cerro sesión")
    

@app.route('/datos')
def datos():
    if (entra == True):
        return render_template('index1.html')
    else:
        return render_template('index.html')


# inicio de la app
if __name__ == "__main__":
    app.run(port=8080, debug=True)
