class AssignmentFeedback{
    constructor(assignment,content,student,faculty,document,richText)
    {
        if(typeof content !== 'string') throw new TypeError(`second argument content must be of type string, ${typeof content} found`);    
        
        this.assignment= assignment;
        this.content= content;
        this.student= student;
        this.faculty= faculty;
        this.document= document;
        this.richText= richText;
    }
}
module.exports =AssignmentFeedback;