import {
  API
} from 'config/config'
import {
  Http
} from 'services/http'
import {
  Jwt
} from 'services/jwt'

/**
 * Problems (Service)
 * Servicio encargado del manejo de problemas y categorías
 * @export
 * @class Problems
 */
export class Problems {

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
   * Crea una instancia de Problems.
   * @param {service} httpService - Servicio de conexión Http (Http)
   * @param {service} jwtService - Servicio de manejo de Json Web Tokens (Jwt)
   */
  constructor (httpService, jwtService) {
    this.jwtService = jwtService
    this.httpService = httpService
  }

  /**
   * Obtiene del backend la lista de categorías existentes.
   * @returns {Promise} Promesa con el token de usuario
   */
  getCategories () {
    return this.httpService.httpClient
      .fetch(API.endponts.categories, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Crea una nueva categoría en la plataforma.
   * @param {string} name - Nombre de la categoría
   * @returns {Promise} Promesa sin body, para validar según el status.
   */
  createCategory (name) {
    return this.httpService.httpClient
      .fetch(API.endponts.categories, {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        },
        body: {
          name: name
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Edita el nombre de una categoría en la plataforma.
   * @param {number} id - Identificador de la categoría a editar.
   * @param {string} name - Nuevo nombre de la categoría.
   * @return {Promise} Promesa indicando el exito o fracaso de la operación.
   */
  editCategory (id, name) {
    return this.httpService.httpClient
      .fetch(API.endponts.categories + '/' + id, {
        method: 'put',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        },
        body: {
          id: id,
          name: name
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Elimina una categoría de la plataforma.
   * @param {number} id - Identificador de la categoría a eliminar.
   */
  removeCategory (id) {
    return this.httpService.httpClient
      .fetch(API.endponts.categories + '/' + id, {
        method: 'delete',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        },
        body: {
          id: id
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Obtiene la lista de problemas de una categoría específica. Como pueden ser muchos problemas,
   * el método realiza "paginación" permitiendo traer así solo un número determinado de problemas
   * según los parámetros establecidos.
   * @param {any} id - Identificador de la categoría a obtener
   * @param {number} [page=1] - Página de resultados a obtener
   * @param {number} [limit=10] - Cantidad de resultados a obtener
   * @param {string} [sort='id'] - Modo de ordenamiento (id o level)
   * @param {string} [by='asc'] - Ordenamiento ascendente o descendente (asc o desc)
   * @param {string} [filter=null] - Selecciona por un lenguaje (null, es o en)
   * @returns {Promise} Promesa con los problemas obtenidos
   */
  getCategoryProblems (id, page = 1, limit = 10, sort = 'id', by = 'asc', filter = null) {
    return this.httpService.httpClient
      .fetch(API.endponts.categoryProblems.replace('{1}', id), {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        },
        body: {
          page: page,
          limit: limit,
          sort: sort,
          by: by,
          filter: filter
        }
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }

  /**
   * Envia un nuevo problema en el servidor
   * @param {Problem} problem - Problema a subir en el servidor
   */
  createProblem (problem) {
    var data = new window.FormData()
    // Datos obligatorios
    data.append('category', problem.category)
    data.append('level', problem.level)
    data.append('example_input', problem.exampleInput)
    data.append('example_output', problem.exampleOutput)
    data.append('time_limit', problem.timeLimit)
    // Datos opcionales
    if (problem.titleEN !== undefined) data.append('title_en', problem.titleEN)
    if (problem.titleES !== undefined) data.append('title_es', problem.titleES)
    if (problem.descriptionEN !== undefined) data.append('description_en', problem.descriptionEN)
    if (problem.descriptionES !== undefined) data.append('description_es', problem.descriptionES)
    // Archivos
    data.append('input', problem.input)
    data.append('output', problem.output)
    return this.httpService.httpClient
      .fetch(API.endponts.problems, {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + this.jwtService.token
        },
        body: data
      })
      .then(this.httpService.checkStatus)
      .then(this.httpService.parseJSON)
  }
}
