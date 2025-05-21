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
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      // Read and process each MD file
      const content = await fs.readFile(path.join(faqsDir, file), 'utf8');
      const lines = content.split('\n');
      lines.shift(); // Skip first line
      const remainingContent = lines.join('\n');
      
      // Split content at --- delimiter
      const splits = utils.splitText(remainingContent);
      
      // Store each split in ChromaDB
      for (const split of splits) {
        if (split.trim()) { // Only store non-empty splits
          const category = categories.find(c => c.filename === file);
          if (category) {
            await chroma.train('faq-finder', {
              categoryId: category.id.toString(),
              trainingType: 'content'
            }, split);
          }
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('FAQ Finder Train Error:', error);
    throw error;
  }
}

module.exports = { trainFaqFinder };
