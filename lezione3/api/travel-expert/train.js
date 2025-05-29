const fs = require('fs/promises');
const path = require('path');

const chroma = require('../../libs/chroma.js');
const utils = require('../../libs/utils.js');

async function trainTravelExpert() {
  try {
    // Delete existing embeddings for travel-expert project
    await chroma.delete({ project: 'travel-expert' });
    
    // Read all MD files from docs/travel directory
    const travelDir = path.join(process.cwd(), 'docs', 'travel');
    const files = await fs.readdir(travelDir);
    
    // Collect all training data
    const trainData = [];
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      // Read and process each MD file
      const content = await fs.readFile(path.join(travelDir, file), 'utf8');
      
      // Split content at --- delimiter
      const splits = utils.splitText(content).slice(1);
      
      // Collect training data
      for (const split of splits) {
        if (split.trim()) { // Only store non-empty splits
          const categoryId = path.basename(file, '.md').toUpperCase();
          trainData.push({
            content: split,
            metadata: {
              categoryId,
              trainingType: 'content'
            }
          });
        }
      }
    }

    console.log('Total contents to train:', trainData.length);

    // Train all data in parallel
    const results = await Promise.all(
      trainData.map(data => 
        chroma.train('travel-expert', data.content, data.metadata)
      )
    );
    console.log('Contents training ok');

    // Check if any training failed
    if (results.includes(false)) {
      // If any failed, delete everything and return failure
      await chroma.delete({ project: 'travel-expert' });
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Travel Expert Train Error:', error);
    throw error;
  }
}

async function trainTravelKeywords() {
  try {
    
    // Load keywords.json
    const keywordsPath = path.join(process.cwd(), 'docs', 'travel', 'keywords.json');
    const keywords = JSON.parse(await fs.readFile(keywordsPath, 'utf8'));
    
    // Collect all training data
    const trainData = [];
    
    // Process each country's keywords
    for (const countryData of keywords) {
      const lang = countryData.country; // e.g. "IT", "FR", etc.
      
      // Process each content block's keywords
      for (const content of countryData.contents) {
        const contentId = content.id;
        
        // Collect each keyword's training data
        for (const keyword of content.keywords) {
          trainData.push({
            content: keyword,
            metadata: {
              lang: lang,
              contentId: contentId,
              trainingType: 'keyword'
            }
          });
        }
      }
    }

    console.log('Total keywords to train:', trainData.length);
    
    // Split trainData into chunks of 50
    const chunkSize = 50
    const chunks = [];
    for (let i = 0; i < trainData.length; i += chunkSize) {
      chunks.push(trainData.slice(i, i + chunkSize));
    }
    
    console.log(`Processing ${chunks.length} chunks of ${chunkSize} elements`);

    // Process each chunk
    for (const chunk of chunks) {
      // Train chunk in parallel
      const results = await Promise.all(
        chunk.map(data => 
          chroma.train('travel-expert', data.content, data.metadata)
        )
      );

      // If any in this chunk failed, delete everything and return failure
      if (results.includes(false)) {
        await chroma.delete({ project: 'travel-expert' });
        return { success: false };
      }
    }
    console.log('Keywords training ok');
    
    return { success: true };
  } catch (error) {
    console.error('Travel Keywords Train Error:', error);
    throw error;
  }
}

module.exports = { trainTravelExpert, trainTravelKeywords };
