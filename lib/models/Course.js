class Course {
    constructor(code, name, programme) {
        if(typeof code !== 'string') throw new TypeError(`first argument code must be of type string, ${typeof code} found`);
        if(typeof name !== 'string') throw new TypeError(`second argument name must be of type string, ${typeof name} found`);
        
        this.code = code;
        this.name = name;
        this.programme = programme;
    }
}

module.exports = Course;