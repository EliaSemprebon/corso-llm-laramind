import utils from './utils.js';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';

const COLLECTION_NAME = "corso-llm-laramind";

/**
 * Creates an OpenAI embedding function instance
 * @returns {OpenAIEmbeddingFunction} The configured embedding function
 */
function createEmbedder() {
    return new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY,
        openai_model: 'text-embedding-3-large'
    });
}

/**
 * Service class for interacting with ChromaDB
 * Handles vector storage and retrieval of documents
 */
class ChromaService {
    constructor() {
        this.client = new ChromaClient({
            path: process.env.CHROMA_PATH,
            auth: { 
                provider: "basic", 
                credentials: process.env.CHROMA_CREDENTIALS 
            }
        });
    }

    /**
     * Initializes the ChromaDB collection
     * Creates a new collection if it doesn't exist
     * @returns {Promise<boolean>} True if initialization was successful
     */
    async start() {
        try {
            const embedder = createEmbedder();
            const collection = await this.client.getCollection({
                name: COLLECTION_NAME,
                embeddingFunction: embedder
            });
            console.log(await collection.count());
            return true;
        } catch(err) {
            const embedder = createEmbedder();
            await this.client.createCollection({
                name: COLLECTION_NAME,
                embeddingFunction: embedder,
                metadata: { "hnsw:space": "cosine" }
            });
            return true;
        }
    }

    /**
     * Adds new content to the collection with specified project and metadata
     * @param {string} project - The project identifier
     * @param {Object} metadata - The metadata object containing categoryId, trainingType, and other fields
     * @param {string} content - The content to store
     * @returns {Promise<boolean>} True if content was added successfully
     */
    async train(project, metadata, content) {
        try {
            const embedder = createEmbedder();
            const collection = await this.client.getCollection({
                name: COLLECTION_NAME,
                embeddingFunction: embedder
            });

            // Prepare data for insertion
            const id = utils.getId();
            const tokens = utils.conTokens(content);
            const metadatas = [{
                project, tokens,
                id, ...metadata
            }];
            const documents = [content];
            const ids = [id];

            // Add data to collection
            const results = await collection.add({
                ids,
                metadatas,
                documents
            });

            return !results.error;
        } catch(e) {
            console.error('Error in train:', e);
            return false;
        }
    }

    /**
     * Queries the collection for similar content
     * @param {string[]} query - Array of query texts to search for
     * @param {Object} where - Filter criteria for the query
     * @returns {Promise<Array<{pageContent: string, metadata: Object}>>} Array of matching documents with metadata
     */
    async read(query, where = {}) {
        try {
            const embedder = createEmbedder();
            const collection = await this.client.getCollection({
                name: COLLECTION_NAME,
                embeddingFunction: embedder
            });

            // Query for similar content
            const results = await collection.query({
                where,
                nResults: 5,
                queryTexts: query
            });
            if (results.error) return false;

            // Format response data
            const documents = results.documents[0];
            const metadatas = results.metadatas[0];
            
            return documents.map((pageContent, index) => ({
                pageContent,
                metadata: metadatas[index]
            }));
        } catch(e) {
            console.error('Error in read:', e);
            return false;
        }
    }

    /**
     * Deletes documents from the collection based on where clause
     * @param {Object} where - The filter criteria for deletion
     * @returns {Promise<boolean>} True if deletion was successful
     */
    async delete(where) {
        try {
            const embedder = createEmbedder();
            const collection = await this.client.getCollection({
                name: COLLECTION_NAME,
                embeddingFunction: embedder
            });

            await collection.delete({ where });
            return true;
        } catch(e) {
            console.error('Error in delete:', e);
            return false;
        }
    }
}

export default new ChromaService();
