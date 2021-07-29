#include <strategy.hpp>
#include <trading.hpp>

#include <map>
#include <string>
#include <vector>

int main()
{
    auto data = Tradistonks::get_symbols_data();
    auto config = Tradistonks::get_symbols_data_config();

    std::vector<unsigned long> historical_timestamps;
    std::map<unsigned long, std::map<std::string, Tradistonks::SymbolDataCandle>> historical_data;

    int i = 0;

    for (unsigned long timestamp = config.timestamp_start; timestamp <= config.timestamp_end; timestamp += config.granularity)
    {
        Tradistonks::current_timestamp = timestamp;
        auto &symbols = data[timestamp];

        decision_phase(Tradistonks::DecisionPhaseData{
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
