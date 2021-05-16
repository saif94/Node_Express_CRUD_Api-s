const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const courses = [
  {id:1, name: 'Machine Learning'},
  {id:2, name: 'Artificial Intelligence'},
  {id:3, name: 'Deep Learning'}
];

app.get('/', (req,res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req,res) => {
  res.send(courses);
})

app.post('/api/courses', (req,res) => {
    
  const { error } = validateCourse(req.body);
    if(error) {
      return res.status(400).send(error.details[0].message);
    }

    const course ={
      id: courses.length + 1,
      name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id', (req,res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course){
    return res.status(404).send('Course not Found!!!');    
  }
  res.send(course.name);
});

app.put('/api/courses/:id', (req,res) =>{
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course){
    return res.status(404).send('Course not Found!!!');    
  }
  const {error} = validateCourse(req.body);

  if(error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
})

app.delete('/api/courses/:id', (req,res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course){
    return res.status(404).send('Course not Found!!!');    
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  
  res.send(course);
});

function validateCourse(course){
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });

  return schema.validate(course);
}

const port = process.env.Port || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));