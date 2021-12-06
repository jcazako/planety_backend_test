/** Remove empty field from an object
 *
 * @param {*} obj
 */

export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value))
}

export class User {
  constructor(user) {
    this.id = user[0]
    this.data = user[1]
  }

  /** Merge the data from and other file/endpoint
   *
   * @param {[[string, {} ], ...]} endpointData data from an endpoint
   */

  mergeData(endpointData) {
    const userData = endpointData.find((data) => data[0] === this.id)
    if (userData) {
      this.data = { ...userData[1], ...this.data }
    }
    return this
  }

  /** Find and replace a property with data from an endpoint
   *
   * @param {string} property
   * @param {[[string, {} ], ...]} endpointData data from an endpoint
   */

  _findAndReplace(property, endpointData) {
    const userData = endpointData.find((data) => data[0] === this.id)
    if (userData && userData[1][property]) {
      this.data[property] = userData[1][property]
    }
    return this
  }

  /** Find and replace a property with data from an endpoint depending of its value
   *
   * @param {string} property
   * @param {string} value
   * @param {[[string, {} ], ...]} endpointData
   */

  checkProperty(property, value, endpointData) {
    if (this.data[property] === value) {
      this._findAndReplace(property, endpointData)
    }
    return this
  }

  /** Replace each character depending the map provided
   *
   * @param {string} property
   * @param {Map} syntaxMap
   */

  checkSyntax(property, syntaxMap) {
    syntaxMap.forEach((value, key) => {
      this.data[property] = this.data[property].replaceAll(key, value)
    })
    return this
  }

  /** Check the string format for a property
   *
   * @param {string} property
   */

  checkFormat(property) {
    if (!this.data[property]) {
      return this
    }
    this.data[property] =
      this.data[property].charAt(0).toUpperCase() +
      this.data[property].slice(1).toLowerCase()

    // Fix attribute if there is a dash in it
    const dash = this.data[property].indexOf('-')
    if (dash !== -1 && dash !== this.data[property].length - 1) {
      this.data[property] =
        this.data[property].slice(0, dash + 1) +
        this.data[property].charAt(dash + 1).toUpperCase() +
        this.data[property].slice(dash + 2)
    }
    return this
  }

  getUser() {
    return [this.id, removeEmpty(this.data)]
  }
}
