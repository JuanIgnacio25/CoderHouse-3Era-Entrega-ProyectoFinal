const admin = require('firebase-admin');
const {firebase} = require('../configFireBase');

admin.initializeApp({
    credential: admin.credential.cert(firebase.firebaseConfig),
    databaseURL: 'https://proyecto-final-segunda-entrega.firebaseio.com'
});


const db = admin.firestore();

class Container {
    constructor (collection) {
        this.collection = db.collection(collection);
        this.id = 1;
    }    

    async save(element) {
        try {
            //const allItems = await this.collection.get(); 
            //const docs = allItems.docs;
            //const id = docs.length + 1;
            //const idDoc = "" + id;
            const idDoc = JSON.stringify(this.id);
            this.id++
            try {
                const elementToSave = this.collection.doc(idDoc);
                await elementToSave.create(element);
                console.log("agregado exitoso", idDoc);
                return idDoc;
            }
            catch (error) {
                console.log("el error al guardar fue: ", error);
            }
        }
        catch (error) {
            console.log("error en Save): ", error);
        }
    }
    

    async replaceById(idSearch, data) {
        try {
            const result = await this.collection.doc(idSearch).update(data);
            return result;
        }
        catch (error) {
            console.log("error al reemplazar datos: ", error);
            return null;
        }
    }

    async getById(idSearch) {
        try {
            const doc = await this.collection.doc(idSearch).get();
            return doc.data();
        }
        catch (error) {
            console.log("error al buscar por id: ", error);
        }
    }

    async getAll() {
        try {
            const allItems = await this.collection.get();
            const docs = allItems.docs;
            const resp = docs.map((doc) => ({
                code: doc.data().code,
                title: doc.data().title,
                price: doc.data().price,
                thumbnail: doc.data().thumbnail,
                description: doc.data().description,
                stock : doc.data().stock,
                timestamp: doc.data().timestamp
            }));
            return resp;
        }
        catch (error) {
            console.log("error en getAll): ", error);
            return [];
        }
    }

    async deleteById(idSearch) {
        try {
            const doc = await this.collection.doc(idSearch).get();
            if (doc.data()) {
                const result = await this.collection.doc(idSearch).delete();
                return result;
            }
            else return null;
        }
        catch (error) {
            console.log("error en deleteById): ", error);
        }
    }
}




module.exports = Container;
