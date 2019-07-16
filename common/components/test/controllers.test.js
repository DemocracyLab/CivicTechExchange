import React from 'react'
import ReactDOM from 'react-dom'
import window from './__mocks__/window'
import mockAPI from './__mocks__/mockAPI'
import MainController from '../controllers/MainController'

describe('controllers', () => {

  it('should render without crashing', () => {
  	//fetch.resetMocks() <--Use before making assertions on the arguments passed to fetch()
  	//ProjectSearchStore calls fetch() as a Promise
		fetch.mockResponse(() => new Promise(resolve => {})
																.then(response => ({body: mockAPI.projects})))

		ReactDOM.render(<MainController />, document.createElement('div'))
  })

})