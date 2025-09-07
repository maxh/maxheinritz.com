---
title: Annual ledger
layout: post
tags: [money]
---

For the past few years I've been tracking my income and expenses in a Google Spreadsheet. I find that it provides a liberating sense of "controlling my own destiny" when it comes to money.

Previously, I used [mint.com](https://en.wikipedia.org/wiki/Intuit_Mint). Mint was decent but imperfect: connections required constant maintenance, it didn't support all my accounts, and it was hard to customize. So when its shutdown was announced in late 2023, I took that as an opportunity to reevaluate my goals when it comes to this sort of thing.

## Link to template

[\[TEMPLATE\] Annual Ledger](https://docs.google.com/spreadsheets/d/1dnkJR0HPyEaYQcSjEUTDvD8sO_W7TBDl2vaG9rlGl8M/edit?gid=302876574)

## Goals

- Track all expense transactions (including cash, Venmo, trading fees, transit)
- Track all income transactions (including wage income, taxable dividends, interest, etc)
- View summary statistics (monthly savings rate, monthly expenses, average credit card rewards percentage, etc)
- Chart expenses by category ("condo electricity"), category group ("condo"), month, etc with consistent colors and some interactivity
- Track credit card rewards per expense transaction
- Calculate estimated income tax (for quarterly payments, ISO option AMT optimization)

## Non-goals

- I don't amortize big expenses. I follow a cash basis rather than an accrual basis, meaning I record when the money moves in and out of my accounts rather than when expenses are more abstractly incurred or revenue is earned.
- I don't follow a budget. Fortunately, I've saved enough that I don't really have any hard guidelines. On the contrary, maybe having a "must spend" budget could be useful to force me to indulge every so often.
- Automated data import isn't that important to me. I don't mind manually entering rows. I find that it encourages me to be more intentional with expenses and more appreciative of income. To co-opt Anaïs Nin, "We track expenses to taste life twice, in the moment and in retrospect."
- I prefer not to depend on domain-specific software maintained by other people. To save money, to avoid vendor lock-in, privacy, etc. I'm ok with using Google workspace tools, they have always been a favorite of mine.

## Design

On the expense side of the house, we have the following entities:

- Expense transaction
- Expense payment method
- Expense category
- Expense category group

On the income side, we have:

- Income transaction
- Income source

<img src="/images/annual-ledger-erd.png" alt="annual ledger erd" style="width:600px;"/>

## Usage

I have a separate spreadsheet for each year.

Daily, or near daily, I manually enter my expenses into the sheet. This typically involves inserting a new row, copy/pasting data from an existing row, tweaking the data to match. New transactions go at the top of the sheet so that I don't have to scroll down all the time.

The nice thing about it being manual is that the process is the same regardless of payment method. I don't need to worry about certain accounts syncing or not syncing. I try to save paper receipts and use them as a physical reminder about what to log. For online purchases, it's easy to log because I'm already on my computer.

If I have known upcoming expenses, I keep them as rows at the top with an empty row between them and past transactions. I drag the empty row up/down as future expenses take place.

Every week or so, I add income from paydays and when new dividends or interest get paid out. I also use this time to review summary statistics and explore charts.

## Mindset shift

I enjoy tight feedback loops, especially visual ones. It's so rewarding to want something, take action, get the thing, and iterate. I'm able to enter a flow state in the moment and (ideally) look back, point to the thing, and think "I did that!" with some sense of accomplishment.

Programming, of course, offers this experience in spades. Writing, drawing, and other forms of creative expression like cooking offer feedback loops as well.

The personal ledger sheet has created this sort of feedback loop for my financial health. It's gratifying to see the connection between my day-to-day activity and my savings rate. It's useful to compare my expense category breakdown to my values, and see whether I'm spending on what actually brings me joy.

## Behavior change

In terms to tactical changes, here are some changes I've made since starting to track expenses:

- Switched from Walgreens to Mark Cuban's Cost Plus Pharmacy for pharmaceuticals. It's much cheaper and way more convenient.
- Applied for and started using new credit cards. For example, I use the Bilt Rewards card to earn 1% rewards on HOA dues. More to talk about here but maybe I'll save that for another post.
- Walk and bike everywhere to avoid transit and ridesharing costs. I was already doing that but even more so now.
- Fewer "aspirational" expenses. Previously I would buy things I think I might need or might be something I would enjoy. I do less of that now.
- Spend more generously on gifts for friends and family. I treat a high number in that category as good.

## Future opportunities

This functionality could be implemented in a simple web application. There are a lot of personal finance applications out there already. But it's fun to build tools like this.

## Implementation in Google Sheets

The sheet relies heavily on the query operator. For example, to generate a list of expense totals by category:

```
=query(Expenses!$A:$G, "select G,sum(B) group by G order by sum(B) desc")
```

One hack to get new rows to insert correctly underneath the fixed header section: create a blank row immediately underneath the fixed header and hide it. Then when you insert a row at the top of the list, it's in the right spot. Experiment to see what I mean.

The trickiest part was getting the colors of the categories to be consistent between the tables and the charts. To generate colored cells next to each row:

```
=sparkline(1,{"charttype","bar";"color1",H5})
```

And then to use those colors for the slices within a bar chart:

```
function setColorsForAllCharts() {
  var sheet = SpreadsheetApp.getActiveSheet();

  var charts = sheet.getCharts();

  var tosearch = "Category breakdown";
  var tf = sheet.createTextFinder(tosearch);
  var all = tf.findAll();
  
  for (var i = 0; i < all.length; i++) {
    var headerCell = all[i];
    var chart = charts[i];
    if (chart != null) {
      setColorsForChart(sheet, headerCell, chart);
    }
  }
};

function setColorsForChart(sheet, headerCell, chart) {
    const headerRowIndex = headerCell.getRowIndex();
    const colorRowStartIndex = headerRowIndex + 2;
    const headerCol = headerCell.getColumn();
    const labelCol = headerCol + 1; 

    const range =  sheet.getRange(colorRowStartIndex, labelCol, 50);
    let colorCount = 0;
    for (let j = 1; j < 50; j++) {
      var colorCell = range.getCell(j,1);
      if (colorCell.isBlank()) {
        colorCount = j - 1;
        break;
      }
    }
    const colorRange = sheet.getRange(colorRowStartIndex, labelCol, colorCount);
    const values = colorRange.getValues().map(v => v[0]).filter(v => v != '#N/A');
    chart = chart.modify()
        .setOption('colors', values.map(() => '#FFF').concat(values.map(() => '#FFF')))
        .build();
    sheet.updateChart(chart); 
    chart = chart.modify()
        .setOption('colors', values)
        .build();
    sheet.updateChart(chart); 
}
```

## Entity relationship diagram

```
erDiagram
    USER ||--o{ EXPENSE_TRANSACTION : "owns"
    USER ||--o{ EXPENSE_METHOD : "owns"
    USER ||--o{ EXPENSE_CATEGORY : "owns"
    USER ||--o{ EXPENSE_CATEGORY_GROUP : "owns"

    EXPENSE_METHOD ||--o{ EXPENSE_TRANSACTION : "used for"
    EXPENSE_TRANSACTION ||--|{ EXPENSE_CATEGORY : "belongs to"
    EXPENSE_CATEGORY_GROUP ||--o{ EXPENSE_CATEGORY : "belongs to"

    USER {
        string qid
        string name
        string email
        string passwordHash
    }
    EXPENSE_METHOD {
        string userQid
        string qid
        string name
        decimal defaultRewardsPercentage
        string color
    }
    EXPENSE_TRANSACTION {
        string userQid
        string qid
        decimal amount
        date expenseDate
        string expenseCategoryQid
        string expenseMethodQid
        decimal rewardsPercentage
        string note
    }
    EXPENSE_CATEGORY_GROUP {
        string userQid
        string qid
        string name
    }
    EXPENSE_CATEGORY {
        string userQid
        string qid
        string name
    }

    USER ||--o{ INCOME_TRANSACTION : "owns"
    USER ||--o{ INCOME_SOURCE : "owns"

    INCOME_SOURCE ||--o{ INCOME_TRANSACTION : "provides"
    
    INCOME_TRANSACTION {
        string userQid
        string qid
        decimal amount
        string incomeSource
        string note
    }
    INCOME_SOURCE {
        string userQid
        string qid
        string name
    }
```
