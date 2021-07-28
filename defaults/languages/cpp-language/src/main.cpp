#include <strategy.hpp>
#include <trading.hpp>

#include <map>
#include <string>
#include <vector>

int main()
{
    auto data = Tradistonks::getSymbolsData();
    auto config = Tradistonks::getSymbolsDataConfig();

    std::vector<unsigned long> historical_timestamps;
    std::map<unsigned long, std::map<std::string, Tradistonks::SymbolDataCandle>> historical_data;

    int i = 0;

    for (unsigned long timestamp = config.timestamp_start; timestamp <= config.timestamp_end; timestamp += config.granularity)
    {
        Tradistonks::CurrentTimestamp = timestamp;
        auto &symbols = data[timestamp];

        decisionPhase(Tradistonks::DecisionPhaseData{
            timestamp,
            symbols,
            historical_timestamps,
            historical_data,
        });

        historical_data[timestamp] = symbols;
        historical_timestamps.push_back(timestamp);
    }

    Tradistonks::write_orders_file();

    return 0;
}
