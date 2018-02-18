import { Problem } from './problem'
/**
 * Assignment (Model)
 * Modelo de tareas.
 * @export
 * @class Assignment
 */
export class Assignment {
  /**
   * Inicializa una tarea
   * @param {string} title - Nombre de la tarea
   * @param {string} description - Descripción de la tarea
   * @param {stringdate} startDate - Fecha de apertura de la tarea
   * @param {stringdate} endDate - Fecha de cierre de la tarea
   * @param {array} problems - Array con el id de los problemas de la tarea
   * @param {number} syllabusId - Identificador del syllabus al que pertenece la tarea
   * @param {number} id - Idetificador de la tarea
   */
  constructor (title, description, startDate, endDate, problems, syllabusId, id) {
    this.title = title
    this.description = description
    this.startDate = startDate
    this.endDate = endDate
    this.problems = problems
    this.syllabusId = syllabusId
    this.id = id
  }

  /**
   * Añade problemas completos (no solo el id) a la tarea.
   * @param {Array} problems - vector con los problemas a añadir.
   */
  adjuntProblems (problems) {
    this.problemsLoaded = []
    for (let i = 0; i < problems.length; i++) {
      this.problemsLoaded.push(new Problem(problems[i].id, problems[i].title_en, problems[i].title_es, problems[i].level))
    }
  }

  /**
   * Elimina un problema de problemsLoaded.
   * @param {number} id - Identificador del problema a eliminar.
   */
  removeProblem (id) {
    for (let i = 0; i < this.problemsLoaded.length; i++) {
      if (this.problemsLoaded[i].id === id) {
        this.problemsLoaded.splice(i, 1)
        break
      }
    }
  }
}
