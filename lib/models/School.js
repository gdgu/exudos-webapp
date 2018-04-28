class School {
    constructor(name) {
        if(typeof name !== 'string') throw new TypeError(`first argument name must be of type string, ${typeof name} found`);

        this.name = name;
    }
}

module.exports = School;
