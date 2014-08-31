package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.InStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockOrder;

/**
 * TODO Comment of StockMapper
 * 
 * @author caoyaojun
 */
public interface InStockMapper {

    public List<InStock> listAllInStocks(QueryParameter queryParameter);

    public Integer countAllInStocks(QueryParameter queryParameter);

    public List<InStock> listAllInStocksByStock(Integer stockId);

    public InStock queryInStockById(Integer id);

    public StockOrder sumInStockByOrderId(String orderId);

    public void addInStock(InStock InStock);

    public void deleteInStockById(Integer id);

    public void logicDeleteInStockById(Integer id);

    public void modifyInStockById(InStock InStock);
}
