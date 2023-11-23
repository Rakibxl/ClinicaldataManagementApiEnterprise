/*
Milestone 3. Web Server with Implementation of all of use-cases and Integration with Android Mobile App
for a Patient Clinical Data management application with the express framewor.
Functionality Implemented
● Create Patient Information
● View Patient Information
● Add Patient test Information
● List all Patients Information 
● Remove Patient Information
Team Members - Group 4
Michael Akinola - 201251688 
Jemine Collins - 301275173 
Ahmed Rakib - 301243511 
Temiloluwa Omoniwa - 301209585
*/
const fs = require('fs')
const express = require('express')

const app = express()
const port =  3000

const cors = require('cors');
app.use(cors());

const patients =  JSON.parse(
  fs.readFileSync(`${__dirname}/data/patients.json`)
)
const testRecord = JSON.parse(
  fs.readFileSync(`${__dirname}/data/patients_test.json`)
)

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// get the patient list in the form of JSON
app.get('/patients', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: patients.length,
    data: {patients}
    })
});

// get the patient test list in the form of JSON
app.get('/tests', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: testRecord.length,
    data: {testRecord}
    })
});

// add a new patient to the list
app.post('/patients',  (req, res) => {
  const newId = patients[patients.length - 1].id + 1
  const newPatient =Object.assign({id: newId}, req.body)

patients.push(newPatient)
fs.writeFile(`${__dirname}/data/patients.json`, JSON.stringify(patients), err =>{
  res.status(201).json({
    status: 'Patient Info Updated',
    data: {
      patient: newPatient
    }
  })
})

});

// add a new patient test to the list
app.post('/patients/:id',  (req, res) => {
  const id = req.params.id * 1
  const newTest =Object.assign({id: id}, req.body)

testRecord.push(newTest)
fs.writeFile(`${__dirname}/data/patients_test.json`, JSON.stringify(testRecord), err =>{
  res.status(201).json({
    status: 'Patient Test Updated',
    data: {
      test: newTest
    }
  })
})

});

//search for a patient on the list

app.get(`/patients/:id`, (req, res) => {

  const id = req.params.id * 1
  const patient  =  patients.find(el => el.id === id)

  if (!patient) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      patient
    }
  })
})

// get a patient test in the form of JSON
app.get('/tests/:id', (req, res) => {

  const id = req.params.id * 1
  const tests = testRecord.filter(el => el.id ===  id)
  console.log(tests)

  if (!tests) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      tests
    }
  })
})


//remove patient from  the list
app.delete(`/patients/:id`, (req,res) =>{
 
    if (req.params.id * 1 > patients.length) {
      return res.status(404).json({
        status: 'fail',
        message:  'Invalid ID'
      })
    }
    res.status(204).json({
      status: 'success',
      data: null
    })
})


// set the server to listen at port
app.listen(port, () => console.log(`Server listening at port ${port}`));

