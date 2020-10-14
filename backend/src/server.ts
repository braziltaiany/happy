import express from 'express';

const app = express();

app.get('/users', (request, response) => {
  //return response.send('teste');
  return response.json({ message: 'teste' });
});

app.listen(3333);
