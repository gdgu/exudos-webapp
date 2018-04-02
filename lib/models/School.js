class School {
    constructor(name, programmes) {
        if(typeof name !== 'string') throw new TypeError(`first argument name must be of type string, ${typeof name} found`);

        this.name = name;
        this.programmes = programmes;
    }
}

module.exports = School;
