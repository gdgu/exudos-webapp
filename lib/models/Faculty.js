class Faculty {
    constructor(name, employeeId, school, emailId, user) {
        if(typeof name !== 'string') throw new TypeError(`first argument name must be of type string, ${typeof name} found`);
        if(typeof employeeId !== 'number') throw new TypeError(`second argument employeeId must be of type number, ${typeof employeeId} found`);
        if(typeof emailId !== 'string') throw new TypeError(`fourth argument emailId must be of type string, ${typeof emailId} found`);
        
        this.name = name;
        this.employeeId = employeeId;
        this.school = school;
        this.emailId = emailId;
        this.user = user;

        this.courses = [];
        this.currentSemester = null;
    }
}

module.exports = Faculty;