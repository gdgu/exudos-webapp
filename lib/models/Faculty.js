class Faculty {
    static genderTypes() {
        return ['Female', 'Male', 'Other'];
    }
    constructor(name, gender, employeeId, school, emailId, user) {
        if(typeof name !== 'string') throw new TypeError(`first argument name must be of type string, ${typeof name} found`);
        if(!Faculty.genderTypes().includes(gender)) throw new TypeError(`cannot find specified gender ${gender} in second argument. Must be ${Faculty.genderTypes().join(' or ')}.`);                        
        if(typeof employeeId !== 'number') throw new TypeError(`third argument employeeId must be of type number, ${typeof employeeId} found`);
        if(typeof emailId !== 'string') throw new TypeError(`fifth argument emailId must be of type string, ${typeof emailId} found`);
        
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