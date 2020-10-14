import express from 'express';

const app = express();

app.use(express.json());

app.post('/users/:id', (request, response) => {
  //return response.send('teste');
  console.log(request.query);
  console.log(request.params);
  console.log(request.body);

  return response.json({ message: 'teste' });
});

app.listen(3333);
