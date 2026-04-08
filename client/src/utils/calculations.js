export function calculateSettlements(members = [], expenses = []) {
    const balances = {};
    members.forEach(m => balances[m] = 0);
  
    expenses.forEach(expense => {
      if (!balances[expense.payer]) balances[expense.payer] = 0;
      balances[expense.payer] += expense.amount;
      
      const sharesObj = expense.shares || {};
      for (const [userId, share] of Object.entries(sharesObj)) {
        if (!balances[userId]) balances[userId] = 0;
        balances[userId] -= share;
      }
    });
  
    const creditors = [];
    const debtors = [];
    
    for (const [person, balance] of Object.entries(balances)) {
      if (balance > 0.01) creditors.push({ person, amount: balance });
      else if (balance < -0.01) debtors.push({ person, amount: Math.abs(balance) });
    }
  
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);
  
    const settlements = [];
    let c = 0, d = 0;
  
    while (c < creditors.length && d < debtors.length) {
      const creditor = creditors[c];
      const debtor = debtors[d];
  
      const settleAmount = Math.min(creditor.amount, debtor.amount);
      
      if (settleAmount > 0.01) {
        settlements.push({
          from: debtor.person,
          to: creditor.person,
          amount: parseFloat(settleAmount.toFixed(2))
        });
      }
  
      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;
  
      if (creditor.amount < 0.01) c++;
      if (debtor.amount < 0.01) d++;
    }
  
    return settlements;
}