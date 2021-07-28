#pragma once

#include <libs/json.hpp>

#include <fstream>
#include <string>

using json = nlohmann::json;

namespace Tradistonks
{

struct SymbolDataCandle
{
    double open;
    double high;
    double low;
    double close;
    double volume;
    unsigned long timestamp;

    static SymbolDataCandle from(const json &j)
    {
        SymbolDataCandle candle;

        j.at("open").get_to(candle.open);
        j.at("high").get_to(candle.high);
        j.at("low").get_to(candle.low);
        j.at("close").get_to(candle.close);
        j.at("volume").get_to(candle.volume);
        j.at("timestamp").get_to(candle.timestamp);

        return candle;
    }
};

struct SymbolsDataConfig
{
    unsigned long timestamp_start;
    unsigned long timestamp_end;
    unsigned long granularity;

    static SymbolsDataConfig from(const json &j)
    {
        SymbolsDataConfig config;

        j.at("timestamp_start").get_to(config.timestamp_start);
        j.at("timestamp_end").get_to(config.timestamp_end);
        j.at("granularity").get_to(config.granularity);

        return config;
    }
};

std::map<unsigned long, std::map<std::string, SymbolDataCandle>> getSymbolsData();

SymbolsDataConfig getSymbolsDataConfig();

} // namespace Tradistonks
