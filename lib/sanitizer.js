import { User } from './User.js'

export function sanitizer(users, infos, jobs) {
  const usersEntries = Object.entries(users)
  const infosEntries = Object.entries(infos)
  const jobsEntries = Object.entries(jobs)

  const result = usersEntries.map((user) => {
    return new User(user)
      .mergeData(infosEntries) // load infos
      .mergeData(jobsEntries) // loads jobs
      .checkAttribute('name', '#ERROR', jobsEntries) // replace name #ERROR with jobs data
      .checkAttribute('name', '#ERROR', infosEntries) // replace name #ERROR with infos data
      .checkSyntax(
        'name',
        new Map([
          ['3', 'e'],
          ['4', 'a'],
          ['1', 'i'],
          ['0', 'o'],
        ])
      ) // check syntax of name
      .checkFormat('name') // check format of name
      .checkFormat('city') // check format of city
      .getUser() // get the result
  })

  return Object.fromEntries(result)
}
