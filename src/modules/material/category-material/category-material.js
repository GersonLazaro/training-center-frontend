import { Router } from 'aurelia-router'

import { MESSAGES } from 'config/config'
import { Material } from 'models/models'
import { Alert, Auth, Materials } from 'services/services'

/**
 * CategoryMaterial (Module)
 * Módulo encargado de mostrar el material que hace parte de una categoría
 * @export
 * @class CategoryMaterial
 */
export class CategoryMaterial {
  /**
   * Método que realiza inyección de las dependencias necesarias en el módulo.
   * Estas dependencias son cargadas bajo el patrón de diseño singleton.
   * @static
   * @returns Array con las dependencias a inyectar: Servicio de notificaciones (Alert),
   * servicio de backend de material (Material), servicio de Router (Router)
   */
  static inject () {
    return [Alert, Auth, Materials, Router]
  }

  /**
   * Crea una instancia de CategoryMaterial.
   * @param {service} alertService - Servicio de notificaciones
   * @param {service} authService - Servicio de autenticación y validación
   * @param {material} materialService - Servicio de material
   * @param {service} routerService - Servicio de enrutamiento
   */
  constructor (alertService, authService, materialService, routerService) {
    this.alertService = alertService
    this.authService = authService
    this.materialService = materialService
    this.routerService = routerService
    this.materials = []
    this.newMaterial = new Material()
    this.noProblemsToShow = 7
    this.sortDisplay = 'Id'
    this.byDisplay = 'Ascendente'
    this.page = 1
    this.totalPages = 1
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
    this.newMaterial.category = this.id
    this.getMaterial()
  }

  /**
   * Obtiene la lista de materiales según los parametros indicados.
   */
  getMaterial () {
    this.materialService.getCategoryMaterial(this.id, this.page, this.noProblemsToShow, (this.sortDisplay === 'Nombre') ? 'name' : undefined, (this.byDisplay === 'Ascendente' ? 'asc' : 'desc'))
      .then(data => {
        this.materials = []
        this.category = data.meta.categoryName
        this.totalPages = data.meta.totalPages
        for (let i = 0; i < data.data.length; i++) {
          this.materials.push(new Material(data.data[i].id, data.data[i].name))
        }
        this.setPagination()
      }).catch(error => {
        if (error.status === 404) {
          this.alertService.showMessage(MESSAGES.materialDoesNotExist)
        } else {
          this.alertService.showMessage(MESSAGES.serverError)
        }
      })
  }

  createMaterial () {
    this.materialService.createMaterial(this.newMaterial)
      .then(data => {
        this.alertService.showMessage(MESSAGES.addedMaterial)
        this.getMaterial()
        window.$('#new-material').modal('hide')
      }).catch(() => {
        this.alertService.showMessage(MESSAGES.serverError)
        window.$('#new-material').modal('hide')
      })
  }

  /**
   * Establece un nuevo criterio de ordenamiento y obtiene los materiales bajo este criterio.
   * @param {String} sort - Criterio de ordenamiento (Nombre o Id)
   */
  setSort (sort) {
    this.sortDisplay = sort
    this.getMaterial()
  }

  /**
   * Establece una nueva dirección de ordenamiento y obtiene los materiales bajo esta dirección.
   * @param {String} sort - Dirección de ordenamiento (Ascendente o Descendente)
   */
  setBy (by) {
    this.byDisplay = by
    this.getMaterial()
  }

  /**
   * Establece una nueva cantidad de materiales y obtiene esa cantidad.
   * @param {Number} number - Cantidad de materiales a obtener.
   */
  setNoProblemsToShow (number) {
    this.noProblemsToShow = number
    this.getMaterial()
  }

  /**
   * Establece la paginación de los materiales en la parte inferior.
   */
  setPagination () {
    this.pagination = []
    if (this.page === this.totalPages && this.page - 4 > 0) {
      this.pagination.push(this.page - 4)
      this.pagination.push(this.page - 3)
    } else if (this.page + 1 === this.totalPages && this.page - 3 > 0) {
      this.pagination.push(this.page - 3)
    }
    if (this.page > 2) {
      this.pagination.push(this.page - 2)
    }
    if (this.page > 1) {
      this.pagination.push(this.page - 1)
    }
    this.pagination.push(this.page)
    while (this.pagination.length < 5 && this.pagination[this.pagination.length - 1] < this.totalPages) {
      this.pagination.push(this.pagination[this.pagination.length - 1] + 1)
    }
  }

  /**
   * Muestra la primera página de materiales en una categoría
   */
  goToFirstPage () {
    this.goToPage(1)
  }

  /**
   * Muestra la última página de materiales en una categoría.
   */
  goToLastPage () {
    this.goToPage(this.totalPages)
  }

  /**
   * Muestra la página anterior a la actual de materiales en una categoría.
   */
  goToPrevPage () {
    if (this.page > 1) {
      this.goToPage(this.page - 1)
    }
  }

  /**
   * Muestra la página de materiales siguiente a la actual en una categoría.
   */
  goToNextPage () {
    if (this.page < this.totalPages) {
      this.goToPage(this.page + 1)
    }
  }

  /**
   * Muestra una página especifica de materiales en una categoría.
   * @param {any} page - Página a mostrar
   */
  goToPage (page) {
    if (page !== this.page) {
      this.page = page
      this.getMaterial()
    }
  }
}
