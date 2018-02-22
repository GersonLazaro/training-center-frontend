import { inject } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Syllabus } from 'models/models'
import { Alert, Auth, Syllabuses } from 'services/services'

/**
 * SyllabusDetail (Module)
 * Módulo encargado de manejar el detalle de un syllabus
 * @export
 * @class SyllabusDetail
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth) y Servicio de obtención y manejo de clases (Syllabus)
@inject(Alert, Auth, Syllabuses)
export class SyllabusDetail {

  /**
   * Crea una instancia de SyllabusDetail.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación
   * @param {service} syllabusService - Servicio de obtención y manejo de clases
   */
  constructor (alertService, authService, syllabusService) {
    this.alertService = alertService
    this.authService = authService
    this.syllabusService = syllabusService
    this.syllabus = new Syllabus()
  }

  /**
   * Método que toma los parametros enviados en el link y configura la página para adaptarse
   * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
   * ejecuta automáticamente luego de lanzar el constructor.
   * @param {any} params
   * @param {any} routeConfig
   */
  activate (params, routeConfig) {
    this.routeConfig = routeConfig
    this.id = params.id
    this.getSyllabus()
  }

  /**
   * Lee los detalles del syllabus en la plataforma.
   */
  getSyllabus () {
    this.syllabusService.getSyllabus(this.id)
      .then(data => {
        console.log(data)
        this.syllabus = new Syllabus(data.syllabus.id, data.syllabus.tittle, data.syllabus.description, data.syllabus.public, undefined, true, data.syllabus.assignments)
      })
      .catch(error => {
        console.log(error)
        if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }
}
