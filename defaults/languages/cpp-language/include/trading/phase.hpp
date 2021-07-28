#pragma once

#include <trading/data.hpp>

#include <map>
#include <string>

namespace Tradistonks
{

struct DecisionPhaseData
{
    unsigned long timestamp;

    std::map<std::string, SymbolDataCandle> symbols;

    std::vector<unsigned long> &historical_timestamps;

    std::map<unsigned long, std::map<std::string, SymbolDataCandle>> &historical_data;
};

} // namespace Tradistonks
