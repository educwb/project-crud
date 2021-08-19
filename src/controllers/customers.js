const CustomersModel = require('../models/customers')
const { crypto } = require('../utils/password')

const defaultTitle = 'Cadastro de Clientes'

function index(req, res) {
  res.render('register', {
    title: defaultTitle
  })
}

async function add(req, res) {
  // console.log('customers add ok')
  const {
    name,
    age,
    email,
    password,
  } = req.body

  const passwordCrypto = await crypto(password)
  
  const register = new CustomersModel({
    name,
    age,
    email,
    password: passwordCrypto,
  })

  register.save()
  
  // res.send('Cadastro realizado com sucesso!')
  // res.end()
  res.render('register', {
    title: defaultTitle,
    message: "Cadastro realizado com sucesso!",
  })
}

async function list(req, res) {
  const customers = await CustomersModel.find()

  res.render('list', {
    title: 'Listagem de Clientes',
    customers
  })
}

async function formEdit(req, res) {
  const { id } = req.query

  const customer = await CustomersModel.findById(id)

  res.render('edit', {
    title: 'Editar Cliente',
    customer
  })
}

async function edit(req, res) {
  const {
    name,
    age,
    email,
  } = req.body

  const { id } = req.params

  const customer = await CustomersModel.findById(id)

  customer.name = name
  customer.age = age
  customer.email = email

  customer.save()

  res.render('edit', {
    title: 'Editar Cliente',
    customer,
    message: 'Cliente alterado com sucesso!'
  })

}

async function remove(req, res) {
  const { id } = req.params

  const remove = await CustomersModel.deleteOne({ _id: id })

  // console.log(remove)

  if (remove.ok) {
    res.redirect('/list')
  }
}

module.exports = {
  add,
  index,
  list,
  formEdit,
  edit,
  remove
}