import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
import { readFile } from 'node:fs/promises';
import { expressMiddleware as apolloMiddlware } from '@apollo/server/express4';
import { resolvers } from './resolver.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);


const typeDefs = await readFile('./schema.graphql', 'utf-8');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloServer.start();

app.use('/graphql', apolloMiddlware(apolloServer))

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Graphql Endpoint: http://localhost:${PORT}/graphql`);
});
