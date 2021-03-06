/* eslint-env mocha */
var expect = require('chai').expect
var React = require('react')
var formatChildren = require('../packages/format-message/react').formatChildren

describe('react formatChildren', function () {
  it('returns a single child for simple messages', function () {
    var results = formatChildren('simple')
    expect(results).to.equal('simple')
  })

  it('preserves tokens with no element mapping', function () {
    var results = formatChildren('<0>simple</0>')
    expect(results).to.equal('<0>simple</0>')
  })

  it('returns a single child for wrapped messages', function () {
    var results = formatChildren('<0>simple</0>', [
      React.createElement('span')
    ])
    expect(results).to.deep.equal(React.createElement('span', null, 'simple'))
  })

  it('preserves the props of the wrappers', function () {
    var results = formatChildren('<0>simple</0>', [
      React.createElement('span', { className: 'foo' })
    ])
    expect(results).to.deep.equal(React.createElement('span', {
      className: 'foo'
    }, 'simple'))
  })

  it('returns an array of children when there are many', function () {
    var results = formatChildren('it was <0>his</0> fault', [
      React.createElement('em')
    ])
    expect(results).to.deep.equal([
      'it was ',
      React.createElement('em', null, 'his'),
      ' fault'
    ])
  })

  it('nests arbitrarily deep', function () {
    var results = formatChildren('<0><1><2><3>deep</3></2></1></0>', [
      React.createElement('div'),
      React.createElement('span'),
      React.createElement('em'),
      React.createElement('strong')
    ])
    expect(results).to.deep.equal(
      React.createElement('div', null,
        React.createElement('span', null,
          React.createElement('em', null,
            React.createElement('strong', null, 'deep')
          )
        )
      )
    )
  })

  it('throws when wrapper tokens aren\'t nested properly', function () {
    expect(function () {
      formatChildren('<0><1><2><3>deep</2></3></1></0>', [
        React.createElement('div'),
        React.createElement('em'),
        React.createElement('span'),
        React.createElement('strong')
      ])
    }).to.throw()
  })

  it('throws when mappings aren\'t valid elements', function () {
    expect(function () {
      formatChildren('<0>test</0>', [ 'span' ])
    }).to.throw()
    expect(function () {
      formatChildren('<0>test</0>', [ {} ])
    }).to.throw()
    expect(function () {
      formatChildren('<0>test</0>', [ 1 ])
    }).to.throw()
  })
})
