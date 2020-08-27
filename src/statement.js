function usd(){
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}


function getAmount(play,perf){
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

function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = usd();
  for (let perf of invoice.performances) {
	const play = plays[perf.playID];
	thisAmount=getAmount(play,perf);
    volumeCredits+=countCredits(perf.audience,play);
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}
function countCredits(audience,play){
  let credits=0;
  credits += Math.max(audience - 30, 0);
    if ('comedy' === play.type) credits += Math.floor(audience / 5);
    return credits
}
module.exports = {
  statement,
};
