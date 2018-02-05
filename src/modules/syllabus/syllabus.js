/**
 * Syllabus (Module)
 * Módulo encargado de manejar las clases específicas
 * @export
 * @class Syllabus
 */
export class Syllabus {
  /**
   * Se encarga del enrutamiento dentro de la aplicación
   * @param {any} config - Configuración de la aplicación
   * @param {any} router - Enrutador principal de la aplicación
   */
  configureRouter (config, router) {
    config.title = 'UFPS Training Center'
    config.map([
      {
        route: '',
        name: 'syllabus',
        moduleId: 'modules/syllabus/home-syllabus/home-syllabus',
        settings: {
          roles: ['coach', 'student']
        }
      },
      {
        name: 'SyllabusDetail',
        route: 'clases/:id',
        moduleId: 'modules/problems/syllabus-detail/syllabus-detail',
        settings: {
          roles: ['coach', 'student']
        }
      }
    ])
    this.router = router
  }
}
