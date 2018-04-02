class Notice{
    constructor(dateTime, content,programmes, courses){   
        if(dateTime instanceof Date) throw new TypeError(`first argument dateTime must be an instance of Date`);             
        if(typeof content !== 'string') throw new TypeError(`second argument content must be of type string, ${typeof content} found`);               

        this.dateTime= dateTime;
        this.content= content;
        this.programmes= programmes;
        this.courses= courses;
    }
}
module.exports =Notice;