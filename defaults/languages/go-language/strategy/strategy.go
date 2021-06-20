package strategy

import "tradistonks/trading"

type WalletEntry struct {
	Average  float64
	Quantity float64
}

var wallet = make(map[string]WalletEntry)

func getWalletEntry(symbol string) *WalletEntry {
	if entry, ok := wallet[symbol]; ok {
		return &entry
	}

	return nil
}

func buyAndUpdateEntry(symbol string, quantity float64, price float64) {
	trading.Buy(symbol, quantity)

	entry := getWalletEntry(symbol)

	if entry != nil {
		entry.Average = (entry.Average*entry.Quantity + quantity*price) / (entry.Quantity + quantity)
		entry.Quantity += quantity
	} else {
		wallet[symbol] = WalletEntry{
			Average:  price,
			Quantity: quantity,
		}
	}
}

func sellAndUpdateEntry(symbol string, quantity float64, price float64) {
	trading.Sell(symbol, quantity)

	entry := getWalletEntry(symbol)

	if entry != nil {
		entry.Quantity -= quantity

		if entry.Quantity == 0 {
			entry.Average = 0
		}
	}
}

func DecisionPhase(data trading.DecisionPhaseData) {
	for symbol, candle := range data.Symbols {
		entry := getWalletEntry(symbol)

		if entry != nil && entry.Quantity > 0 {
			percentageDiffFromAverage := (entry.Average/candle.Close - 1) * 100

			if percentageDiffFromAverage <= -2 {
				quantity := 500 / candle.Close
				buyAndUpdateEntry(symbol, quantity, candle.Close)
			} else if percentageDiffFromAverage > 2 {
				sellAndUpdateEntry(symbol, entry.Quantity, candle.Close)
			}
		} else {
			percentageDiffFromOpen := (candle.Open/candle.Close - 1) * 100

			if percentageDiffFromOpen <= -2 {
				quantity := 500 / candle.Close
				buyAndUpdateEntry(symbol, quantity, candle.Close)
			}
		}
	}
}
