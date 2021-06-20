package main

import (
	"tradistonks/strategy"
	"tradistonks/trading"
)

func main() {
	data := trading.GetSymbolsData()
	config := trading.GetSymbolsDataConfig()

	historicalTimestamps := make([]uint64, 0)
	historicalData := make(map[uint64]map[string]trading.SymbolDataCandle)

	for timestamp := config.TimestampStart; timestamp <= config.TimestampEnd; timestamp += config.Granularity {
		trading.Timestamp = timestamp
		symbols := data[timestamp]

		strategy.DecisionPhase(trading.DecisionPhaseData{
			Timestamp:            timestamp,
			Symbols:              symbols,
			HistoricalTimestamps: historicalTimestamps,
			HistoricalData:       historicalData,
		})

		historicalData[timestamp] = symbols
		historicalTimestamps = append(historicalTimestamps, timestamp)
	}

	trading.WriteOrdersFile()
}
