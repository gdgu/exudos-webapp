class User {
    static userTypes() {
        return ['student', 'faculty'];
    }
    constructor(username, password, type, link) {
        if(!User.userTypes().includes(type)) throw new TypeError(`Cannot find specified user type ${type}. Must be ${User.userTypes().join(' or ')}.`);

        this.type = type;
        this[this.type] = link;

        this.username = username;
        this.password = password;
    }
}

module.exports = User;