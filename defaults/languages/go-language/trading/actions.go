package trading

import (
	"encoding/json"
	"log"
	"os"
)

type Order struct {
	OrderType string  `json:"type"`
	Symbol    string  `json:"symbol"`
	Quantity  float64 `json:"quantity"`
	Timestamp uint64  `json:"timestamp"`
}

var orders = make([]Order, 0)
var Timestamp uint64 = 0

func pushOrder(order Order) {
	orders = append(orders, order)
}

func createAndPushOrder(orderType string, symbol string, quantity float64) {
	pushOrder(Order{
		OrderType: orderType,
		Symbol:    symbol,
		Quantity:  quantity,
		Timestamp: Timestamp,
	})
}

func Buy(symbol string, quantity float64) {
	createAndPushOrder("Buy", symbol, quantity)
}

func Sell(symbol string, quantity float64) {
	createAndPushOrder("Sell", symbol, quantity)
}

func WriteOrdersFile() {
	bytes, err := json.Marshal(orders)
	if err != nil {
		log.Fatal(err)
	}

	if err := os.WriteFile(".orders", bytes, 0644); err != nil {
		log.Fatal(err)
	}
}
