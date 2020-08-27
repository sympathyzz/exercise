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

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    const play = playFor(plays, perf);
    thisAmount = getAmount(play, perf);
    totalAmount += thisAmount;
  }
  volumeCredits = getvolumeCredits(invoice, plays);
  return generateTxtResult(invoice, volumeCredits, totalAmount,plays);
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
};
