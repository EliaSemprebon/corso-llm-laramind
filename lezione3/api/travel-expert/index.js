const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const chroma = require('../../libs/chroma.js');
const utils = require('../../libs/utils.js');

const router = express.Router();

// Controller for travel expert functionality
async function travelExpert(req, res) {
  try {
    // Empty controller for now - will be implemented step by step
  } catch (error) {
    console.error('Travel Expert Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Controller for training travel expert content
async function trainTravelExpert(req, res) {
  try {
    // Delete existing embeddings for travel-expert project
    await chroma.delete({ project: 'travel-expert' });
    
    // Read all MD files from docs/travel directory
    const travelDir = path.join(process.cwd(), 'docs', 'travel');
    const files = await fs.readdir(travelDir);
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      // Read and process each MD file
      const content = await fs.readFile(path.join(travelDir, file), 'utf8');
      const lines = content.split('\n');
      lines.shift(); // Skip first line
      const remainingContent = lines.join('\n');
      
      // Split content at --- delimiter
      const splits = utils.splitText(remainingContent);
      
      // Store each split in ChromaDB
      for (const split of splits) {
        if (split.trim()) { // Only store non-empty splits
          const categoryId = path.basename(file, '.md').toUpperCase();
          await chroma.train('travel-expert', {
            categoryId,
            trainingType: 'content'
          }, split);
        }
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Travel Expert Train Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Controller for training travel expert keywords
async function trainTravelKeywords(req, res) {
  try {
    // Delete existing embeddings for travel-keywords project
    await chroma.delete({ project: 'travel-keywords' });
    
    // Load keywords.json
    const keywordsPath = path.join(process.cwd(), 'docs', 'travel', 'keywords.json');
    const keywords = JSON.parse(await fs.readFile(keywordsPath, 'utf8'));
    
    // Process each country's keywords
    for (const countryData of keywords) {
      const lang = countryData.country; // e.g. "IT", "FR", etc.
      
      // Process each content block's keywords
      for (const content of countryData.contents) {
        const contentId = content.id;
        
        // Train each individual keyword
        for (const keyword of content.keywords) {
          await chroma.train('travel-keywords', {
            categoryId: lang,
            trainingType: 'keyword',
            lang: lang,
            contentId: contentId
          }, keyword);
        }
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Travel Keywords Train Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Routes
router.post('/travel', travelExpert);
router.post('/train', trainTravelExpert);
router.post('/train/keywords', trainTravelKeywords);

module.exports = router;
