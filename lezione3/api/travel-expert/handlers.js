const chroma = require('../../libs/chroma.js');
const travelDocs = require('./docs.js');

/**
 * Search for travel information by country
 * @param {string} paese - Country code (IT, FR, DE, ES, GR, CH)
 * @param {Array<string>} keywords - Keywords to search for
 * @returns {Promise<Array>} - Search results
 */
async function searchByCountry(paese, keywords) {
  try {
    // Nation-specific search
    // Filter RAG results by the specified nation
    const where = { 
      project: 'travel-expert',
      categoryId: paese,
      trainingType: 'content'
    };
    
    // Join keywords into a query string
    const query = keywords.join(' ');
    
    // Search in ChromaDB with nation filter
    const results = await chroma.read(query, where);
    return results || [];
  } catch (error) {
    console.error('Search by Country Error:', error);
    throw error;
  }
}

/**
 * Search for travel information by keywords/interests
 * @param {Array<string>} keywords - Keywords/interests to search for
 * @returns {Promise<Array>} - Search results
 */
async function searchByKeywords(keywords) {
  try {
    // Initialize travel docs if not already initialized
    if (!travelDocs.initialized) {
      await travelDocs.initialize();
    }
    
    // Search for keywords in the travel-expert project
    const where = { 
      project: 'travel-expert',
      trainingType: 'keyword'
    };
    
    // Join keywords into a query string
    const query = keywords.join(' ');
    
    // Search in ChromaDB for keywords
    const keywordResults = await chroma.read(query, where);
    if (!keywordResults || keywordResults.length === 0) {
      return [];
    }
    
    // Process the results to extract content based on metadata
    const contentResults = [];
    
    for (const result of keywordResults) {
      if (result.metadata) {
        const { categoryId, contentId } = result.metadata;
        
        if (categoryId && contentId) {
          // Get the content section from the travel docs
          const contentSection = travelDocs.getContentSection(categoryId, parseInt(contentId));
          
          if (contentSection) {
            // Add the content to the results with metadata
            contentResults.push({
              content: contentSection,
              metadata: {
                country: categoryId,
                contentId: contentId,
                score: result.score || 0
              }
            });
          }
        }
      }
    }
    
    // Sort results by score (highest first)
    contentResults.sort((a, b) => b.metadata.score - a.metadata.score);
    
    return contentResults;
  } catch (error) {
    console.error('Search by Keywords Error:', error);
    throw error;
  }
}

module.exports = {
  searchByCountry,
  searchByKeywords
};
