class Semester {
    constructor(number, programme, session) {
        if(typeof number !== 'number') throw new TypeError(`first argument number must be of type number, ${typeof number} found`);
        
        this.number = number;
        this.programme = programme;
        this.session = session;
    }
}

module.exports = Semester;