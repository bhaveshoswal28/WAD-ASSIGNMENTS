const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://bhavesh_main:bhavesh@cluster0.c0sttkv.mongodb.net/trial?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    const studentSchema = new mongoose.Schema({
      Name: String,
      Roll_No: Number,
      WAD_Marks: Number,
      DSBDA_Marks: Number,
      CNS_Marks: Number,
      CC_Marks: Number,
      AI_marks: Number
    });

    const Student = mongoose.model('Student', studentSchema);

    const studentsData = [
      {
        Name: 'ABC',
        Roll_No: 111,
        WAD_Marks: 25,
        DSBDA_Marks: 25,
        CNS_Marks: 25,
        CC_Marks: 25,
        AI_marks: 25
      },
      {
        Name: 'XYZ',
        Roll_No: 222,
        WAD_Marks: 20,
        DSBDA_Marks: 15,
        CNS_Marks: 30,
        CC_Marks: 35,
        AI_marks: 40
      }
    ];

    Student.insertMany(studentsData)
      .then(() => {
        console.log('Documents inserted successfully.');
//{DSBDA_Marks:15}
        app.get('/students', async (req, res) => {
          try {
            const totalCount = await Student.countDocuments();
            const students = await Student.find();

            const tableRows = students.map((student) => {
              return `
                <tr>
                  <td>${student.Name}</td>
                  <td>${student.Roll_No}</td>
                  <td>${student.WAD_Marks}</td>
                  <td>${student.DSBDA_Marks}</td>
                  <td>${student.CNS_Marks}</td>
                  <td>${student.CC_Marks}</td>
                  <td>${student.AI_marks}</td>
                </tr>
              `;
            });

            const table = `
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>RollNo</th>
                    <th>WAD</th>
                    <th>DSBDA</th>
                    <th>CNS</th>
                    <th>CC</th>
                    <th>AI</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows.join('')}
                </tbody>
              </table>
            `;

            res.send(`Total Count: ${totalCount}<br><br>${table}`);
          } catch (err) {
            console.error('Failed to get students', err);
            res.send('Failed to retrieve students');
          }
        });

        app.get('/students/dsbda', async (req, res) => {
          try {
            const students = await Student.find({ DSBDA_Marks: { $gt: 20 } });
            const studentNames = students.map((student) => student.Name);
            res.send(`Students who got more than 20 marks in DSBDA: ${studentNames.join(', ')}`);
          } catch (err) {
            console.error('Failed to get students', err);
            res.send('Failed to retrieve students');
          }
        });

        app.get('/students/update/:rollNo/:marks', async (req, res) => {
            const { rollNo, marks } = req.params;
            try {
              const filter = { Roll_No: rollNo };
              const update = {   WAD_Marks: marks, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_marks: 10  };
              const updatedStudent = await Student.findOneAndUpdate(filter, update, { new: true });
              if (updatedStudent) {
                res.send('Marks updated successfully');
              } else {
                res.send('Student not found');
              }
            } catch (err) {
              console.error('Failed to update marks', err);
              res.send('Failed to update marks');
            }
          });          

        // List the names of students who got more than 25 marks in all subjects
        app.get('/students/highmarks', async (req, res) => {
            try {
            const students = await Student.find({
                $or: [
                  { WAD_Marks: { $gt: 25 } },
                  { DSBDA_Marks: { $gt: 25 } },
                  { CNS_Marks: { $gt: 25 } },
                  { CC_Marks: { $gt: 25 } },
                  { AI_marks: { $gt: 25 } }
                ]
            }, { Name: 1, _id: 0 });
        
            res.json(students);
            } catch (err) {
            console.error('Failed to fetch students', err);
            res.send('Failed to fetch students');
            }
        });

        app.get('/students/lowmarks', async (res) => {
            try {
              const students = await Student.find({
                $or: [
                  { WAD_Marks: { $lt: 50 } },
                  { DSBDA_Marks: { $lt: 50 } },
                  { CNS_Marks: { $lt: 50 } },
                  { CC_Marks: { $lt: 50 } },
                  { AI_marks: { $lt: 50 } }
                ]
              }, { Name: 1, _id: 0 });
          
              res.json(students);
            } catch (err) {
              console.error('Failed to fetch students', err);
              res.send('Failed to fetch students');
            }
          });          

        app.get('/students/delete/:rollNo', async (req, res) => {
          const { rollNo } = req.params;
          try {
            const deletedStudent = await Student.findOneAndDelete({ Roll_No: rollNo });
            if (deletedStudent) {
              res.send('Student deleted successfully');
            } else {
              res.send('Student not found');
            }
          } catch (err) {
            console.error('Failed to delete student', err);
            res.send('Failed to delete student');
          }
        });

        app.listen(port, () => {
          console.log(`Server running on port ${port}`);
        });
      })
      .catch((err) => {
        console.error('Failed to insert documents', err);
      });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });