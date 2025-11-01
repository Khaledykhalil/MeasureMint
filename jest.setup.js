// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Miro API globally
global.miro = {
  board: {
    ui: {
      on: jest.fn(),
      off: jest.fn(),
    },
    createConnector: jest.fn(),
    createShape: jest.fn(),
    createText: jest.fn(),
    getSelection: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  },
}

// Mock window.miro
Object.defineProperty(window, 'miro', {
  writable: true,
  value: global.miro,
})
