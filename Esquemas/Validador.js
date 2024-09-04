const z = require('zod')

const Esquema = z.object({
  firstName: z.string({
    invalid_type_error: 'Pon el primer nombre vago',
    required_error: 'Primer nombre requerido'
  }).max(20, { message: 'No creo que tu nombre sea tan grande' }),
  lastName: z.string().max(20, { message: 'No creo que tu nombre sea tan grande' }),
  birthDate: z.string(),
  contactInfo: z.array(z.string()).min(2, { message: 'Se requieren minimo 2 datos de contacto' }),
  address: z.array(z.string()).min(3, { message: 'Se requieren minimo 2 datos de correo' })
})

function Validar (Peticion) {
  return Esquema.safeParse(Peticion)
}
function ValidarOpcional (Peticion) {
  return Esquema.partial().safeParse(Peticion)
}

module.exports = {
  Validar,
  ValidarOpcional
}
