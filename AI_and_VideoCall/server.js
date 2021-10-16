const express = require("express")

const app = express()
const server = require("http").Server(app)

const PDFDOCUMENT = require("pdfkit");
const nodemailer = require("nodemailer")

const {PythonShell} = require('python-shell');
const bodyParser = require("body-parser");

const io = require("socket.io")(server)
const fs = require("fs")

const open = require("opener")

const {
    v4 : uuidV4
} = require("uuid")

app.set("view engine", 'ejs')
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var ExpressPeerServer = require("peer").ExpressPeerServer;    
var options = {
  debug: true,
  allow_discovery: true,
};
let peerServer = ExpressPeerServer(server, options);
app.use("/peerjs", peerServer);


const mongoose = require("mongoose");
const User = require("./model/user.js");
const appointment = require("./model/appointment.js");
mongoose.connect(
  "mongodb+srv://user1:user@cluster0.vk6hu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;

function capitalize(str) {
  if(!str) return ""
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
}

app.get("/appointment/:roomID/test", (req, res) => {
    let roomId = req.params.roomID;
    // console.log(roomId);
    let prescriptionJson = {"prescription" : "some data"}
      appointment.updateOne({URL: roomId}, prescriptionJson)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated the item.`)
        }
        res.send(result)
      })
  })

  app.get("/:roomID/prescription", (req, res) => {
    let roomId = req.params.roomID;
    appointment.find({URL: roomId}, async function(err, data) {
        console.log({"prescription" : JSON.parse(data[0].prescription)});
      if(err) res.send(err)
      else res.render("index", {
        prescription : data[0].prescription,
        to1: data[0].patientEmail,
        to2: data[0].doctorEmail
      });
    //   else res.render("index", {prescription : JSON.parse(data[0].prescription)});
    })
    // res.send("okkk")
  })

  app.post("/sendPrescription", (req,res) => {
    let pdfDoc = new PDFDOCUMENT;
    let answer = req.body.prescription
    pdfDoc.pipe(fs.createWriteStream('Prescription.pdf'));

    pdfDoc.image('images/mobitemp3.png', 0, 0, {width: 615});
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();
    pdfDoc.moveDown();

    // pdfDoc.image('images/2022293.jpg', 0, 300, {width: 615});

    pdfDoc.font('Helvetica-Bold').fontSize(16).fillColor('black').text("Patient Name");
    pdfDoc.font('Helvetica').fontSize(12).fillColor('black').text(capitalize(answer.name.name));
    pdfDoc.moveDown();

    pdfDoc.font('Helvetica-Bold').fontSize(16).fillColor('black').text("Age");
    pdfDoc.font('Helvetica').fontSize(12).fillColor('black').text(answer.age.age);
    pdfDoc.moveDown();

    pdfDoc.font('Helvetica-Bold').fontSize(16).fillColor('black').text("Gender");
    pdfDoc.font('Helvetica').fontSize(12).fillColor('black').text(capitalize(answer.gender.gender));
    pdfDoc.moveDown();

    // pdfDoc.font('Helvetica').fontSize(12).fillColor('black').text("-------------------------------------------------------", 37, 170);
    pdfDoc.font('Helvetica-Bold').fontSize(16).fillColor('black').text("Symptoms");
    
    let val = 1;
    let obj = answer.symptoms
    let cursor = 240
    for(let symptom in obj){
      pdfDoc.font('Helvetica').fontSize(12).fillColor('black').text(capitalize(obj[symptom]));
      cursor += 20
      val++;
    }
    pdfDoc.moveDown();

    cursor += 40
    pdfDoc.font('Helvetica-Bold').fontSize(16).fillColor('black').text("Disease");
    pdfDoc.font('Helvetica').fontSize(12).fillColor('black').text(capitalize(answer.disease.disease));
    pdfDoc.moveDown();

    cursor += 40

    pdfDoc.font('Helvetica-Bold').fontSize(16).fillColor('black').text("Medication");

    val = 1;
    obj = answer.medication
    
    for(let med in obj){
      cursor += (val - 1) * 40
      console.log(obj[med]);
      let medicine = Object.keys(obj[med])[0]
      let mm = obj[med][medicine]
      // console.log(mm);
      pdfDoc.font('Helvetica').fontSize(12).fillColor('black').text(capitalize(medicine));
      cursor += 20
      if(mm.dosage_frequency)
            pdfDoc.font('Helvetica-Oblique').fontSize(12).fillColor('black').text("   - " + capitalize(mm.dosage_frequency));
      cursor += 20
      if(mm.duration)
            pdfDoc.font('Helvetica-Oblique').fontSize(12).fillColor('black').text("   - " + capitalize(mm.duration));
      cursor += 20
      if(mm.dosage) 
            pdfDoc.font('Helvetica-Oblique').fontSize(12).fillColor('black').text("   - " + capitalize(mm.dosage));
      val++;
      pdfDoc.moveDown();
    }


    cursor += 40

    pdfDoc.font('Helvetica-Bold').fontSize(16).fillColor('black').text("Advices");

    
    val = 1;
    obj = answer.advice
    for(let adv in obj) {
      pdfDoc.font('Helvetica').fontSize(12).fillColor('black').text(obj[adv]);
      cursor += 20
      val++;
    }

    pdfDoc.end();

    let transport = nodemailer.createTransport({
        service : "gmail",
        host: 'smtp.gmail.com',
        // port: 5500,
        // tls: {
        //     rejectUnauthorized: false
        // }
        auth: { 
           user: 'mobinursehealth@gmail.com',
           pass: 'laxminagar'
        }
    });
    // console.log(req.body);
    let to1 = req.body.to1
    let to2 = req.body.to2
    const message1 = {
        from: 'noreply@mobinurse.com', // Sender address
        to: to1,
        subject: 'Prescription', // Subject line
        text : "Your Prescription", // Plain text body
        attachments: [{
            filename: 'Prescription.pdf',
            path: './Prescription.pdf',
            contentType: 'application/pdf'
        }]
    };
    const message2 = {
        from: 'noreply@mobinurse.com', // Sender address
        to: to2,
        subject: 'Prescription', // Subject line
        text : "Your Diagnosis", // Plain text body
        attachments: [{
            filename: 'Prescription.pdf',
            path: './Prescription.pdf',
            contentType: 'application/pdf'
        }]
    };

    transport.sendMail(message1, function(err, info) {
        if (err) {
        console.log(err)
        } else {
        console.log(info);
        }
    });
    transport.sendMail(message2, function(err, info) {
        if (err) {
        console.log(err)
        } else {
        console.log(info);
        }
    });
  })




app.get("/", (req,res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get("/:room", (req,res) => {

    
    // const urlParams = new URLSearchParams(window.location.search);
    // const isDoc = urlParams.get('doc');
    // console.log("isDoc", isDoc);
    // console.log("query", req.query);
        let docName = ""
        let patName = ""
        let time = ""
        appointment.find({URL: req.params.room}, async function(err, data) {
            // console.log("77", data[0]);
            // console.log(req.params);
            // console.log(req.body);
            if(err) res.send(err)
            else {
                console.log("80", data);
                patName = data[0].patientName
                time = data[0].Time
                await User.findOne({username: data[0].doctorEmail}, function(err,userData) {
                    if(!err) {
                        docName = userData.name
                        res.render("room", {
                            roomId: req.params.room,
                            isDoc: req.query.doc === "true",
                            doctorName: docName,
                            patientName: patName,
                            doctorEmail: data[0].doctorEmail,
                            patientEmail: data[0].patientEmail,
                            time: time
                        })
                    }
                })
            }
        })
})

app.post("/jsonData",(req,res) => {

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', 'https://medimeet.herokuapp.com');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
      console.log("py");
      console.log(req.body);
      let options = {
          mode: 'text',
          pythonOptions: ['-u'], // get print results in real-time
          scriptPath: './ml', //If you are having python_test.py script in same folder, then it's optional.
          args: [req.body.url] //An argument which can be accessed in the script using sys.argv[1]
      };
        
      PythonShell.run('server.py', options, function (err, result) {
            if (err) throw err;
            // result is an array consisting of messages collected 
            //during execution of script.
            console.log('result: ', result.toString());
            // answer = JSON.parse(result.toString())

            let roomId = req.body.roomId;

            console.log(roomId);
    
            let prescriptionJson = {"prescription" : result.toString()}
            appointment.updateOne({URL: roomId}, prescriptionJson)
            .then(resultt => {
                const { matchedCount, modifiedCount } = resultt;
                if(matchedCount && modifiedCount) {
                    console.log(`Successfully updated the item.`)
                }
                console.log("\n\n\n\nbefore open\n\n\n\n");
                // open(`http://localhost:3000/${req.body.roomId}/prescription`, err => {
                // open(`https://medimeet.herokuapp.com/${req.body.roomId}/prescription`, err => {
                //     if(err) console.log(err)
                //     console.log("\n\n\n\nopen\n\n\n\n");
                // })
                open(`https://medimeet.herokuapp.com/${req.body.roomId}/prescription`)

                // res.redirect(`/${req.body.roomId}/prescription`)
            })




            // let prescriptionJson = {"prescription" : "some data"}
            // appointment.updateOne({URL: roomId}, prescriptionJson)
            // .then(result => {
            //     const { matchedCount, modifiedCount } = result;
            //     if(matchedCount && modifiedCount) {
            //         console.log(`Successfully updated the item.`)
            //     }
            //     res.send(result)
            // })

      })
})

// app.get("/:roomId/viewPrescription", (req,res) => {

//     res.render("index", {

//     })
// })

io.on('connection', socket => {
    socket.on("join-room", (roomId, userId) => {
        // console.log(roomId);
        // console.log(userId);
        socket.join(roomId)
        socket.to(roomId).emit('user-connected',userId)
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT || 3000)