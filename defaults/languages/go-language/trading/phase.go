package trading

type DecisionPhaseData struct {
	Timestamp            uint64
	Symbols              map[string]SymbolDataCandle
	HistoricalTimestamps []uint64
	HistoricalData       map[uint64]map[string]SymbolDataCandle
}
