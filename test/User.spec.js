import { User } from '../lib/User.js'

describe('User test', () => {
  it('should update fields but name', () => {
    const user = new User([ 'aaaa', { name: 'nameTest' }])
    expect(user.mergeData([[ 'aaaa', { name: 'newNameTest', newAttribute: 'default value' }]]))
      .toEqual(new User([ 'aaaa', { name: 'nameTest', newAttribute: 'default value' }]))
  })

  it('should check if the attribute has the specified value and replace it with endpoint data', () => {
    const user = new User([ 'aaaa', { name: '#ERROR' }])
    expect(user.checkProperty('name', '#ERROR', [[ 'aaaa', { name: 'goodName' }]]))
      .toEqual(new User([ 'aaaa', { name: 'goodName' }]))
  })

  it('should check if the syntax is correctly fixed', () => {
    const user = new User([ 'aaaa', { name: 'Qu3nt1n' }])
    expect(user.checkSyntax('name', new Map([['3', 'e'], ['4', 'a'], ['1', 'i'], ['0', 'o'],])))
      .toEqual(new User([ 'aaaa', { name: 'Quentin' }]))
  })
  

  it('Should check the format of the specified attribute', () => {
    const user = new User([ 'aaaa', { name: 'anh-jo' }])
    expect(user.checkFormat('name'))
      .toEqual(new User([ 'aaaa', { name: 'Anh-Jo' }]))
  })
})