const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String },
        password: { type: String },
        name: { type: String },
        address: { type: String },
        phone_number: { type: Number },
        age: { type: Number }
    }
)

const users = mongoose.model('users', userSchema);

const connection = process.env.MONGOURL;

class MongoUser {
    constructor() {
        this.connection = connection
        this.model = users
    }
    mongoConnected() {
        mongoose.connect(this.connection, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    async addUser(user) {
        try {
            this.mongoConnected();
            const saveNew = this.model(user);
            await saveNew.save();
        }
        catch (err) {
            console.log(err)
        }
    }
    async findUser(username) {
        try {
            this.mongoConnected();
            const filterUser = this.model.find({ username: username });
            return filterUser;
        } catch (error) {
            console.log(error)
        }
    }

    async updateUser(email, user) {
        try {
            this.mongoConnected();
            const updateUser = this.model.updateOne({ username: email }, { $set: { name: user.name, address: user.address, phone_number: user.number , age: user.age} })
            return updateUser;
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = MongoUser