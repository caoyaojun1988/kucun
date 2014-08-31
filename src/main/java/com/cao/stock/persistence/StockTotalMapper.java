package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.CategoryTotal;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockTotal;

/**
 * TODO Comment of StockMapper
 * 
 * @author caoyaojun
 */
public interface StockTotalMapper {

    public List<StockTotal> listInStocks(QueryParameter queryParameter);

    public Integer countInStocks(QueryParameter queryParameter);

    public List<StockTotal> listOutStocks(QueryParameter queryParameter);

    public Integer countOutStocks(QueryParameter queryParameter);

    public List<StockTotal> listOutStocksByDepartment(QueryParameter queryParameter);

    public Integer countOutStocksByDepartment(QueryParameter queryParameter);

    public List<CategoryTotal> listStocksByCategory(QueryParameter queryParameter);

    public Integer countStocksByCategory(QueryParameter queryParameter);
}
