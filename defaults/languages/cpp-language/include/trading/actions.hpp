#pragma once

#include <fstream>
#include <iostream>
#include <string>
#include <vector>

namespace Tradistonks
{

struct Order
{
    std::string type;

    std::string symbol;

    double quantity;

    unsigned long timestamp;

    static Order from(const json &j)
    {
        Order order;

        j.at("type").get_to(order.type);
        j.at("symbol").get_to(order.symbol);
        j.at("quantity").get_to(order.quantity);
        j.at("timestamp").get_to(order.timestamp);

        return order;
    }
};

extern std::vector<Order> orders;
extern unsigned long current_timestamp;

void push_order(const Order &order);
void create_and_push_order(const std::string &order_type, const std::string &symbol, double quantity);

void buy(const std::string &symbol, double quantity);
void sell(const std::string &symbol, double quantity);

void write_orders_file();

} // namespace Tradistonks
