const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express();
// middle ware
app.use(express.static('public')); //to access the files in public folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());
// file upload api
app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    // accessing the file
    const myFile = req.files.file;
    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/datasets/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({ name: myFile.name, path: `/${myFile.name}` });
    });
})

app.post('/python', (req, res) => {
    var pythonArr = ['interactive_constrained_clustering.py']
    for (const key in req.body) {
        pythonArr.push(req.body[key]);
    }
    console.log(pythonArr)

    const spawn = require('child_process').spawn;
    const ls = spawn('python', pythonArr);

    var values

    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        values = data.toString()
    });

    ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        console.log("values", values)
        return res.send({ name: values })
    });
})
app.listen(4500, () => {
    console.log('server is running at port 4500');
})