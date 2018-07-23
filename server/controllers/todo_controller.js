const Todo = require('../models/todo')
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const { changeFormat } = require('../helpers/convertDate')
// const token = jwt.decode(req.headers.token)

module.exports = {

  readAllTodo (req, res) {
    const token = req.body.token
    const decoded = jwt.decode(token.slice(1, token.length-1))

    Todo.find({ UserId: decoded.id })
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(404).json('not found')
    })
  },

  getHistory (req, res) {
    const token = req.body.token
    const decoded = jwt.decode(token.slice(1, token.length-1))

    Todo.find({status: false, UserId: decoded.id})
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(404).json('not found')
    })
  },

  addTodo (req, res) {
    const token = req.body.token
    const decoded = jwt.decode(token.slice(1, token.length-1))
    const date = changeFormat(req.body.deadline)

    const newToDo = {
      activity: req.body.activity,
      deadline: date,
      description: req.body.description,
      UserId: decoded.id,
      status: true
    }

    Todo.create(newToDo, (err, success) => {

      if (err) {
        res.status(404).json('failed add todo')
      } else {
        res.status(201).json('success add todo')
      }

    })

  },

  checklistTodo (req, res) {
    Todo.findOneAndUpdate({ _id: req.body.id }, {status: false})
    .then(data => {
      res.status(200).json('success update data')
    })
    .catch(err => {
      res.status(404).json('failed update data')
    })
  },

  deleteTodo (req, res) {

    Todo.deleteOne({ _id: req.params.id })
    .then(success => {
      res.status(200).json('success delete data')
    })
    .catch(err => {
      res.status(404).json('failed delete data')
    })

  },

  updateHistory (req, res) {
    Todo.findOneAndUpdate({ _id: req.body.id }, {status: true})
    .then(data => {
      res.status(200).json('success update data')
    })
    .catch(err => {
      res.status(404).json('failed update data')
    })
  }

};
