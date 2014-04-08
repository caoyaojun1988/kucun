package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.Stock;

/**
 * TODO Comment of StockMapper
 * 
 * @author caoyaojun
 */
public interface StockMapper {

    public List<Stock> listAllStocks(QueryParameter queryParameter);

    public Integer countAllStocks(QueryParameter queryParameter);

    public Stock queryStockByUid(Integer uid);

    public Stock queryStockById(Integer id);

    public void addStock(Stock stock);

    public void deleteStockByUid(Integer uid);

    public void modifyStockByUid(Stock stock);

    public void modifyStockById(Stock stock);

}
