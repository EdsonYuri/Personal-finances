const displayModes = screen.availWidth < 960 ? 'mobile' : 'desktop'



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
function openModal() {
  let modal = document.getElementById('add_transaction')
  let cancel = document.querySelector('.cancelButton')
  modal.showModal()
  cancel.addEventListener('click', function (e) {
    e.preventDefault()
    modal.close()
  })
}
document.querySelector('dialog form button').addEventListener('click', e => {
  e.preventDefault()
  instaceInput()
  dataBase.dataRecord()
})

function determinesSubcategorys(Category, Type) {
  const category = document.getElementById(Category)
  const type = document.getElementById(Type)
  const expenseSubcategory = {
    'Selecione um tipo de despesa': '',
    Educação: 'Educação',
    Alimentação: 'Alimentação',
    Lazer: 'Lazer',
    Serviço: 'Serviço',
    Restaurante: 'Restaurante',
    Saúde: 'Saúde',
    Transporte: 'Transporte',
    Casa: 'Casa',
    SuperMercado: 'Super Mercado',
    Outro: 'Outro'
  }

  const revenuesSubcategory = {
    'Selecione um tipo de Receita': '',
    Salario: 'Salario',
    Juros: 'Juros',
    Dividendos: 'Dividendos',
    Benefícios: 'Benefícios',
    Freelancer: 'Freelancer',
    Venda: 'Venda',
    Bonificação: 'Bonificação',
    Bônus: 'Bônus',
    Ganhos: 'Ganhos',
    Outro: 'Outro',
  }
  switch (category.value) {
    case '1':
      type.innerHTML = ''
      for (let key in expenseSubcategory) {
        const option = document.createElement('option')
        option.innerText = key
        option.value = expenseSubcategory[key]
        type.appendChild(option)
        if (expenseSubcategory[key] == '') {
          option.setAttribute("disabled", "disabled")
        }
      }
      break;
    case '2':
      type.innerHTML = ''
      for (let key in revenuesSubcategory) {
        const option = document.createElement('option')
        option.innerText = key
        option.value = revenuesSubcategory[key]
        type.appendChild(option)
      }
      break;
  }
}
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
    this.revenuesByCategory = []
  }
  static yearFiltered = new Date().getFullYear()
  retriveRecord() {
    if (this.recoveredRegister.length === 0) {
      for (let i = 0; i <= this.id; i++) {
        if (localStorage.getItem(`chave${i}`) != undefined) {
          this.recoveredRegister.push(JSON.parse(localStorage.getItem(
            `chave${i}`
          )))
        }
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
      }).format(this.balance)
      }`
    if (this.balance < 0) this.balanceCard.style.color = 'red'

  }

  determineTransactionPerMonths() {
    let sumExpenses = 0
    let sum = 0
    function transactionsPerMonth(category, transactions, register) {
      sumExpenses = 0
      for (let i = 1; i <= 12; i++) {
        let monthTraveled = ''
        let year = new Date().getFullYear()
        i <= 9 ? monthTraveled = `0${i}` : monthTraveled = `${i}`
        register.filter(filtered => {
          transactions[0] = sum
          if (filtered.date.slice(5, 7) === monthTraveled
            && filtered.category === category
            && filtered.date.slice(0, 4) == DataManager.yearFiltered) {
            sum = sumExpenses += Number(filtered.value)
          }
        })
        transactions.push(sum)
        sumExpenses = 0
        sum = 0
      }
      transactions.shift()
    }
    transactionsPerMonth('1', this.ExpensesPerMonth, this.recoveredRegister)
    transactionsPerMonth('2', this.RevenuesPerMonth, this.recoveredRegister)
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
    let listExpenseByCategory = [
      ['Educação', 0],
      ['Alimentação', 0],
      ['Lazer', 0],
      ['Serviço', 0],
      ['Restaurante', 0],
      ['Saúde', 0],
      ['Transporte', 0],
      ['Casa', 0],
      ['Super Mercado', 0],
      ['Outro', 0],
    ]
    let listRevenuesByCategory = [
      ['Salario', 0],
      ['Juros', 0],
      ['Dividendos', 0],
      ['Benefícios', 0],
      ['Freelancer', 0],
      ['Venda', 0],
      ['Bonificação', 0],
      ['Bônus', 0],
      ['Ganhos', 0],
      ['Outro', 0],
    ]

    function listByCategory(category, values, ListByCategory) {
      for (let i in ListByCategory) {
        records.filter(e => {
          if (e.type == ListByCategory[i][0]
            && e.category == category
            && e.date.slice(0, 4) == DataManager.yearFiltered) {
            ListByCategory[i][1] += Number(e.value)
          }
        })
      }

      values.length = 0
      for (let i in ListByCategory) {
        values.push(ListByCategory[i][1])
      }
    }
    listByCategory('1', this.expenseByCategory, listExpenseByCategory)
    listByCategory('2', this.revenuesByCategory, listRevenuesByCategory)
  }

}
class DistributeValues extends DataManager {
  constructor() {
    super()
    this.expenseCard = document.getElementById('expenseValue')
    this.revenuesCard = document.getElementById('revenuesValue')
    this.balanceCard = document.getElementById('balanceValue')
    this.transactionsPerDay = []
    this.daysOfTransaction = []
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
            }).format(this.expense)
            }`
          break;
        case '2':
          this.revenues += Number(this.recoveredRegister[i].value)
          this.revenuesCard.innerHTML = `${new Intl.NumberFormat('PT-BR',
            {
              style: 'currency',
              currency: 'BRL'
            }).format(this.revenues)
            }`
          break;
      }
    }
  }

  monthlyTransactions() {
    let monthExpense = 0
    let monthRevenue = 0
    this.expensePerDay = []
    this.revenuesPerDay = []
    this.daysOfTransaction = []
    let monthSelected = Number(document.getElementById('monthTransactions').value.slice(5))
    let yearSelected = Number(document.getElementById('monthTransactions').value.slice(0, 4))
    this.transactionsPerMonth = this.recoveredRegister.filter(e => {
      if (e.date.slice(5, 7) == monthSelected
        && e.date.slice(0, 4) == yearSelected) {
        DataManager.yearFiltered = yearSelected
        return e
      }
    })
    const determineTransactionsPerDay = (categoryPerday, category) => {
      this.daysOfTransaction = []
      let dayOftransaction = 0
      for (let i in this.transactionsPerMonth) {
        if (this.transactionsPerMonth[i].date.slice(8) > dayOftransaction) {
          dayOftransaction = this.transactionsPerMonth[i].date.slice(8)
        }
      }
      for (let i = 1; i <= dayOftransaction; i++) {
        let month = monthSelected <= 9 ? `0${monthSelected}` : `${monthSelected}`
        let day = i <= 9 ? `0${i}` : `${i}`
        let value = 0
        for (let i in this.transactionsPerMonth) {
          if (this.transactionsPerMonth[i].date.slice(8) == day && this.transactionsPerMonth[i].category == category) {
            value += Number(this.transactionsPerMonth[i].value)
          }
        }
        categoryPerday.push(value)
        value = 0
        this.daysOfTransaction.push(`${day}-${month}`)
      }
    }

    determineTransactionsPerDay.bind(this)(this.expensePerDay, '1')
    determineTransactionsPerDay.bind(this)(this.revenuesPerDay, '2')
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
    this.row.id = this.id

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
    this.row.insertCell(2).innerHTML = this.type
    this.row.insertCell(3).innerHTML = this.description
    this.row.insertCell(4).innerHTML = `${new Intl.NumberFormat('PT-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }).format(this.value)
      }`

    let edit_register = document.createElement('button')
    let icon = document.createElement('img')
    icon.setAttribute('src', '../Assets/pen.png')
    edit_register.appendChild(icon)
    edit_register.setAttribute('img', './Assets/pen.png')
    edit_register.className = 'edit_register'
    edit_register.id = this.id
    edit_register.onclick = () => {
      localStorage.setItem(`chave${edit_register.id}`, `{ "category": "1", "type": "1", "date": "2023-01-01", "value": "0", "description": "Valor do registro alterado", "id": ${edit_register.id}} `)
      window.location.reload()
    }
    edit_register.onclick = () => {
      const modal = document.getElementById('editRecord')
      const cancelButton = document.getElementById('cancel_button')
      const confirmButton = document.getElementById('confirmButton')
      modal.showModal()
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
        if (registryChanges.type === '' && registryChanges.category !== '') {
          alert("Selecione um tipo da categoria escolhida")
        } else {
          dataManager.editRegister(registryChanges, edit_register.id)
        }

      }

    }
    let buttons = this.row.insertCell(5)
    let remove_button = document.createElement('button')
    remove_button.innerText = 'X'
    remove_button.className = 'button_Remove'
    remove_button.id = this.id
    remove_button.onclick = function () {
      localStorage.removeItem(`chave${remove_button.id}`)
      window.location.reload()
    }
    buttons.className = 'buttons'

    buttons.appendChild(edit_register)
    buttons.appendChild(remove_button)
  }

}
function loadTable(listTransactions = dataManager.recoveredRegister) {
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
  userInterface.interactiveButtons()
}
class UserInterface extends TransactionsTable {
  constructor() {
    super()
    this.menu = document.getElementById('navegation')
    this.modals = document.querySelector('dialog')
    this.content = document.getElementById('content')
    this.body = document.querySelector('body')
    this.transactionSearchModal = document.getElementById('transaction_search_modal')
    this.searchTransactionsForm = document.getElementById('search_transactions')
    this.cards = document.querySelector('.cards')
    this.createNavigationEventListeners()

  }
  createNavigationEventListeners() {
    document.querySelector('.open_navigation').addEventListener('click', () => {

      switch (this.menu.style.display) {
        case 'flex':
          this.menu.style.width = 0
          this.menu.style.display = 'none'
          this.content.style.overflow = 'auto'
          this.body.style.overflowY = 'auto'
          break;
        default:
          this.menu.style.width = '250px'
          this.menu.style.display = 'flex'
          this.content.style.overflowX = 'hidden'
          break;
      }
    })
  }

  controlsGridElements() {
    let values = [document.getElementById("balanceValue").innerText,
    document.getElementById("revenuesValue").innerText,
    document.getElementById("expenseValue").innerText
    ]
    let manyCharacters = undefined

    for (let i in values) {
      if (values[i].length >= 30) {
        manyCharacters = true
      }
    }
    if (manyCharacters === true && displayModes === 'mobile') {
      this.cards.style.justifyContent = 'start'
      this.cards.style.textAlign = 'start'
      document.querySelector('#main_of_management').style.paddingTop = '39px'
    } else if (manyCharacters !== true && displayModes === 'mobile') {
      this.cards.style.justifyContent = 'center'
      this.cards.style.textAlign = 'center'
    }
  }

  interactiveButtons() {
    const tableRows = document.querySelectorAll('tbody tr')

    if (screen.availWidth < 900) {
      for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].addEventListener('click', () => {
          const buttons = tableRows[i].lastChild

          switch (buttons.style.display) {
            case 'flex':
              buttons.style.display = 'none'
              tableRows[i].style.background = 'none'
              break;
            default:
              tableRows[i].style.background = 'linear-gradient(90deg, rgba(36,40,41,0.09987745098039214) 0%, #33455a 100%)'
              buttons.style.display = 'flex'
              buttons.style.position = 'absolute'
              buttons.style.right = '10px'
              break;
          }
        })
      }
      this.controlsGridElements()
    }
  }

  openTransactionSearch() {
    let research = document.getElementById('research')
    let cancel = document.getElementById('close_transaction_search_modal')
    document.getElementById('open_search').addEventListener('click', () => {
      this.transactionSearchModal.appendChild(this.searchTransactionsForm)
      this.transactionSearchModal.showModal()
      Array.from(this.searchTransactionsForm.children).forEach(child => {
        child.className = "fields";
      });
      this.searchTransactionsForm.style.display = 'flex'
    })
    cancel.onclick = () => {
      this.transactionSearchModal.close()
    }
    research.addEventListener('click', (e) => {
      e.preventDefault()
      this.transactionSearchModal.close()
    })
    this.interactiveButtons()
  }

  changeView() {
    let momentaryDisplay = screen.availWidth < 960 ? 'mobile' : 'desktop'
    if (momentaryDisplay !== displayModes) {
      window.location.reload()
    }
  }
}
const userInterface = new UserInterface()

class Graphics extends DistributeValues {
  constructor() {
    super()
    this.tableSwing = document.getElementById('tableSwing')
    this.expenseGraphic = document.getElementById('expenseByCategory')
    this.revenuesGraphic = document.getElementById('revenuesByCategory')
  }
  generateChart() {
    dataManager.retriveRecord()
    dataManager.expenseListByCategory(dataManager.recoveredRegister)
    this.expenseChart = new Chart(this.expenseGraphic, {
      type: 'pie',
      data: {
        labels: ['Educação', 'Alimentação', 'Lazer', 'Serviço', 'Restaurante', 'Saúde', 'Transporte', 'Casa', 'Super Mercado', 'Outro'],
        datasets: [{
          label: 'Valor em dinheiro',
          data: dataManager.expenseByCategory,
          backgroundColor: [
            'rgb(255, 99, 132',  
            'rgb(255, 205, 86',   
            'rgb(54, 162, 235',   
            'rgb(255, 159, 64)',   
            'rgb(153, 102, 255)',  
            'rgb(255, 99, 255)',   
            'rgb(75, 192, 192)',  
            'rgb(201, 203, 207)',  
            'rgb(255, 204, 92)',   
            'rgb(0, 204, 153)'     
          ],
          borderWidth: 1
        }]
      },
      options: {
        layout: {
          padding: 0,
        },
        resposive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Despesas',
            color: 'white',
            font: { size: 20 }
          },
          legend: {
            position: 'right',
            labels: {
              boxWidth: 10,
              color: '#9b9b9b',
            }
          }
        }
      }
    });
    this.monthlyBalanceChart = new Chart(this.tableSwing, {
      type: 'bar',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [{
          label: 'Receitas',
          data: distributeValues.RevenuesPerMonth,
          borderWidth: 1,
        },
        {
          label: 'Despesas',
          data: distributeValues.ExpensesPerMonth,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: '#9b9b9b'
            }
          },
          y: {
            ticks: {
              color: '#9b9b9b'
            }
          }
        },
        layout: {
          padding: 0
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#9b9b9b'
            }
          },
          title: {
            display: true,
            text: 'Balanço mensal',
            color: 'white',
            font: { size: 20 }
          }
        }
      }
    });
    this.revenuesChart = new Chart(this.revenuesGraphic, {
      type: 'pie',
      data: {
        labels: ['Salario', 'Juros', 'Dividendos', 'Benefícios', 'Freelancer', 'Venda', 'Bonificação', 'Bônus', 'Ganhos', 'Outro'],
        datasets: [{
          label: 'Valor em dinheiro',
          backgroundColor: [
            'rgb(191, 63, 127)',   
            'rgb(127, 191, 63)',   
            'rgb(63, 127, 191)',   
            'rgb(191, 127, 63)',   
            'rgb(127, 191, 191)',  
            'rgb(255, 102, 102)',  
            'rgb(204, 102, 255)',  
            'rgb(255, 153, 51)',   
            'rga(255, 204, 0)',    
            'rgb(0, 153, 153)'     
          ],
          data: dataManager.revenuesByCategory,
          borderWidth: 1,
        }]
      },
      options: {
        layout: {
          padding: 0
        },
        resposive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Receitas',
            color: 'white',
            font: { size: 20 }
          },
          legend: {
            position: 'right',
            labels: {
              color: '#9b9b9b',
              boxWidth: 10
            }
          }
        }
      }
    });
  }
  updateChart() {
    this.retriveRecord()
    this.monthlyTransactions()
    this.expenseListByCategory(this.transactionsPerMonth)
    this.expenseChart.data.datasets[0].data = this.expenseByCategory
    this.revenuesChart.data.datasets[0].data = this.revenuesByCategory
    this.monthlyBalanceChart.data.datasets[1].data = this.expensePerDay
    this.monthlyBalanceChart.data.datasets[0].data = this.revenuesPerDay
    this.monthlyBalanceChart.data.labels = this.daysOfTransaction
    this.expenseChart.update()
    this.revenuesChart.update()
    this.monthlyBalanceChart.update()
  }
}
let graphics = new Graphics()
graphics.generateChart()

document.getElementById('monthTransactions').onchange = () => {
  graphics.updateChart()
}
