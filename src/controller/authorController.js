const authorModel = require("../model/AuthorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        let result = await authorModel.create(data);
        res.status(201).send(result);
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports.createAuthor = createAuthor