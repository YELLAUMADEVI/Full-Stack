const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Recipe schema
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

app.use(bodyParser.json());

// Get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new recipe
app.post('/api/recipes', async (req, res) => {
  const { title, ingredients } = req.body;

  if (!title || !ingredients) {
    return res.status(400).json({ message: 'Title and ingredients are required.' });
  }

  const newRecipe = new Recipe({ title, ingredients });

  try {
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});