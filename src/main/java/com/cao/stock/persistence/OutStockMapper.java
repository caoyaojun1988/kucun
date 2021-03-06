package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockOrder;

/**
 * TODO Comment of StockMapper
 * 
 * @author caoyaojun
 */
public interface OutStockMapper {

    public List<OutStock> listAllOutStocks(QueryParameter queryParameter);

    public Integer countAllOutStocks(QueryParameter queryParameter);

    public OutStock queryOutStockById(Integer id);

    public StockOrder sumInStockByOrderId(String orderId);

    public void addOutStock(OutStock outStock);

    public void deleteOutStockById(Integer id);

    public void modifyOutStockById(OutStock outStock);
}
