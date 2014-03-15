package com.cao.stock.persistence;

import java.util.List;

import com.cao.stock.domain.InOutStock;

/**
 * TODO Comment of StockMapper
 * 
 * @author caoyaojun
 */
public interface InOutStockMapper {

    public List<InOutStock> listAllInOutStocks();

    public InOutStock queryInOutStockById(Integer id);

    public List<InOutStock> queryInOutStockByOutStockId(Integer outStockId);

    public void addInOutStock(InOutStock inOutStock);

    public void deleteInOutStockById(Integer id);

    public void modifyInOutStockById(InOutStock inOutStock);
}
