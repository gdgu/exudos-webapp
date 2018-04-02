class Assignment{
    constructor(course,publishDate,submitDate,document,richText){
        if(publishDate instanceof Date) throw new TypeError(`second argument publishDate must be an instance of Date`);                
        if(submitDate instanceof Date) throw new TypeError(`third argument submitDate must be an instance of Date`);        

        this.course= course;
        this.publishDate= publishDate;
        this.submitDate= submitDate;
        this.document= document;
        this.richText= richText;
    }
}
module.exports =Assignment;