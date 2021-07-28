#include <trading.hpp>

std::vector<Tradistonks::Order> Tradistonks::Orders;
unsigned long Tradistonks::CurrentTimestamp = 0;

json unmarshall(const std::string &path)
{
    std::ifstream i(path);
    json j;
    i >> j;

    return j;
}

std::map<unsigned long, std::map<std::string, Tradistonks::SymbolDataCandle>> Tradistonks::getSymbolsData()
{
    auto j = unmarshall(".symbols-data");

    std::map<unsigned long, std::map<std::string, SymbolDataCandle>> out;

    for (auto &[timestamp_string, symbols] : j.items())
    {
        auto timestamp = stoul(timestamp_string);

        out[timestamp] = std::map<std::string, SymbolDataCandle>();

        for (auto &[symbol, data] : symbols.items())
        {
            out[timestamp][symbol] = SymbolDataCandle::from(symbols[symbol]);
        }
    }

    return out;
}

Tradistonks::SymbolsDataConfig Tradistonks::getSymbolsDataConfig()
{
    auto j = unmarshall(".symbols-data-config");
    return SymbolsDataConfig::from(j);
}

void Tradistonks::push_order(const Tradistonks::Order &order)
{
    Orders.push_back(order);
}

void Tradistonks::create_and_push_order(const std::string &order_type, const std::string &symbol, double quantity)
{
    Orders.push_back(Order{order_type, symbol, quantity, CurrentTimestamp});
}

void Tradistonks::buy(const std::string &symbol, double quantity)
{
    create_and_push_order("Buy", symbol, quantity);
}

void Tradistonks::sell(const std::string &symbol, double quantity)
{
    create_and_push_order("Sell", symbol, quantity);
}

void Tradistonks::write_orders_file()
{
    auto j = json::array();

    for (const auto &order : Orders)
    {
        json order_j;
        order_j["type"] = order.type;
        order_j["symbol"] = order.symbol;
        order_j["timestamp"] = order.timestamp;
        order_j["quantity"] = order.quantity;

        j.push_back(order_j);
    }

    std::ofstream o(".orders");
    o << j.dump() << std::endl;
}
