
const express=require("express")
const fs = require('fs')
const si = require('systeminformation');
const router=express.Router()
const path = require('path');
let messages="jhjdcskhjhcfsiyhfsciufvsyuifcsyugfsvyu"
var CryptoJS = require("crypto-js");

router.get("/" , (req,res)=>{
    res.send("Hello World")
  })




// create a file and read file syystem path

router.post('/create-file', (req, res) => {
    const { fileName, content } = req.body;

    // Validate input
    if (!fileName || !content) {
        return res.status(400).json({ error: 'fileName and content are required!' });
    }

    const folderPath = path.join(__dirname, 'filesystem');

    // Ensure the folder exists
    fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
            return res.status(500).json({ error: 'Failed to create directory' });
        }

        const filePath = path.join(folderPath, fileName);

        const encrypted = CryptoJS.AES.encrypt(content, messages).toString();
        console.log("Encrypted:", encrypted);
        

        // Write content to the file inside the folder
        fs.writeFile(filePath, encrypted, (err) => {
            if (err) {
                console.error('Error creating file:', err);
                return res.status(500).json({ error: 'Failed to create file' });
            }
            res.status(200).json({ message: `File '${fileName}' created successfully in /filesystem! ` });
        });
    });
});

// router.post('/create-file', (req, res) => {
//     const { fileName, content } = req.body;

//     // Validate input
//     if (!fileName || !content) {
//         return res.status(400).json({ error: 'fileName and content are required!' });
//     }

 

//     // Write content to the file
//     fs.writeFile(fileName, content, (err) => {
//         if (err) {
//             console.error('Error creating file:', err);
//             return res.status(500).json({ error: 'Failed to create file' });
//         }
//         res.status(200).json({ message: `File '${fileName}' created successfully!` });
//     });
// });



// delete file system  ......................

router.delete("/delete-file", async (req, res) => {
    const { fileName } = req.body;

    if (!fileName) {
        return res.status(400).json({ error: "fileName is required!" });
    }

    try {
        // Go up from 'routes' to 'server' folder
        // const filePath = path.join(__dirname, "..", fileName);
           // Correctly build the file path to include the file name
           const filePath = path.join(__dirname, 'filesystem', fileName);

        console.log("Attempting to delete:", filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: `File '${fileName}' not found at ${filePath}` });
        }

        await fs.promises.unlink(filePath);
        res.status(200).json({ message: `File '${fileName}' deleted successfully!` });
    } catch (err) {
        console.error("Error deleting file:", err);
        res.status(500).json({ error: "Failed to delete file" });
    }
});
// readfile system  ......................................

router.post('/read', async (req, res) => {
    const { fileName } = req.body;

    if (!fileName) {
        return res.status(400).json({ error: 'File name is required!' });
    }

    try {
        // Correctly build the file path to include the file name
        const filePath = path.join(__dirname, 'filesystem', fileName);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: `File '${fileName}' not found.` });
        }

        // Read the file content asynchronously
        const data = await fs.promises.readFile(filePath, 'utf8');

                const bytes = CryptoJS.AES.decrypt(data, messages);
                        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                        console.log("Decrypted:", decrypted);

        res.status(200).json({ content:  decrypted , filePath });
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Failed to read the file.' });
    }
});

//::::::::::::: ======== Storage :::::::::::::::

router.get('/storage', async (req, res) => {
    try {
        const diskData = await si.fsSize();
        console.log(diskData)
        const storage = diskData.map(disk => ({
            mount: disk.mount,
            total: (disk.size / (1024 ** 3)).toFixed(2) + ' GB',
            used: (disk.used / (1024 ** 3)).toFixed(2) + ' GB',
            free: (disk.size - disk.used) / (1024 ** 3).toFixed(2) + ' GB',
            type: disk.type
        }));

        res.json(storage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch storage information', details: err.message });
    }
});




module.exports=router