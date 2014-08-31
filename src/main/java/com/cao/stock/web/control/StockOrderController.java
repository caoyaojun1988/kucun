package com.cao.stock.web.control;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.InStock;
import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.service.InStockService;
import com.cao.stock.service.OutStockService;
import com.cao.stock.service.StockOrderService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/stockOrder")
public class StockOrderController {

    @Autowired
    private StockOrderService  stockOrderService;
    @Autowired
    private OutStockService    outStockService;
    @Autowired
    private InStockService     inStockService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listInAll")
    public @ResponseBody
    HashMap<String, Object> listAllInStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<StockOrder> stockOrders = stockOrderService.listAllInStockOrders(queryParameter);
        int count = stockOrderService.countAllInStockOrders(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stockOrders);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/listOutAll")
    public @ResponseBody
    HashMap<String, Object> listAllOutStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<StockOrder> stockOrders = stockOrderService.listAllOutStockOrders(queryParameter);
        int count = stockOrderService.countAllOutStockOrders(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stockOrders);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/update")
    public @ResponseBody
    Result updateStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<StockOrder> stockOrders = parseJson.parse(parameter, StockOrder.class);
            for (StockOrder stockOrder : stockOrders) {
                if (stockOrder == null || stockOrder.getId() == null) {
                    continue;
                }
                stockOrderService.modifyStockOrderByid(stockOrder);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/deleteOutStockOrder")
    @Transactional
    public @ResponseBody
    Result deleteOutStockOrder() {
        try {
            String parameter = request.getReader().readLine();
            List<StockOrder> stockOrders = parseJson.parse(parameter, StockOrder.class);
            for (StockOrder stockOrder : stockOrders) {
                if (stockOrder == null || stockOrder.getId() == null) {
                    continue;
                }
                QueryParameter queryParameter = new QueryParameter();
                queryParameter.setOrderId(stockOrder.getId());
                List<OutStock> outStocks = outStockService.listAllOutStocks(queryParameter);

                for (OutStock outStock : outStocks) {
                    if (outStock == null || outStock.getId() == null) {
                        continue;
                    }
                    OutStock newOutStock = new OutStock();
                    BeanUtils.copyProperties(outStock, newOutStock);
                    newOutStock.setNumber(0);
                    newOutStock.setWorth(0D);

                    outStockService.modifyOutStock(outStock, newOutStock);
                }
                stockOrderService.deleteStockByUid(stockOrder);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/deleteInStockOrder")
    @Transactional
    public @ResponseBody
    Result deleteInStockOrder() {
        try {
            String parameter = request.getReader().readLine();
            List<StockOrder> stockOrders = parseJson.parse(parameter, StockOrder.class);
            for (StockOrder stockOrder : stockOrders) {
                if (stockOrder == null || stockOrder.getId() == null) {
                    continue;
                }
                QueryParameter queryParameter = new QueryParameter();
                queryParameter.setOrderId(stockOrder.getId());
                List<InStock> inStocks = inStockService.listAllInStocks(queryParameter);

                for (InStock inStock : inStocks) {
                    if (inStock == null || inStock.getId() == null) {
                        continue;
                    }
                    if (inStock.getNumber() > inStock.getRemainderNumber()) {
                        throw new RuntimeException("已经出库不能删除订单");
                    }

                    InStock newInStock = new InStock();
                    BeanUtils.copyProperties(inStock, newInStock);

                    newInStock.setNumber(0);
                    inStockService.modifyInStock(inStock, newInStock);

                }
                stockOrderService.deleteStockByUid(stockOrder);
            }
            return Result.successResult();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

}
