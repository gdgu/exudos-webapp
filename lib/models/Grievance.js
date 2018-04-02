class Grievance{
    constructor(user,description,document){
        if(typeof description !== 'string') throw new TypeError(`second argument description must be of type string, ${typeof description} found`);
        
        this.user= user;
        this.description= description;
        this.document= document;
    }
}
module.exports =Grievance;
