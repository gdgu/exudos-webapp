class Grade {
    constructor(marksObtained,maximumMarks){
        if(typeof marksObtained !== 'number') throw new TypeError(`first argument marksObtained must be of type string, ${typeof marksObtained} found`);
        if(typeof maximumMarks !== 'number') throw new TypeError(`second argument maximumMarks must be of type string, ${typeof maximumMarks} found`);
                
        this.marksObtained= marksObtained;
        this.maximumMarks= maximumMarks;
    }
}
module.exports = Grade;
