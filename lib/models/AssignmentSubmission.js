class AssignmentSubmission{
    constructor(assignment,submitDateTime,student){
        if(submitDateTime instanceof Date) throw new TypeError(`second argument submitDateTime must be an instance of Date`);

        this.assignment= assignment;
        this.submitDateTime= submitDateTime;
        this.student= student;
    }
}
module.exports =AssignmentSubmission;
