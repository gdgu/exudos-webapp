class Administrator{
    constructor(name,user){
        if(typeof name !== 'string') throw new TypeError(`first argument name must be of type string, ${typeof name} found`);        
        
        this.name= name;
        this.user= user;
    }
}
module.exports =Administrator;
