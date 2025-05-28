const path = require('path');
const fs = require('fs/promises');

/**
 * Class to handle travel documentation files
 */
class TravelDocs {
  constructor() {
    this.docsCache = {};
    this.initialized = false;
  }

  /**
   * Initialize the docs cache by loading all travel documentation files
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Get all MD files from the travel docs directory
      const travelDir = path.join(process.cwd(), 'docs', 'travel');
      const files = await fs.readdir(travelDir);
      
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        // Read the file content
        const filePath = path.join(travelDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        // Get country code from filename (e.g., 'it.md' -> 'IT')
        const countryCode = path.basename(file, '.md').toUpperCase();
        
        // Split content by "---" delimiter
        const sections = this.splitContent(content);
        
        // Store in cache
        this.docsCache[countryCode] = sections;
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing travel docs:', error);
      throw error;
    }
  }

  /**
   * Split content by "---" delimiter
   * @param {string} content - File content
   * @returns {Array<string>} - Array of content sections
   */
  splitContent(content) {
    // Split by "---" delimiter
    const sections = content.split('---').map(section => section.trim());
    
    // Remove the first section (usually just the title)
    if (sections.length > 0) {
      sections.shift();
    }
    
    return sections;
  }

  /**
   * Get content section for a specific country and content ID
   * @param {string} countryCode - Country code (IT, FR, DE, ES, GR, CH)
   * @param {number} contentId - Content ID (1-based index)
   * @returns {string|null} - Content section or null if not found
   */
  getContentSection(countryCode, contentId) {
    if (!this.initialized) {
      throw new Error('TravelDocs not initialized. Call initialize() first.');
    }
    
    // Check if country exists in cache
    if (!this.docsCache[countryCode]) {
      console.warn(`Country ${countryCode} not found in docs cache`);
      return null;
    }
    
    // Content ID is 1-based, array is 0-based
    const sectionIndex = contentId - 1;
    
    // Check if section exists
    if (sectionIndex < 0 || sectionIndex >= this.docsCache[countryCode].length) {
      console.warn(`Content ID ${contentId} out of range for country ${countryCode}`);
      return null;
    }
    
    return this.docsCache[countryCode][sectionIndex];
  }

  /**
   * Get all content sections for a specific country
   * @param {string} countryCode - Country code (IT, FR, DE, ES, GR, CH)
   * @returns {Array<string>|null} - Array of content sections or null if not found
   */
  getCountryContent(countryCode) {
    if (!this.initialized) {
      throw new Error('TravelDocs not initialized. Call initialize() first.');
    }
    
    return this.docsCache[countryCode] || null;
  }
}

// Create a singleton instance
const travelDocs = new TravelDocs();

module.exports = travelDocs;
