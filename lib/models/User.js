class User {
    static userTypes() {
        return ['student', 'faculty'];
    }
    constructor(username, password, type, link) {
        this.type = type;

        if(!User.userTypes().includes(this.type)) throw new TypeError(`Cannot find specified user type ${this.type}. Must be ${User.userTypes().join(' or ')}.`);

        this[this.type] = link;

        this.username = username;
        this.password = password;
    }
}

module.exports = User;