class CourseMaterial{
    constructor(richText,document,publishDate,course, publishFaculty){
        if(publishDate instanceof Date) throw new TypeError(`third argument publishDate must be an instance of Date`);                

        this.richText= richText;
        this.document= document;
        this.publishDate= publishDate;
        this.course= course;
        this.publishFaculty = publishFaculty;
    }
}
module.exports= CourseMaterial;
