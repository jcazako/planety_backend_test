import superagent from 'superagent'
import { promisify } from 'util'
import { promises as fs} from 'fs'
import { User } from './User.js'

const request = promisify(superagent)

async function getFiles(url) {
  return new Promise(async (resolve, reject) => {
    const filename = url.split('/').pop()
    const { body } = await request.get(url)
    fs.writeFile(filename, JSON.stringify(body, null, '  '))
      .then(() => resolve({ filename, body }))
      .catch((err) => reject(err))
  })
}

export default function sanitizer(users, infos, jobs) {
  const usersEntries = Object.entries(users)
  const infosEntries = Object.entries(infos)
  const jobsEntries = Object.entries(jobs)

  const result = usersEntries.map((user) => {
    return new User(user)
      .mergeData(infosEntries) // load infos
      .mergeData(jobsEntries) // loads jobs
      .checkAttribute('name', '#ERROR', jobsEntries) // replace name #ERROR with jobs data
      .checkAttribute('name', '#ERROR', infosEntries) // replace name #ERROR with infos data
      .checkSyntax('name', new Map([['3', 'e'], ['4', 'a'], ['1', 'i'], ['0', 'o']])) // check syntax of name
      .checkFormat('name') // check format of name
      .checkFormat('city') // check format of city
      .getUser() // get the result
  })

  return Object.fromEntries(result)
}

async function main() {
  const endpoints = [
    'https://recrutement-practice-default-rtdb.firebaseio.com/informations.json',
    'https://recrutement-practice-default-rtdb.firebaseio.com/jobs.json',
    'https://recrutement-practice-default-rtdb.firebaseio.com/users.json'
  ]

  const files = await Promise.all(endpoints.map((url) => getFiles(url)))

  console.log('Git the files')

  const users = files.find((file) => file.filename === 'users.json').body
  const infos = files.find((file) => file.filename === 'informations.json').body
  const jobs = files.find((file) => file.filename === 'jobs.json').body

  const result = sanitizer(users, infos, jobs)

  fs.writeFile('output.json', JSON.stringify(result, null, '  '))
    .then(() => console.log('Result stored locally in output.json'))
}