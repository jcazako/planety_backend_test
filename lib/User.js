export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value))
}

export class User {
  constructor(user) {
    this.id = user[0]
    this.data = user[1]
  }

  mergeData(file) {
    const userData = file.find((data) => data[0] === this.id)
    if (userData) {
      this.data = { ...userData[1], ...this.data }
    }
    return this
  }

  _findAndReplace(attribute, file) {
    const userData = file.find((data) => data[0] === this.id)
    if (userData && userData[1][attribute]) {
      this.data[attribute] = userData[1][attribute]
    }
    return this
  }

  checkAttribute(attribute, value, file) {
    if (this.data[attribute] === value) {
      this._findAndReplace(attribute, file)
    }
    return this
  }

  checkSyntax(attribute, syntaxMap) {
    syntaxMap.forEach((value, key) => {
      this.data[attribute] = this.data[attribute].replaceAll(key, value)
    })
    return this
  }

  checkFormat(attribute) {
    if (!this.data[attribute]) {
      return this
    }
    this.data[attribute] =
      this.data[attribute].charAt(0).toUpperCase() +
      this.data[attribute].slice(1).toLowerCase()

    // Fix attribute if there is a dash in it
    const dash = this.data[attribute].indexOf('-')
    if (dash !== -1 && dash !== this.data[attribute].length - 1) {
      this.data[attribute] =
        this.data[attribute].slice(0, dash + 1) +
        this.data[attribute].charAt(dash + 1).toUpperCase() +
        this.data[attribute].slice(dash + 2)
    }
    return this
  }

  getUser() {
    return [this.id, removeEmpty(this.data)]
  }
}
