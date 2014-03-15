package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.InStock;

/**
 * TODO Comment of StockMapper
 * 
 * @author caoyaojun
 */
public interface InStockMapper {

    public List<InStock> listAllInStocks();

    public List<InStock> listAllInStocksByStock(Integer stockId);

    public InStock queryInStockById(Integer id);

    public void addInStock(InStock InStock);

    public void deleteInStockById(Integer id);

    public void logicDeleteInStockById(Integer id);

    public void modifyInStockById(InStock InStock);
}
