const jwt = require('jsonwebtoken');
const authorModule = require('../modules/authorModule');


// 👇 email validater
const validateEmail = (email) => {
    let filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return filter.test(email) ? true : false
};


/*------------------------------------------------------------------------------------------
 ## Author APIs /authors
 -> Create an author - atleast 5 authors
 -> Create a author document from request body. Endpoint: BASE_URL/authors
------------------------------------------------------------------------------------------ */


const createAuthor = async function (req, res) {
    try {
        const {
            fname,
            lname,
            title,
            email,
            password
        } = req.body;
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({
                status: false,
                msg: "Body is required"
            })
        }
        /*----------------------------------------------------------
        Validate the body data start 
        ----------------------------------------------------------*/
        if (!fname || !fname.trim()) return res.status(400).send({
            status: false,
            msg: "First Name must be required!"
        })

        if (!lname || !lname.trim()) return res.status(400).send({
            status: false,
            msg: "Last Name must be required!"
        })

        if (!title || !title.trim()) return res.status(400).send({
            status: false,
            msg: "Title must be required!"
        })

        if (['Mr', 'Mrs', 'Miss'].indexOf(title.trim()) == -1) return res.status(400).send({
            status: false,
            msg: "Title not valid, Please try with Mr Mrs and Miss"
        })

        if (!email || !email.trim()) return res.status(400).send({
            status: false,
            msg: "Email must be required!"
        })

        if (!validateEmail(email.trim())) return res.status(400).send({
            status: false,
            msg: "Please enter a valid email address!"
        })

        let emailIsExist = await authorModule.findOne({
            email: email.trim()
        }).catch(e => null)

        if (emailIsExist) return res.status(400).send({
            status: false,
            msg: `${email} is already exists try with another email address`
        })

        if (!password || !password.trim()) return res.status(400).send({
            status: false,
            msg: "Password must be required!"
        })

        let metaData = {
            fname,
            lname,
            title,
            email,
            password
        }
        const saveData = await authorModule.create(metaData)
        res.status(201).send({
            status: true,
            data: saveData
        })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}

const authorLogin = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) return res.status(400).send({
            status: false,
            msg: "body not present"
        })

        let {
            email,
            password
        } = req.body

        if (!email || !email.trim()) return res.status(400).send({
            status: false,
            msg: "email not present"
        })

        if (!validateEmail(email.trim())) return res.status(400).send({
            status: false,
            msg: "Please enter a valid email address!"
        })

        if (!password || !password.trim()) return res.status(400).send({
            status: false,
            msg: "password not present"
        })

        let findAuthor = await authorModule.findOne({
            email: email,
            password: password
        })
            .catch(error => null);

        if (!findAuthor) return res.status(401).send({
            status: false,
            msg: "email & password not valid"
        })

        //jwt.sign token creation
        const token = jwt.sign({
            authorId: findAuthor._id.toString()
        }, 'Group 27');

        res.status(200).send({
            status: true,
            data: token
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


module.exports.createAuthor = createAuthor
module.exports.authorLogin = authorLogin