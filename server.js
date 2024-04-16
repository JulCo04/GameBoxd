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

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    "373417650631-dv7hjo9k8br1u1tt4jkfbevs0rtf2v0g.apps.googleusercontent.com",
    "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", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: "1//04uHkvcyOcmWACgYIARAAGAQSNwF-L9IrIwsxNZtvguqtL_J-RnmeG6ShSd9ewnkDX2TKtXkehraAdtkBTeaAWdw4Yx2fgp1XCqk"
});
const accessToken = oauth2Client.getAccessToken()

// Function to generate a verification token
function generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: "OAuth2",
        clientId: "373417650631-dv7hjo9k8br1u1tt4jkfbevs0rtf2v0g.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04uHkvcyOcmWACgYIARAAGAQSNwF-L9IrIwsxNZtvguqtL_J-RnmeG6ShSd9ewnkDX2TKtXkehraAdtkBTeaAWdw4Yx2fgp1XCqk",
        user: 'gamegridmail@gmail.com',
        accessToken: accessToken
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.post('/api/register', async (req, res, next) => {
    const { email, password, displayName } = req.body;
    const verificationToken = generateVerificationToken(); // Generate verification token

    let error = '';

    try {
        const db = client.db("VGReview");

        // Check if the email already exists
        const existingUser = await db.collection('Users').findOne({ email: email });
        if (existingUser) {
            error = 'Email already exists';
        } else {
            const newUser = {
                email: email,
                password: password,
                displayName: displayName,
                dateCreated: new Date(),
                dateLastLoggedIn: null,
                verified: false,
                verificationToken: verificationToken,
                friends: {
                    sentRequests: [],
                    receivedRequests: [],
                    accepted: []
                }
            };

            const result = await db.collection('Users').insertOne(newUser);

            // Send verification email
            await sendVerificationEmail(email, verificationToken);
        }

    } catch (e) {
        error = e.toString();
    }

    const ret = { error: error };
    res.status(200).json(ret);
});

// Verification endpoint
app.get('/api/verify', async (req, res) => {
    const { token } = req.query;

    try {
        const db = client.db("VGReview");
        const user = await db.collection('Users').findOne({ verificationToken: token });

        if (user) {
            await db.collection('Users').updateOne(
                { _id: user._id },
                { $set: { verified: true, verificationToken: null } }
            );

            res.send('Account verified successfully. You can now login.');
        } else {
            res.status(404).send('Invalid or expired verification token.');
        }
    } catch (error) {
        console.error('Error verifying account:', error);
        res.status(500).send('Internal server error');
    }
});


// Function to send verification email
async function sendVerificationEmail(email, verificationToken) {
    const mailOptions = {
        from: 'gamegridmail@gmail.com',
        to: email,
        subject: 'Account Verification',
        html: `<p>Click the following link to verify your account: <a href="https://g26-big-project-6a388f7e71aa.herokuapp.com/api/verify?token=${verificationToken}">Verify Email</a></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

app.post('/api/login', async (req, res, next) => {
    // incoming: email, password
    // outgoing: id, displayName, email, dateCreated, error
    var error = '';
    const { email, password } = req.body;
    const db = client.db("VGReview");
    const results = await db.collection('Users').find({ email: email, password: password }).toArray();
    var _id = -1;
    var displayName = '';
    var userEmail = '';
    var dateCreated = '';

    if (results.length > 0) {
        const user = results[0];
        if (!user.verified) {
            error = 'Please verify your email before logging in.';
        } else {
            displayName = user.displayName;
            _id = user._id;
            userEmail = user.email;
            dateCreated = user.dateCreated;
        }
    } else {
        error = 'Invalid email or password.';
    }

    var ret = { id: _id, displayName: displayName, email: userEmail, dateCreated: dateCreated, error: error };
    res.status(200).json(ret);
});

const { ObjectId } = require('mongodb');

// Endpoint for sending friend requests
app.post('/api/friends/send-request', async (req, res) => {
    const { userId, friendId } = req.body;
    const db = client.db("VGReview");
    const usersCollection = db.collection('Users');

    try {
        // Check if the sender and receiver exist
        const [sender, receiver] = await Promise.all([
            usersCollection.findOne({ _id: new ObjectId(userId) }),
            usersCollection.findOne({ _id: new ObjectId(friendId) })
        ]);

        if (!sender || !receiver) {
            res.status(404).json({ error: "One or both users not found" });
            return;
        }

        // Check if a friend request already exists
        if (sender.friends && sender.friends.sentRequests.includes(friendId)) {
            res.status(400).json({ error: "Friend request already sent" });
            return;
        }

        // Check if they are already friends
        if (sender.friends && sender.friends.accepted.includes(friendId)) {
            res.status(400).json({ error: "Already friends" });
            return;
        }

        // Update sender's sentRequests and receiver's receivedRequests
        await Promise.all([
            usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $addToSet: { "friends.sentRequests": friendId } }
            ),
            usersCollection.updateOne(
                { _id: new ObjectId(friendId) },
                { $addToSet: { "friends.receivedRequests": userId } }
            )
        ]);

        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for accepting friend requests
app.post('/api/friends/accept-request', async (req, res) => {
    const { userId, friendId } = req.body;
    const db = client.db("VGReview");
    const usersCollection = db.collection('Users');

    try {
        // Retrieve both the receiver (user who received the friend request) and sender (user who sent the friend request)
        const [receiver, sender] = await Promise.all([
            usersCollection.findOne({ _id: new ObjectId(userId) }),
            usersCollection.findOne({ _id: new ObjectId(friendId) })
        ]);

        if (!sender || !receiver) {
            res.status(404).json({ error: "One or both users not found" });
            return;
        }

        // Check if the friend request exists in the received requests of the receiver
        if (!receiver.friends || !receiver.friends.receivedRequests.includes(friendId)) {
            res.status(400).json({ error: "No friend request found" });
            return;
        }

        // Update the friend lists of both users: add to accepted friends for both, and remove from received requests for the receiver
        await Promise.all([
            usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                {
                    $addToSet: { "friends.accepted": friendId },
                    $pull: { "friends.receivedRequests": friendId }
                }
            ),
            usersCollection.updateOne(
                { _id: new ObjectId(friendId) },
                { $addToSet: { "friends.accepted": userId } }
            )
        ]);

        res.status(200).json({ message: "Friend request accepted successfully" });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/friends/reject-request', async (req, res) => {
    const { userId, friendId } = req.body;
    const db = client.db("VGReview");
    const usersCollection = db.collection('Users');

    try {
        // Retrieve both the receiver (user who received the friend request) and sender (user who sent the friend request)
        const [receiver, sender] = await Promise.all([
            usersCollection.findOne({ _id: new ObjectId(userId) }),
            usersCollection.findOne({ _id: new ObjectId(friendId) })
        ]);

        if (!sender || !receiver) {
            res.status(404).json({ error: "One or both users not found" });
            return;
        }

        // Check if the friend request exists in the received requests of the receiver
        if (!receiver.friends || !receiver.friends.receivedRequests.includes(friendId)) {
            res.status(400).json({ error: "No friend request found" });
            return;
        }

        // Remove the friend request from the receiver's receivedRequests
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { "friends.receivedRequests": friendId } }
        );

        res.status(200).json({ message: "Friend request rejected successfully" });
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/friends/:userId', async (req, res) => {
    const userId = req.params.userId;
    const db = client.db("VGReview");
    const usersCollection = db.collection('Users');

    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const friends = user.friends && user.friends.accepted ? user.friends.accepted : [];

        // Fetch details of friends using their IDs
        const friendsDetails = await Promise.all(
            friends.map(async (friendId) => {
                const friend = await usersCollection.findOne({ _id: new ObjectId(friendId) });
                if (friend) {
                    return {
                        id: friend._id,
                        email: friend.email,
                        displayName: friend.displayName,
                        // Add more properties as needed
                    };
                }
                return null; // Handle if friend not found
            })
        );

        res.status(200).json({ friends: friendsDetails });
    } catch (error) {
        console.error('Error fetching friends list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/friends/received-requests/:userId', async (req, res) => {
    const userId = req.params.userId;
    const db = client.db("VGReview");
    const usersCollection = db.collection('Users');

    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const receivedRequests = user.friends && user.friends.receivedRequests ? user.friends.receivedRequests : [];

        // Fetch details of users who sent the friend requests
        const requestersDetails = await Promise.all(
            receivedRequests.map(async (requesterId) => {
                const requester = await usersCollection.findOne({ _id: new ObjectId(requesterId) });
                if (requester) {
                    return {
                        id: requester._id,
                        displayName: requester.displayName,
                        
                    };
                }
                return null; // Handle if requester not found
            })
        );

        res.status(200).json({ receivedRequests: requestersDetails });
    } catch (error) {
        console.error('Error fetching received friend requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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
            if (newPassword && newPassword !== user.password) {
                updateFields.password = newPassword;
            }

            // Check and update display name
            if (newDisplayName && newDisplayName !== user.displayName) {
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
    // incoming: displayName
    // outgoing: user object, error
    const { displayName } = req.body;
    var error = '';
    var user = null;

    try {
        const db = client.db("VGReview");
        const result = await db.collection('Users').findOne({ displayName: displayName });

        if (result) {
            user = {
                id: result._id,
                email: result.email,
                displayName: result.displayName,
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

const jwt = require('jsonwebtoken');


// Function to generate a unique token for password reset
function generateResetToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Function to verify the reset token
function verifyResetToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.email;
    } catch (error) {
        return null;
    }
}

// Endpoint for initiating password reset
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    const db = client.db("VGReview");
    const usersCollection = db.collection('Users');

    try {
        // Check if the user with the provided email exists
        const user = await usersCollection.findOne({ email: email });
        console.log("user", user);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Generate a unique reset token
        const resetToken = generateResetToken(email);
        console.log("resetToken", resetToken);

        // Save the reset token in the user document
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { resetToken: resetToken } }
        );

        // Send an email with the reset link containing the token
        const resetLink = `https://g26-big-project-6a388f7e71aa.herokuapp.com/verify?token=${resetToken}`;
        const mailOptions = {
            from: 'gamegridmail@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `<p>Click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent successfully. Check your email." });
    } catch (error) {
        console.error('Error initiating password reset:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for resetting password via token
app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    const email = verifyResetToken(token);

    if (!email) {
        res.status(400).json({ error: "Invalid or expired reset token" });
        return;
    }

    const db = client.db("VGReview");
    const usersCollection = db.collection('Users');

    try {
        // Find the user by email
        const user = await usersCollection.findOne({ email: email });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Update the user's password with the new password
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { password: newPassword, resetToken: null } }
        );

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



const clientID = "3xkf3mqu8ca2j83dwpurhsr69ck7b3";
const authorization = "shv9tq3bjpw8cxlbivhjh4v71vr1rc";

app.post('/api/games', async (req, res) => {
    try {
        const { limit, offset, genre, search } = req.body; // Receive genre and search term from request body

        let query = `
            fields name, cover.url, total_rating_count, first_release_date, total_rating, summary;
            offset ${offset};
        `;

        if (search) { // If search term is provided, add it to the query
            query += `search "${search}";
                      where total_rating_count > 10;
                      limit 500;`;
        } else if (genre) { // If genre is provided, add it to the query
            query += `sort total_rating_count desc;
                      sort total_rating desc;
                      sort first_release_date desc;
                      where total_rating_count > 100 & genres.name = "${genre}";
                      limit ${limit};`;
        } else { // If neither search nor genre is provided, include sorting and filtering
            query += `
                where total_rating_count > 100;
                sort total_rating_count desc;
                sort total_rating desc;
                sort first_release_date desc;
                limit ${limit};
            `;
        }

        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Client-ID": clientID,
                Authorization: `Bearer ${authorization}`
            },
            body: query
        });

        console.log("REQ: ", req.body);
        console.log("QUERY: ", query);


        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }

        const games = await response.json();
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/games/gameName', async (req, res) => {
    try {

        const { gameName, gameId } = req.body;

        let query = `
            fields name, cover.url, total_rating_count, first_release_date, total_rating, summary, involved_companies.company.name, platforms.name;
            where id = ${gameId};
            limit 1;
        `;


        console.log("GAME-NAME: ", gameName);
        console.log("GAME-ID: ", gameId);


        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Client-ID": clientID,
                Authorization: `Bearer ${authorization}`
            },
            body: query
        });

        if (!response.ok) {
            throw new Error('Failed to fetch game details');
        }

        const games = await response.json();
        console.log(games);
        res.json(games);
    } catch (error) {
        console.error('Error fetching game details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/reviews', async (req, res, next) => {
    try {
        const { textBody, rating, videoGameId, displayName } = req.body;
        console.log("Request Body:", req.body);

        // Check if the required data is present in the request body
        if (!textBody || !rating || !videoGameId || !displayName) {
            return res.status(400).json({ error: "Missing required data in the request body." });
        }

        const db = client.db("VGReview");
        
        // Check if the user has already reviewed this game
        const existingReview = await db.collection('Reviews').findOne({
            videoGameId: videoGameId,
            displayName: displayName
        });

        if (existingReview) {
            // If the user has already reviewed this game, return an error
            return res.status(400).json({ error: "You have already reviewed this game." });
        }

        // Insert the new review since the user has not reviewed this game before
        const newReview = {
            dateWritten: new Date(),
            textBody: textBody,
            rating: rating,
            videoGameId: videoGameId,
            displayName: displayName
        };

        await db.collection('Reviews').insertOne(newReview);

        // Update the game rating in the VideoGames collection
        const result = await db.collection('VideoGames').findOne({ videoGameId: videoGameId });
        if (result) {
            const ovrRating = result.rating;
            const reviewCount = result.reviewCount;
            const newRating = ((ovrRating * reviewCount) + rating) / (reviewCount + 1);

            await db.collection('VideoGames').updateOne(
                { videoGameId: videoGameId },
                { $set: { rating: newRating, reviewCount: reviewCount + 1 } }
            );

            return res.status(200).json({ newRating: newRating, message: "Review submitted successfully." });
        } else {
            // If the game doesn't exist in the database, add it
            const newGame = {
                videoGameId: videoGameId,
                rating: rating,
                reviewCount: 1
            };
            await db.collection('VideoGames').insertOne(newGame);
            return res.status(200).json({ message: "Game added and reviewed." });
        }
    } catch (e) {
        console.error("Failed to submit review:", e);
        return res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

//Get for given users recent reviews
app.get('/api/reviews/search/:displayName', async (req, res) => {
    const { displayName } = req.params; // Extract the display name from the route parameters

    try {
        const db = client.db("VGReview");
        const reviewsCollection = db.collection('Reviews');

        // Search for reviews by display name
        const reviews = await reviewsCollection.find({ displayName: displayName }).toArray();

        // Send the found reviews in the response
        res.status(200).json({ reviews: reviews });
    } catch (error) {
        console.error('Error searching reviews by display name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/getRecentReviews', async (req, res, next) => {
    // incoming: pageSize 
    // outgoing: error

    const { pageSize = 10 } = req.body;
    var error = '';

    try {
        const db = client.db("VGReview");
        const collection = db.collection('Reviews');

        let skip = 0;
        let allReviews = [];

        while (true) {
            const result = await collection
                .find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .toArray();

            if (result.length === 0) {
                break; 
            }

            allReviews = allReviews.concat(result);
            skip += pageSize;
        }

        var ret = { recentReviews: allReviews };
    } catch (e) {
        error = e.toString();
        var ret = { error: error };
    }
    res.status(200).json(ret);
});


/*app.post('/api/reviews', async (req, res, next) => {
    // incoming: displayName, videoGameId, rating
    // outgoing: error

    const { textBody, rating, videoGameId, displayName } = req.body;
    console.log(req.body);
    const newReview = {
        dateWritten: new Date(), // Set current date as dateCreated
        textBody: textBody,
        rating: rating,
        videoGameId: videoGameId,
        displayName: displayName
    };
    var error = '';

    try {
        const db = client.db("VGReview");
        await db.collection('Reviews').insertOne(newReview);
        const result = await db.collection('VideoGames').findOne({ videoGameId: videoGameId });
        if (result) {
            const ovrRating = result.rating;
            const reviewCount = result.reviewCount;
            const newRating = ((ovrRating * reviewCount) + rating) / (reviewCount + 1);
            await db.collection('VideoGames').updateOne({ videoGameId: videoGameId }, { $set: { rating: newRating, reviewCount: (reviewCount + 1) } });
            error = 'Game found';
            var ret = { newRating: newRating, error: error };
        } else {
            const newGame = {
                videoGameId: videoGameId,
                rating: rating,
                reviewCount: 1
            };
            await db.collection('VideoGames').insertOne(newGame);
            error = "Game added";
            var ret = { error: error };
        }
    } catch (e) {
        error = e.toString();
    }

    res.status(200).json(ret);
});*/

app.get('/api/user/games/:userId', async (req, res) => {
    const userId = req.params.userId;
    const db = client.db("VGReview");
    const usersCollection = db.collection('Users');

    try {
        // Find the user by user ID
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Extract the game array from the user object
        const games = user.games || [];

        res.status(200).json({ games: games });
    } catch (error) {
        console.error('Error fetching user games:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/addGame', async (req, res, next) => {
    // incoming: email, videoGameId
    // outgoing: error

    const { email, videoGameId } = req.body;
    var error = '';

    try {
        const db = client.db("VGReview");
        const result = await db.collection('Users').findOne({ email: email });
        const gameFind = await db.collection('Users').findOne({ email: email, games: videoGameId });
        const gameCheck = await db.collection('VideoGames').findOne({ videoGameId: videoGameId });

        //if game isn't in VideoGames, add it
        if (!gameCheck) {
            const newGame = {
                videoGameId: videoGameId,
                rating: null,
                reviewCount: 0
            };
            await db.collection('VideoGames').insertOne(newGame);
        }

        if (result) {
            if (gameFind) {
                error = "Game already in library!"
            } else {
                //add game to library
                await db.collection('Users').updateOne(
                    { email: email },
                    { $push: { games: videoGameId } }
                );
                error = "Game successfully added to your library!";
            }
        } else {
            error = "User not found!";
        }
    } catch (e) {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/getReviews', async (req, res, next) => {
    // incoming: videoGameId
    // outgoing: error

    const { videoGameId } = req.body;
    var error = '';

    try {
        const db = client.db("VGReview");
        const result = await db.collection('Reviews').find({ videoGameId: videoGameId }, { _id: 0, textBody: 1, rating: 1, videoGameId });
        if (result) {
            const reviews = await result.toArray();
            var ret = { reviews: reviews};
        } else {
            error = "Game not found!";
            var ret = { error: error };
        }
    } catch (e) {
        error = e.toString();
    }
    res.status(200).json(ret);
});

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