import { users, infos, jobs, result } from './api.js'
import Sanitizer from '../lib/index.js'

describe('backend test', () => {
  it('should concat and sanitize correctly the data', () => {
    const output = new Sanitizer(users, infos, jobs).run()
    expect(output).toEqual(result)
  })
})
