let infoInput = {}
class InfoInput {
  constructor(category, type, date, value, description) {
    this.category = category.value
    this.type = type.value
    this.date = date.value
    this.value = value.value
    this.description = description.value
  }
  dataValidate() {
    for (let i in this) {
      if (this[i] != "" && this[i] != undefined && this[i] != null) {
        continue
      } else {
        return false
      }
    }
  }
}

class DataBase {
  constructor() {
    this.id = 0
  }
  addIdStorage() {
    if (localStorage.length == 0) {
      this.id = 0
      localStorage.setItem('id', this.id)
    } else {
      let nextId = Number(localStorage.getItem('id')) + 1
      this.id = nextId
      localStorage.setItem('id', nextId)
    }
  }
  dataRecord() {

    if (infoInput.dataValidate() != false) {
      alert('dados validados com sucesso')
      this.addIdStorage()
      infoInput.id = this.id
      localStorage.setItem(`chave${this.id}`,
        `${JSON.stringify(infoInput)}`)
      window.location.reload()
    } else {
      alert('campos ainda não prenchidos')
    }
  }
}
let dataBase = new DataBase()

document.querySelector('form button').addEventListener('click', e => {
  e.preventDefault()
  instaceInput()
  dataBase.dataRecord()
})
function instaceInput() {
  infoInput = new InfoInput(
    category = document.getElementById('typeCategory'),
    type = document.getElementById('type'),
    date = document.getElementById('date'),
    value = document.getElementById('value'),
    description = document.getElementById('description')
  )
  infoInput.dataValidate()
}
class DataManager {
  constructor() {
    this.expense = 0
    this.revenues = 0
    this.balance = 0
    this.recoveredRegister = []
    this.id = Number(localStorage.getItem('id'))
    this.ExpensesPerMonth = []
    this.RevenuesPerMonth = []
    this.expenseByCategory = []
  }
  retriveRecord() {
    for (let i = 0; i <= this.id; i++) {
      if (localStorage.getItem(`chave${i}`) != undefined) {
        this.recoveredRegister.push(JSON.parse(localStorage.getItem(
          `chave${i}`
        )))
      }

    }
  }
  determineBalance() {
    this.balance += this.revenues
    this.balance -= this.expense
    this.balanceCard.innerHTML = `${new Intl.NumberFormat('PT-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }).format(this.balance)}`
    if (this.balance < 0) this.balanceCard.style.color = 'red'

  }

  determineTransactionPerMonths() {
    this.sumExpenses = 0
    for (let i = 1; i <= 12; i++) {
      let monthTraveled = ''
      i < 9 ? monthTraveled = `0${i}` : monthTraveled = `${i}`
      this.recoveredRegister.filter(filtered => {
        this.ExpensesPerMonth[0] = this.sum
        if (filtered.date.slice(5, 7) === monthTraveled && filtered.category === '1') {
          this.sum = this.sumExpenses += Number(filtered.value)
        }
      })
      this.ExpensesPerMonth.push(this.sum)
      this.sumExpenses = 0
      this.sum = 0
    }
    this.ExpensesPerMonth.shift()
    //revenues
    for (let i = 1; i <= 12; i++) {
      let monthTraveled = ''
      i < 9 ? monthTraveled = `0${i}` : monthTraveled = `${i}`
      this.recoveredRegister.filter(filtered => {
        this.RevenuesPerMonth[0] = this.sum
        if (filtered.date.slice(5, 7) === monthTraveled && filtered.category === '2') {
          this.sum = this.sumExpenses += Number(filtered.value)
        }
      })
      this.RevenuesPerMonth.push(this.sum)

      this.sumExpenses = 0
      this.sum = 0
    }
    this.RevenuesPerMonth.shift()
  }

  filterTransactions(transaction) {
    this.filteredTransactions = this.recoveredRegister
    if (transaction.category != '') {
      this.filteredTransactions = this.filteredTransactions.filter(e => {
        return e.category == transaction.category
      })
    }
    if (transaction.date != '') {
      this.filteredTransactions = this.filteredTransactions.filter(e => {
        return e.date == transaction.date
      })
    }
    if (transaction.type != '') {
      this.filteredTransactions = this.filteredTransactions.filter(e => {
        return e.type == transaction.type
      })
    }
    if (transaction.description != '') {
      this.filteredTransactions = this.filteredTransactions.filter(e => {
        return e.description == transaction.description
      })
    }
    if (transaction.value != '') {
      this.filteredTransactions = this.filteredTransactions.filter(e => {
        return e.value == transaction.value
      })
    }
  }

  editRegister(changes, id) {
    let selectedRecord = JSON.parse(localStorage.getItem(`chave${id}`))
    for (let i in changes) {
      if (changes[i] != '') {
        selectedRecord[i] = changes[i]
      }
    }
    localStorage.setItem(`chave${id}`, JSON.stringify(selectedRecord))
    window.location.reload()
  }
  expenseListByCategory(records) {
    //this.retriveRecord()
    let ListExpenseByCategory = [
      ['Education', 0],
      ['Food', 0],
      ['Leisure', 0],
      ['Service', 0],
      ['Restaurant', 0],
      ['Health', 0],
      ['Transport', 0],
      ['Home', 0],
      ['Supermarket', 0],
      ['other', 0],
    ]
    for (let i in ListExpenseByCategory) {
      records.filter(e => {
        if (e.type == ListExpenseByCategory[i][0] && e.category == '1') {
          ListExpenseByCategory[i][1] += Number(e.value)
        }
      })
    }
    if (this.expenseByCategory.length === 0) {
      for (let i in ListExpenseByCategory) {
        this.expenseByCategory.push(ListExpenseByCategory[i][1])
      }
    } else {
      this.expenseByCategory = []
      for (let i in ListExpenseByCategory) {
        this.expenseByCategory.push(ListExpenseByCategory[i][1])
      }
    }
  }
}
class DistributeValues extends DataManager {
  constructor() {
    super()
    this.expenseCard = document.getElementById('expenseValue')
    this.revenuesCard = document.getElementById('revenuesValue')
    this.balanceCard = document.getElementById('balanceValue')
  }
  determinesTransactions() {
    this.retriveRecord()
    this.annualTransactions()
    this.determineBalance()
    this.determineTransactionPerMonths()
  }
  annualTransactions() {
    for (let i in this.recoveredRegister) {
      switch (this.recoveredRegister[i].category) {
        case '1':
          this.expense += Number(this.recoveredRegister[i].value)
          this.expenseCard.innerHTML = `${new Intl.NumberFormat('PT-BR',
            {
              style: 'currency',
              currency: 'BRL'
            }).format(this.expense)}`
          break;
        case '2':
          this.revenues += Number(this.recoveredRegister[i].value)
          this.revenuesCard.innerHTML = `${new Intl.NumberFormat('PT-BR',
            {
              style: 'currency',
              currency: 'BRL'
            }).format(this.revenues)}`
          break;
      }
    }
  }

  monthlyTransactions() { //rever o código
    let monthExpense = 0
    let monthRevenue = 0
    let monthSelected = Number(document.getElementById('monthTransactions').value.slice(5))
    this.transactionsPerMonth = this.recoveredRegister.filter(e => {
      if (e.date.slice(5, 7) == monthSelected) {
        return e
      }
    })
    console.log(this.transactionsPerMonth)
    for (let i in this.transactionsPerMonth) {
      if (this.transactionsPerMonth[i].category == '1') {
        monthExpense += Number(this.transactionsPerMonth[i].value)
      } else {
        monthRevenue += Number(this.transactionsPerMonth[i].value)
      }
    }
    this.expenseCard.innerHTML = `${new Intl.NumberFormat('PT-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }).format(monthExpense)
      }`

    this.revenuesCard.innerHTML = `${new Intl.NumberFormat('PT-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }).format(monthRevenue)
      }`

  }
}
let dataManager = new DataManager()
let distributeValues = new DistributeValues()
distributeValues.determinesTransactions()

class TransactionsTable {
  constructor(category, date, type, description, value, id) {
    this.category = category
    this.date = date
    this.type = type
    this.description = description
    this.value = value
    this.id = id
  }

  addCell() {
    this.tableBody = document.getElementById('tableBody')
    this.row = tableBody.insertRow()

    let date = {
      day: this.date.slice(8),
      month: this.date.slice(5, 7),
      year: this.date.slice(0, 4)
    }
    switch (this.category) {
      case '1':
        this.category = 'Despesa'
        break;
      case '2':
        this.category = 'Receita'
        break;
    }
    this.row.insertCell(0).innerHTML = this.category
    this.row.insertCell(1).innerHTML = `${date.day}/${date.month}/${date.year}`
    switch (this.type) {
      case 'Education':
        this.type = 'Educação'
        break;
      case 'Food':
        this.type = 'Alimentação'
        break;
      case 'Leisure':
        this.type = 'Lazer'
        break;
      case 'Service':
        this.type = 'Serviço'
        break;
      case 'Restaurant':
        this.type = 'Restaurante'
        break;
      case 'Health':
        this.type = 'Saúde'
        break;
      case 'Transport':
        this.type = 'Transporte'
        break;
      case 'Home':
        this.type = 'Casa'
        break;
      case 'Supermarket':
        this.type = 'SuperMercado'
        break;
      case 'other':
        this.type = 'Outro'
        break;
    }
    this.row.insertCell(2).innerHTML = this.type
    this.row.insertCell(3).innerHTML = this.description
    this.row.insertCell(4).innerHTML = `${new Intl.NumberFormat('PT-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }).format(this.value)}`

    let edit_register = document.createElement('button')
    edit_register.innerText = 'X'
    edit_register.className = 'edit_register'
    edit_register.id = this.id
    edit_register.onclick = () => {
      localStorage.setItem(`chave${edit_register.id}`, `{"category":"1","type":"1","date":"2023-01-01","value":"0","description":"Valor do registro alterado","id":${edit_register.id}}`)
      window.location.reload()
    }
    edit_register.onclick = () => {
      const modal = document.querySelector('dialog')
      const editForm = document.getElementById('editForm')
      const cancelButton = document.getElementById('cancelButton')
      const confirmButton = document.getElementById('confirmButton')
      modal.showModal()
      editForm.addEventListener('click', e => {
        e.preventDefault()
      })
      cancelButton.onclick = () => {
        modal.close()
      }
      confirmButton.onclick = () => {
        let registryChanges = new InfoInput(
          document.getElementById('editCategory'),
          document.getElementById('editType'),
          document.getElementById('editDate'),
          document.getElementById('editValue'),
          document.getElementById('editDescription')
        )
        dataManager.editRegister(registryChanges, edit_register.id)
      }

    }
    this.row.insertCell(5).appendChild(edit_register)

    let remove_button = document.createElement('button')
    remove_button.innerText = 'X'
    remove_button.className = 'button_Remove'
    remove_button.id = this.id
    remove_button.onclick = function () {
      localStorage.removeItem(`chave${remove_button.id}`)
      window.location.reload()
    }
    this.row.insertCell(6).appendChild(remove_button)
  }
}
function loadTable(listTransactions = dataManager.recoveredRegister) {
  dataManager.retriveRecord()
  for (let i in listTransactions) {
    let transactionsTable = new TransactionsTable(
      listTransactions[i].category,
      listTransactions[i].date,
      listTransactions[i].type,
      listTransactions[i].description,
      listTransactions[i].value,
      listTransactions[i].id
    )
    transactionsTable.addCell()
  }
}

function filterTransactions() {
  document.getElementById('search_transactions').addEventListener('click', e => {
    e.preventDefault()
  })
  let searchInputs = new InfoInput(
    category = document.getElementById('searchTypeCategory'),
    type = document.getElementById('searchType'),
    date = document.getElementById('searchDate'),
    value = document.getElementById('searchValue'),
    description = document.getElementById('searchDescription')
  )
  dataManager.filterTransactions(searchInputs)
  document.getElementById('tableBody').innerHTML = ''
  for (let i in dataManager.filteredTransactions) {
    let transactionsTable = new TransactionsTable(
      dataManager.filteredTransactions[i].category,
      dataManager.filteredTransactions[i].date,
      dataManager.filteredTransactions[i].type,
      dataManager.filteredTransactions[i].description,
      dataManager.filteredTransactions[i].value,
      dataManager.filteredTransactions[i].id
    )
    transactionsTable.addCell()
  }
}

function updateChart() {
  distributeValues.monthlyTransactions()
  dataManager.expenseListByCategory(distributeValues.transactionsPerMonth)
  console.log(dataManager.expenseByCategory)
  expenseByCategory.data.datasets[0].data = dataManager.expenseByCategory
  expenseByCategory.update()
}

// Graphics
const tableSwing = document.getElementById('tableSwing')
const expense = document.getElementById('expenseByCategory')
dataManager.retriveRecord()
dataManager.expenseListByCategory(dataManager.recoveredRegister)

const monthlyBalanceChart = new Chart(tableSwing, {
  type: 'bar',
  data: {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [{
      label: 'Receitas',
      data: distributeValues.RevenuesPerMonth,
      borderWidth: 1
    },

    {
      label: 'Despesas',
      data: distributeValues.ExpensesPerMonth,
      borderWidth: 1
    }
    ]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Balanço mensal',
        color: 'white',
        font: { size: 20 }
      },
    },
    layout: {
      //padding: 20,
    }
  }
});
let expenseByCategory = new Chart(expense, {
  type: 'bar',
  data: {
    labels: ['Educação', 'Alimentação', 'Lazer', 'Serviço', 'Restaurante', 'Saúde', 'Transporte', 'Casa', 'Super Mercado', 'Outro'],
    datasets: [{
      label: '# of Votes',
      data: dataManager.expenseByCategory,
      borderWidth: 1
    }]
  },
  options: {
    indexAxis: 'y',
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
