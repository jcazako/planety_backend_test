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

  this.run = function() {

    this.results = this.users.map((user) => {
      // load info
      user = this._mergeData(user, this.infos)
      // load jobs
      // const job = this.jobs.find((job) => job[0] === user[0])
      // if (job) {
      //   user[1] = { ...job[1], ...user[1] }
      // }
      user = this._mergeData(user, this.jobs)

      // check if name is #ERROR
      if (user[1].name === '#ERROR') {
        const id = user[0]
    
        const nameFromJobs = this.jobs.find((job) => job[0] === id)
        
        const nameFromInfos = this.infos.find((info) => info[0] === id)
    
        if (nameFromJobs && nameFromJobs[1].name) {
          user[1].name = nameFromJobs[1].name
        }
    
        if (nameFromInfos && nameFromInfos[1].name) {
          user[1].name = nameFromInfos[1].name
        }
      }

      // check name syntax
      const syntax = new Map([['3', 'e'], ['4', 'a'], ['1', 'i'], ['0', 'o']])
      syntax.forEach((value, key) => {
        user[1].name = user[1].name.replaceAll(key, value)
      })

      // check cities format
      if (user[1].city) {
        // First letter capitalized
        user[1].city = user[1].city.charAt(0).toUpperCase() + user[1].city.slice(1).toLowerCase() 
      }

      if (user[1].name) {
        // First letter capitalized
        user[1].name = user[1].name.charAt(0).toUpperCase() + user[1].name.slice(1).toLowerCase()
        
        // correct name if there is a dash in it
        const dash = user[1].name.indexOf('-')
        
        if (dash !== -1 && dash !== user[1].name.length - 1) {
          user[1].name = user[1].name.slice(0, dash + 1) + user[1].name.charAt(dash + 1).toUpperCase() + user[1].name.slice(dash + 2)
        }
      }

      return user
    })

    return Object.fromEntries(this.results)
  }
}