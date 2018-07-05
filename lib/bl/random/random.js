var randomList = require('./randomlist.json')

exports.getName = () => {
	return randomList.adjectives[Math.round(Math.random() * randomList.adjectives.length)] + randomList.surnames[Math.round(Math.random() * randomList.surnames.length)]
}
