package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockOrder;

/**
 * TODO Comment of StockMapper
 * 
 * @author caoyaojun
 */
public interface StockOrderMapper {

    public List<StockOrder> listAllStockOrders(QueryParameter queryParameter);

    public StockOrder queryStockOrderById(String id);

    public void addStockOrder(StockOrder stockOrder);

    public void deleteStockByUid(StockOrder stockOrder);

    public void modifyStockOrderByid(StockOrder stockOrder);

}
