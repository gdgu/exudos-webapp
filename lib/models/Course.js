class Course {
    constructor(code, name, programme, credits) {
        if(typeof code !== 'string') throw new TypeError(`first argument code must be of type string, ${typeof code} found`);
        if(typeof name !== 'string') throw new TypeError(`second argument name must be of type string, ${typeof name} found`);
        if(typeof credits !== 'number') throw new TypeError(`fourth argument name must be of type number, ${typeof credits} found`);        
        
        this.code = code;
        this.name = name;
        this.programme = programme;
        this.credits = credits;
    }
}

module.exports = Course;