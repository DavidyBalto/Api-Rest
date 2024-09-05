const express = require('express')
const cors = require('cors')

const serv = express()
// Se puede usar abreviarturas a un metodo que se vaya a usar mucho cono expres()
// Ejemplo ObtenerElemento= document.getEleentById() asi cada que quiera un elemento por id usaria
// Obtener Elemento(Id) Y NO document.getEleentById() mas corto mas facil y yo entiendo :3
const Datos = require('./Datos.json') // En claissic JS se puede importar json sin exportar o cosas raras

const Crypto = require('node:crypto')
const { Validar, ValidarOpcional } = require('./Esquemas/Validador')

// Nota>>> Req.params otiene los parametros obligatorios de url osea :valor del dato
// Mientras Req.querry obtiene parametros opcionales ?variable=valor que afectaran
// a como se envia la info por ejemplo
// Se pueden juntar una req.param :1234 con un req.querry :1234?orden=mmenormayor

const PORT = process.env.PORT ?? 1234

// disable the header x-powered bye express para que no moleste :3
serv.disable('x-powered-by')

// Middelware: se ejecuta si o si antes de revisar la url tiene muchos usos que nose :v
// Una arrow function "()=>" Se usa para que cuando se comprete determinada accion o funcion
// Se ejecute otra funcion despues y asi no toca hacer referencia :).
serv.use(express.json())
serv.use(cors())
/* serv.use(cors({
  origin: (origin, callback) => {
    const ValidatePorts = [
      'http://127.0.0.1:3000/Web/Index.html',
      'http://Produccion.com',
      'Ya no me se mas ips.com'
    ]
    if (ValidatePorts.includes(origin)) return callback(null, true)
    if (!origin) return callback(null, true)

    return callback(new Error('Not allowed by CORS'))
  }
}
)) */

serv.get('/person', (req, res) => {
  const { contactInfo } = req.query
  // Esto fucniona para encontrar si hay un valor en comun de un array en caso de
  // no ser array quitariamo el some y dejariamos la logica del some
  if (contactInfo) {
    const person = Datos.filter(
      p => p.contactInfo.some(na => na.toLowerCase() === contactInfo.toLowerCase())
    )
    return res.json(person)
  }
  res.json(Datos)
})
serv.get('/person/:firstName', (req, res) => {
  const { firstName } = req.params
  // Find es un metodo que se aplica a arrays en este caso, este metodo devuelve
  // el primer resultado que coincida en base a un callback
  // Esta funcion se ejecuta cada x numero de elemetos en el array en base a una
  // comparacion
  const person = Datos.find(personas => personas.firstName === firstName)
  if (person) return res.json(person)

  res.status(404).json({ mesage: 'no hay tu pinche persona' })
})

serv.post('/person', (req, res) => {
  const DateValidado = Validar(req.body)
  if (DateValidado.error) {
    return res.status(402).json({ error: JSON.parse(DateValidado.error.message) })
  }

  const newPerson = {
    id: Crypto.randomUUID(),
    ...DateValidado
  }
  Datos.push(newPerson)
  res.status(201).json(newPerson) // ni idea :v
})

serv.patch('/person/:firstname', (req, res) => {
  const { firstname } = req.params
  const PersonIndex = Datos.findIndex(p => p.firstName === firstname)

  if (PersonIndex === -1) return res.status(404).json({ mesage: 'No hay tu pishi persona' })

  const PersonValidate = ValidarOpcional(req.body)
  if (!PersonValidate.success) return res.status(404).json({ error: JSON.parse(PersonValidate.error.mesage) })

  const PersonAct = {
    ...Datos[PersonIndex],
    ...PersonValidate.data
  }
  Datos[PersonIndex] = PersonAct
  return res.status(201).json(PersonAct)
})

serv.delete('/person/:firstName', (req, res) => {
  const { firstName } = req.params
  const PersonIndex = Datos.findIndex(p => p.firstName === firstName)
  if (PersonIndex === -1) return res.status(404).json({ mesage: 'No hay persona' })

  Datos.slice(PersonIndex, 1)
  return res.status(201).json({ mesage: 'Person deleted' })
})
// Serv.use al final para error 404 en caso de no exitir url o
// metodo de dicha url (post,put, ni se que mas).
serv.use((req, res) => {
  res.status(404).send('<p>Url invalida</p>')
})

// Crea un servidor que escucha en X puerto se puede usar un callback para saber la ruta
serv.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}`)
})
