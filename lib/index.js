export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value));
}

export default function Sanitizer(users, infos, jobs) {
  this.users = Object.entries(users)
  this.infos = Object.entries(infos)
  this.jobs = Object.entries(jobs)


  this._mergeData = function(user, file) {
    const data = file
      .find((data) => data[0] === user[0])
    if (data) {
      user[1] = { ...data[1],  ...user[1] }
    }
    return user
  }

  this._findAndReplaceName = function(user, file) {
    const data = file
      .find((data) => data[0] === user[0])
    if (data && data[1].name) {
      user[1].name = data[1].name
    }
    return user
  }

  this._checkFormat = function(user, attribute) {
    user[1][attribute] = user[1][attribute].charAt(0).toUpperCase() + user[1][attribute].slice(1).toLowerCase()

    // correct attribute if there is a dash in it
    const dash = user[1][attribute].indexOf('-')
        
    if (dash !== -1 && dash !== user[1][attribute].length - 1) {
      user[1][attribute] = user[1][attribute].slice(0, dash + 1) + user[1][attribute].charAt(dash + 1).toUpperCase() + user[1][attribute].slice(dash + 2)
    }
    return user
  }

  this.run = function() {

    this.results = this.users.map((user) => {
      // load info
      user = this._mergeData(user, this.infos)
      // load jobs
      user = this._mergeData(user, this.jobs)

      // check if name is #ERROR
      if (user[1].name === '#ERROR') {
        // Find name in jobs file first 
        user = this._findAndReplaceName(user, this.jobs)

        // Find name in infos file snd 
        user = (user[1].name === '#ERROR')? this._findAndReplaceName(user, this.infos) : user
      }

      // check name syntax
      const syntax = new Map([['3', 'e'], ['4', 'a'], ['1', 'i'], ['0', 'o']])
      syntax.forEach((value, key) => {
        user[1].name = user[1].name.replaceAll(key, value)
      })

      // check cities format
      if (user[1].city) {
        user = this._checkFormat(user, "city")
      }

      // check name format
      if (user[1].name) {
        user = this._checkFormat(user, "name")
      }

      // remove empty field
      user[1] = removeEmpty(user[1])

      return user
    })

    return Object.fromEntries(this.results)
  }
}

