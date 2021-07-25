package trading

import (
	"encoding/json"
	"io/ioutil"
	"log"
)

func fileUnmarshal(filename string, data interface{}) {
	content, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(content, &data)
	if err != nil {
		log.Fatal(err)
	}
}

type SymbolDataCandle struct {
	Open      float64
	High      float64
	Low       float64
	Close     float64
	Volume    float64
	Timestamp uint64
	Status    string
}

type SymbolsDataConfig struct {
	TimestampStart uint64 `json:"timestamp_start"`
	TimestampEnd   uint64 `json:"timestamp_end"`
	Granularity    uint64 `json:"granularity"`
}

func GetSymbolsData() map[uint64]map[string]SymbolDataCandle {
	data := make(map[uint64]map[string]SymbolDataCandle)
	fileUnmarshal(".symbols-data", &data)

	return data
}

func GetSymbolsDataConfig() SymbolsDataConfig {
	var config SymbolsDataConfig
	fileUnmarshal(".symbols-data-config", &config)

	return config
}
