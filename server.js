require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

/*app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error
    const { userId, card } = req.body;
    const newCard = { Card: card, UserId: userId };
    var error = '';
    try {
        const db = client.db("COP4331Cards");
        const result = db.collection('Cards').insertOne(newCard);
    }
    catch (e) {
        error = e.toString();
    }
    cardList.push(card);
    var ret = { error: error };
    res.status(200).json(ret);
});*/

app.post('/api/register', async (req, res, next) => {
    // incoming: email, password, displayname
    // outgoing: error

    const { email, password, displayName } = req.body;
    const newUser = {
        email: email,
        password: password,
        displayName: displayName,
        dateCreated: new Date(), // Set current date as dateCreated
        dateLastLoggedIn: null // Set to null initially
    };
    var error = '';

    try {
        const db = client.db("VGReview");
        const result = db.collection('Users').insertOne(newUser);
        
    } catch (e) {
        error = e.toString();
    }

    var ret = { error: '' };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => {
    // incoming: email, password
    // outgoing: id, displayName, error
    var error = '';
    const { email, password } = req.body;
    const db = client.db("VGReview");
    const results = await
        db.collection('Users').find({ email: email, password: password }).toArray();
    var username = '';
    var _id = -1;
    var displayName = '';
    if (results.length > 0) {
        displayName = results[0].displayName;
        _id = results[0]._id;
    }
    var ret = { id: _id, displayName: displayName, error: '' };
    res.status(200).json(ret);
});

app.post('/api/updateuser', async (req, res, next) => {
    // incoming: email (as identifier), new email, new password, new displayname
    // outgoing: error

    const { email, newEmail, newPassword, newDisplayName } = req.body;
    var error = '';

    try {
        const db = client.db("VGReview");
        const userCollection = db.collection('Users');

        // Find the user by email
        const user = await userCollection.findOne({ email: email });

        if (!user) {
            error = 'User not found.';
        } else {
            // Update user information if new values are provided
            const updateFields = {};

            // Check and update email
            if (newEmail && newEmail !== user.email) {
                updateFields.email = newEmail;
            }

            // Check and update password
            if (newPassword) {
                updateFields.password = newPassword;
            }

            // Check and update display name
            if (newDisplayName) {
                updateFields.displayName = newDisplayName;
            }

            // Update the user document if there are any changes
            if (Object.keys(updateFields).length > 0) {
                const result = await userCollection.updateOne(
                    { email: email },
                    { $set: updateFields }
                );

                if (result.modifiedCount === 0) {
                    error = 'Failed to update user information.';
                }
            } else {
                error = 'No fields to update.';
            }
        }
    } catch (e) {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/searchusers', async (req, res, next) => {
    // incoming: username
    // outgoing: user object, error
    const { username } = req.body;
    var error = '';
    var user = null;

    try {
        const db = client.db("VGReview");
        const result = await db.collection('Users').findOne({ username: username });

        if (result) {
            user = {
                id: result._id,
                username: result.username,
                dateCreated: result.dateCreated,
                dateLastLoggedIn: result.dateLastLoggedIn
            };
        } else {
            error = 'User not found';
        }
    } catch (e) {
        error = e.toString();
    }

    var ret = { user: user, error: error };
    res.status(200).json(ret);
});

const { ObjectId } = require('mongodb');

app.post('/api/deleteuser', async (req, res, next) => {
    // incoming: id
    // outgoing: success message, error
    const { id } = req.body; // Extracting id from req.body
    var error = '';
    var successMessage = '';

    try {
        const db = client.db("VGReview");
        const result = await db.collection('Users').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            successMessage = 'User deleted successfully';
        } else {
            error = 'User not found';
        }
    } catch (e) {
        error = e.toString();
    }

    var ret = { successMessage: successMessage, error: error };
    res.status(200).json(ret);
});

/*app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db('COP4331Cards');
    const results = await
        db.collection('Cards').find({ "Card": { $regex: _search + '.*', $options: 'i' } }).toArray();
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].Card);
    }
    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});*/

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}