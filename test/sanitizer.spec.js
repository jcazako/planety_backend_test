import { users, infos, jobs, result } from './api.js'
import { sanitizer } from '../lib/sanitizer.js'

describe('sanitizer test', () => {
  it('should concat and sanitize correctly the data', () => {
    const output = sanitizer(users, infos, jobs)
    expect(output).toEqual(result)
  })
})
