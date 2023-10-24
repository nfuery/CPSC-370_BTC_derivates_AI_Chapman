// Data Structures for CLOB
type Order = {
  id: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
};

type OrderBook = Order[];

// Data Structures for AMM
type Reserve = {
  tokenX: number;
  tokenY: number;
};

type Liquidity = {
  proportion: number;
};
// Functions for CLOB
function placeOrder(order: Order, orderBook: OrderBook): OrderBook {
  const newOrderBook = [...orderBook, order];
  newOrderBook.sort((a, b) => b.price - a.price);
  return newOrderBook;
}

function cancelOrder(id: string, orderBook: OrderBook): OrderBook {
  return orderBook.filter(order => order.id !== id);
}

function matchOrders(orderBook: OrderBook): { matchedOrders: Order[], newOrderBook: OrderBook } {
  const matchedOrders: Order[] = [];
  const newOrderBook = [...orderBook];

  for (let i = 0; i < newOrderBook.length; i++) {
    for (let j = i + 1; j < newOrderBook.length; j++) {
      if (newOrderBook[i].price === newOrderBook[j].price && newOrderBook[i].type !== newOrderBook[j].type) {
        matchedOrders.push(newOrderBook[i], newOrderBook[j]);
        newOrderBook.splice(j, 1);
        newOrderBook.splice(i, 1);
        i--;
        break;
      }
    }
  }

  return { matchedOrders, newOrderBook };
}
// Functions for AMM
function addLiquidity(amount: Reserve, currentReserve: Reserve): Reserve {
  return {
    tokenX: currentReserve.tokenX + amount.tokenX,
    tokenY: currentReserve.tokenY + amount.tokenY,
  };
}

function removeLiquidity(liquidity: Liquidity, currentReserve: Reserve): { removedAmounts: Reserve, newReserve: Reserve } {
  const removedAmounts = {
    tokenX: currentReserve.tokenX * liquidity.proportion,
    tokenY: currentReserve.tokenY * liquidity.proportion,
  };

  return {
    removedAmounts,
    newReserve: {
      tokenX: currentReserve.tokenX - removedAmounts.tokenX,
      tokenY: currentReserve.tokenY - removedAmounts.tokenY,
    },
  };
}

function swap(tokenToRemove: 'tokenX' | 'tokenY', amountToRemove: number, currentReserve: Reserve): { calculatedAmount: number, newReserve: Reserve } {
  let calculatedAmount;
  let newReserve;

  if (tokenToRemove === 'tokenX') {
    calculatedAmount = amountToRemove * (currentReserve.tokenY / currentReserve.tokenX);
    newReserve = {
      tokenX: currentReserve.tokenX - amountToRemove,
      tokenY: currentReserve.tokenY + calculatedAmount,
    };
  } else {
    calculatedAmount = amountToRemove * (currentReserve.tokenX / currentReserve.tokenY);
    newReserve = {
      tokenX: currentReserve.tokenX + calculatedAmount,
      tokenY: currentReserve.tokenY - amountToRemove,
    };
  }

  return { calculatedAmount, newReserve };
}
