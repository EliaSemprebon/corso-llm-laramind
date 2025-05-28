const path = require('path');
const fs = require('fs/promises');

const utils = require('../../libs/utils.js');
const chroma = require('../../libs/chroma.js');

async function trainFaqFinder() {
  try {
    // Delete existing embeddings for faq-finder project
    await chroma.delete({ project: 'faq-finder' });
    
    // Load categories
    const categoriesPath = path.join(process.cwd(), 'docs', 'faqs', 'categories.json');
    const categories = JSON.parse(await fs.readFile(categoriesPath, 'utf8'));

    // Read all MD files from docs/faqs directory
    const faqsDir = path.join(process.cwd(), 'docs', 'faqs');
    const files = await fs.readdir(faqsDir);
    
    // Collect all training data
    const trainData = [];
    
    // Scorro i files
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      // Read and process each MD file
      const content = await fs.readFile(path.join(faqsDir, file), 'utf8');
      
      // Split content at --- delimiter
      const splits = utils.splitText(content).slice(1);
      
      // Collect training data
      for (const split of splits) {
        if (split.trim()) { // Only store non-empty splits
          const category = categories.find(c => c.filename === file);
          if (category) {
            trainData.push({
              content: split,
              metadata: {
                categoryId: category.id.toString(),
                trainingType: 'content'
              }
            });
          }
        }
      }
    }

    // Train all data in parallel
    const results = await Promise.all(
      trainData.map(data => 
        chroma.train('faq-finder', data.content, data.metadata)
      )
    );

    // Check if any training failed
    if (results.includes(false)) {
      // If any failed, delete everything and return failure
      await chroma.delete({ project: 'faq-finder' });
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('FAQ Finder Train Error:', error);
    throw error;
  }
}

module.exports = { trainFaqFinder };
