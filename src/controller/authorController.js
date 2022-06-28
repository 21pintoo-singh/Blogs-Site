const authorModel = require('../model/AuthorModel');
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {

    try {
        let data = req.body
        let authorCreated = await authorModel.create(data)
        return res.status(201).send({ status: true, msg: "Author created successfully", data: authorCreated })
    }
    catch (err) {
        return res.status(500).send({ status:false, message: err.message })
    }
}

const loginAuthor = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data //extract params

        let author = await authorModel.findOne({ email: email, password: password });

        if (!author)
            return res.status(401).send({ status: false, msg: "Invalid login credential", });

        let token = jwt.sign(                    //making the token
            {    authorId: author._id.toString(),
                project: "blogging-Site"
            },
            'author-blog'
        );
        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "Author successfully logged in", data: token });
    }
    catch (err) {
        return res.status(500).send({ status:false, message: err.message })
    }
};


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor