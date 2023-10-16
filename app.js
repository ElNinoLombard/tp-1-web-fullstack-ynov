const express = require('express');
const firebase = require('firebase');

const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyC82QcqpgRq9_nwjQUwuVWuKO3-ftz4Veg",
  authDomain: "tp-1-fullstack-web-dev-ynov.firebaseapp.com",
  databaseURL: "https://tp-1-fullstack-web-dev-ynov-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tp-1-fullstack-web-dev-ynov",
  storageBucket: "tp-1-fullstack-web-dev-ynov.appspot.com",
  messagingSenderId: "1063655953759",
  appId: "1:1063655953759:web:285e47266cbd13f205d2ea",
  measurementId: "G-Y41M0R7CGP"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

app.use(express.json());

app.post('/api/items', (req, res) => {
  const newItem = req.body;
  const itemsRef = database.ref('/items');
  const newItemRef = itemsRef.push(newItem);
  res.status(201).json({ id: newItemRef.key });
});

// Read all items
app.get('/api/items', async (req, res) => {
  try {
    const itemsRef = database.ref('/items');
    const snapshot = await itemsRef.once('value');
    const items = snapshot.val();
    res.json(items);
  } catch (error) {
    console.error("An error occurred while fetching items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an item
app.put('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  const itemRef = database.ref(`/items/${itemId}`);
  itemRef.set(updatedItem);
  res.status(204).send();
});

// Delete an item
app.delete('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const itemRef = database.ref(`/items/${itemId}`);
  itemRef.remove();
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
