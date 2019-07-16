import async from '../utils/async'

describe('utils', () => {

  test('async.js', () => {
  	expect.hasAssertions()
  	const readyFunc = () => true
  	const doVoidFunc = jest.fn()

  	async.doWhenReady(readyFunc, doVoidFunc, 1)
  	expect(doVoidFunc).toBeCalled()
  })

})