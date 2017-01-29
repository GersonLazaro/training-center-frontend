import { API } from 'config/config'
import { Http } from 'services/http'
import { Jwt } from 'services/jwt'

/**
 * Auth (Service)
 * Servicio de autenticación y registro
 * @export
 * @class Auth
 */
export class Auth {

  /**
   * Método que realiza inyección de las dependencias necesarias en el servicio.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de conexión Http (Http),
   * servicio de manejo de Json Web Tokens (Jwt)
   */
  static inject () {
    return [Http, Jwt]
  }

  /**
   * Crea una instancia de Auth.
   * @param {service} httpService - Servicio para conexiones http
   * @param {service} jwtService - Servicio para manejo de Json Web Tokens (jwt)
   */
  constructor (httpService, jwtService) {
    this.httpService = httpService
    this.jwtService = jwtService
  }
  /**
   * Envia al servidor los datos de inicio de sesión, y retorna el token de usuario si el login
   * es válido.
   * @param {UserLogIn} user - Usuario del tipo userLogin con email y password
   * @returns - Promise con el token de usuario
   */
  auth (user) {
    return this.httpService.httpClient
      .fetch(API.endponts.auth, {
        method: 'post',
        body: JSON.stringify(user)
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Envia un estudiante para ser registrado en la plataforma
   * @param {UserSignIn} user - Datos del usuario a ser registrado en la plataforma
   * @returns Promise sin body, donde el status code indica el resultado de la operación
   */
  registerStudent (user) {
    return this.httpService.httpClient
      .fetch(API.endponts.users, {
        method: 'post',
        body: JSON.stringify(user)
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Envia un correo para solicitar un cambio de contraseña. Si el correo está registrado
   * Se enviará un mensaje a esa dirección para proceder con el cambio.
   * @param {string} email - Correo que solicita el cambio
   * @returns Promise sin body, donde el status code indica el resultado de la operación
   */
  requestRecovery (email) {
    return this.httpService.httpClient
      .fetch(API.endponts.recovery, {
        method: 'get',
        body: {email: email}
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Verifica que el token de cambio de contraseña es valido.
   * @param {string} token - token enviado por email
   * @returns Promise con cuerpo {email: email} en caso de ser exitoso.
   */
  validateReset (token) {
    return this.httpService.httpClient
      .fetch(API.endponts.reset, {
        method: 'post',
        body: {token: token}
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Envía los datos de un usuario para reestablecer su contraseña
   * @param {userReset} user - Usuario cuya contraseña será reestablecida
   * @returns Promise sin body, donde el status code indica el resultado de la operación
   */
  resetPassword (user) {
    return this.httpService.httpClient
      .fetch(API.endponts.reset, {
        method: 'PATCH',
        body: JSON.stringify(user)
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Inicia sesión guardando el token en el almacenamiento local del usuario.
   * @param {string} token - Token para almacenar
   */
  login (token) {
    this.jwtService.save(token)
  }

  /**
   * Cierra una sesión de usuario en la plataforma.
   */
  logout () {
    this.jwtService.remove()
  }

  /**
   * Informa si el usuario se encuentra actualmente autenticado (tiene una sesión activa)
   * @returns boolean - true si está autenticado, false en caso contrario
   */
  isAuthenticated () {
    return this.jwtService.tokenExists()
  }

  /**
   * Informa si el usuario es un estudiante.
   * @returns boolean - true si es estudiante, false en caso contrario
   */
  isStudent () {
    return this.jwtService.getUserType() === 'student'
  }

  /**
   * Informa si el usuario es un coach.
   * @returns boolean - true si es coach, false en caso contrario
   */
  isCoach () {
    return this.jwtService.getUserType() === 'coach'
  }

  /**
   * Informa si el usuario es un administrador.
   * @returns boolean - true si es administrador, false en caso contrario
   */
  isAdmin () {
    return this.jwtService.getUserType() === 'admin'
  }

  /**
   * Informa si el usuario es un visitante (no autenticado).
   * @returns boolean - true si es visitante, false en caso contrario
   */
  isVisitor () {
    return this.jwtService.getUserType() === 'visitor'
  }
}
