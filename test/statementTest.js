const test = require('ava');
const { statement,statementHtml } = require('../src/statement');

test('test1:customer BigCo without performances', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': []
  }
  const result = statement(invoice, plays);

  t.is(result,'Statement for BigCo\nAmount owed is $0.00\nYou earned 0 credits \n');
});

test('test2:customer BigCo with a performance 20 hamlet', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 20,
      }
    ]
  }

  const result = statement(invoice, plays);

  t.is(result,'Statement for BigCo\n Hamlet: $400.00 (20 seats)\nAmount owed is $400.00\nYou earned 0 credits \n');
});

test('test3:customer BigCo with a performance 40 hamlet', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 40,
      }
    ]
  }

  const result = statement(invoice, plays);

  t.is(result,'Statement for BigCo\n Hamlet: $500.00 (40 seats)\nAmount owed is $500.00\nYou earned 10 credits \n');
});

test('test4:customer BigCo with a performance 31 hamlet', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 31,
      }
    ]
  }

  const result = statement(invoice, plays);

  t.is(result,'Statement for BigCo\n Hamlet: $410.00 (31 seats)\nAmount owed is $410.00\nYou earned 1 credits \n');
});

test('test5:customer BigCo with a performance 10 as-like', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 10,
      }
    ]
  }

  const result = statement(invoice, plays);

  t.is(result,'Statement for BigCo\n As You Like It: $330.00 (10 seats)\nAmount owed is $330.00\nYou earned 2 credits \n');
});

test('test6:customer BigCo with a performance 30 as-like', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 30,
      }
    ]
  }

  const result = statement(invoice, plays);

  t.is(result,'Statement for BigCo\n As You Like It: $540.00 (30 seats)\nAmount owed is $540.00\nYou earned 6 credits \n');
});

test('test7:customer BigCo with two performance 30 as-like and 40 othello', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 30,
      },
      {
        'playID': 'othello',
        'audience': 40,
      }
    ]
  }

  const result = statement(invoice, plays);

  t.is(result,'Statement for BigCo\n As You Like It: $540.00 (30 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,040.00\nYou earned 16 credits \n');
});


test('test8:customer BigCo with a performance 30 as-like 40 othello to html', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 30
      },
      {
        'playID': 'othello',
        'audience': 40,
      }
    ]
  }

  const result = statementHtml(invoice, plays);
  t.is(result, '<h1>Statement for BigCo</h1>\n' +
    '<table>\n' +
    '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
    '<tr><td>As You Like It</td><td>30</td><td>$540.00</td></tr>\n' +
    '<tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
    '</table>\n' +
    '<p>Amount owed is <em>$1,040.00</em></p>\n' +
    '<p>You earned <em>16</em> credits</p>\n');
});

const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy'
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy'
  }
}