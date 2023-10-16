const express = require('express');
const firebase = require('firebase');

const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyC82QcqpgRq9_nwjQUwuVWuKO3-ftz4Veg",
  authDomain: "tp-1-fullstack-web-dev-ynov.firebaseapp.com",
  projectId: "tp-1-fullstack-web-dev-ynov",
  storageBucket: "tp-1-fullstack-web-dev-ynov.appspot.com",
  messagingSenderId: "1063655953759",
  appId: "1:1063655953759:web:285e47266cbd13f205d2ea",
  measurementId: "G-Y41M0R7CGP"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

app.use(express.json());

app.post('/api/items', async (req, res) => {
  try {
    const newItem = req.body;
    const itemsCollection = firestore.collection('items');
    const newItemDoc = await itemsCollection.add(newItem);
    res.status(201).json({ id: newItemDoc.id });
  } catch (error) {
    console.error("An error occurred while adding an item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const itemsCollection = firestore.collection('items');
    const itemsSnapshot = await itemsCollection.get();
    const items = [];
    itemsSnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    res.json(items);
  } catch (error) {
    console.error("An error occurred while fetching items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  const itemRef = firestore.collection('items').doc(itemId);
  itemRef.set(updatedItem, { merge: true });
  res.status(204).send();
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const itemRef = firestore.collection('items').doc(itemId);
    await itemRef.delete();
    res.status(204).send();
  } catch (error) {
    console.error("An error occurred while deleting an item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});