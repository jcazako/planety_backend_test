import superagent from 'superagent'
import { promisify } from 'util'
import { promises as fs} from 'fs'

const request = promisify(superagent)

async function getFiles(url) {
  const filename = url.split('/').pop()
  try {
    const { body } = await request.get(url)
    await fs.writeFile(filename, JSON.stringify(body, null, '  '))
    return { filename, body }
  } catch (error) {
    throw new Error(`Couldn't download ${filename}`)
  }
}

async function main() {
  const endpoints = [
    'https://recrutement-practice-default-rtdb.firebaseio.com/informations.json',
    'https://recrutement-practice-default-rtdb.firebaseio.com/jobs.json',
    'https://recrutement-practice-default-rtdb.firebaseio.com/users.json'
  ]

  const files = await Promise.all(endpoints.map((url) => getFiles(url)))

  const users = files.find((file) => file.filename === 'users.json').body
  const infos = files.find((file) => file.filename === 'informations.json').body
  const jobs = files.find((file) => file.filename === 'jobs.json').body

  const result = sanitizer(users, infos, jobs)

  fs.writeFile('output.json', JSON.stringify(result, null, '  '))
    .then(() => console.log('Result stored locally in output.json'))
}

main()