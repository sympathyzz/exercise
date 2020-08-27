function usd(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount/100);
}


function getAmount(play, perf) {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

function generateTxtResult(invoice, volumeCredits, totalAmount,plays) {
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    const play = playFor(plays, perf);
    result+=` ${play.name}: ${usd(getAmount(play, perf))} (${perf.audience} seats)\n`
  }
  result+=`Amount owed is ${usd(totalAmount)}\nYou earned ${volumeCredits} credits \n`;
  return result;
}

function getTotalAmount(invoice,plays){
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    const play = playFor(plays, perf);
    thisAmount = getAmount(play, perf);
    totalAmount += thisAmount;
  }
  return totalAmount;
}

function statement(invoice, plays) {
  let volumeCredits = 0;
  let totalAmount=0;
  volumeCredits = getvolumeCredits(invoice, plays);
  totalAmount=getTotalAmount(invoice,plays);
  return generateTxtResult(invoice, volumeCredits, totalAmount,plays);
}

function statementHtml(invoice, plays) {
  let volumeCredits = 0;
  let totalAmount=0;
  volumeCredits = getvolumeCredits(invoice, plays);
  totalAmount=getTotalAmount(invoice,plays);
  return generateHtmlResult(invoice, volumeCredits, totalAmount,plays);
}

function generateHtmlResult(invoice, volumeCredits, totalAmount,plays){
  let result=`<h1>Statement for ${invoice.customer}</h1>\n` +
  '<table>\n' +
  '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  for (let perf of invoice.performances) {
    const play = playFor(plays, perf);
    result+=`<tr><td>${play.name}</td><td>${perf.audience}</td><td>${usd(getAmount(play, perf))}</td></tr>\n`;
  }
  result+='</table>\n' +
  `<p>Amount owed is <em>${usd(totalAmount)}</em></p>\n` +
  `<p>You earned <em>${volumeCredits}</em> credits</p>\n`;
  return result;
}

function playFor(plays, perf) {
  return plays[perf.playID];
}

function getvolumeCredits(invoice, plays) {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = playFor(plays, perf);
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  }
  return volumeCredits;
}

module.exports = {
  statement,
  statementHtml
};
