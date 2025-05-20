
import utils from './utils.js';
import {ChromaClient, OpenAIEmbeddingFunction} from 'chromadb';

const chroma = new ChromaClient({
    path: process.env.CHROMA_PATH,
    auth: { provider: "basic", credentials: process.env.CHROMA_CREDENTIALS }
});

class ChromaService {

    async start() {
        try {
            const embedder = new OpenAIEmbeddingFunction({
                openai_api_key: process.env.OPENAI_API_KEY,
                openai_model: 'text-embedding-3-large'
            });
            const collection = await chroma.getCollection({
                name: "corso-llm-laramind",
                embeddingFunction: embedder
            });
            console.log(await collection.count());
            return true;
        } catch(err) {
            const embedder = new OpenAIEmbeddingFunction({
                openai_api_key: process.env.OPENAI_API_KEY,
                openai_model: 'text-embedding-3-large'
            });
            await chroma.createCollection({
                name: "corso-llm-laramind",
                embeddingFunction: embedder,
                metadata: { "hnsw:space": "cosine" }
            });
            return true;
        }
    }

    async train(trainingId, categoryId, content) {
        try {
            //carico la collection
            const embedder = new OpenAIEmbeddingFunction({
                openai_api_key: process.env.OPENAI_API_KEY,
                openai_model: 'text-embedding-3-large'
            });
            const collection = await chroma.getCollection({
                name: "corso-llm-laramind",
                embeddingFunction: embedder
            });
            //preparo i dati
            const random = utils.getRandomName(5);
            const metadatas = [], documents = [], ids = [];
            documents.push(content);
            const id = trainingId + '-' + random;
            const tokens = utils.contTokens(content);
            metadatas.push({
                trainingId, categoryId, tokens, id
            });
            ids.push(id);
            //aggiungo i dati
            const results = await collection.add({
                ids:ids,
                metadatas: metadatas,
                documents: documents
            });
            if(results.error) return false;
            //correct
            return true;
        } catch(e) {
            return false;
        }
    }

    async read(phrases) {
        try {
            //carico la collection
            const embedder = new OpenAIEmbeddingFunction({
                openai_api_key: process.env.OPENAI_API_KEY,
                openai_model: 'text-embedding-3-large'
            });
            const collection = await chroma.getCollection({
                name: "corso-llm-laramind",
                embeddingFunction: embedder
            });
            //cerco i dati
            const results = await collection.query({
                nResults: 30, queryTexts:phrases
            });
            if(results.error) return false;
            //elaboro la risposta
            const contents = results.documents[0];
            const metadatas = results.metadatas[0];
            const data = [];
            for(let index in contents) {
                data.push({
                    pageContent:contents[index],
                    metadata:metadatas[index]
                });
            }
            //correct
            return data;
        } catch(e) {
            return false;
        }
    }

    async delete(where) {
        try {
            //carico la collection
            const embedder = new OpenAIEmbeddingFunction({
                openai_api_key: process.env.OPENAI_API_KEY,
                openai_model: 'text-embedding-3-large'
            });
            const collection = await chroma.getCollection({
                name: "corso-llm-laramind",
                embeddingFunction: embedder
            });
            //elimino i contenuti
            await collection.delete({
                where: where
            });
            //correct
            return true;
        } catch(e) {
            return false;
        }
    }

}

export default new ChromaService();