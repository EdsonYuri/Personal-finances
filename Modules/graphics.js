const tableSwing = document.getElementById('tableSwing')

export let monthlyBalanceChart = new Chart(tableSwing, {
  type: 'pie',
  data: {
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      label: 'Balanço mensal',
      data: [12, 19],
      borderWidth: 1
    }]
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
      padding: 20,
    }
  }
});
