package com.cao.stock.web.control;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cao.stock.domain.OutStock;
import com.cao.stock.domain.QueryParameter;
import com.cao.stock.domain.StockOrder;
import com.cao.stock.service.OutStockService;
import com.cao.stock.service.StockOrderService;
import com.cao.stock.web.domain.Result;
import com.cao.stock.web.util.parseJson;

@Controller
@RequestMapping("/outStock")
public class OutStockController {

    @Autowired
    private OutStockService    outStockService;
    @Autowired
    private StockOrderService  stockOrderService;
    @Autowired
    private HttpServletRequest request;

    @RequestMapping("/listAll")
    public @ResponseBody
    HashMap<String, Object> listAllOutStocks(@ModelAttribute("pojo") QueryParameter queryParameter) {
        List<OutStock> stocks = outStockService.listAllOutStocks(queryParameter);
        int count = outStockService.countAllOutStocks(queryParameter);
        HashMap<String, Object> result = new HashMap<String, Object>();
        result.put("rows", stocks);
        result.put("total", count);
        result.put("success", true);
        return result;
    }

    @RequestMapping("/add")
    @Transactional
    public @ResponseBody
    Result addOutStocks(@RequestParam("outStockMark") String outStockMark,
                        @RequestParam("createDate") String createDate, @RequestParam("staff") Integer staff,
                        @RequestParam("department") Integer department, @RequestParam("method") String method) {
        try {
            if (!"add".equals(method)) {
                return Result.failureResult("add in stock parameter Error :" + method);
            }
            return outStocks(outStockMark, createDate, staff);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    @RequestMapping("/update")
    @Transactional
    public @ResponseBody
    Result updateOutStocks(@RequestParam(value = "outStockMark", required = false) String outStockMark,
                           @RequestParam(value = "createDate", required = false) String createDate,
                           @RequestParam(value = "staff", required = false) Integer staff,
                           @RequestParam(value = "department", required = false) Integer department,
                           @RequestParam(value = "method", required = false) String method) {
        try {
            if ("add".equals(method)) {
                return outStocks(outStockMark, createDate, staff);
            } else {
                String parameter = request.getReader().readLine();
                List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);

                for (OutStock outStock : outStocks) {
                    if (outStocks == null || outStock.getStock() == null) {
                        continue;
                    }
                    OutStock oldOutStock = outStockService.queryOutStockById(outStock.getId());
                    outStockService.modifyOutStock(oldOutStock, outStock);
                }
            }
            return Result.successResult();
        } catch (Exception e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

    private Result outStocks(String outStockMark, String createDate, Integer staff) throws IOException, ParseException {
        String parameter = request.getReader().readLine();
        List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);
        String orderId = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());

        StockOrder stockOrder = new StockOrder();
        stockOrder.setId(orderId);
        stockOrder.setCreateDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(createDate));
        stockOrder.setModifyDate(new Date());
        stockOrder.setStaff(staff);
        stockOrder.setStatus("out");
        stockOrder.setMark(outStockMark);
        Double totalworth = 0D;
        Integer totalNumber = 0;

        for (OutStock outStock : outStocks) {
            if (outStock != null && outStock.getStock() != null) {
                outStock.setOrderId(orderId);
                outStockService.addOutStock(outStock);
                totalNumber++;
                totalworth += outStock.getWorth();
            }
        }

        stockOrder.setTotalNumber(totalNumber);
        stockOrder.setTotalWorth(totalworth);
        stockOrderService.addStockOrder(stockOrder);
        return Result.successResult();
    }

    @RequestMapping("/delete")
    public @ResponseBody
    Result deleteOutStocks() {
        try {
            String parameter = request.getReader().readLine();
            List<OutStock> outStocks = parseJson.parse(parameter, OutStock.class);
            for (OutStock outStock : outStocks) {
                if (outStock == null || outStock.getId() == null) {
                    continue;
                }
                OutStock oldOutStock = outStockService.queryOutStockById(outStock.getId());

                outStock.setNumber(0);
                outStock.setWorth(0D);
                outStockService.modifyOutStock(oldOutStock, outStock);
            }
            return Result.successResult();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.failureResult(e.getMessage());
        }
    }

}
