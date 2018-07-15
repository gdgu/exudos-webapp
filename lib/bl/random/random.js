var randomList = require('./randomlist.json')

exports.getName = () => {
	return randomList.adjectives[Math.floor(Math.random() * randomList.adjectives.length)] + randomList.surnames[Math.floor(Math.random() * randomList.surnames.length)]
}
