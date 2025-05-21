const chroma = require('../../libs/chroma.js');

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
    // TODO: Implement new keywords search logic
    // This function will be implemented with new logic
    
    // For now, return an empty array
    return [];
  } catch (error) {
    console.error('Search by Keywords Error:', error);
    throw error;
  }
}

module.exports = {
  searchByCountry,
  searchByKeywords
};
